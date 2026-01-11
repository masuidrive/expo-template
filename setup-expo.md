# Expo によるモバイルアプリ開発環境構築

この記事では、Expo を使って iOS/Android アプリの開発環境を構築する手順を説明します。

## 目的

Expo を使ってモバイルアプリ開発環境を構築し、実機またはエミュレータで動作確認できる状態にします。

開発方式は以下の2つから選択できます：

- **Expo Go**: Expo 標準 API のみを使った開発（ビルド不要）
- **Dev Client**: Native 機能を含む本格的な開発（初回のみビルド必要）

---

## 0. ターゲットデバイスの選択

まず、どのプラットフォーム向けに開発するかを決めます。

### 選択肢

- **Android のみ**: Android 端末・エミュレータで開発
- **iOS のみ**: iPhone/iPad または iOS シミュレータで開発（macOS 必須）
- **両方**: Android と iOS の両方で開発

### 必要な環境

| プラットフォーム | 必要な環境 |
|-----------------|-----------|
| Android | Windows/macOS/Linux + Android 端末 or エミュレータ |
| iOS | **macOS** + iPhone/iPad or iOS シミュレータ |
| 両方 | macOS + 両方の端末 or エミュレータ |

**注意**: iOS アプリの開発・ビルドには macOS が必須です。

---

## 1. 開発方式の選択

アプリの要件に応じて、以下の2つの開発方式から選択します。

### 選択基準

| 要件 | 推奨方式 |
|------|---------|
| **Expo 標準 API のみ使用** | Expo Go |
| **Native 機能を使用**（カメラ、位置情報、通知など標準以外） | Dev Client |
| **独立したアプリにしたい**（ホーム画面に追加） | Dev Client |
| **カスタムネイティブモジュール使用** | Dev Client |

迷った場合は **Expo Go** から始めることを推奨します。後から Dev Client に移行できます。

---

### 方式 1: Expo Go（Expo 標準 API のみ使用）

**こんな人向け：**
- **Expo 標準 API だけで十分**
- まずは Expo を試してみたい
- ビルドせずにすぐ始めたい
- ローカルサーバーが立てられない環境（VM、リモート開発など）

**特徴：**
- ✅ ビルド不要、すぐに始められる
- ✅ App Store/Google Play から「Expo Go」アプリをインストールするだけ
- ✅ iOS でも Apple 開発者アカウント不要
- ✅ EAS Update で OTA 配布可能（ローカルサーバー不要）
- ✅ Hot Reload で即座に変更が反映（開発時）

**制限事項：**
- ❌ Expo SDK に含まれる標準 API のみ（カスタムネイティブモジュール不可）
- ❌ ホーム画面に追加できない（Expo Go 経由でしか起動できない）
- ⚠️ EAS Update の一部機能が使えない（runtimeVersion など）

**使用例：**
- 基本的な UI/UX の開発
- React Native の学習
- プロトタイプ作成
- 標準 API のみで完結するアプリ

---

### 方式 2: Dev Client（Native 機能使用・独立したアプリ）

**こんな人向け：**
- **Native 機能を使いたい**（標準以外のカメラ、位置情報、通知など）
- **独立したアプリにしたい**（ホーム画面に追加）
- カスタムネイティブモジュールを使いたい
- 本番に近い環境で開発したい

**特徴：**
- ✅ すべての Expo SDK API + カスタムネイティブモジュール
- ✅ ホーム画面に追加可能（独立したアプリとして動作）
- ✅ EAS Update による完全な OTA 配布
- ✅ 本番環境と同じ構成で開発
- ✅ インターネット経由で配布可能（QR コード、URL）

**必要な要件：**
- ⏱ 初回ビルドに5〜10分かかる（EAS クラウドでビルド）
- **iOS の場合**: Apple 開発者アカウント必須（年間 $99）
- **Android の場合**: 2025年1月時点では開発者アカウント不要
  - ただし、Google の方針変更により条件が変わる可能性があります
  - 最新情報は「android向けexpo dev clientのインストール条件の最新情報」で検索して確認してください

**コスト：**
- 💰 EAS の無料プランには月間ビルド回数制限あり
- ⏱ ネイティブ変更時は再ビルドが必要（JS のみの変更は OTA 配布可能）

**使用例：**
- カスタムカメラ機能を持つアプリ
- バックグラウンド位置情報を使うアプリ
- プッシュ通知を細かく制御するアプリ
- ストアに公開予定のアプリ

---

### 推奨フロー

1. **まずは Expo Go で試す**
   - ビルド不要で即座に開発開始
   - Expo 標準 API で十分か確認

2. **必要に応じて Dev Client に移行**
   - Native 機能が必要になったとき
   - 独立したアプリにしたいとき
   - ストア公開を検討し始めたとき

