# /js-build

Run EAS Update to deploy JavaScript/UI changes without native rebuild.

```bash
cd hello-update
npx eas update --branch dev --message "JS update from Claude Code" --non-interactive
```

Use this for:
- UI components, styling
- Screen layouts, navigation
- Business logic (TypeScript/JavaScript)
- API calls, text/strings
- Pure JS dependencies

For native changes, use `/native-build` instead.
