# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo project using Dev Client + EAS Update for OTA (over-the-air) JS bundle distribution. The architecture separates native builds from JS updates:

- **Dev Client**: Native app built once, acts as the runtime environment
- **EAS Update**: JS bundle distributed via CDN, no rebuild needed for UI/logic changes

## Expo Go の勘違いしやすい所

### Expo Go でも EAS Update (/ota) は使える

**誤解**: 「Expo Go では EAS Update が使えない」
**正解**: **Expo Go でも EAS Update は使えます**

- `/ota` コマンドで JS バンドルを配信できる
- Expo Go アプリの **Extensions タブ**（または Updates タブ）から公開済み Update を選択して実行できる
- 開発サーバーなしで、配信された Update をダウンロードして実行可能

### runtimeVersion の有無

**Expo Go の特徴**:
- `runtimeVersion` による厳密な互換性チェックは行われない
- 代わりに **Expo SDK バージョン**（例: SDK 52）で互換性を管理
- Expo が提供する標準 API のみ使用するため、開発者として使う分には困ることはない

**Dev Client との違い**:
- **Dev Client**: カスタムネイティブモジュールを使う場合、`runtimeVersion` で互換性を厳密に管理
- **Expo Go**: 固定のネイティブランタイムを使うため、SDK バージョンの互換性のみ気にすればよい

**結論**: 学習やプロトタイプ開発で Expo Go を使う場合、`runtimeVersion` がなくても実用上の問題はありません。

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

## Custom Skills

This project has custom skills for common Expo workflows. Skills are automatically discovered from `.claude/skills/`.

For usage documentation, see [README.md](./README.md).

## Pull Request Rules

When creating pull requests, add the appropriate build tag to the PR title or commit message:

- **[ota]**: For JS-only changes (UI, logic, components) that can be deployed via EAS Update
- **[dist-dev-client]**: For changes that require native rebuild (permissions, native modules, deep links, etc.)

This helps identify which type of deployment is needed for each change.
