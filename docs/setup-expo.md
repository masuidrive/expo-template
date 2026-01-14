# Expo によるモバイルアプリ開発環境構築

## 指示
以後のドキュメントを読み、ここにExpoを使ったモバイル開発環境を構築すること。
エラーなどで作業が進まない場合は、エラー内容をユーザに提示してユーザと共に解決して進めるように。Optional以外について勝手に飛ばして作業を進めないように。
ユーザへの質問はまとめて行わず、一つずつ行なってください。

## エラー発生時の対処方針

環境構築中にエラーが発生した場合は、以下の手順で自力解決を試みてください：

1. **エラーメッセージを調査**
   - Web検索でエラーメッセージを検索し、解決策を探す
   - Expo公式ドキュメント（https://docs.expo.dev/）で関連情報を確認
   - Stack Overflow や GitHub Issues で同様の問題を探す

2. **修正内容をユーザーに確認**
   - 見つけた解決策や必要な変更点を明確に説明
   - 変更を実行する前に、ユーザーに確認を求める
   - 複数の解決策がある場合は、選択肢を提示する

3. **自力で問題を解決しながら進める**
   - 確認を得たら、必要なコマンドやファイル編集を実行
   - 各ステップの結果を報告し、次のステップに進む
   - 問題が解決したら、通常の手順に戻る

**重要**: 単にエラーメッセージを表示して止まるのではなく、積極的に解決策を調査して提案してください。

---

## 概要

このガイドでは、ExpoとGitHub を使った開発環境を構築します。Expoの開発方式は2つあり、プロジェクトの要件に応じて選択します。

### 開発方式の選択

#### Expo Go（推奨：学習・プロトタイプ）

**メリット**:
- ビルド不要ですぐに開始できる
- App Store/Google Play から Expo Go アプリをインストールするだけ
- EAS Update で配信された Update を Extensions タブから実行可能
- 開発サイクルが非常に高速

**デメリット**:
- Expo が提供する標準 API のみ使用可能
- カスタムネイティブモジュールは使用不可

**こんな場合に最適**:
- React Native や Expo を学習中
- プロトタイプやデモアプリを作成
- 標準的な機能のみで十分なアプリ

#### Dev Client（推奨：本格的な開発）

**メリット**:
- カスタムネイティブモジュールが使用可能
- EAS Update で OTA 配信が可能（runtimeVersion 対応）
- Expo Go の全機能 + 独自の拡張が可能
- 本番環境と同じ構成でテスト可能

**デメリット**:
- 初回ビルドが必要（5〜10分）
- ネイティブ変更時は再ビルドが必要

**こんな場合に最適**:
- 本番リリースを予定しているアプリ
- ネイティブモジュール（カメラ、位置情報など）を使用
- EAS Update で継続的にアップデートを配信したい

**アーキテクチャ**:
- **Dev Client**: ネイティブアプリを一度だけビルド（実行環境）
- **EAS Update**: JS バンドルを OTA 配信（再ビルド不要で更新）

---

## 前提条件

### Expo Go および Dev Client 共通

**必須アクション**: ログインされていない場合は、ユーザーにログインを促すか EXPO_TOKEN を設定してください。

```bash
# ログイン状態を確認
npx -y eas-cli@latest whoami

# ログインしていない場合は、Expo アカウントでログイン
npx -y eas-cli@latest login
```

**Expo アカウント**: https://expo.dev でアカウント作成が必要です。

#### CI など非対話環境でのログイン

CI環境（GitHub Actions など）や非対話環境でログインエラーが発生した場合は、`eas login`が実行できないため、環境変数 `EXPO_TOKEN` を設定する必要があります。ユーザに下記の内容をURLなども含めて提示し、設定してもらってください。

**EXPO_TOKEN の取得方法**:
1. https://expo.dev/accounts/[account]/settings/access-tokens にアクセス
2. 「Create Token」をクリック
3. トークン名を入力（例: `github-actions`）
4. トークンをコピー

**GitHub Secrets への登録**:
1. リポジトリの Settings → Secrets and variables → Actions に移動
   - URL: `https://github.com/[OWNER]/[REPO]/settings/secrets/actions`
   - `[OWNER]/[REPO]`は`git remote`などから情報取得して埋めてください
2. 「New repository secret」をクリック
3. Name: `EXPO_TOKEN`
4. Secret: コピーしたトークンを貼り付け
5. 「Add secret」をクリック

