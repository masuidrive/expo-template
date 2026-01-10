---
paths: app.json, app.config.*, *.config.js, plugins/**/*
---

# Expo Config Plugins

ネイティブプロジェクトの構成を自動化する Config Plugins のガイド。

## Config Plugin とは

- プリビルドプロセス中にネイティブプロジェクト（android/ios）を書き換え
- `app.json` の `plugins` 配下で定義
- JavaScript 関数でネイティブ設定を変更

## 用途例

- アイコン生成やアプリ名設定
- `AndroidManifest.xml` や `Info.plist` の修正
- アプリ設定だけではカバーできないネイティブ要素の指定

## 構造

```javascript
// plugins/withCustomConfig.js
const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withCustomConfig(config) {
  return withAndroidManifest(config, (config) => {
    // ネイティブ設定を変更
    return config;
  });
};
```

```json
// app.json
{
  "expo": {
    "plugins": ["./plugins/withCustomConfig"]
  }
}
```

## 重要

- CNG（継続的ネイティブ生成）では手作業でネイティブファイルを編集しない
- Config plugin で変更を反映するのが推奨
- **必ず `npx expo prebuild` を併用**

## 学習順序

1. Introduction to config plugins
2. Create a config plugin
3. Mods
4. Best practices for development and debugging

## コード生成時の注意

- JSON 変更ではなく JavaScript 関数でプラットフォームごとの設定を行う
- プリビルドなしの場合は無効になることを説明

## 参照

- [Introduction to config plugins - Expo Documentation](https://docs.expo.dev/config-plugins/introduction/)
