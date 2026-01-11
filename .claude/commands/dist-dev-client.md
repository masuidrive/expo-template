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

**重要**: 生成した一時スクリプトは実行終了後に必ず削除してください。

#### macOS
expect コマンドを使用した自動化が推奨されます：

**実装手順**:
1. 一時ファイル名を生成（例: `eas-build-auto-${timestamp}.exp`）
2. expect スクリプトを書き込む
3. 実行権限を付与して実行
4. **実行終了後、一時ファイルを削除**

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

**実行例**:
```bash
# 一時スクリプトを生成して実行
SCRIPT_NAME="eas-build-auto-$$.exp"
cat > "$SCRIPT_NAME" << 'EOF'
#!/usr/bin/expect -f
set timeout -1
spawn npx eas build -p android --profile dev
expect "Generate a new Android Keystore?" {
    send "y\r"
    exp_continue
}
expect eof
wait
EOF

chmod +x "$SCRIPT_NAME"
"./$SCRIPT_NAME"
EXIT_CODE=$?

# 終了後に一時ファイルを削除
rm -f "$SCRIPT_NAME"

exit $EXIT_CODE
```

#### Windows/Linux
Node.js + node-pty ライブラリを使用した自動化が推奨されます：

**実装手順**:
1. 一時ファイル名を生成（例: `eas-build-auto-${timestamp}.js`）
2. Node.js スクリプトを書き込む（削除処理を含む）
3. 実行
4. **実行終了後、一時ファイルを自動削除**

```javascript
const pty = require('node-pty');
const os = require('os');
const fs = require('fs');

const scriptPath = __filename; // 自身のパス

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
  // 終了時に一時ファイルを削除
  try {
    fs.unlinkSync(scriptPath);
  } catch (err) {
    // 削除失敗は無視
  }
  process.exit(code);
});

// プロセス終了時のクリーンアップ
process.on('SIGINT', () => {
  try {
    fs.unlinkSync(scriptPath);
  } catch (err) {
    // 削除失敗は無視
  }
  process.exit(130);
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
