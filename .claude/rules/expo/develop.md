# Expo Development Tools

開発作業を支援するツールや手法のガイド。

## Expo CLI

プロジェクト作成時に自動で含まれる開発用 CLI。

```bash
npx expo start        # 開発サーバを起動
npx expo run:ios      # iOS実行
npx expo run:android  # Android実行
npx expo prebuild     # ネイティブプロジェクト生成
```

## EAS CLI

EAS Build/Submit などのクラウドサービス用 CLI。

```bash
npm install -g eas-cli
eas login
eas build --platform android
eas update --branch dev --message "description"
```

## Expo Doctor

依存関係や設定ファイルの不整合を診断。

```bash
npx expo-doctor
```

## その他ツール

- **Orbit**: EAS ビルドインストール用アプリ
- **VS Code Expo 拡張**: 開発体験向上

## ナビゲーション

- React Native には組み込みナビゲーションがない
- **Expo Router** (推奨) または **React Navigation** を使用
- 新規プロジェクトでは Expo Router がデフォルト

## コード生成時の注意

- Expo CLI の各コマンドを正しく案内する
- Expo Router 使用時はファイル配置によるルーティングを説明
- Expo Go vs 開発ビルドの選択を状況に応じて促す

## 参照

- [Tools for development - Expo Documentation](https://docs.expo.dev/develop/tools/)
- [Navigation in Expo and React Native apps](https://docs.expo.dev/develop/app-navigation/)
