# expo-demo

Expo Dev Client + EAS Update のデモプロジェクト。Claude Code のカスタムスキルを使った効率的な開発フローを提供します。

## プロジェクト概要

このプロジェクトは、Expo を使った iOS/Android アプリ開発のリファレンス実装です。

**アーキテクチャ**:
- **Dev Client**: ネイティブアプリを一度だけビルド（実行環境）
- **EAS Update**: JS バンドルを CDN 経由で配信（OTA デプロイ）

**更新フロー**:
- **JS のみの変更**: EAS Update で OTA 配信（再ビルド不要）
- **ネイティブ変更**: EAS Build で再ビルドが必要

## カスタムスキル

このプロジェクトでは、開発中に繰り返し使用するスキルを提供しています。

### `/dev-server`

**目的**: Expo 開発サーバーの起動・停止

**使用方法**:
- 起動: `/dev-server` または `/dev-server start`
- 停止: `/dev-server stop` または「dev-serverを止めて」

**実行場所**: アプリルート（APPNAMEディレクトリ、.gitルートではない）

**特徴**:
- バックグラウンドで実行
- QR コードで Expo Go アプリから接続
- 簡単に停止可能

### `/ota`

**目的**: JavaScript/UI の変更を EAS Update で OTA 配信

**使用タイミング**:
- UI コンポーネント、スタイリングの変更
- 画面レイアウト、ナビゲーションの変更
- ビジネスロジック（TypeScript/JavaScript）の変更
- API 呼び出し、テキスト/文字列の変更
- 純粋な JS 依存関係の追加

**実行場所**: アプリルート（APPNAMEディレクトリ、.gitルートではない）

**特徴**:
- 再ビルド不要
- 高速（数秒）
- 無料

### `/dist-dev-client`

**目的**: Dev Client APK/IPA をビルド

**使用タイミング**:
- Intent handlers / deep links
- Permissions
- Native modules
- Package name / app icon の変更
- Build configuration (app.json affecting native)

**実行場所**: アプリルート（APPNAMEディレクトリ、.gitルートではない）

**特徴**:
- Android Keystore 生成プロンプトを自動処理
- プラットフォーム別の自動化（macOS: expect、Windows/Linux: node-pty）
- EAS クラウドでビルド（5〜10分）

## 基本的な使い方

### 新規プロジェクトの作成

詳細は [setup-expo.md](./setup-expo.md) を参照してください。

概要：
1. 前提条件（eas-cli インストール、ログイン）
2. プロジェクト作成（`npx create-expo-app`）
3. 依存関係インストール（expo-dev-client、expo-updates）
4. EAS 初期化（`expo prebuild`、`eas init`）
5. eas.json 作成
6. App.tsx 編集

### 初回デプロイ

```bash
# Claude Code で実行（APPNAMEディレクトリ内で）
/ota              # Update を配信
/dist-dev-client  # APK をビルド
```

### 開発フロー

```bash
# コードを編集
# Claude Code で実行
/ota  # JS のみの変更の場合

# または
/dist-dev-client  # ネイティブ変更がある場合
```

## ドキュメント

- **[setup-expo.md](./setup-expo.md)**: Expo 開発環境の構築手順（詳細版）
- **[setup-gh-actions.md](./setup-gh-actions.md)**: GitHub Actions の設定
- **[CLAUDE.md](./CLAUDE.md)**: Claude Code 向けのガイダンス（AI用）

## Pull Request ルール

PR の説明またはコミットメッセージに、以下のタグを含めてください：

- **[ota]**: JS のみの変更（EAS Update で配信）
- **[dist-dev-client]**: ネイティブ変更（再ビルドが必要）

これにより、GitHub Actions が適切なデプロイメントを自動実行します。

## スキルファイルの場所

カスタムスキルの実装は以下にあります：

- `.claude/skills/dev-server/SKILL.md`
- `.claude/skills/ota/SKILL.md`
- `.claude/skills/dist-dev-client/SKILL.md`

## ライセンス

MIT
