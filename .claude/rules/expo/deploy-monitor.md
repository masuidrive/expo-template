# Expo Deploy & Monitor

ビルド後のレビュー配布、ストア申請、公開後の監視ガイド。

## 配布・レビュー

QA 用のアプリ共有方法:

- アプリストアのテストトラック
- 内部配布（Internal Distribution）
- 開発ビルド + EAS Update

**重要**: Expo Go はプロダクション用途には使わない

## 本番ビルド

```bash
# EAS Build でリリースビルド作成
eas build --platform android --profile production
eas build --platform ios --profile production

# ストアに提出
eas submit --platform android
eas submit --platform ios
```

### 必要なもの

- Google Play デベロッパーアカウント
- Apple Developer Program メンバーシップ
- 署名用証明書・キー

## 監視（Monitor）

### Expo Insights

```bash
npx expo install expo-insights
```

- バージョン別の利用状況分析
- アップデートの採用率確認

### 外部サービス

- **Sentry**: クラッシュレポート
- **LogRocket**: セッションリプレイ
- **Bugsnag**: エラートラッキング

## 学習順序

1. Distributing apps for review
2. Share previews with your team
3. EAS Submit/Metadata/Updates
4. Deploy web apps
5. Monitoring services

## コード生成時の注意

- Expo Go をテスト目的で使わないよう明示
- 内部配布や EAS Update の URL 共有を活用
- アプリ署名用鍵の管理に触れる
- ユーザプライバシー（GDPR対応）に留意

## 参照

- [Overview of distributing apps for review](https://docs.expo.dev/review/overview/)
- [Build your project for app stores](https://docs.expo.dev/deploy/build-project/)
- [Monitoring services](https://docs.expo.dev/monitoring/services/)