詳細は [DEVELOPERS_GUIDE.md](../DEVELOPERS_GUIDE.md) の「GitHub Actions の設定」セクションを参照してください。

**理由**:
- Expo Go でも EAS Update（`/ota` コマンド）を使用するため、Expo アカウントが必要
- Dev Client では EAS Build と EAS Update の両方を使用するため同様に必要
- `npx -y eas-cli@latest` を使うことで、確認なしで常に最新版を使用できます

---

## 開始前の必須質問

セットアップを始める前に、以下の情報を確認してください：

### 1. アプリ名（プロジェクト名）

作成するプロジェクトの名前を決めてください（例: `hello-world`, `my-app`）。
例を選択肢に出さないので、AskUserQuestion は使わず聞いてください。
その後、README.mdのタイトルが`expo-template`だった場合、プロジェクト名に書き換えてください。

### 2. 開発方式

どの開発方式を使いますか？ **AskUserQuestion を使って聞く**。

**選択肢**:
- **Expo Go**: ビルド不要で即座に開始（学習・プロトタイプ向け）
- **Dev Client**: カスタムネイティブモジュールと EAS Update 対応（本格的な開発向け）

詳細は上記「開発方式の選択」セクションを参照してください。

### 3. ターゲットプラットフォーム（Dev Client の場合のみ）

どのプラットフォーム向けにビルドしますか？ **AskUserQuestion を使って聞く**。

**選択肢**:
- **Android のみ**: Android端末向けのAPKをビルド
- **iOS のみ**: iPhone/iPad向けのIPAをビルド（Mac + Xcode不要、EASクラウドビルド）
- **両方**: Android と iOS の両方をビルド

**注意**:
- iOS向けビルドには Apple Developer アカウント（有料: $99/年）が必要です
- 開発中のテストのみなら無料の Personal Team でも可能（7日間有効）

---

# セットアップ手順

開発方式によって手順が異なります。

## A. Expo Go を使う場合

Expo Go は最もシンプルな開発方法です。ビルド不要で即座に開始できます。

### A-1. プロジェクト作成

```bash
npx create-expo-app@latest APPNAME --template blank-typescript
cd APPNAME
```

**APPNAME** は先ほどユーザに聞いたアプリ名に置き換えてください。

### A-2. GitHub Actions のディレクトリ名を修正

**GitHub Actions を使用する場合のみ必要な手順です。**

`.github/workflows/` 内の3つのファイルで、`APPNAME` を実際のアプリ名に置き換えてください：

- `verify.yml`
- `eas-update-on-merge.yml`
- `eas-build-android-on-merge.yml`

各ファイルで以下の2箇所を修正：

```yaml
defaults:
  run:
    working-directory: APPNAME  # ← 実際のアプリ名に変更

# ...

- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm
    cache-dependency-path: APPNAME/package-lock.json  # ← 実際のアプリ名に変更
```

**例**: アプリ名が `my-app` の場合

```yaml
working-directory: my-app
cache-dependency-path: my-app/package-lock.json
```

修正後、コミットしてプッシュしてください：

```bash
git add .github/workflows/
git commit -m "Update workflow directory to match app name"
git push
```

### A-3. Hello World を作成

`App.tsx` を編集（または作成）：

```tsx
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Hello World v1</Text>
    </View>
  );
}
```

### A-4. EAS 初期化と設定ファイル生成

#### A-4-1. EAS プロジェクトを初期化

```bash
npx -y eas-cli@latest init --non-interactive --force
```

これにより、`app.json` に EAS projectId が追加されます。

#### A-4-2. eas.json を生成

```bash
npx -y eas-cli@latest build:configure
```

対話的に質問されますが、プラットフォーム選択時は「All」を選択してください（**ビルドは実行されません**）。

これにより：
- `eas.json` が生成される（development, preview, production プロファイル）
- GitHub Actions で必要な設定ファイルがコミット可能になる

#### A-4-3. EAS Update を設定

```bash
npx -y eas-cli@latest update:configure
```

これにより：
- `app.json` に `updates.url` と `runtimeVersion` が追加される
- `eas.json` に各プロファイルの `channel` 設定が追加される

#### A-4-4. 設定ファイルをコミット

```bash
git add app.json eas.json
git commit -m "Add EAS configuration"
git push
```

