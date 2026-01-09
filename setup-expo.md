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
npx create-expo-app@latest hello-update --template blank-typescript
cd hello-update
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

* ビルドは **Expo のクラウド**
* Free tier は queue 待ちあり（数分〜）
* 完了後、**APK の URL と QR コード** が出る

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
npx create-expo-app@latest hello-update --template blank-typescript
cd hello-update
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
