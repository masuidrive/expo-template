---
name: expo-troubleshoot
description: Expoプロジェクトの問題診断と解決を支援。ビルドエラー、依存関係の問題、設定ミスなどのトラブルシューティングに使用。
allowed-tools: Bash, Read, Grep, Glob
user-invocable: true
---

# Expo Troubleshooting

Expo プロジェクトの問題診断と解決ガイド。

## 診断手順

### 1. Expo Doctor を実行

```bash
npx expo-doctor
```

依存関係や設定ファイルの不整合を自動検出。

### 2. キャッシュクリア

```bash
npx expo start --clear
```

### 3. node_modules 再インストール

```bash
rm -rf node_modules
npm install
```

### 4. Expo prebuild のクリーンアップ

```bash
rm -rf android ios
npx expo prebuild
```

## よくある問題

### ビルドエラー

**症状**: `eas build` が失敗する

**対処**:
1. `npx expo-doctor` で依存関係確認
2. `eas.json` の設定を確認
3. EAS Dashboard でビルドログを確認

### Metro バンドラーエラー

**症状**: アプリが起動しない、モジュールが見つからない

**対処**:
1. `npx expo start --clear`
2. Watchman キャッシュクリア: `watchman watch-del-all`

### 依存関係の競合

**症状**: npm/yarn install でエラー

**対処**:
1. `npx expo install` で Expo 互換バージョンをインストール
2. `package.json` の依存関係を確認

### ネイティブモジュールの問題

**症状**: Expo Go で動作しない機能がある

**対処**:
1. 開発ビルドが必要かどうか確認
2. `expo-dev-client` をインストール
3. `eas build --profile development` でビルド

## EAS Build トラブルシューティング

### Android

```bash
# キーストア問題
eas credentials --platform android

# ビルド設定確認
eas build:configure
```

### iOS

```bash
# 証明書問題
eas credentials --platform ios

# プロビジョニングプロファイル確認
eas build:configure
```

## ログの確認方法

1. **Metro ログ**: ターミナルで `npx expo start`
2. **デバイスログ**: `npx react-native log-android` / `log-ios`
3. **EAS ビルドログ**: EAS Dashboard で確認
