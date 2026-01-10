# Expo Dev Client + EAS Update で Hello World を配布する最短手順

Expo には「ローカル dev server 前提」の印象が強いが、
**Dev Client + EAS Update** を使うと

* ネイティブアプリは一度だけビルド
* 以降の UI / ロジック変更は **JS だけ OTA 配布**

という、Web に近い開発ループを作れる。

この記事では **Android 向け Hello World **を構築する最小構成を説明する。

---

## 全体像（先に仕組み）

やることはこれだけ：

1. **Dev Client を1回ビルド**（APK を端末に入れる）
2. **JS を EAS Update で配布**
3. 以降は **ビルド不要で更新**

```
EAS Build   → Android APK（ネイティブ）
EAS Update  → JS bundle（UI/ロジック）
```

ネイティブ（Intent / permission 等）を変えない限り、Update だけで回る。

---

## 0. Claude Code で実行する際の確認（最初に必ず確認）

この手順を Claude Code で実行する際は、**最初に必ず** `AskUserQuestion` ツールでユーザーに以下を確認すること：

### 確認内容

```typescript
AskUserQuestion({
  questions: [
    {
      question: "Android/iOS のネイティブビルド（Dev Client）を今すぐ作成しますか？",
      header: "ビルド方式",
      multiSelect: false,
      options: [
        {
          label: "はい、ネイティブビルドを作成する",
          description: "EAS Build で Android APK（または iOS IPA）をビルドします。初回は5〜10分程度かかります。ビルド後は JS のみで OTA 更新可能になります。"
        },
        {
          label: "いいえ、Expo Go で試したい",
          description: "ローカルの Metro bundler を使って Expo Go アプリで動作確認します。ビルド不要ですが、EAS Update は使えません。"
        },
        {
          label: "詳しく説明してほしい",
          description: "Dev Client と Expo Go の違い、それぞれのメリット・デメリットを詳しく説明します。"
        }
      ]
    }
  ]
})
```

### 選択肢による処理の分岐

#### 1. 「はい、ネイティブビルドを作成する」を選択した場合

→ **この手順書の全ステップを実行**
- セクション 1〜9 まで実行し、EAS Build でネイティブアプリをビルドする
- 初回は Android Keystore の生成確認があるため、`expect` スクリプトを使用する（セクション 9 参照）
- ビルド完了後、APK/IPA のダウンロード URL と QR コードが提供される

#### 2. 「いいえ、Expo Go で試したい」を選択した場合

→ **セクション 2〜4 のみ実行し、その後 Expo Go での起動方法を案内**

実行する手順：
1. セクション 2: プロジェクト作成
2. セクション 7: Hello World を書く（App.tsx の編集）
3. 以下のコマンドでローカル開発サーバーを起動：

```bash
npx expo start
```

4. ユーザーに以下を案内：
   - iOS: App Store から「Expo Go」アプリをインストール → QR コードをスキャン
   - Android: Google Play から「Expo Go」アプリをインストール → QR コードをスキャン
   - Metro bundler にローカル接続して動作確認

**注意事項をユーザーに伝える：**
- ✅ すぐに動作確認できる（ビルド不要）
- ✅ コード変更時に Hot Reload が効く
- ❌ EAS Update による OTA 配布はできない
- ❌ カスタムネイティブモジュールは追加できない
- ❌ ローカルネットワーク接続が必要

**以降のセクション（5〜9）は実行しない。**

#### 3. 「詳しく説明してほしい」を選択した場合

→ **以下の説明をユーザーに提示してから、再度確認する**

