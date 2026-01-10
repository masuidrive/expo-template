# Expo Debugging

開発中のデバッグとテストに関するガイド。

## Expo Doctor

依存関係や設定ミスを自動検出。

```bash
npx expo-doctor
```

- 依存パッケージの互換性チェック
- アプリ設定の整合性チェック

## デバッグツール

- **リモートデバッガー**: ブラウザでデバッグ
- **Reactotron**: React Native 向けデバッグツール
- **コンソールログ**: 基本的なログ出力

## キャッシュクリア

問題が発生した場合:

```bash
npx expo start --clear
```

## テスト

Expo には組み込みテスト環境がないため、以下を導入:

- **Jest**: ユニットテスト
- **React Native Testing Library**: コンポーネントテスト
- **Detox**: E2Eテスト（オプション）

## エラーモニタリング

本番環境では Sentry 等のサービスを併用:

- クラッシュレポート
- エラートラッキング
- パフォーマンス監視

## コード生成時の注意

- 依存解決エラーやビルド失敗時は Expo Doctor 実行を提案
- キャッシュクリア (`expo start --clear`) を案内
- ユニットテストや静的解析ツールの導入例を補足

## 参照

- [Tools for development - Expo Documentation](https://docs.expo.dev/develop/tools/)
- [Monitoring services - Expo Documentation](https://docs.expo.dev/monitoring/services/)
