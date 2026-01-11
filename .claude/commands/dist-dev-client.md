# /dist-dev-client

Dev Client APK/IPA を EAS Build で配信します。

**注意**: `npx` コマンドはプロジェクトルート（.git がある場所）から実行してください。

## 実行方法

Claude Code がプラットフォームに応じて自動的に Keystore 生成プロンプトを処理します：

- **macOS**: expect スクリプトを生成して実行
- **Windows/Linux**: Node.js + pty 系ライブラリ（node-pty 等）を使用

### 基本コマンド

```bash
cd APPNAME
npx eas build -p android --profile dev
```

初回実行時、"Generate a new Android Keystore?" の確認が表示されますが、自動的に "yes" で応答されます。

### 推奨実装方法

#### macOS
expect コマンドを使用した自動化が推奨されます：

```bash
#!/usr/bin/expect -f
set timeout -1
spawn npx eas build -p android --profile dev
expect "Generate a new Android Keystore?" {
    send "y\r"
    exp_continue
}
expect eof
wait
```

#### Windows/Linux
Node.js + node-pty ライブラリを使用した自動化が推奨されます：

```javascript
const pty = require('node-pty');
const os = require('os');

const shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';
const ptyProcess = pty.spawn('npx', ['eas', 'build', '-p', 'android', '--profile', 'dev'], {
  name: 'xterm-color',
  cwd: process.cwd(),
  env: process.env
});

ptyProcess.on('data', (data) => {
  process.stdout.write(data);
  if (data.includes('Generate a new Android Keystore?')) {
    ptyProcess.write('y\r');
  }
});

ptyProcess.on('exit', (code) => {
  process.exit(code);
});
```

## 使用するタイミング

ネイティブ変更が必要な場合に使用：
- Intent handlers / deep links
- Permissions
- Native modules
- Package name changes
- App icon or splash screen
- Build configuration (app.json affecting native)

JS のみの変更の場合は `/js-build` を使用（より高速で無料）。
