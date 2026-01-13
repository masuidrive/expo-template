# Claude Code on the Web で GitHub App をセットアップする方法

Claude Code CLI の `/install-github-app` コマンドに相当する処理を、Claude Code on the Web（claude.ai の Computer Use 機能）で実行する手順です。

## 概要

Claude Code を GitHub Actions と連携させるには、以下の2つが必要です：

1. **Long-Lived Token（OAuth トークン）**: Claude Code が GitHub Actions 内で動作するための認証トークン
2. **Claude GitHub App のインストール**: リポジトリへの読み取り/書き込み権限を付与

このガイドでは、Web 環境でこれらのセットアップを完了する方法を説明します。

## 前提条件

- Claude Max または Pro プランのアカウント
- GitHub リポジトリへの管理者権限（Admin access）
- Claude Code Web 環境（Computer Use 有効）

---

## Step 1: Long-Lived Token を取得

Claude Code が GitHub Actions で動作するには、1年間有効な OAuth トークンが必要です。

### 詳細な取得手順

トークン取得の詳細手順は [`setup-claude-code-on-the-web.md`](./setup-claude-code-on-the-web.md) を参照してください。

### 概要

1. **pexpect をインストール**:
   ```bash
   pip install pexpect --break-system-packages
   ```

2. **認証スクリプトを作成して実行**:
   スクリプトが認証 URL を生成します。

3. **ブラウザで認証**:
   表示された URL をブラウザで開き、Claude アカウントでログイン・認可します。

4. **認証コードを入力**:
   取得した認証コードを指定されたファイルに書き込みます。

5. **トークンを取得**:
   ```bash
   cat /tmp/claude_token.txt
   ```

取得したトークンは次のステップで使用します。

---

## Step 2: GitHub Secrets に Long-Lived Token を登録

取得したトークンを GitHub リポジトリの Secrets に登録します。

### 手順

1. **GitHub リポジトリの設定ページにアクセス**

   ```
   https://github.com/[OWNER]/[REPO]/settings/secrets/actions
   ```

   - `[OWNER]`: GitHub のユーザー名または Organization 名
   - `[REPO]`: リポジトリ名

   例: `https://github.com/anthropics/expo-demo/settings/secrets/actions`

2. **新しい Secret を作成**

   - 「**New repository secret**」ボタンをクリック

3. **Secret を設定**

   - **Name**: `CLAUDE_CODE_OAUTH_TOKEN`
   - **Secret**: Step 1 で取得した Long-Lived Token を貼り付け

4. **保存**

   - 「**Add secret**」ボタンをクリック

### 確認

Secrets ページに `CLAUDE_CODE_OAUTH_TOKEN` が表示されていれば成功です。

---

## Step 3: Claude GitHub App のインストール確認

Claude Code が GitHub リポジトリにアクセスするには、Claude GitHub App がインストールされている必要があります。

### 確認方法

1. **Organization/個人アカウントの設定ページにアクセス**

   **Organization の場合**:
   ```
   https://github.com/organizations/[ORGANIZATION]/settings/installations
   ```

   **個人アカウントの場合**:
   ```
   https://github.com/settings/installations
   ```

2. **インストール済みアプリを確認**

   - **「Anthropic Claude for GitHub」** または **「Claude」** という名前のアプリが表示されているか確認
   - アプリ名をクリックして、対象のリポジトリにアクセス権が付与されているか確認

### 確認のポイント

- アプリが表示されていれば、既にインストール済み
- 対象のリポジトリが「**Repository access**」に含まれているか確認
  - 「All repositories」または特定のリポジトリが選択されている

**インストール済みの場合**: セットアップ完了です！

**インストールされていない場合**: Step 4 に進んでください。

---

## Step 4: Claude GitHub App をインストール

Claude GitHub App がインストールされていない場合は、以下の手順でインストールします。

### 手順

1. **インストールページにアクセス**

   ```
   https://github.com/apps/anthropic-claude
   ```

   または

   ```
   https://github.com/apps/claude-for-github
   ```

   **注意**: 正確な App 名は Anthropic の公式ドキュメントで確認してください。

2. **「Install」または「Configure」をクリック**

   - 既にインストールされている場合は「Configure」が表示される
   - 未インストールの場合は「Install」が表示される

3. **インストール先を選択**

   - Organization または個人アカウントを選択

4. **リポジトリアクセスを設定**

   2つの選択肢があります：

   - **All repositories**: すべてのリポジトリにアクセスを許可（推奨）
   - **Only select repositories**: 特定のリポジトリのみを選択

   対象のリポジトリを選択してください。

5. **権限を確認して許可**

   Claude GitHub App が要求する権限を確認し、「**Install**」または「**Save**」をクリック

### 確認

インストール完了後、Step 3 の確認方法で Claude GitHub App が表示されることを確認してください。

---

## GitHub Actions Workflow の設定

Claude Code を GitHub Actions で使用するための Workflow ファイル例です。

### Workflow ファイル例

`.github/workflows/claude-pr-action.yml`:

```yaml
name: Claude PR Action
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]

permissions:
  contents: write
  pull-requests: write
  issues: write

jobs:
  claude-response:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'issues' && contains(github.event.issue.body, '@claude'))
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-action@v1
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
```

### Workflow の動作

- **PR コメント**: `@claude` でメンションすると、Claude が応答
- **Issue コメント**: `@claude` でメンションすると、Claude が応答
- **Issue 作成**: Issue 本文に `@claude` が含まれると、Claude が応答

---

## トラブルシューティング

### Token が取得できない

- Step 1 の詳細手順（[`setup-claude-code-on-the-web.md`](./setup-claude-code-on-the-web.md)）を再度確認
- 認証コードに `#` を含む全体をコピーしているか確認

### GitHub Actions でエラーが出る

**`CLAUDE_CODE_OAUTH_TOKEN` が見つからない**:
- Step 2 で Secret 名が正しく設定されているか確認（大文字小文字を含む）
- Secret が正しいリポジトリに登録されているか確認

**Claude GitHub App の権限エラー**:
- Step 3 で対象のリポジトリにアクセス権が付与されているか確認
- Organization の場合、Organization の設定で GitHub Apps の使用が許可されているか確認

### Claude GitHub App が見つからない

- Anthropic の公式ドキュメントで最新の App 名とインストール URL を確認
- [Claude Code GitHub Actions ドキュメント](https://code.claude.com/docs/en/github-actions) を参照

---

## まとめ

Claude Code on the Web で `/install-github-app` 相当の処理を実行するには、以下の3つのステップが必要です：

1. **Long-Lived Token を取得**（[`setup-claude-code-on-the-web.md`](./setup-claude-code-on-the-web.md) 参照）
2. **GitHub Secrets に登録**（`CLAUDE_CODE_OAUTH_TOKEN`）
3. **Claude GitHub App をインストール**（リポジトリへのアクセス権限を付与）

これらが完了すると、GitHub Actions で Claude Code を使用できるようになります。

---

## 参考リンク

- [Claude Code GitHub Actions ドキュメント](https://code.claude.com/docs/en/github-actions)
- [anthropics/claude-code-action](https://github.com/anthropics/claude-code-action)
- [Long-Lived Token 取得ガイド](./setup-claude-code-on-the-web.md)
