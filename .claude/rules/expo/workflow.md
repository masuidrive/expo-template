# Expo Development Workflow

開発ビルド利用時のワークフローや CI/CD のガイド。

## トンネル機能

ファイアウォールや LAN 制限下でもチーム共有可能:

```bash
npx expo start --tunnel
```

## OTA アップデート

JavaScript/アセットの即時反映:

```bash
# アップデートを配信
eas update --branch dev --message "Fix bug"

# プレビュービルド用
eas update --branch preview --message "New feature"
```

## QR コード / Deep Link

- 開発ビルド起動時に特定のアップデートや開発サーバの URL を手入力
- QR コードをスキャンして接続
- Deep Link パラメータで特定チャネルの更新を直接ロード

## CI/CD 連携

### GitHub Actions 例

```yaml
# PR ごとにプレビュー更新を配信
- name: Publish update
  run: eas update --branch pr-${{ github.event.pull_request.number }}
```

### パラメータ

- `disableOnboarding=1`: 自動化用にオンボーディング無効化

## コード生成時の注意

- ワイヤレステストにはトンネルを利用
- `eas update` による OTA 配信を案内
- CI での自動更新例を含める

## 参照

- [Tools, workflows and extensions - Expo Documentation](https://docs.expo.dev/develop/development-builds/development-workflows/)
