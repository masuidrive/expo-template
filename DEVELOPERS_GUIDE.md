# Developer's Guide

コーディングエージェント（Claude Code など）を使ったExpo開発ガイド

## 環境構築

最初に環境構築を行ってください:

```
@docs/setup-expo.md に従って環境構築して
```

## 基礎知識

### Expo Go とは
Expoが提供する既製アプリ。App Storeからインストールして即使える。標準APIのみ対応。

### Dev Client とは
自分でビルドするカスタム開発アプリ。カスタムネイティブモジュールが使える。初回ビルドが必要。

### 比較
- **Expo Go**: インストールするだけ、標準APIのみ、学習・プロトタイプ向け
- **Dev Client**: 一度ビルド必要、カスタムネイティブコード使える、本格開発向け

**共通点:** どちらもJSの更新は `/ota` (EAS Update) で即座に配信可能

---

## 開発フロー

### 1. 開発サーバーの起動: `/dev-server`

ローカル開発用の Expo 開発サーバーを起動・停止します。

**使用例:**
```
/dev-server start   # サーバー起動
/dev-server stop    # サーバー停止
```

**用途:**
- ローカルでのコード変更を即座に反映
- Expo Go や Dev Client からアクセス
- ホットリロードで開発効率向上

**注意:** `/ota` で配信する場合は不要（オプション機能）

---

### 2. JS/UI 変更の配信: `/ota`

JS コードや UI の変更を EAS Update で配信します。ネイティブビルドは不要です。

**使用例:**
```
/ota
```

**配信されるもの:**
- UI コンポーネント
- ビジネスロジック
- スタイリング
- API 呼び出し

**特徴:**
- 即座に配信（数秒〜1分）
- 無料
- Expo Go と Dev Client の両方で使用可能

---

### 3. Dev Client のセットアップ: `/setup-dev-client`

Expo Go から Dev Client に移行する際、または新規に Dev Client 環境をセットアップします。

**使用例:**
```
/setup-dev-client
```

**セットアップ内容:**
- expo-dev-client のインストール
- ネイティブプロジェクトの生成（android/ios）
- eas.json の作成

**次のステップ:** `/dist-dev-client` でビルド

---

### 4. ネイティブビルドの配信: `/dist-dev-client`

Dev Client APK/IPA をビルドして配信します。

**使用タイミング:**
- ネイティブ権限の追加
- ネイティブモジュールの追加
- ディープリンク設定
- アプリアイコン/スプラッシュ画面の変更

**使用例:**
```
/dist-dev-client
```

**ビルド時間:**
- 有料プラン: 5〜10分
- 無料プラン: 30分〜3時間以上

**注意:** バックグラウンドで実行されるため、ビルド中に他の作業が可能です。

---

## 開発パターン

### パターン1: ローカル開発（Expo Go）
```
1. 環境構築
2. /dev-server start
3. Expo Go アプリでスキャンして接続
4. コード変更がホットリロードで即座に反映
```

### パターン2: OTA 配信（Expo Go）
```
1. 環境構築
2. /ota で配信
3. Expo Go アプリの Extensions タブから確認
```

### パターン3: Dev Client（本格開発）
```
1. 環境構築
2. /setup-dev-client
3. /dist-dev-client（初回のみ）
4. /dev-server または /ota で開発
5. ネイティブ変更時のみ /dist-dev-client
```

---

## 詳細な開発フロー

### Dev Client: JS/UI のみの変更

1. `App.tsx` を編集（例: `<Text>Hello World v2</Text>`）
2. **Claude Code で `/ota` を実行**

**結果**:
- 再ビルド不要
- APK/IPA の再インストール不要
- **アプリを再起動すると新しいバージョンが表示される**

### Dev Client: ネイティブ変更がある場合

以下の変更をした場合は再ビルドが必要です：

- Intent handlers / deep links
- Permissions
- Native modules
- Package name / app icon
- Build configuration (app.json affecting native)

**Claude Code で `/dist-dev-client` を実行**してください。

### 開発サーバーの使用（オプション）

より高速な開発サイクルが必要な場合、開発サーバーを起動して Hot Reload を有効にできます。

#### 開発サーバーを起動

**Claude Code で `/dev-server` を実行**します。

これにより：
- `npx expo start --dev-client` がバックグラウンドで実行される（Dev Client の場合）
- `npx expo start` がバックグラウンドで実行される（Expo Go の場合）
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

