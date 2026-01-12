# Expo によるモバイルアプリ開発環境構築

Expo を使って iOS/Android アプリの開発環境を構築する手順です。

## 概要

このガイドでは、Expo を使った開発環境を構築します。開発方式は2つあり、プロジェクトの要件に応じて選択します。

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

事前に Expo アカウントでログインしておいてください：

```bash
# ログイン状態を確認
npx -y eas-cli@latest whoami

# ログインしていない場合は、Expo アカウントでログイン
npx -y eas-cli@latest login
```

**Expo アカウント**: https://expo.dev でアカウント作成が必要です。

**理由**:
- Expo Go でも EAS Update（`/ota` コマンド）を使用するため、Expo アカウントが必要
- Dev Client では EAS Build と EAS Update の両方を使用するため同様に必要
- `npx -y eas-cli@latest` を使うことで、確認なしで常に最新版を使用できます

---

## 開始前の必須質問

セットアップを始める前に、以下の情報を確認してください：

### 1. アプリ名（プロジェクト名）

作成するプロジェクトの名前を決めてください（例: `hello-world`, `my-app`）。

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

**APPNAME** は任意のプロジェクト名に置き換えてください（例: `hello-world`）。

### A-2. Hello World を作成

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

### A-3. EAS 初期化と初回配信

#### A-3-1. EAS 初期化

初回のみ、EAS プロジェクトを初期化します：

```bash
npx -y eas-cli@latest init --non-interactive --force
```

これにより、`app.json` に EAS projectId が追加されます。

#### A-3-2. 初回 Update を配信

**Claude Code で `/ota` を実行**します。

これにより：
- `eas update --branch dev` が実行される
- 初回実行時、`updates.url` と `runtimeVersion` が `app.json` に自動設定される
- JS バンドルが EAS の CDN にアップロードされる

### A-4. Expo Go でアプリを確認

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

### A-5. 基本的な開発フロー

#### JS/UI の変更（再配信）

1. `App.tsx` を編集（例: `<Text>Hello World v2</Text>`）
2. **Claude Code で `/ota` を実行**
3. Expo Go アプリで **Extensions タブ** から最新の Update を選択して **Open**

**制限事項**:
- カスタムネイティブモジュールは使用不可（Expo が提供する標準 API のみ）

---

### A-6. 開発サーバーの使用（オプション）

より高速な開発サイクルが必要な場合、開発サーバーを起動して Hot Reload を有効にできます。

**重要**: Sandbox 環境（Claude Code on the Web など）では開発サーバーを連続的に起動できないため、基本的な開発フロー（A-5）を使用してください。

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

## B-2. Dev Client と expo-updates をインストール

```bash
npx expo install expo-dev-client expo-updates
```

- **expo-dev-client**: Dev Client（開発用スタンドアロンアプリ）を有効化
- **expo-updates**: EAS Update（OTA 配信）を有効化

---

## B-3. EAS 初期化

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

## B-4. eas.json を作成

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

## B-5. Hello World を作成

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

## B-6. 初回 Update を配信

**Claude Code で `/ota` を実行**します。

これにより：
- `eas update --branch dev` が実行される
- 初回実行時、`updates.url` と `runtimeVersion` が `app.json` に自動設定される

---

## B-7. Dev Client をビルド

**Claude Code で `/dist-dev-client` を実行**します。

これにより：
- EAS Build が開始される
- Android: Keystore の生成確認が自動応答される
- iOS: Apple Developer 認証情報が要求される（初回のみ）
- ビルドは Expo のクラウドで実行される（5〜10分）
- 完了後、**ビルド成果物の URL と QR コード**が表示される

---

## B-8. 端末にインストール（ユーザー操作）

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

## B-9. アプリ起動と Update のロード（ユーザー操作）

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

## B-10. 基本的な開発フロー

### JS/UI のみの変更

1. `App.tsx` を編集（例: `<Text>Hello World v2</Text>`）
2. **Claude Code で `/ota` を実行**

**結果**:
- 再ビルド不要
- APK/IPA の再インストール不要
- **アプリを再起動すると新しいバージョンが表示される**

### ネイティブ変更がある場合

以下の変更をした場合は再ビルドが必要です：

- Intent handlers / deep links
- Permissions
- Native modules
- Package name / app icon
- Build configuration (app.json affecting native)

**Claude Code で `/dist-dev-client` を実行**してください。

---

### B-11. 開発サーバーの使用（オプション）

