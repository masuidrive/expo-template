# Developer's Guide

コーディングエージェント（Claude Code など）を使った開発ガイド

## 環境構築

最初に環境構築を行ってください:

```
@setup-expo.md に従って環境構築して
```

## 開発フロー

### 1. JS/UI 変更の配信: `/ota`

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

### 2. Dev Client のセットアップ: `/setup-dev-client`

Expo Go から Dev Client に移行する際、または新規に Dev Client 環境をセットアップします。

**Dev Client とは:**
- カスタムネイティブモジュールを使えるランタイム環境
- ネイティブビルドが1回だけ必要
- その後は `/ota` で JS を更新可能

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

### 3. ネイティブビルドの配信: `/dist-dev-client`

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

### パターン1: Expo Go（学習・プロトタイプ）
```
1. 環境構築
2. /ota で配信
3. Expo Go アプリの Extensions タブから確認
```

### パターン2: Dev Client（本格開発）
```
1. 環境構築
2. /setup-dev-client
3. /dist-dev-client（初回のみ）
4. /ota で JS 更新
5. ネイティブ変更時のみ /dist-dev-client
```

---

## よくある質問

**Q: /ota と /dist-dev-client の使い分けは?**
A: JS/UI 変更は `/ota`、ネイティブ変更は `/dist-dev-client`

**Q: Dev Client は必須?**
A: いいえ。標準 API のみ使う場合は Expo Go で十分です。

**Q: ビルド待ち時間が長い**
A: 無料プランではキュー時間が長くなります。バックグラウンド実行を活用してください。

---

詳細は [README.md](./README.md) と [CLAUDE.md](./CLAUDE.md) を参照してください。
