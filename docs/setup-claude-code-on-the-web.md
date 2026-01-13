# Claude Code Long-Lived Token 取得ガイド

Claude Code Web環境（claude.ai のComputer Use機能）でMax/Proプランの Long-Lived Token（1年有効）を取得する方法。

## 概要

Claude Code CLIの `setup-token` コマンドはインタラクティブなTUIを使用するため、通常のヘッドレス環境では実行できない。本手順では `pexpect` を使用してpty経由でプロセスを制御し、認証URLの取得とコード入力を実現する。

## 前提条件

- Claude Max または Pro プランのアカウント
- Claude Code Web環境（Computer Use有効）
- npm/Node.js（環境に含まれている）

## 手順

コードでエラーが出た場合、仕様に従って修正して実行し直すこと。

### Step 1: pexpectをインストール

```bash
pip install pexpect --break-system-packages
```

### Step 2: 認証スクリプトを起動してURLを取得

以下の2つのコマンドを順番に実行する。

**2-1: スクリプトファイルを作成**

```bash
cat > /tmp/claude_auth_script.py << 'PYEOF'
import pexpect
import sys
import re
import time
import os
import json

print("Starting authentication process...", flush=True)

child = pexpect.spawn(
    'npx -y @anthropic-ai/claude-code setup-token',
    encoding='utf-8',
    timeout=600,
    dimensions=(50, 400)
)

output = ""

# URLが表示されるまで待つ（npxダウンロード時間含め最大3分）
print("Waiting for URL (this may take a while for npx download)...", flush=True)
for i in range(180):
    try:
        chunk = child.read_nonblocking(size=16384, timeout=2)
        output += chunk
        if 'Paste code' in output:
            print("Found paste prompt!", flush=True)
            break
    except pexpect.TIMEOUT:
        if i % 15 == 0:
            print(f"Still waiting... ({i} seconds)", flush=True)
        continue
    except pexpect.EOF:
        print("Process ended unexpectedly (EOF)", flush=True)
        sys.exit(1)

# ANSIエスケープを除去
clean = re.sub(r'\x1b\[[0-9;]*[a-zA-Z]', '', output)
clean = re.sub(r'\x1b\[\?[0-9]+[hl]', '', clean)
clean = clean.replace('\r', '')

# URLを抽出
url_match = re.search(r'https://claude\.ai/oauth[^\s]*state=[a-zA-Z0-9_-]+', clean.replace('\n', ' '))
if not url_match:
    print("ERROR: Could not extract URL from output", flush=True)
    print(f"Output: {clean[-1000:]}", flush=True)
    sys.exit(1)

full_url = url_match.group(0)

# URLをファイルに保存
with open('/tmp/claude_auth_url.txt', 'w') as f:
    f.write(full_url)

print("\n" + "="*60, flush=True)
print("認証URL:", flush=True)
print("="*60, flush=True)
print(full_url, flush=True)
print("="*60, flush=True)
print("\n次のステップ:", flush=True)
print("1. 上記URLをブラウザで開く", flush=True)
print("2. Claudeアカウントでログイン", flush=True)
print("3. 認可を許可", flush=True)
print("4. 認証コードを取得", flush=True)
print("\nコード入力待ち（最大5分）...", flush=True)
print("コードを: echo 'YOUR_CODE' > /tmp/claude_code_input.txt", flush=True)

# ファイルをポーリングしてコードを待つ（最大5分）
for i in range(300):
    if os.path.exists('/tmp/claude_code_input.txt'):
        with open('/tmp/claude_code_input.txt', 'r') as f:
            code = f.read().strip()
        if code:
            print(f"\nCode received: {code[:30]}...", flush=True)
            child.sendline(code)
            time.sleep(5)
            child.close()
            
            # 認証ファイルからトークンを取得
            cred_file = os.path.expanduser("~/.claude/.credentials")
            if os.path.exists(cred_file):
                with open(cred_file, 'r') as f:
                    data = json.loads(f.read())
                if 'claudeAiOauth' in data:
                    token = data['claudeAiOauth'].get('accessToken', '')
                    with open('/tmp/claude_token.txt', 'w') as f:
                        f.write(token)
                    print("\n" + "="*60, flush=True)
                    print("SUCCESS! Token obtained:", flush=True)
                    print("="*60, flush=True)
                    print(token, flush=True)
                    print("="*60, flush=True)
                    sys.exit(0)
            
            print("ERROR: No credentials file found", flush=True)
            sys.exit(1)
    time.sleep(1)

print("TIMEOUT: No code received in 5 minutes", flush=True)
child.close()
sys.exit(1)
PYEOF

echo "スクリプトファイル作成完了: /tmp/claude_auth_script.py"
```

**2-2: スクリプトを実行**

```bash
# クリーンアップ
rm -f /tmp/claude_code_input.txt /tmp/claude_auth_url.txt /tmp/claude_token.txt

# スクリプトを実行（フォアグラウンドで実行してURLを表示）
python3 /tmp/claude_auth_script.py
```

