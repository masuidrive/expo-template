# GitHub Actions Setup for Expo EAS

Coding Agent が claude/* or features/* ブランチを作って Pull Request → main にマージされたら GitHub Actions が EAS で自動デプロイする設定手順。

---

## ゴール

- Pull Request は claude/* と features/* ブランチから作成
- Pull Request 作成・更新時は verify（lint/typecheck/test）を実行
- main へマージ時、PR body のタグに応じて自動デプロイ:
  - `[ota]`: EAS Update で JS バンドル配信（高速・無料）
  - `[dist-dev-client]`: EAS Build で APK ビルド（重い・回数制限あり）
- Expo の認証は GitHub Secrets の EXPO_TOKEN で管理

---

## 前提条件

- eas.json が設定済み（詳細は [setup-expo.md](./setup-expo.md) 参照）
- Expo アカウント作成済み

---

## 1. package.json に verify スクリプトを追加

Pull Request と Actions で共通のゲートを定義します。

```json
{
  "scripts": {
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "verify": "npm run lint && npm run typecheck && npm run test"
  }
}
```

lint だけでも推奨。プロジェクトに応じて調整してください。

---

## 2. EAS Token の発行と登録

### 2-1) トークン作成

1. https://expo.dev/accounts/[your-account]/settings/access-tokens にアクセス
2. "Create Token" でトークン発行（スコープは write 推奨）
3. トークン文字列（`ey...`）をコピー

### 2-2) GitHub リポジトリに登録

1. GitHub リポジトリの **Settings > Secrets and variables > Actions > Secrets**
2. **New repository secret**
   - Name: `EXPO_TOKEN`
   - Value: コピーしたトークン

---

## 3. GitHub Actions ワークフローの設定

### 3-1) Pull Request で verify 実行

`.github/workflows/verify.yml`

```yaml
name: Verify

on:
  pull_request:
    branches: [main]
  push:
    branches:
      - "claude/**"
      - "features/**"

jobs:
  verify:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: my-app  # アプリディレクトリ名に変更
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: my-app/package-lock.json  # アプリディレクトリ名に変更
      - run: npm ci
      - run: npm run verify
```

**ポイント:**
- `working-directory` と `cache-dependency-path` をアプリディレクトリ名に変更
- claude/* と features/* の push で自動実行

---

### 3-2) main マージ時に EAS Update 実行（[ota] タグ）

`.github/workflows/eas-update-on-merge.yml`

```yaml
name: EAS Update (on merge to main)

on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  eas_update:
    # PR body に [ota] タグがある場合のみ実行
    if: |
      github.event.pull_request.merged == true &&
      contains(github.event.pull_request.body, '[ota]')
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: my-app  # アプリディレクトリ名に変更
    steps:
      - uses: actions/checkout@v4
        with:
          ref: main

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: my-app/package-lock.json  # アプリディレクトリ名に変更

      - run: npm ci

      - name: EAS Update (JS bundle to dev channel)
        run: npx eas-cli@latest update --branch dev --message "${MESSAGE}" --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          MESSAGE: "Deployed from main after PR #${{ github.event.pull_request.number }}"
```

**ポイント:**
- PR body に `[ota]` タグを含める必要がある
- JS バンドルのみ配信（高速・無料）

---

### 3-3) main マージ時に EAS Build 実行（[dist-dev-client] タグ）

`.github/workflows/eas-build-android-on-merge.yml`

```yaml
name: EAS Build Android (on merge to main)

on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  build_android:
    # PR body に [dist-dev-client] タグがある場合のみ実行
    if: |
      github.event.pull_request.merged == true &&
      contains(github.event.pull_request.body, '[dist-dev-client]')
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: my-app  # アプリディレクトリ名に変更
    steps:
      - uses: actions/checkout@v4
        with:
          ref: main

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: my-app/package-lock.json  # アプリディレクトリ名に変更

      - run: npm ci
      - run: npm run verify

      - name: EAS Build (Android)
        run: npx eas-cli@latest build -p android --profile dev --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

**ポイント:**
- PR body に `[dist-dev-client]` タグを含める必要がある
- ネイティブビルド（5〜10分、回数制限あり）
- `--profile dev` は eas.json の設定に合わせて変更

---

## 4. Pull Request のタグ運用

### タグの使い分け

PR の説明（body）に以下のタグを含めてください:

- **[ota]**: JS/UI の変更のみ（UI、ロジック、API、スタイル）
  - `eas update` で即座に配信
  - 無料・高速

- **[dist-dev-client]**: ネイティブ変更（permissions、native modules、deep links、アイコン）
  - `eas build` でビルド実行
  - ビルド回数を消費

### 例

**JS 変更の PR:**
```markdown
Fix login button styling

[ota]
```

**ネイティブ変更の PR:**
```markdown
Add camera permission for photo upload

[dist-dev-client]
```

---

## 5. ブランチ運用

Coding Agent に作業指示する際は、ブランチ名を明示すると確実です:

```
features/add-login-screen ブランチを作って変更して Pull Request 作って
```

```
claude/fix-typo ブランチで修正して
```

---

## 6. カスタマイズポイント

- `working-directory`: アプリディレクトリ名（my-app など）
- `cache-dependency-path`: package-lock.json のパス
- `--profile dev`: eas.json のプロファイル名
- `--branch dev`: EAS Update のチャンネル名

---

これで、タグベースの自動デプロイが完成です。無駄なビルドを避けつつ、効率的な CI/CD パイプラインが構築できます。