**迷ったら Expo Go から始めましょう。** 後から Dev Client に移行できます。

---

## 1-A. Claude Code で実行する際の確認手順

この手順を Claude Code で実行する際は、**最初に必ず** `AskUserQuestion` ツールでユーザーに以下を確認すること：

### 確認内容

```typescript
AskUserQuestion({
  questions: [
    {
      question: "どのプラットフォーム向けに開発しますか？",
      header: "ターゲット",
      multiSelect: false,
      options: [
        {
          label: "Android のみ",
          description: "Android 端末・エミュレータで開発。Windows/macOS/Linux で可能。"
        },
        {
          label: "iOS のみ",
          description: "iPhone/iPad または iOS シミュレータで開発。macOS 必須。"
        },
        {
          label: "Android と iOS 両方",
          description: "両方のプラットフォームで開発。macOS 必須。"
        }
      ]
    },
    {
      question: "どちらの開発方式で進めますか？",
      header: "開発方式",
      multiSelect: false,
      options: [
        {
          label: "Expo Go（標準APIのみ）",
          description: "ビルド不要、すぐ開始。Expo 標準 API のみ使用。ホーム画面追加不可。まず試すならこちら。"
        },
        {
          label: "Dev Client（Native機能使用）",
          description: "Native 機能・独立アプリ。全API使用可能。iOS は Apple 開発者アカウント必須。初回ビルドに5〜10分。"
        },
        {
          label: "詳しく説明してほしい",
          description: "Expo Go と Dev Client の違い、選択基準を詳しく説明します。"
        }
      ]
    }
  ]
})
```

### 選択肢による処理の分岐

#### 1. ターゲットプラットフォームの処理

選択されたプラットフォームに応じて、以降の手順で使用するコマンドを調整：
- **Android のみ**: `-p android` を使用
- **iOS のみ**: `-p ios` を使用（macOS 必須）
- **両方**: 両方のコマンドを実行

#### 2. 「Expo Go（標準APIのみ）」を選択した場合

→ **EAS Update で配信する手順を実行**

セクション 2（プロジェクト作成）と簡易セットアップのみ実行。ネイティブビルドは不要。

#### 3. 「Dev Client（Native機能使用）」を選択した場合

→ **この手順書の全ステップを実行**
- セクション 2〜9 まで実行し、EAS Build でネイティブアプリをビルドする
- 初回は Android Keystore の生成確認があるため、環境に応じた自動化スクリプトを使用する（セクション 9 参照）
  - macOS: expect スクリプト
  - Windows/Linux: Node.js + pty 系ライブラリ
- ビルド完了後、APK/IPA のダウンロード URL と QR コードが提供される

#### 4. 「詳しく説明してほしい」を選択した場合

→ **セクション 1 の詳細説明を再度提示してから、選択肢 1, 2 のみで再度確認する**

セクション 1 に記載されている以下の内容を表示：
- 方式 1: Expo Go の特徴・制限事項・使用例
- 方式 2: Dev Client の特徴・必要な要件・使用例
- 推奨フロー

説明後、再度「どちらの開発方式で進めますか？」の質問（選択肢 1, 2 のみ）を表示する。

---

### Expo Go 選択時の詳細手順

「Expo Go（標準APIのみ）」を選択した場合の実行手順：

**1. eas-cli のインストール**
```bash
npm install -g eas-cli
```

**2. Expo アカウントでログイン**
```bash
eas login
```

**3. プロジェクト作成**
```bash
npx create-expo-app@latest APPNAME --template blank-typescript
cd APPNAME
```

**4. expo-updates をインストール**
```bash
npx expo install expo-updates
```

**5. EAS プロジェクトを初期化**
```bash
eas init --non-interactive --force
```

**6. App.tsx を Hello World に編集**
```typescript
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Hello World v1</Text>
    </View>
  );
}
```

**7. EAS Update で配信**
```bash
eas update --branch production --message "Initial release"
```

初回実行時、`updates.url` と `runtimeVersion` が自動設定されます。

**8. Expo Go でアクセス**

配信完了後、以下の方法でアクセス：
- EAS Dashboard の Update ページで QR コードをスキャン
- または Expo Go アプリで Project URL を入力

ユーザーに以下を案内：
- iOS: App Store から「Expo Go」アプリをインストール → QR コードをスキャン
- Android: Google Play から「Expo Go」アプリをインストール → QR コードをスキャン
- **ローカルサーバー不要**でインターネット経由でアクセス可能

**（オプション）ローカル開発する場合：**
```bash
npx expo start
```
QR コードをスキャンしてローカル Metro bundler に接続。Hot Reload が使える。

