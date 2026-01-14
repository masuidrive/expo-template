# Developer's Guide

**環境構築後に参照する開発リファレンス**

環境構築がまだの場合は、Claude Code で `@docs/setup-expo.md` を実行してください。

---

## スキルコマンド

- `/dev-server`: 開発サーバーの起動・停止（ホットリロード）
- `/ota`: JS/UI 変更を EAS Update で配信（ネイティブビルド不要）
- `/setup-dev-client`: Dev Client 環境のセットアップ
- `/dist-dev-client`: Dev Client APK/IPA のビルドと配信

---

## ネイティブ変更が必要なケース

以下の変更には `/dist-dev-client` での再ビルドが必要です:

- Intent handlers / deep links
- Permissions (カメラ、位置情報など)
- Native modules
- Package name / app icon / splash screen
- Build configuration (app.json の native に影響する変更)

**JS/UI のみの変更**: `/ota` で配信（再ビルド不要）

---

## Pull Request ルール

PR タイトルまたはコミットメッセージにタグを含めてください:

- **[ota]**: JS のみの変更（EAS Update で配信）
- **[dist-dev-client]**: ネイティブ変更（再ビルドが必要）

これにより GitHub Actions で自動デプロイが実行されます。

---

## よくある質問

### Q1. Extensions タブに Update が表示されない

**A**: 以下を確認:
- Extensions タブで Login しているか
- `/ota` で Update を配信したか

### Q2. Update 後も変更が反映されない

**A**: ネイティブ変更がある場合は `/dist-dev-client` で再ビルドが必要です。

### Q3. Dev Client は必須?

**A**: いいえ。標準 API のみ使う場合は Expo Go で十分です。

### Q4. ビルド待ち時間が長い

**A**: 無料プランではキュー時間が長くなります。バックグラウンド実行を活用してください。

### Q5. GitHub Actions が発動しない

**A**: GitHub Actions の設定は [docs/setup-gh-actions.md](./docs/setup-gh-actions.md) を参照してください。

---

## 参考リンク

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Update](https://docs.expo.dev/eas-update/introduction/)
- [Dev Client](https://docs.expo.dev/develop/development-builds/introduction/)
