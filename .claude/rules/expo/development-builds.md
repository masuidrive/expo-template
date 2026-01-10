# Expo Development Builds

Expo Go を超えた開発ビルド（Dev Client）の概念と手順。

## 開発ビルドとは

- `expo-dev-client` ライブラリを含むデバッグビルド
- ネットワークインスペクタ、デプロイ管理UI などの追加機能
- Expo Go では使えないネイティブライブラリやカスタム設定を組み込み可能

## Expo Go との違い

| 項目 | Expo Go | 開発ビルド |
|------|---------|-----------|
| 用途 | プロトタイプ | 本番移行前提 |
| ネイティブ機能 | 制限あり | 自由 |
| カスタム設定 | 不可 | 可能 |
| 再ビルド | 不要 | 設定変更時に必要 |

## ビルド手順

```bash
# Dev Client をインストール
npx expo install expo-dev-client

# EAS でビルド
eas build --profile development --platform android
eas build --profile development --platform ios
```

## 学習順序

1. Introduction to development builds
2. Expo Go to development build
3. Create a build on EAS
4. Use a build
5. Share with your team
6. Tools, workflows and extensions

## コード生成時の注意

- 「Expo Go はプロトタイプ用途、開発ビルドは本番移行前提」と強調
- ネイティブビルドツール（Xcode/Android SDK）が必要
- EAS Build 使用時はクラウドサービス利用の注意点を補足

## 参照

- [Introduction to development builds - Expo Documentation](https://docs.expo.dev/develop/development-builds/introduction/)