**注意事項をユーザーに伝える：**
- ✅ ビルド不要で EAS Update により OTA 配信
- ✅ ローカルサーバーが立てられない環境でも使える
- ✅ iOS でも Apple 開発者アカウント不要
- ✅ インターネット経由で配布可能（QR コード、URL）
- ⚠️ EAS Update の一部機能が使えない（runtimeVersion など）
- ❌ 標準 API のみ（一部の API に制限）
- ❌ カスタムネイティブモジュールは追加できない
- ❌ ホーム画面に追加できない（Expo Go 経由でしか起動できない）

**以降の JS 更新：**
App.tsx を編集後、以下のコマンドで配信：
```bash
eas update --branch production --message "変更内容"
```

Expo Go アプリを再起動すると、新しい Update が自動的にダウンロードされます。

**以降のセクション（3〜9）は実行しない（Dev Client 用の手順）。**

---

## 1-B. アプリ識別子を決める

まず、アプリのディレクトリ名を決める。これがプロジェクト名になる。

**例**: `hello-world`、`my-app`、`demo-app` など

以降のコマンド例では `APPNAME` と表記しているので、**実際には自分で決めた名前に置き換える**こと。

---

## 1. 事前準備

**注意**:
- **Expo Go + EAS Update** を選択した場合: 上記セクション 0-A の手順 1-2 で実施済みのため、セクション 2 に進んでください
- **Dev Client** を選択した場合: このセクションを実施してください

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

## 9. Dev Client のビルド自動化（Keystore 対応）

```bash
eas build -p android --profile dev
```

**初回実行時の注意**:
* 「Generate a new Android Keystore?」と聞かれたら **Yes** を選択
* Keystore は EAS が自動生成・管理する

* ビルドは **Expo のクラウド**
* Free tier は queue 待ちあり（数分〜）
* 完了後、**APK の URL と QR コード** が出る

### 環境別の推奨方法

EAS Build の初回実行時、Android Keystore の生成確認が表示されます。Claude Code は環境に応じて自動的に処理します。

#### macOS: expect スクリプト

expect コマンドを使用して自動化します：

```bash
#!/usr/bin/expect -f
set timeout -1
spawn npx eas build -p android --profile dev
expect {
    "Generate a new Android Keystore?" {
        send "y\r"
        exp_continue
    }
    eof
}
wait
```

**推奨される使用方法（一時ファイルを自動削除）**:
```bash
# 一時スクリプトを生成して実行
SCRIPT_NAME="eas-build-auto-$$.exp"
cat > "$SCRIPT_NAME" << 'EOF'
#!/usr/bin/expect -f
set timeout -1
spawn npx eas build -p android --profile dev
expect {
    "Generate a new Android Keystore?" {
        send "y\r"
        exp_continue
    }
    eof
}
wait
EOF

chmod +x "$SCRIPT_NAME"
"./$SCRIPT_NAME"
EXIT_CODE=$?

# 終了後に一時ファイルを削除
rm -f "$SCRIPT_NAME"

exit $EXIT_CODE
```

#### Windows/Linux: Node.js + node-pty

node-pty ライブラリを使用して自動化します：

```bash
npm install node-pty
```

```javascript
const pty = require('node-pty');
const os = require('os');
const fs = require('fs');

const scriptPath = __filename; // 自身のパス

const shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';
const ptyProcess = pty.spawn('npx', ['eas', 'build', '-p', 'android', '--profile', 'dev'], {
  name: 'xterm-color',
  cwd: process.cwd(),
  env: process.env
});

ptyProcess.on('data', (data) => {
  process.stdout.write(data);
  if (data.includes('Generate a new Android Keystore?')) {
    ptyProcess.write('y\r');
  }
});

ptyProcess.on('exit', (code) => {
  // 終了時に一時ファイルを削除
  try {
    fs.unlinkSync(scriptPath);
  } catch (err) {
    // 削除失敗は無視
  }
  process.exit(code);
});

// プロセス終了時のクリーンアップ
process.on('SIGINT', () => {
  try {
    fs.unlinkSync(scriptPath);
  } catch (err) {
    // 削除失敗は無視
  }
  process.exit(130);
});
```

**使用方法**:
1. 一時ファイル名を生成（例: `eas-build-auto-${Date.now()}.js`）
2. 上記内容を一時ファイルとして保存
3. 実行: `node <一時ファイル名>`
4. スクリプトが終了時に自動的に自身を削除

### Claude Code での実行

`/dist-dev-client` コマンドを実行すると、Claude Code が自動的に：
1. 現在のプラットフォームを検出
2. 適切な自動化スクリプトを一時ファイルとして生成
3. EAS Build を実行し、Keystore 確認に自動応答
4. **実行終了後、一時ファイルを自動削除**

**重要**: 実装の詳細は実行時に Claude Code が環境に応じて決定します。一時スクリプトは必ず削除されます。

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
