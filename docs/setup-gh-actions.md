# GitHub Actions Setup for Expo EAS

Pull Request を main にマージしたら GitHub Actions が EAS で自動デプロイする設定手順。

**スキルコマンドの使い方**: [DEVELOPERS_GUIDE.md](../DEVELOPERS_GUIDE.md) を参照してください。

---

## ゴール

- Pull Request 作成・更新時は verify（lint/typecheck/test）を実行
- main へマージ時、PR body のタグに応じて自動デプロイ:
  - `[ota]`: EAS Update で JS バンドル配信（高速・無料）
  - `[dist-dev-client]`: EAS Build で APK/IPA ビルド（重い・回数制限あり）

---

## 設定手順

### 1. EXPO_TOKEN の発行と登録

#### 1-1) トークン作成

1. https://expo.dev/accounts/[your-account]/settings/access-tokens にアクセス
2. "Create Token" でトークン発行（スコープは write 推奨）
3. トークン文字列（`ey...`）をコピー

#### 1-2) GitHub リポジトリに登録

1. GitHub リポジトリの **Settings > Secrets and variables > Actions > Secrets**
2. **New repository secret**
   - Name: `EXPO_TOKEN`
   - Value: コピーしたトークン

### 2. Claude Code で GitHub App をインストール

```
/install-github-app
```

これで GitHub Actions ワークフローが PR に反応するようになります。

---

## Pull Request のタグ運用

PR の説明（body）に以下のタグを含めてください:

- **[ota]**: JS/UI の変更のみ（EAS Update で配信）
- **[dist-dev-client]**: ネイティブ変更（EAS Build で再ビルド）

**どちらを使うべきか**: [DEVELOPERS_GUIDE.md](../DEVELOPERS_GUIDE.md) の「ネイティブ変更が必要なケース」を参照してください。

**例**:
```markdown
Fix login button styling

[ota]
```

```markdown
Add camera permission for photo upload

[dist-dev-client]
```

---

## ワークフロー設定

プロジェクトには既に以下のワークフローが含まれています:

- `.github/workflows/verify.yml` - Pull Request での verify 実行
- `.github/workflows/eas-update-on-merge.yml` - `[ota]` タグで EAS Update
- `.github/workflows/eas-build-android-on-merge.yml` - `[dist-dev-client]` タグで EAS Build

**カスタマイズが必要な箇所**:
- `working-directory`: アプリディレクトリ名（例: `my-app`）
- `cache-dependency-path`: package-lock.json のパス（例: `my-app/package-lock.json`）

詳細は各ワークフローファイルを参照してください。

---

これで、タグベースの自動デプロイが完成です。無駄なビルドを避けつつ、効率的な CI/CD パイプラインが構築できます。