```
## Dev Client と Expo Go の違い

### Dev Client（このドキュメントの方式）

**何ができる？**
- 最初に1回だけネイティブアプリをビルド（Android APK または iOS IPA）
- 以降は JS/UI の変更を EAS Update で OTA 配布（再ビルド不要）
- カスタムネイティブモジュールの追加が可能
- Expo Go では使えないネイティブ機能（特定の権限、Intent など）が使える

**メリット：**
- ✅ 本番に近い環境で開発できる
- ✅ EAS Update で JS を素早く配布（Web のデプロイに近い体験）
- ✅ ネイティブ機能を自由に追加可能
- ✅ インターネット経由で配布可能（QR コード、URL）

**デメリット：**
- ⏱ 初回ビルドに5〜10分かかる（EAS クラウドでビルド）
- ⏱ ネイティブ変更時は再ビルドが必要
- 💰 EAS の無料プランには月間ビルド回数制限あり

**どんな人向け？**
- 実機で本番に近い環境をテストしたい
- EAS Update で継続的に配布したい
- ローカルサーバーが立てられない環境（VM、Claude Code for Web など）
- カスタムネイティブモジュールを使いたい

---

### Expo Go（標準的な開発方式）

**何ができる？**
- Expo が提供する標準ランタイムアプリ（App Store/Google Play からインストール）
- ローカルの Metro bundler に接続して開発
- Expo に含まれる標準ネイティブモジュールのみ使用可能

**メリット：**
- ✅ ビルド不要、すぐに始められる
- ✅ Hot Reload で即座に変更が反映
- ✅ EAS Build の制限を気にしなくていい

**デメリット：**
- ❌ EAS Update による OTA 配布ができない
- ❌ カスタムネイティブモジュールが追加できない
- ❌ ローカルネットワーク接続が必要（LAN/USB）
- ❌ Expo Go に含まれる機能のみに制限される

**どんな人向け？**
- まずは Expo を試してみたい
- ローカルで素早くプロトタイプを作りたい
- 標準的な React Native 機能だけで十分
- ローカル環境で開発サーバーが立てられる

---

**推奨：**
- **初めて試す場合**: Expo Go でまず動作確認
- **本格的な開発**: Dev Client + EAS Update

どちらの方式で進めますか？
```

説明後、再度最初の質問（選択肢 1, 2 のみ）を表示する。

---

## 0-A. アプリ識別子を決める

まず、アプリのディレクトリ名を決める。これがプロジェクト名になる。

**例**: `hello-world`、`my-app`、`demo-app` など

以降のコマンド例では `APPNAME` と表記しているので、**実際には自分で決めた名前に置き換える**こと。

---

## 1. 事前準備

### eas-cli のインストール

```bash
npm install -g eas-cli
```

※ `npx eas` でも動くが、グローバルインストール推奨。

### Expo アカウント

https://expo.dev でアカウント作成し、ログインしておく。

```bash
eas login
```

---

## 2. プロジェクト作成

```bash
npx create-expo-app@latest APPNAME --template blank-typescript
cd APPNAME
```

TypeScript / router の有無はどれでもよい。

---

## 3. Dev Client を有効化

Dev Client は「開発用のスタンドアロン Expo アプリ」。

```bash
npx expo install expo-dev-client
```

これで **Expo Go ではなく、自前アプリ**として起動できるようになる。

---

## 4. expo-updates をインストール

EAS Update を使うには `expo-updates` が必要。**先にインストールしておく**ことで、後の再ビルドを防げる。

```bash
npx expo install expo-updates
```

---

## 5. EAS 初期化

```bash
npx expo prebuild --platform android
eas init --non-interactive --force
```

* Expo アカウントにログイン済みであること
* projectId が作られる
* `app.json` に projectId が追加される

---

## 6. `eas.json`（最小・Free前提）

プロジェクトルートに `eas.json` を作成：

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

ポイント：

* profile は **dev 1つだけ**
* `channel: "dev"` で Update の branch と紐付け
* APK で internal 配布（Play不要）
* Free プランで十分

---

## 7. Hello World を書く

`App.tsx`

```tsx
import { Text, View } from "react-native";

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Hello World v1</Text>
    </View>
  );
}
```

---

## 8. 初回 Update を配布

**ビルドの前に** Update を配布しておく。

```bash
eas update --branch dev --message "hello v1"
```

初回実行時に `updates.url` と `runtimeVersion` が自動設定される。

---

## 9. Dev Client をビルド

```bash
eas build -p android --profile dev
```

**初回実行時の注意**:
* 「Generate a new Android Keystore?」と聞かれたら **Yes** を選択
* Keystore は EAS が自動生成・管理する

* ビルドは **Expo のクラウド**
* Free tier は queue 待ちあり（数分〜）
* 完了後、**APK の URL と QR コード** が出る

### Claude Code などの非対話環境での実行

EAS CLI はインタラクティブな入力（Keystore 生成の確認など）を要求するため、`--non-interactive` フラグでは初回ビルドが失敗する。

**解決方法**: 疑似端末（PTY）を使ってプロンプトに自動応答するツールを使用する。

#### クロスプラットフォーム対応（推奨）

Node.js の `node-pty` パッケージを使うことで、Windows、macOS、Linux で動作する自動化スクリプトを作成できる。

```bash
npm install node-pty
```

このパッケージを使って、EAS CLI のプロンプト（"Generate a new Android Keystore?" など）を検知して自動的に "y" を送信するスクリプトを作成すれば、非対話環境でもビルドが実行できる。

