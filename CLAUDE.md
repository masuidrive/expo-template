# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo project using Dev Client + EAS Update for OTA (over-the-air) JS bundle distribution. The architecture separates native builds from JS updates:

- **Dev Client**: Native app built once, acts as the runtime environment
- **EAS Update**: JS bundle distributed via CDN, no rebuild needed for UI/logic changes

## Common Commands

```bash
# Create project (if starting fresh)
npx create-expo-app hello-update
cd hello-update

# Install Dev Client
npx expo install expo-dev-client

# Initialize EAS
npx expo prebuild
npx eas init

# Build Dev Client APK (one-time)
npx eas build -p android --profile dev

# Deploy JS updates (no rebuild needed)
npx eas update --branch dev --message "description"
```

## What Can Be Updated via EAS Update (no rebuild)

- UI components and screens
- Business logic
- API calls
- Text/strings

## What Requires Native Rebuild

- Intent handlers / deep links
- Permissions
- Native modules
- Package name / app icon

## PR Labeling Rules

When creating a PR, apply the appropriate label:

- **No label (default)**: JS-only changes → `eas update` runs on merge (fast, free)
- **`native` label**: Native changes → `eas build` runs on merge (slow, counts against quota)

### Examples:
- UI/logic/API changes → No label needed
- Adding intent filters, permissions, or native modules → Add `native` label

## Claude Code policy

- Do: implement changes, run `npm ci` and `npm run verify`, open PR from claude/* or features/*
- Don't: run `eas build`, `eas update`, or `expo start`
- Don't: store secrets
