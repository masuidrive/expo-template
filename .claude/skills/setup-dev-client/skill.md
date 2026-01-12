---
name: setup-dev-client
description: Setup Dev Client environment and manage platforms (Android/iOS). Use for initial setup from Expo Go or to add/remove platforms. Run this BEFORE /dist-dev-client.
user-invocable: true
allowed-tools:
  - Bash
  - Write
  - Read
  - AskUserQuestion
---

# /setup-dev-client - Dev Client Setup & Platform Management

Setup Dev Client environment for Expo projects and manage target platforms.

## Usage

### Initial Setup (Expo Go → Dev Client)
```bash
/setup-dev-client
```
Migrates from Expo Go to Dev Client by:
1. Installing expo-dev-client
2. Running expo prebuild
3. Creating eas.json

### Add Platform
```bash
/setup-dev-client add android
/setup-dev-client add ios
/setup-dev-client add all
```

### Remove Platform
```bash
/setup-dev-client remove android
/setup-dev-client remove ios
```

## Execution Requirements

**IMPORTANT**: Execute commands from the **app root directory** (APPNAME directory, not the .git root).

## Idempotency Guarantee

This skill is safe to run multiple times. All operations check current state before executing:
- Won't reinstall already-installed packages
- Won't regenerate existing native projects
- Won't overwrite existing eas.json
- Won't re-add already-configured platforms

## Instructions for Claude

### 0. Parse Command Arguments (Run this FIRST)

Check if the skill was invoked with arguments:
- No arguments: Execute Initial Setup Flow
- `add <platform>`: Execute Platform Add Flow
- `remove <platform>`: Execute Platform Remove Flow

---

### Initial Setup Flow (No arguments)

1. **Determine target platform**

   **If eas.json exists**: Read platform from existing configuration
   ```bash
   if [ -f "eas.json" ]; then
     PLATFORMS=$(jq -r '.build.dev | keys[]' eas.json 2>/dev/null)
   fi
   ```

   **If eas.json doesn't exist**: Ask user using AskUserQuestion
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
   # For Android
   if [ ! -d "android" ] && [platform includes Android]; then
     npx expo prebuild --platform android
   fi

   # For iOS
   if [ ! -d "ios" ] && [platform includes iOS]; then
     npx expo prebuild --platform ios
   fi
   ```

4. **Create eas.json** (idempotent)
   ```bash
   if [ ! -f "eas.json" ]; then
     # Create eas.json based on target platforms
     # Android only example:
     cat > eas.json << 'EOF'
{
  "cli": {
    "version": ">= 16.0.0"
  },
  "build": {
    "dev": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "dev",
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleDebug"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
EOF
     # iOS only: include ios config instead
     # Both: include both android and ios configs
   fi
   ```

5. **Display completion message**
   ```
   Setup complete! Next steps:
   1. Run /ota to publish your first update
   2. Run /dist-dev-client to build APK/IPA
   ```

---

### Platform Add Flow

1. **Parse platform name** from arguments (android/ios/all)

2. **Check eas.json exists**
   ```bash
   if [ ! -f "eas.json" ]; then
     echo "Error: eas.json not found. Run /setup-dev-client first."
     exit 1
   fi
   ```

3. **Check if platform already configured** (idempotent)
   ```bash
   # For Android
   if jq -e '.build.dev.android' eas.json > /dev/null 2>&1; then
     echo "Android platform already configured, skipping."
   else
     jq '.build.dev.android = {"buildType": "apk", "gradleCommand": ":app:assembleDebug"}' eas.json > eas.json.tmp && mv eas.json.tmp eas.json
   fi
   ```

4. **Check if native directory exists** (idempotent)
   ```bash
   if [ -d "android" ]; then
     echo "Android native project already exists, skipping."
   else
     npx expo prebuild --platform android
   fi
   ```

5. **Display completion message**
   ```
   Android platform added!
   Next: Run /dist-dev-client to build.
   ```

---

### Platform Remove Flow

1. **Parse platform name** from arguments (android/ios)

2. **Check if platform configured** (idempotent)
   ```bash
   if ! jq -e '.build.dev.android' eas.json > /dev/null 2>&1; then
     echo "Android platform not configured, nothing to remove."
     exit 0
   fi
   ```

3. **Remove from eas.json**
   ```bash
   jq 'del(.build.dev.android)' eas.json > eas.json.tmp && mv eas.json.tmp eas.json
   ```

4. **Ask about directory deletion**
   ```javascript
   AskUserQuestion({
     questions: [{
       question: "Delete android/ directory?",
       header: "Directory",
       multiSelect: false,
       options: [
         { label: "Delete", description: "Remove android/ directory completely" },
         { label: "Keep", description: "Keep directory, only remove from eas.json" }
       ]
     }]
   })
   ```

5. **Delete if user confirmed**
   ```bash
   if [user selected "Delete"]; then
     rm -rf android/
   fi
   ```

6. **Display completion message**
   ```
   Android platform removed.
   ```

---

## Dependencies

- `jq`: Required for JSON manipulation. If not available, install with:
  - macOS: `brew install jq`
  - Linux: `sudo apt-get install jq`
  - Windows: Download from https://jqlang.github.io/jq/

## Success Indicators

- expo-dev-client installed in package.json
- Native directories generated (android/ or ios/)
- eas.json created with correct platform configurations
- No errors during prebuild

## Common Issues

- **jq not found**: Install jq using package manager
- **Not in app directory**: Command must run from APPNAME directory
- **EAS project not initialized**: Run `eas init` first (should be automatic in initial setup)
