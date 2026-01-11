---
name: setup-expo-project
description: Set up a complete Expo project with Dev Client and EAS Update configuration. Creates project, installs dependencies, configures EAS, generates eas.json, and creates Hello World app. Use when the user wants to create a new Expo project or mentions "setup expo", "new expo project", "create expo app", or "initialize expo".
user-invocable: true
allowed-tools:
  - Bash
  - Write
  - Read
  - Edit
  - AskUserQuestion
---

# /setup-expo-project - Complete Expo Project Setup

Automated setup for Expo Dev Client + EAS Update project. Runs all initial setup steps (sections 1-7 from setup-expo.md).

## What This Skill Does

Automates the complete initial setup:
1. Verify prerequisites (eas-cli, Expo account)
2. Create Expo project
3. Install expo-dev-client
4. Install expo-updates
5. Run expo prebuild and eas init
6. Create eas.json configuration
7. Create Hello World App.tsx

## Instructions for Claude

When this skill is invoked:

### Step 1: Ask for Project Name

Use AskUserQuestion to get the project name:

```typescript
AskUserQuestion({
  questions: [
    {
      question: "What is the project name (directory name)?",
      header: "Project Name",
      multiSelect: false,
      options: [
        {
          label: "Use default (hello-world)",
          description: "Create project in ./hello-world directory"
        },
        {
          label: "Custom name",
          description: "Specify a custom project name"
        }
      ]
    }
  ]
})
```

If user selects "Custom name", ask for the actual name in a follow-up question or prompt.

Let APPNAME be the project name (default: `hello-world`).

### Step 2: Verify Prerequisites

Check if prerequisites are installed:

```bash
# Check eas-cli
which eas || npm list -g eas-cli

# Check if logged in
eas whoami
```

If eas-cli is not installed or user is not logged in, inform the user:
- **eas-cli not installed**: Run `npm install -g eas-cli`
- **Not logged in**: Run `eas login`

Ask if they want to proceed or if they need to install/login first.

### Step 3: Create Project

```bash
npx create-expo-app@latest APPNAME --template blank-typescript
cd APPNAME
```

**IMPORTANT**: After this step, all subsequent commands must be run from the APPNAME directory.

### Step 4: Install Dev Client and Updates

```bash
cd APPNAME
npx expo install expo-dev-client expo-updates
```

### Step 5: Run Prebuild and EAS Init

```bash
cd APPNAME
npx expo prebuild --platform android
eas init --non-interactive --force
```

This will:
- Generate native Android project files
- Create projectId in Expo account
- Add projectId to app.json

### Step 6: Create eas.json

Create `APPNAME/eas.json` with the following content:

```json
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
```

Use the Write tool to create this file.

### Step 7: Create Hello World App

Edit `APPNAME/App.tsx` (or create if it doesn't exist):

```tsx
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Hello World v1</Text>
    </View>
  );
}
```

Use Edit tool if file exists, Write tool if it doesn't.

### Step 8: Verify and Inform User

After all steps complete successfully:

1. **Verify created files**:
   ```bash
   cd APPNAME
   ls -la eas.json app.json App.tsx
   ```

2. **Inform user** of what was created:
   - Project directory: `APPNAME/`
   - Configuration: `eas.json` (dev profile for APK builds)
   - App code: `App.tsx` (Hello World v1)
   - Native files: `android/` directory

3. **Next steps for user**:
   - Deploy Update: Run `/ota` in the APPNAME directory
   - Build APK: Run `/dist-dev-client` in the APPNAME directory

## Error Handling

### Common Issues

**eas-cli not installed**:
- Error: `command not found: eas`
- Solution: Install with `npm install -g eas-cli`

**Not logged in**:
- Error: `You must be logged in to use this command`
- Solution: Run `eas login`

**Project name already exists**:
- Error: `Directory APPNAME already exists`
- Solution: Choose a different project name or delete existing directory

**Network errors during npx/npm**:
- Retry the command
- Check internet connection

**Prebuild fails**:
- Ensure Android SDK is not required (prebuild generates files but doesn't need SDK)
- Check expo-dev-client is installed

## Success Indicators

- ✅ Project directory created
- ✅ node_modules installed
- ✅ android/ directory exists
- ✅ eas.json created with correct content
- ✅ App.tsx contains Hello World code
- ✅ app.json contains projectId

## Parameters

- **Project name**: Directory name for the project (default: `hello-world`)
- **Template**: Always use `blank-typescript`

## Expected Duration

- Total time: 3-5 minutes (mostly npm install time)
- Network-dependent (downloading packages)

## Notes

- This skill does NOT run the build or update - use `/dist-dev-client` and `/ota` for that
- All commands after project creation must run from APPNAME directory
- The skill creates a Dev Client configuration (not Expo Go)
- Free tier EAS configuration (APK builds, internal distribution)
