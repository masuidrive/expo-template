---
name: expo-guide
description: Expo開発のガイドとベストプラクティスを提供。プロジェクトセットアップ、ビルド、デプロイ、トラブルシューティングに関する質問に回答する際に使用。
allowed-tools: Read, Grep, Glob, WebFetch
user-invocable: true
---

# Expo Development Guide

Expo プロジェクト開発の総合ガイド。

## 使用場面

- 新規 Expo プロジェクトのセットアップ
- 開発からデプロイまでのワークフロー
- トラブルシューティング
- ベストプラクティスの確認

## クイックリファレンス

### プロジェクト作成

```bash
npx create-expo-app@latest my-app
cd my-app
npx expo start
```

### 開発ビルド

```bash
npx expo install expo-dev-client
eas build --profile development --platform android
```

### OTA アップデート

```bash
eas update --branch dev --message "Update description"
```

### 本番ビルド

```bash
eas build --platform android --profile production
eas build --platform ios --profile production
```

### トラブルシューティング

```bash
npx expo-doctor           # 依存関係チェック
npx expo start --clear    # キャッシュクリア
```

## 更新が必要な変更の判断

### EAS Update で可能（JS のみ）

- UI コンポーネント、画面
- ビジネスロジック
- API 呼び出し
- テキスト、文字列

### ネイティブ再ビルドが必要

- Intent handlers / Deep links
- パーミッション
- ネイティブモジュール
- パッケージ名 / アプリアイコン

## 詳細ドキュメント

`.claude/rules/expo/` 配下の各ルールファイルを参照:

- `get-started.md` - 導入
- `develop.md` - 開発ツール
- `user-interface.md` - UI 設定
- `development-builds.md` - Dev Client
- `config-plugins.md` - Config Plugins
- `debugging.md` - デバッグ
- `deploy-monitor.md` - デプロイと監視
- `core-concepts.md` - 基本概念
- `workflow.md` - ワークフロー
- `router.md` - Expo Router
- `modules-api.md` - ネイティブモジュール
