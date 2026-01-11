---
name: ota
description: Deploy JavaScript/UI changes via EAS Update without native rebuild (OTA = Over-The-Air). Use for UI components, styling, screen layouts, navigation, business logic, API calls, text/strings, or pure JS dependencies. Use when the user mentions "ota", "EAS Update", "OTA deploy", "JS update", "UI update", or wants to deploy code changes without rebuilding.
user-invocable: true
---

# /ota - OTA Update Deployment

Run EAS Update to deploy JavaScript/UI changes without native rebuild (OTA = Over-The-Air).

## Execution Requirements

**IMPORTANT**: Execute `npx` commands from the **app root directory** (APPNAME directory, not the .git root).

## Command

```bash
cd APPNAME  # Move to app directory from project root
npx eas update --branch dev --message "OTA update from Claude Code" --non-interactive
```

## Use This For

JavaScript-only changes that don't require native rebuild:
- UI components, styling
- Screen layouts, navigation
- Business logic (TypeScript/JavaScript)
- API calls, text/strings
- Pure JS dependencies

## When NOT to Use

For native changes, use `/dist-dev-client` instead:
- Intent handlers / deep links
- Permissions
- Native modules
- Package name changes
- App icon or splash screen
- Build configuration (app.json affecting native)

## Instructions for Claude

When this skill is invoked:

1. **Verify current directory**: Ensure you're in the app root (APPNAME directory)
2. **Run EAS Update**:
   ```bash
   cd APPNAME
   npx eas update --branch dev --message "OTA update from Claude Code" --non-interactive
   ```
3. **Inform the user**: Explain that the update was deployed and users need to restart the app to see changes
4. **Verify success**: Check command output for successful deployment confirmation

## Success Indicators

- "Published" message in output
- Update ID shown
- No error messages

## Common Issues

- **Not in app directory**: Remind user that command must be run from APPNAME directory
- **Not logged in**: Run `eas login` first
- **No EAS project**: Run `eas init` first