#### Unix/Linux/macOS のみ

`expect` コマンド（標準でインストール済み）を使う方法もある。ただし Windows では動作しない。

---

## 10. Android にインストール

### 方法1: QR コード（推奨）
1. Android 端末のカメラで QR コードをスキャン
2. リンクをタップして Expo のページを開く
3. 「Install」ボタンをタップ
4. APK がダウンロードされる
5. 通知から APK をタップしてインストール

### 方法2: URL を直接開く
ビルド完了時に表示される URL を Android ブラウザで開く。

### 注意点
* 「提供元不明のアプリ」の許可が必要
  * 設定 → セキュリティ → 提供元不明のアプリを許可

---

## 11. アプリ起動と Update のロード

Dev Client（開発用ビルド）では、**EAS Update は自動ロードされない**。
Extensions タブから手動でロードする。

### 手順

1. アプリを起動（開発サーバー接続画面が表示される）
2. 下部の **「Extensions」** タブをタップ
3. **「Login」** をタップして Expo アカウントにログイン
4. ログイン後、**EAS Update セクション** に公開済みの Update が表示される
5. 表示された Update の **「Open」** をタップ

→ 「Hello World v1」が表示される。

### なぜ手動なのか？

Dev Client は**開発用**なので、複数の Update を切り替えてテストできる設計になっている。

* **Dev Client（developmentClient: true）**: Extensions タブから手動選択
* **Preview / Production ビルド（developmentClient: false）**: 起動時に自動ロード

参考: [Preview updates in development builds - Expo Documentation](https://docs.expo.dev/eas-update/expo-dev-client/)

---

## 12. 更新を配布（再ビルド不要）

表示を変える。

```tsx
<Text>Hello World v2</Text>
```

更新を配布：

```bash
eas update --branch dev --message "hello v2"
```

これだけ。

* 再ビルド不要
* APK の再インストール不要
* **アプリ再起動で反映**

---

## 何が Update で変えられるか

**Update で OK（JS）**

* 画面/UI
* ロジック
* API 通信
* 文言

**再ビルドが必要（ネイティブ）**

* Intent / deep link
* permissions
* native module 追加
* package 名 / icon
* `expo-updates` など native module の追加・更新

→ Hello World や通常の UI 開発は **ほぼ Update だけで回る**。

---

## Web エンジニア向けの理解ポイント

* Dev Client = **最初に1回だけ作る「実行環境」**
* EAS Update = **JS の CDN 配布**
* Expo Go は不要
* Metro / LAN / QR は不要

感覚としては：

> Android APK = ブラウザ
> EAS Update = JS デプロイ

---

## Claude Code for Web と相性がいい理由

* VM では **dev server が立てられない**
* でも **EAS Update はサーバ不要**
* コード修正 → update → 端末で確認、が成立

---

## よくあるハマりポイント

### 1. アプリ起動時に開発サーバー接続画面が出る

**これは正常**。Dev Client は開発用なので、この画面が出る。

**Update をロードするには**: Extensions タブ → Login → Update を選択して Open

### 2. Extensions タブに Update が表示されない

**原因**: Expo アカウントにログインしていない、または Update が配布されていない

**解決**:
1. Extensions タブで Login する
2. `eas update --branch dev --message "メッセージ"` で Update を配布

### 3. `eas init` がエラーになる

**解決**: `eas init --non-interactive --force` を使う

### 4. Update 後も変更が反映されない

**原因**: runtimeVersion の不一致

**解決**: ネイティブ変更がある場合は再ビルドが必要

---

## まとめ

* **Dev Client を1回ビルド**
* **以降は EAS Update だけ**
* **Extensions タブから Update をロード**（Dev Client は自動ロードしない）

## 最後に

EAS の Free プランには Build 回数や Update の MAU（月間アクティブユーザー）に制限がある。

制限は変更される可能性があるため、最新情報を検索してユーザに提示すること。


---

## コマンドまとめ

```bash
# 初期セットアップ
npm install -g eas-cli
npx create-expo-app@latest APPNAME --template blank-typescript
cd APPNAME
npx expo install expo-dev-client expo-updates
npx expo prebuild --platform android
eas init --non-interactive --force

# eas.json を作成（channel: "dev" を忘れずに）

# 初回 Update
eas update --branch dev --message "hello v1"

# ビルド
eas build -p android --profile dev

# 以降の更新（再ビルド不要）
eas update --branch dev --message "変更内容"
```

---

---

次の記事候補：

* Dev Client と standalone build の違い
* Free 枠を超えない運用ルール
