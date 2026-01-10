---
paths: app/**/*.tsx, app/**/*.ts
---

# Expo Router

ファイルベースルーティングの導入と活用ガイド。

## ファイルベースルーティング

`app/` ディレクトリ内のファイル構造がそのままルートにマッピング:

```
app/
├── index.tsx        → /
├── about.tsx        → /about
├── settings/
│   ├── index.tsx    → /settings
│   └── profile.tsx  → /settings/profile
└── [id].tsx         → /123 (動的ルート)
```

## 特徴

- React Navigation 上に構築
- ネイティブでプラットフォーム最適化
- 全画面が自動的にユニバーサルリンク化
- オフライン対応
- 遅延バンドル
- 高速リフレッシュ

## 新規プロジェクト

`npx create-expo-app` 実行時点で Expo Router が組み込み済み。

## React Navigation との違い

| 項目 | Expo Router | React Navigation |
|------|-------------|------------------|
| ルート定義 | ファイルベース | コードで定義 |
| Deep Link | 自動 | 手動設定 |
| Web 対応 | 組み込み | 追加設定必要 |

## 注意

- Wix の React Native Navigation は Expo 環境では非対応

## コード生成時の注意

- 画面コンポーネントは `app/` 配下に配置
- URL へのマッピングが自動で行われることを強調
- React Navigation 使用時はスタック/タブの手動定義が必要と補足

## 参照

- [Introduction to Expo Router - Expo Documentation](https://docs.expo.dev/router/introduction/)