**重要**: GitHub Actions が eas.json を参照するため、必ずコミットしてください。

#### A-4-5. 初回 Update を配信

**Claude Code で `/ota` を実行**します。

これにより、JS バンドルが EAS の CDN にアップロードされます。

### A-5. Expo Go でアプリを確認

**開発者に以下の手順を説明して実行してもらってください**：

1. **Expo Go アプリをインストール**
   - **Android**: Google Play から「Expo Go」をインストール
   - **iOS**: App Store から「Expo Go」をインストール

2. **Expo Go アプリを起動**

3. **Update をロード**
   - 下部の **「Extensions」** タブをタップ
   - **「Login」** をタップして Expo アカウントにログイン
   - ログイン後、**EAS Update セクション**に公開済みの Update が表示される
   - 表示された Update の **「Open」** をタップ
   - 「Hello World v1」が表示される

### A-6. 基本的な開発フロー

#### JS/UI の変更（再配信）

1. `App.tsx` を編集（例: `<Text>Hello World v2</Text>`）
2. **Claude Code で `/ota` を実行**
3. Expo Go アプリで **Extensions タブ** から最新の Update を選択して **Open**

**制限事項**:
- カスタムネイティブモジュールは使用不可（Expo が提供する標準 API のみ）

---

### A-7. 開発サーバーの使用（オプション）

より高速な開発サイクルが必要な場合、開発サーバーを起動して Hot Reload を有効にできます。

#### 開発サーバーを起動

**Claude Code で `/dev-server` を実行**します。

これにより：
- `npx expo start` がバックグラウンドで実行される
- QR コードとアクセス用 URL が生成される

#### Expo Go でアプリを確認

**開発者に以下の手順を説明して実行してもらってください**：

1. **Expo Go アプリを起動**

2. **QR コードをスキャン**
   - ターミナルに表示された QR コードをスキャン
   - **Android**: Expo Go アプリ内のスキャナーを使用
   - **iOS**: カメラアプリで QR コードをスキャン
   - アプリが起動して「Hello World」が表示される

#### 開発フロー

1. `App.tsx` を編集（例: `<Text>Hello World v2</Text>`）
2. 保存すると Expo Go アプリに自動的にリロードされる

#### 開発サーバーを停止

**Claude Code で `/dev-server stop` を実行**

---

## B. Dev Client を使う場合

Dev Client はカスタムネイティブモジュールと EAS Update による OTA 配信に対応しています。

### B-1. プロジェクト作成

```bash
npx create-expo-app@latest APPNAME --template blank-typescript
cd APPNAME
```

**APPNAME** は任意のプロジェクト名に置き換えてください（例: `hello-world`）。

以降のコマンドはすべて **APPNAME ディレクトリ内**で実行します。

---

## B-2. GitHub Actions のディレクトリ名を修正

**GitHub Actions を使用する場合のみ必要な手順です。**

`.github/workflows/` 内の3つのファイルで、`APPNAME` を実際のアプリ名に置き換えてください：

- `verify.yml`
- `eas-update-on-merge.yml`
- `eas-build-android-on-merge.yml`

各ファイルで以下の2箇所を修正：

```yaml
defaults:
  run:
    working-directory: APPNAME  # ← 実際のアプリ名に変更

# ...

- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm
    cache-dependency-path: APPNAME/package-lock.json  # ← 実際のアプリ名に変更
```

**例**: アプリ名が `my-app` の場合

```yaml
working-directory: my-app
cache-dependency-path: my-app/package-lock.json
```

修正後、コミットしてプッシュしてください：

```bash
git add .github/workflows/
git commit -m "Update workflow directory to match app name"
git push
```

---

## B-3. Dev Client と expo-updates をインストール

```bash
npx expo install expo-dev-client expo-updates
```

- **expo-dev-client**: Dev Client（開発用スタンドアロンアプリ）を有効化
- **expo-updates**: EAS Update（OTA 配信）を有効化

---

## B-4. EAS 初期化

### Android の場合

```bash
npx expo prebuild --platform android
npx -y eas-cli@latest init --non-interactive --force
```

### iOS の場合

```bash
npx expo prebuild --platform ios
npx -y eas-cli@latest init --non-interactive --force
```

### 両方の場合

```bash
npx expo prebuild --platform all
npx -y eas-cli@latest init --non-interactive --force
```