スクリプトが起動すると、認証URLが表示され、コード入力待ち状態になる。
バックグラウンドで実行したい場合は以下のようにする：

```bash
# バックグラウンド実行版
rm -f /tmp/claude_code_input.txt /tmp/claude_auth_url.txt /tmp/claude_token.txt
python3 /tmp/claude_auth_script.py > /tmp/claude_auth.log 2>&1 &
echo "Background PID: $!"

# URLを待つ
for i in $(seq 1 120); do
    if [ -s /tmp/claude_auth_url.txt ]; then
        echo "認証URL:"
        cat /tmp/claude_auth_url.txt
        break
    fi
    sleep 1
    echo -n "."
done
```

### Step 3: ブラウザで認証

1. 上記URLをブラウザで開く
2. Claudeアカウントでログイン（必要な場合）
3. 認可を許可
4. 表示される認証コードをコピー

認証コードの形式：
```
emJRzj8YB9EO0OlY1dqtnRDSEADUZuQL7uiTHVWJ72TSjk6v#KSuowQJE4rBJuo14oqYcZ3CAEjWiN-aXtQ7HO70OwOw
```

### Step 4: 認証コードを入力

**重要**: `YOUR_AUTH_CODE_HERE` を実際に取得したコードに置き換えること。

```bash
echo "YOUR_AUTH_CODE_HERE" > /tmp/claude_code_input.txt
```

例：
```bash
echo "emJRzj8YB9EO0OlY1dqtnRDSEADUZuQL7uiTHVWJ72TSjk6v#KSuowQJE4rBJuo14oqYcZ3CAEjWiN-aXtQ7HO70OwOw" > /tmp/claude_code_input.txt
```

### Step 5: トークンを取得

```bash
# トークンが生成されるまで待つ
for i in $(seq 1 30); do
    if [ -s /tmp/claude_token.txt ]; then
        echo "トークン取得成功:"
        cat /tmp/claude_token.txt
        break
    fi
    sleep 1
done
```

または、認証ファイルから直接取得：

```bash
python3 << 'EOF'
import json
import os
from datetime import datetime

cred_file = os.path.expanduser("~/.claude/.credentials")
with open(cred_file, 'r') as f:
    data = json.loads(f.read())

token = data['claudeAiOauth']['accessToken']
expires = data['claudeAiOauth']['expiresAt']
exp_date = datetime.fromtimestamp(expires)

print(f"Token: {token}")
print(f"Expires: {exp_date.strftime('%Y-%m-%d')} ({(exp_date - datetime.now()).days} days)")
EOF
```

## GitHub Actions での使用方法

### Secretsに登録

1. リポジトリの **Settings → Secrets and variables → Actions**
2. **New repository secret** をクリック
3. 設定：
   - Name: `CLAUDE_CODE_OAUTH_TOKEN`
   - Value: 取得したトークン

### Workflowファイル例

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

## トラブルシューティング

### URLが生成されない

```bash
# ログを確認（フォアグラウンド実行の場合は画面に表示される）
cat /tmp/claude_auth.log

# プロセスを確認
ps aux | grep -E "claude|npx|python" | grep -v grep

# npxが動いているか確認
which npx && npx --version
```

### npxのダウンロードに時間がかかる

初回実行時は `@anthropic-ai/claude-code` のダウンロードに1-2分かかる場合がある。
待機時間が足りない場合は、先に手動でダウンロードしておく：

```bash
npx -y @anthropic-ai/claude-code --version
```

### 認証コードが無効

- URLとコードの `state` パラメータが一致していることを確認
- URLは一度きりの使用。失敗した場合はStep 2からやり直す
- コードは `#` を含む全体をコピーすること

### トークンが保存されない

```bash
# 認証ファイルを確認
cat ~/.claude/.credentials

# ファイルが存在しない場合、コード送信が失敗している可能性
# Step 2からやり直す
```

### バックグラウンド実行で出力が見えない

フォアグラウンドで実行することを推奨：
```bash
python3 /tmp/claude_auth_script.py
```

## 注意事項

- **トークンの有効期限**: 約1年間
- **使用枠**: このトークンはMaxプランの利用枠を消費（APIクレジットではない）
- **セキュリティ**: トークンは秘密情報として扱い、GitHub Secretsなど安全な場所に保存
- **再取得**: トークンが期限切れになった場合は、同じ手順で再取得が必要

## Claudeへの指示（AIアシスタントに実行させる場合）

このガイドの手順をClaude（AIアシスタント）に実行させる場合、以下の点を指示に含めること：

**URLの提示形式**: 認証URLをユーザーに提示する際は、URLのみをコードブロックで囲んで表示すること。

例：
```
https://claude.ai/oauth/authorize?code=true&client_id=...&state=XXXXX
```

これにより、ユーザーがURLをコピーしやすくなる。

## 参考リンク

- [Claude Code GitHub Actions ドキュメント](https://code.claude.com/docs/en/github-actions)
- [anthropics/claude-code-action](https://github.com/anthropics/claude-code-action)