より高速な開発サイクルが必要な場合、開発サーバーを起動して Hot Reload を有効にできます。

**重要**: Sandbox 環境（Claude Code on the Web など）では開発サーバーを連続的に起動できないため、基本的な開発フロー（B-10）を使用してください。

#### 開発サーバーを起動

**Claude Code で `/dev-server` を実行**します。

これにより：
- `npx expo start --dev-client` がバックグラウンドで実行される
- QR コードとアクセス用 URL が生成される

#### Dev Client でアプリを確認

**開発者に以下の手順を説明して実行してもらってください**：

1. **Dev Client アプリを起動**

2. **開発サーバーに接続**
   - QR コードをスキャン、または
   - アプリの開始画面で表示される URL を手動入力
   - アプリが起動して「Hello World」が表示される

#### 開発フロー

1. `App.tsx` を編集（例: `<Text>Hello World v2</Text>`）
2. 保存すると Dev Client アプリに自動的にリロードされる

#### 開発サーバーを停止

**Claude Code で `/dev-server stop` を実行**

---

## まとめ

### A. Expo Go の場合

**基本フロー（Sandbox 環境推奨）**:

```bash
# 初回セットアップ
npx create-expo-app@latest APPNAME --template blank-typescript
cd APPNAME
# App.tsx を編集
npx -y eas-cli@latest init --non-interactive --force

# Claude Code で実行
/ota  # Update を配信

# Expo Go アプリで確認
# - Extensions タブ → Login → Update を選択 → Open

# 開発フロー
# - コードを編集
# - Claude Code で /ota を実行
# - Expo Go で Extensions タブから Update を選択
```

**オプション: 開発サーバー使用（ローカル環境のみ）**:

```bash
# Claude Code で実行
/dev-server  # 開発サーバーを起動

# Expo Go アプリで確認
# - QR コードをスキャン
# - コードを編集すると自動リロード

# サーバー停止
# - Claude Code で /dev-server stop を実行
```

### B. Dev Client の場合

**基本フロー**:

```bash
# 初回セットアップ
npx create-expo-app@latest APPNAME --template blank-typescript
cd APPNAME
npx expo install expo-dev-client expo-updates

# プラットフォームに応じて
npx expo prebuild --platform android  # Android のみ
# または
npx expo prebuild --platform ios      # iOS のみ
# または
npx expo prebuild --platform all      # 両方

npx -y eas-cli@latest init --non-interactive --force

# eas.json を作成（プラットフォームに応じた設定）
# App.tsx を編集

# Claude Code で実行
/ota              # 初回 Update 配信
/dist-dev-client  # ビルド（Android: APK、iOS: IPA）

# 開発フロー
# - コードを編集
# - Claude Code で /ota を実行（JS のみの変更）
# - または /dist-dev-client を実行（ネイティブ変更がある場合）
```

**オプション: 開発サーバー使用（ローカル環境のみ）**:

```bash
# Claude Code で実行
/dev-server  # 開発サーバーを起動

# Dev Client アプリで確認
# - QR コードをスキャンまたは URL 入力
# - コードを編集すると自動リロード

# サーバー停止
# - Claude Code で /dev-server stop を実行
```

---

## よくある質問

### Q1. アプリ起動時に開発サーバー接続画面が出る

**A**: これは正常です。Dev Client は開発用なので、この画面が表示されます。Extensions タブから Update をロードしてください。

### Q2. Extensions タブに Update が表示されない

**A**: 以下を確認してください：
- Extensions タブで Login しているか
- `/ota` で Update を配信したか

### Q3. Update 後も変更が反映されない

**A**: 原因は runtimeVersion の不一致です。ネイティブ変更がある場合は `/dist-dev-client` で再ビルドしてください。

### Q4. eas init がエラーになる

**A**: `npx -y eas-cli@latest init --non-interactive --force` を使ってください。

### Q5. 開発サーバーはいつ使うべきか？

**A**: 開発サーバーは以下の場合に有効です：
- ローカル環境で開発している場合
- 頻繁にコードを変更する場合（Hot Reload で即座に反映）

逆に以下の場合は基本フロー（`/ota`）を使用してください：
- Sandbox 環境（Claude Code on the Web など）で開発している場合
- 開発サーバーを連続的に起動できない環境

---

## 参考リンク

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Update](https://docs.expo.dev/eas-update/introduction/)
- [Dev Client](https://docs.expo.dev/develop/development-builds/introduction/)
