# GitHub Actions Setup for Expo EAS

---
以下、「cc4w が claude/* or features/* ブランチを作ってPR」→「main に merge されたら GitHub Actions が EAS で Android build」まで、ゼロからの設定手順をエンジニア向けにまとめる。
（トークン取得手順は Expo 公式ドキュメント準拠）

---

## ゴール

- PR は claude/* と features/* から作る
- PR 作成・更新時は lint/typecheck/test（速い）
- main への merge 時だけ eas build -p android を実行（重い・回数制限あり）
- Expo の認証は GitHub Secrets の EXPO_TOKEN で行う（cc4w/ローカルに置かない）

---

## 0. 前提（最小）

- リポジトリは npm 前提で例を書く（pnpm/yarnなら読み替え）
- すでに Expo/EAS の初期化（eas init）が済んでいて eas.json がある前提
  ※まだなら先にローカルで npx eas init をやるのが早い

---

## 1. ブランチ運用（cc4w 側）

cc4w が勝手に命名するのを避けたいなら、作業指示でブランチ名を固定するのが確実。

例（cc4wへの指示文）:
- 「features/intent-hello ブランチを作って変更してPR作って」
- 「claude/lint-fix ブランチで…」

GitHub 側は「特定プレフィックス以外の push を禁止」までは必須じゃない（必要なら branch protection で縛る）。

---

## 2. package.json に verify を用意（PRで回す）

cc4w/Actions 共通のゲートを固定する。

```json
{
  "scripts": {
    "lint": "eslint .",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "jest",
    "verify": "npm run typecheck && npm run lint && npm test"
  }
}
```

---

## 3. Expo トークン（EXPO_TOKEN）の取り方

GitHub Actions から EAS を叩くには Expo のアクセストークンを作る。

1. **Expo のアクセストークン画面へ**
   - expo.dev/settings/access-tokens から Create token

2. **生成された token をコピー**

3. **GitHub リポジトリ → Settings → Secrets and variables → Actions → New repository secret**
   - Name: `EXPO_TOKEN`
   - Value: さっきの token

これで Actions 内で EXPO_TOKEN 環境変数を渡せば eas login なしで EAS CLI が認証される。

---

## 4. GitHub Actions を "何もない状態" から追加

### 4-1) PR / 通常 push は verify（軽い）

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
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run verify
```

狙い:
- claude/* と features/* の push で常にゲートが走る
- PR でも main 向けに verify される

### 4-2) main へ merge されたら Android build（重い）

「PR が main に merge された」＝pull_request: closed で merged == true を見る。

`.github/workflows/eas-build-android-on-merge.yml`

```yaml
name: EAS Build Android (on merge to main)

on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  build_android:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      # merge 後の main をビルドしたいので main をcheckout
      - uses: actions/checkout@v4
        with:
          ref: main

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run verify

      - name: EAS Build (Android)
        run: npx eas-cli@latest build -p android --profile dev --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

ポイント:
- eas-cli は プロジェクト依存に入れないのが推奨（Actionで npx eas-cli@latest が無難）。
- --profile dev はあなたの eas.json に合わせて変える（例: preview）

---

## 5. "それ以外の commit では lint とかする？" → Yes

おすすめ構成は今書いた通りで：
- **PR/ブランチ更新（頻繁）**: verify（速い、失敗を早く見つける）
- **merge（たまに）**: verify + eas build（重いのでここに集約）

これで「壊れたコードを merge → 無駄ビルド」も防げる。

---

## 6. Free枠を守る運用（重要）

merge ごと build は、開発が活発だと Androidビルド回数を消費しやすい。
運用としては：

- **JS だけ変更**: main merge → 本当は eas update の方が安い
- **ネイティブ変更（intentFilters/permissions/native modules）**: main merge → eas build

もしこの方針にするなら、「merge時build」をやめて
- merge時は eas update
- native ラベルが付いた PR merge 時だけ eas build に切り替えるのが一番コストが安定する（必要ならそのYAMLも出す）。

---

## 7. cc4w を "syntax check要員" に固定する

リポジトリ直下 CLAUDE.md にこれを書いておくと、cc4wがEAS叩いたりしにくくなる。

```markdown
## cc4w policy
- Do: implement changes, run `npm ci` and `npm run verify`, open PR from claude/* or features/*
- Don't: run `eas build`, `eas update`, or `expo start`
- Don't: store secrets
```

---

必要なら、あなたの eas.json（profile名）と package manager（npm/pnpm/yarn）に合わせて、上の2つのworkflowをそのままコミットできる形に調整して出す。
