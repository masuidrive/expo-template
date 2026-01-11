# /ota

Run EAS Update to deploy JavaScript/UI changes without native rebuild (OTA = Over-The-Air).

**Note**: Execute `npx` commands from the app root directory (APPNAME directory, not the .git root).

```bash
cd APPNAME  # Move to app directory from project root
npx eas update --branch dev --message "OTA update from Claude Code" --non-interactive
```

Use this for:
- UI components, styling
- Screen layouts, navigation
- Business logic (TypeScript/JavaScript)
- API calls, text/strings
- Pure JS dependencies

For native changes, use `/dist-dev-client` instead.
