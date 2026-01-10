# /native-build

Run EAS Build to create a new native APK with updated native code.

**Note**: Execute `npx` commands from the project root directory (where .git exists).

```bash
cd hello-world
npx eas build -p android --profile dev --non-interactive
```

Use this when changes require native rebuild:
- Intent handlers / deep links
- Permissions
- Native modules
- Package name changes
- App icon or splash screen
- Build configuration (app.json affecting native)

For JS-only changes, use `/js-build` instead (faster & free).
