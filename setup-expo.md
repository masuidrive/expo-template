# Expo によるモバイルアプリ開発環境構築

Expo を使って iOS/Android アプリの開発環境を構築する手順です。

## 概要

このガイドでは、Expo Dev Client + EAS Update を使った開発環境を構築します。

**アーキテクチャ**:
- **Dev Client**: ネイティブアプリを一度だけビルド（実行環境）
- **EAS Update**: JS バンドルを OTA 配信（再ビルド不要で更新）

**開発方式**:
- **Expo Go**: 標準 API のみ（ビルド不要、Expo Go アプリで実行）
- **Dev Client**: Native 機能も使用可能（初回ビルド必要）

このガイドは **Dev Client** の構築手順です。Expo Go の場合は `/ota` スキルのみで配信できます。

---

## 前提条件

以下を事前にインストール・ログインしておいてください：

```bash
# eas-cli のインストール
npm install -g eas-cli

# Expo アカウントでログイン
eas login
```

**Expo アカウント**: https://expo.dev でアカウント作成が必要です。

---

## 1. プロジェクト作成

```bash
npx create-expo-app@latest APPNAME --template blank-typescript
cd APPNAME
```

**APPNAME** は任意のプロジェクト名に置き換えてください（例: `hello-world`）。

以降のコマンドはすべて **APPNAME ディレクトリ内**で実行します。

---

## 2. Dev Client と expo-updates をインストール

```bash
npx expo install expo-dev-client expo-updates
```

- **expo-dev-client**: Dev Client（開発用スタンドアロンアプリ）を有効化
- **expo-updates**: EAS Update（OTA 配信）を有効化

---

## 3. EAS 初期化

```bash
npx expo prebuild --platform android
eas init --non-interactive --force
```

これにより：
- Android ネイティブプロジェクトが生成される（`android/` ディレクトリ）
- EAS projectId が作成され、`app.json` に追加される

---

## 4. eas.json を作成

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

**ポイント**:
- `developmentClient: true` → Dev Client として動作
- `distribution: "internal"` → Play Store 不要で APK 配布
- `channel: "dev"` → EAS Update の `dev` ブランチと紐付け
- `buildType: "apk"` → APK でビルド（無料）

---

## 5. Hello World を作成

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

## 6. 初回 Update を配信

**Claude Code で `/ota` を実行**します。

これにより：
- `eas update --branch dev` が実行される
- 初回実行時、`updates.url` と `runtimeVersion` が `app.json` に自動設定される

---

## 7. Dev Client をビルド

**Claude Code で `/dist-dev-client` を実行**します。

これにより：
- EAS Build が開始される
- Android Keystore の生成確認が自動応答される
- ビルドは Expo のクラウドで実行される（5〜10分）
- 完了後、**APK の URL と QR コード**が表示される

---

## 8. Android にインストール（ユーザー操作）

**開発者に以下の手順を説明して実行してもらってください**：

### QR コードでインストール（推奨）

1. Android 端末のカメラで QR コードをスキャン
2. リンクをタップして Expo のページを開く
3. 「Install」ボタンをタップ
4. APK がダウンロードされる
5. 通知から APK をタップしてインストール

**注意**: 「提供元不明のアプリ」の許可が必要です。
- 設定 → セキュリティ → 提供元不明のアプリを許可

### URL で直接インストール

ビルド完了時に表示される URL を Android ブラウザで開いてインストールすることもできます。

---

## 9. アプリ起動と Update のロード（ユーザー操作）

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

## 10. 以降の開発フロー

### コードを更新して配信

1. `App.tsx` を編集（例: `<Text>Hello World v2</Text>`）
2. **Claude Code で `/ota` を実行**

**結果**:
- 再ビルド不要
- APK の再インストール不要
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

## まとめ

### 初回セットアップ

```bash
# 前提条件
npm install -g eas-cli
eas login

# プロジェクト作成
npx create-expo-app@latest APPNAME --template blank-typescript
cd APPNAME
npx expo install expo-dev-client expo-updates
npx expo prebuild --platform android
eas init --non-interactive --force

# eas.json を作成
# App.tsx を編集

# Claude Code で実行
/ota              # 初回 Update 配信
/dist-dev-client  # APK ビルド
```

### 開発フロー

```bash
# コードを編集
# Claude Code で実行
/ota  # JS のみの変更

# または
/dist-dev-client  # ネイティブ変更がある場合
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

**A**: `eas init --non-interactive --force` を使ってください。

---

## 参考リンク

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Update](https://docs.expo.dev/eas-update/introduction/)
- [Dev Client](https://docs.expo.dev/develop/development-builds/introduction/)
