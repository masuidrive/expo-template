---
name: dist-dev-client
description: Build and distribute Dev Client APK/IPA via EAS Build with automatic Android Keystore generation. Use when native changes are required (permissions, native modules, deep links, app configuration, icons) or when the user mentions "native build", "dist-dev-client", "Dev Client build", "APK", "IPA", or "EAS build".
user-invocable: true
allowed-tools:
  - Bash
  - Write
  - Read
---

# /dist-dev-client - Dev Client Build & Distribution

Dev Client APK/IPA を EAS Build で配信します。

## Execution Requirements

**IMPORTANT**: Execute `npx` commands from the **app root directory** (APPNAME directory, not the .git root).

## Use This For

Native changes that require a rebuild:
- Intent handlers / deep links
- Permissions
- Native modules
- Package name changes
- App icon or splash screen
- Build configuration (app.json affecting native)

**For JS-only changes**, use `/ota` instead (faster and free).

## Automatic Keystore Handling

Claude Code automatically handles Android Keystore generation prompts based on the platform:

- **macOS**: Generate and execute expect script
- **Windows/Linux**: Use Node.js + pty library (node-pty)

## Instructions for Claude

When this skill is invoked:

### 1. Detect Platform

```javascript
const platform = process.platform; // 'darwin', 'win32', 'linux'
```

### 2. Navigate to App Directory

Ensure you're in the correct directory:
```bash
cd APPNAME  # Move from project root to app directory
```

### 3. Execute Build with Platform-Specific Automation

#### For macOS (darwin):

Generate a temporary expect script with automatic cleanup:

```bash
SCRIPT_NAME="eas-build-auto-$$.exp"
cat > "$SCRIPT_NAME" << 'EOF'
#!/usr/bin/expect -f
set timeout -1
spawn npx eas build -p android --profile dev
expect "Generate a new Android Keystore?" {
    send "y\r"
    exp_continue
}
expect eof
wait
EOF

chmod +x "$SCRIPT_NAME"
"./$SCRIPT_NAME"
EXIT_CODE=$?

# Clean up temporary file
rm -f "$SCRIPT_NAME"

exit $EXIT_CODE
```

**Key points**:
- Use process ID (`$$`) for unique filename
- Delete script after execution
- Capture and return exit code

#### For Windows/Linux:

Generate a temporary Node.js script with self-deletion:

```bash
SCRIPT_NAME="eas-build-auto-$(date +%s).js"
cat > "$SCRIPT_NAME" << 'EOF'
const pty = require('node-pty');
const os = require('os');
const fs = require('fs');

const scriptPath = __filename;

const shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';
const ptyProcess = pty.spawn('npx', ['eas', 'build', '-p', 'android', '--profile', 'dev'], {
  name: 'xterm-color',
  cwd: process.cwd(),
  env: process.env
});

ptyProcess.on('data', (data) => {
  process.stdout.write(data);
  if (data.includes('Generate a new Android Keystore?')) {
    ptyProcess.write('y\r');
  }
});

ptyProcess.on('exit', (code) => {
  // Clean up on exit
  try {
    fs.unlinkSync(scriptPath);
  } catch (err) {
    // Ignore deletion errors
  }
  process.exit(code);
});

// Clean up on interrupt
process.on('SIGINT', () => {
  try {
    fs.unlinkSync(scriptPath);
  } catch (err) {
    // Ignore deletion errors
  }
  process.exit(130);
});
EOF

node "$SCRIPT_NAME"
```

**Key points**:
- Check if node-pty is installed (if not, inform user to install it)
- Script deletes itself on exit or interrupt
- Handles both normal completion and SIGINT

### 4. Monitor Build Progress

- EAS Build runs in the cloud
- Initial builds may queue (free tier)
- Completion provides APK/IPA URL and QR code

### 5. Inform User

After successful build submission:
- Build is queued/running on EAS servers
- User will receive APK/IPA URL and QR code when complete
- For iOS builds, Apple Developer account is required

## Platform Detection Reference

```javascript
// Detect current platform
switch (process.platform) {
  case 'darwin':  // macOS - use expect
    // Generate expect script
    break;
  case 'win32':   // Windows - use node-pty
  case 'linux':   // Linux - use node-pty
    // Generate Node.js script
    break;
}
```

## Temporary File Cleanup

**CRITICAL**: Always delete temporary scripts after execution.

- macOS: `rm -f "$SCRIPT_NAME"` after script completion
- Node.js: `fs.unlinkSync(scriptPath)` on exit and SIGINT

## Success Indicators

- Build successfully queued
- Build URL provided
- No authentication errors
- QR code displayed (when build completes)

## Common Issues

- **Not in app directory**: Command must run from APPNAME directory
- **Not logged in**: Run `eas login` first
- **No EAS project**: Run `eas init` first
- **node-pty missing (Windows/Linux)**: Instruct user to run `npm install node-pty`
- **iOS build without Apple account**: Inform user that Apple Developer account ($99/year) is required

## Initial Build Note

First-time builds take 5-10 minutes. The Keystore prompt is automatically answered "yes" by the generated script.
