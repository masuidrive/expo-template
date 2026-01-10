# Expo Core Concepts

Expo の基本理念と主要機能、サービスの全体像。

## Expo とは

- Android、iOS、Web で動作するオープンソースフレームワーク
- ファイルベースのルーティング
- クロスプラットフォーム UI コンポーネント
- 豊富なネイティブモジュール

**重要**: すべての機能は**無料・オプション**で、未使用の機能はアプリに影響を与えない

## 主要ツール

| ツール | 説明 |
|-------|------|
| Expo SDK | 公式提供のモジュール群 |
| Expo CLI | 開発用コマンドラインツール |
| Expo Go | 開発用クライアントアプリ |
| prebuild | ネイティブプロジェクト生成 |

## EAS (Expo Application Services)

Expo チーム提供のクラウドサービス群:

- **EAS Build**: クラウドビルド
- **EAS Submit**: ストア提出
- **EAS Update**: OTA アップデート配信
- **EAS Metadata**: ストアメタデータ管理

**注意**: EAS は Expo プロジェクト以外の React Native アプリでも利用可能

## コード生成時の注意

- 「Expo は完全にオープンソースで追加コストなし」と明示
- 「使わない機能が重くなる」という誤解を解消
- EAS のクラウド依存やアカウント登録の必要性に触れる

## 参照

- [Core concepts - Expo Documentation](https://docs.expo.dev/core-concepts/)
