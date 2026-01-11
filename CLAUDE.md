# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo project using Dev Client + EAS Update for OTA (over-the-air) JS bundle distribution. The architecture separates native builds from JS updates:

- **Dev Client**: Native app built once, acts as the runtime environment
- **EAS Update**: JS bundle distributed via CDN, no rebuild needed for UI/logic changes

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

## Custom Commands

This project provides the following custom commands for Claude Code:

- **[ota]** or `/ota`: Deploy JS-only changes via EAS Update (Over-The-Air)
  - For UI, business logic, styling changes
  - No native rebuild required
  - Fast and free
  - Execute from app root directory (APPNAME, not .git root)

- **[native-build]** or `/dist-dev-client`: Build Dev Client APK/IPA
  - Automatically handles Keystore generation prompts
  - Environment-specific implementation:
    - macOS: expect script
    - Windows/Linux: Node.js + node-pty
  - Required for native code changes
  - Execute from app root directory (APPNAME, not .git root)

## Pull Request Rules

When creating pull requests, add the appropriate build tag to the PR title or commit message:

- **[ota]** or **[js-build]**: For JS-only changes (UI, logic, components) that can be deployed via EAS Update
- **[native-build]**: For changes that require native rebuild (permissions, native modules, deep links, etc.)

This helps identify which type of deployment is needed for each change.
