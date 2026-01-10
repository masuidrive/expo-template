---
paths: app/**/*.tsx, components/**/*.tsx
---

# Expo User Interface

アプリのUI要素（スプラッシュ画面、アイコン、レイアウト、フォント等）の設定ガイド。

## スプラッシュ画面とアイコン

- `app.json` で `expo-splash-screen` プラグインを設定
- 画像フォーマットは **PNG** を推奨
- Figma テンプレートで画像作成可能

### 注意点

- Expo Go や通常のデバッグビルドではスプラッシュ画面が正しくテストできない
- プレビュー用ビルドや本番ビルドで確認する

## UI要素の設定順序

1. Splash screen and app icon
2. Safe areas
3. System bars
4. Fonts
5. Assets
6. Color themes
7. Animation
8. Store data

## コード生成時の注意

- `expo-splash-screen` プラグインの使用例を示す
- Expo Go での動作制限に触れる
- 画像の前提条件（サイズ・形式・透明度）を説明
- 間違った形式でビルドが失敗する可能性を警告

## 参照

- [Splash screen and app icon - Expo Documentation](https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/)