## セットアップまとめ

### A. Expo Go の場合

**基本フロー**:

```bash
# 初回セットアップ
npx create-expo-app@latest APPNAME --template blank-typescript
cd APPNAME
# App.tsx を編集
npx -y eas-cli@latest init --non-interactive --force
npx -y eas-cli@latest build:configure  # eas.json 生成（ビルドなし）
npx -y eas-cli@latest update:configure  # Update 設定
git add app.json eas.json
git commit -m "Add EAS configuration"
git push

# Claude Code で実行
/ota  # Update を配信

# Expo Go アプリで確認
# - Extensions タブ → Login → Update を選択 → Open

# 開発フロー
# - コードを編集
# - Claude Code で /ota を実行
# - Expo Go で Extensions タブから Update を選択
```

**オプション: 開発サーバー使用**:

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

# 設定ファイルをコミット
git add app.json eas.json android/ ios/
git commit -m "Add EAS and native configuration"
git push

# Claude Code で実行
/ota              # 初回 Update 配信
/dist-dev-client  # ビルド（Android: APK、iOS: IPA）

# 開発フロー
# - コードを編集
# - Claude Code で /ota を実行（JS のみの変更）
# - または /dist-dev-client を実行（ネイティブ変更がある場合）
```

**オプション: 開発サーバー使用**:

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

## Pull Request ルール

PR タイトルまたはコミットメッセージに、以下のタグを含めてください:

- **[ota]**: JS のみの変更（EAS Update で配信）
- **[dist-dev-client]**: ネイティブ変更（再ビルドが必要）

これにより、どのデプロイが必要かが明確になります。

---

## GitHub Actions の設定

GitHub Actions で自動デプロイを行うため、以下の手順で設定してください。

### 1. EXPO_TOKEN の取得

1. https://expo.dev/accounts/[your-account]/settings/access-tokens にアクセス
2. "Create Token" でトークン発行（スコープは write 推奨）
3. トークン文字列（`ey...`）をコピー

### 2. GitHub Secrets に登録

1. GitHub リポジトリの **Settings > Secrets and variables > Actions > Secrets**
2. **New repository secret**
   - Name: `EXPO_TOKEN`
   - Value: コピーしたトークン

### 3. Claude Code で GitHub App をインストール（Claude Code 使用時のみ）

```
/github-app-install
```

### 完了

これで、Pull Request をマージすると自動的に以下が実行されます:

- **[ota]** タグ付き PR → EAS Update で JS バンドル配信
- **[dist-dev-client]** タグ付き PR → EAS Build で APK/IPA ビルド

詳細は [setup-gh-actions.md](./docs/setup-gh-actions.md) を参照してください。

---

## よくある質問

### Q1. /dev-server と /ota の違いは?

**A**: `/dev-server` はローカル開発用（即座に反映）、`/ota` は配信用（サーバー不要）

### Q2. /ota と /dist-dev-client の使い分けは?

**A**: JS/UI 変更は `/ota`、ネイティブ変更は `/dist-dev-client`

### Q3. Dev Client は必須?

**A**: いいえ。標準 API のみ使う場合は Expo Go で十分です。

### Q4. ビルド待ち時間が長い

**A**: 無料プランではキュー時間が長くなります。バックグラウンド実行を活用してください。

### Q5. アプリ起動時に開発サーバー接続画面が出る

**A**: これは正常です。Dev Client は開発用なので、この画面が表示されます。Extensions タブから Update をロードしてください。

### Q6. Extensions タブに Update が表示されない

**A**: 以下を確認してください：
- Extensions タブで Login しているか
- `/ota` で Update を配信したか

### Q7. Update 後も変更が反映されない

**A**: 原因は runtimeVersion の不一致です。ネイティブ変更がある場合は `/dist-dev-client` で再ビルドしてください。

### Q8. eas init がエラーになる

**A**: `npx -y eas-cli@latest init --non-interactive --force` を使ってください。

### Q9. 開発サーバーはいつ使うべきか？

**A**: 開発サーバーは以下の場合に有効です：
- ローカル環境で開発している場合
- 頻繁にコードを変更する場合（Hot Reload で即座に反映）

---

## 参考リンク

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Update](https://docs.expo.dev/eas-update/introduction/)
- [Dev Client](https://docs.expo.dev/develop/development-builds/introduction/)
- [README.md](./README.md)
- [CLAUDE.md](./CLAUDE.md)