これにより：
- ネイティブプロジェクトが生成される（`android/` または `ios/` または両方）
- EAS projectId が作成され、`app.json` に追加される

---

## B-5. eas.json を作成

プロジェクトルートに `eas.json` を作成：

### Android のみの場合

```json
{
  "build": {
    "dev": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "dev",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### iOS のみの場合

```json
{
  "build": {
    "dev": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "dev",
      "ios": {
        "simulator": false
      }
    }
  }
}
```

### 両方の場合

```json
{
  "build": {
    "dev": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "dev",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": false
      }
    }
  }
}
```

**ポイント**:
- `developmentClient: true` → Dev Client として動作
- `distribution: "internal"` → ストア不要で配布（Android: APK、iOS: Ad Hoc/Enterprise）
- `channel: "dev"` → EAS Update の `dev` ブランチと紐付け
- Android: `buildType: "apk"` → APK でビルド（無料）
- iOS: `simulator: false` → 実機向けビルド

---

## B-6. Hello World を作成

`App.tsx` を編集（または作成）：

```tsx
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Hello World v1</Text>
    </View>
  );
}
```

---

## B-7. 設定ファイルをコミット

```bash
git add app.json eas.json android/ ios/  # プラットフォームに応じて
git commit -m "Add EAS and native configuration"
git push
```

**重要**: GitHub Actions が eas.json と app.json を参照するため、必ずコミットしてください。

---

## B-8. 初回 Update を配信

**Claude Code で `/ota` を実行**します。

これにより：
- `eas update --branch dev` が実行される
- 初回実行時、`updates.url` と `runtimeVersion` が `app.json` に自動設定される（再コミット推奨）

---

## B-9. Dev Client をビルド

**Claude Code で `/dist-dev-client` を実行**します。

これにより：
- EAS Build が開始される
- Android: Keystore の生成確認が自動応答される
- iOS: Apple Developer 認証情報が要求される（初回のみ）
- ビルドは Expo のクラウドで実行される（5〜10分）
- 完了後、**ビルド成果物の URL と QR コード**が表示される

---

## B-10. 端末にインストール（ユーザー操作）

**開発者に以下の手順を説明して実行してもらってください**：

### Android の場合

#### QR コードでインストール（推奨）

1. Android 端末のカメラで QR コードをスキャン
2. リンクをタップして Expo のページを開く
3. 「Install」ボタンをタップ
4. APK がダウンロードされる
5. 通知から APK をタップしてインストール

**注意**: 「提供元不明のアプリ」の許可が必要です。
- 設定 → セキュリティ → 提供元不明のアプリを許可

#### URL で直接インストール

ビルド完了時に表示される URL を Android ブラウザで開いてインストールすることもできます。

### iOS の場合

#### QR コードまたは URL でインストール

1. iPhone/iPad のカメラまたは Safari で QR コード / URL を開く
2. Expo のページで「Install」または「Register Device」をタップ
3. プロファイルのインストール画面が表示される
4. 設定アプリでプロファイルをインストール
5. アプリがホーム画面に追加される

**注意**:
- 初回は UDID（デバイス識別子）の登録が必要
- Apple Developer アカウントに登録されたデバイスのみインストール可能
- Personal Team の場合、7日後に再署名が必要

---

## B-11. アプリ起動と Update のロード（ユーザー操作）

**開発者に以下の手順を説明して実行してもらってください**：

Dev Client は開発用なので、Update は**手動でロード**します。

### 手順

1. インストールしたアプリを起動
2. 開発サーバー接続画面が表示される
3. 下部の **「Extensions」** タブをタップ
4. **「Login」** をタップして Expo アカウントにログイン
5. ログイン後、**EAS Update セクション**に公開済みの Update が表示される
6. 表示された Update の **「Open」** をタップ

→ 「Hello World v1」が表示されます。

### なぜ手動なのか？

Dev Client（`developmentClient: true`）は複数の Update を切り替えてテストできる設計のため、Extensions タブから手動選択します。

本番ビルド（`developmentClient: false`）では起動時に自動ロードされます。

参考: [Preview updates in development builds - Expo Documentation](https://docs.expo.dev/eas-update/expo-dev-client/)

---

## 環境構築完了

環境構築が完了しました！

**次のステップ**: 開発フローの詳細、よくある質問、参考情報については [DEVELOPERS_GUIDE.md](../DEVELOPERS_GUIDE.md) を参照してください。
