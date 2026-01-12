---
name: dist-dev-client
description: Build and distribute Dev Client APK/IPA via EAS Build with automatic Android Keystore generation. Automatically runs setup if eas.json is missing. Use when native changes are required (permissions, native modules, deep links, app configuration, icons) or when the user mentions "native build", "dist-dev-client", "Dev Client build", "APK", "IPA", or "EAS build".
user-invocable: true
allowed-tools:
  - Bash
  - Write
  - Read
  - AskUserQuestion
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

### 0. Check for Setup Requirements (Run this FIRST)

Before executing the build, check if Dev Client setup is complete.

```bash
# Check if eas.json exists
if [ ! -f "eas.json" ]; then
  echo "eas.json not found. Running initial setup..."
fi
```

**If eas.json doesn't exist, execute the following setup steps** (same as /setup-dev-client):

1. **Determine target platform** - Ask user using AskUserQuestion
   ```javascript
   AskUserQuestion({
     questions: [{
       question: "Which platforms do you want to target?",
       header: "Platforms",
       multiSelect: false,
       options: [
         {
           label: "Android only",
           description: "Build APK for Android devices. Free tier available."
         },
         {
           label: "iOS only",
           description: "Build IPA for iOS devices. Requires Apple Developer account ($99/year)."
         },
         {
           label: "Both",
           description: "Build for both Android and iOS platforms."
         }
       ]
     }]
   })
   ```

2. **Install expo-dev-client** (idempotent)
   ```bash
   if ! grep -q "expo-dev-client" package.json; then
     npx expo install expo-dev-client
   fi
   ```

3. **Generate native projects** (idempotent)
   ```bash
   # Based on user selection
   if [Android selected] && [ ! -d "android" ]; then
     npx expo prebuild --platform android
   fi
   if [iOS selected] && [ ! -d "ios" ]; then
     npx expo prebuild --platform ios
   fi
   ```

4. **Create eas.json** (idempotent)
   ```bash
   if [ ! -f "eas.json" ]; then
     # Create eas.json with appropriate platform config
     cat > eas.json << 'EOF'
{
  "build": {
    "dev": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "dev",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
EOF
   fi
   ```

5. **Continue to Step 1** (Detect Platform)

**If eas.json exists**: Skip setup and proceed directly to Step 1.

---

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

**CRITICAL: Temporary Script Cleanup**

The automation scripts MUST be deleted after execution to avoid leaving temporary files in the project directory. Both implementations (expect and node-pty) include automatic cleanup mechanisms.

**IMPORTANT: Run in Background**

EAS Build takes significant time to complete:
- **Paid tier**: A few minutes to 10 minutes
- **Free tier**: 30 minutes to 3+ hours (queue times vary)

**ALWAYS use `run_in_background: true` parameter with the Bash tool** to avoid blocking the conversation. This allows the user to continue with other tasks while the build runs in the cloud.

After starting the build in background:
1. Inform the user that the build is running in background
2. Provide the build URL so they can monitor progress
3. Suggest they can continue with other tasks (e.g., running `/ota`, making code changes, etc.)
4. The user can check build status at any time via the EAS dashboard

#### For macOS (darwin):

Generate a temporary expect script with automatic cleanup.

**IMPORTANT**: Use the Bash tool with `run_in_background: true` parameter:

```javascript
Bash({
  command: `
SCRIPT_NAME="eas-build-auto-$$.exp"
cat > "$SCRIPT_NAME" << 'EOF'
#!/usr/bin/expect -f
set timeout -1
spawn npx eas-cli@latest build -p android --profile dev
expect {
    "Generate a new Android Keystore?" {
        send "y\r"
        exp_continue
    }
    eof
}
wait
EOF

chmod +x "$SCRIPT_NAME"
"./$SCRIPT_NAME"
EXIT_CODE=$?

# Clean up temporary file
rm -f "$SCRIPT_NAME"

exit $EXIT_CODE
  `,
  description: "Execute EAS build with automatic Keystore generation",
  run_in_background: true,
  timeout: 600000
})
```

**Key points**:
- **MUST use `run_in_background: true`** to avoid blocking
- Use process ID (`$$`) for unique filename
- **Script MUST be deleted after execution with `rm -f "$SCRIPT_NAME"`**
- Use `npx eas-cli@latest` to ensure latest version

#### For Windows/Linux:

Generate a temporary Node.js script with self-deletion.

**IMPORTANT**: Use the Bash tool with `run_in_background: true` parameter:

```javascript
Bash({
  command: `
SCRIPT_NAME="eas-build-auto-$(date +%s).js"
cat > "$SCRIPT_NAME" << 'EOF'
const pty = require('node-pty');
const os = require('os');
const fs = require('fs');

const scriptPath = __filename;

const shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';
const ptyProcess = pty.spawn('npx', ['eas-cli@latest', 'build', '-p', 'android', '--profile', 'dev'], {
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
# Backup cleanup in case self-deletion failed
rm -f "$SCRIPT_NAME"
  `,
  description: "Execute EAS build with automatic Keystore generation",
  run_in_background: true,
  timeout: 600000
})
```

**Key points**:
- **MUST use `run_in_background: true`** to avoid blocking
- Check if node-pty is installed (if not, inform user to install it)
- **Script deletes itself on exit or interrupt, with backup cleanup**
- Use `npx eas-cli@latest` to ensure latest version

### 4. Monitor Build Progress

- EAS Build runs in the cloud
- Initial builds may queue (free tier)
- Completion provides APK/IPA URL and QR code

### 5. Inform User

After successful build submission (running in background):

**Immediate notification**:
- Inform user that build is running in background
- Provide the build URL (extract from output using grep if needed)
- Explain build time expectations:
  - Paid tier: Few minutes to 10 minutes
  - Free tier: 30 minutes to 3+ hours (unpredictable queue times)

**Next steps suggestion**:
- User can continue with other tasks (e.g., `/ota`, code changes, documentation)
- Build status can be monitored at the EAS dashboard URL
- APK/IPA download URL and QR code will be available when build completes
- For iOS builds, remind that Apple Developer account ($99/year) is required

**Example message**:
```
Build started in background!

Build URL: https://expo.dev/accounts/...

⏱️ Expected time:
- Paid tier: 5-10 minutes
- Free tier: 30 minutes to 3+ hours

You can continue with other tasks while the build runs. Check the URL above to monitor progress.
```

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

## Build Time Expectations

EAS Build runs in the cloud and completion time varies significantly:

- **Paid tier**:
  - First build: 5-10 minutes
  - Subsequent builds: 3-7 minutes (cached dependencies)

- **Free tier**:
  - Queue time can vary: 30 minutes to 3+ hours depending on server load
  - Actual build time: 5-10 minutes once it starts
  - Total time: Highly unpredictable

**Best Practice**: Always run builds in background using `run_in_background: true` parameter. This allows users to continue working on other tasks while the build completes in the cloud.

**Note**: The Keystore prompt is automatically answered "yes" by the generated script.
