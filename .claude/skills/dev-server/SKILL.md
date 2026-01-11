---
name: dev-server
description: Start or stop the Expo development server. Use when the user mentions "dev server", "start server", "expo start", "stop server", "stop dev-server", or wants to start/stop the development environment.
user-invocable: true
---

# /dev-server - Expo Development Server Control

Start or stop the Expo development server for local development.

## Execution Requirements

**IMPORTANT**: Execute commands from the **app root directory** (APPNAME directory, not the .git root).

## Usage

- **Start server**: `/dev-server` or `/dev-server start`
- **Stop server**: `/dev-server stop`

## Instructions for Claude

When this skill is invoked:

### 1. Determine Action

Check if the user wants to start or stop the server:
- If args contain "stop" OR user message contains "止め" or "stop": **STOP** the server
- Otherwise: **START** the server

### 2. Starting the Server

```bash
cd APPNAME  # Move to app directory from project root
npx expo start
```

**Important**:
- Run the command in **background mode** (`run_in_background: true`)
- Save the task ID for future reference
- Inform the user that the server is running in the background
- Provide instructions for scanning the QR code with Expo Go app

**Output to user**:
```
Expo 開発サーバーを起動しました（バックグラウンド実行中）

次のステップ：
1. 端末で Expo Go アプリを起動
2. QR コードをスキャン（ターミナルで新しいウィンドウを開いて確認できます）

停止するには `/dev-server stop` を実行してください
```

### 3. Stopping the Server

To stop the server:

1. **Find running expo start tasks**:
   ```bash
   ps aux | grep "[e]xpo start" | awk '{print $2}'
   ```

2. **Kill the processes**:
   ```bash
   pkill -f "expo start"
   ```

**Alternative method** if you have the task ID:
- Use `KillShell` tool with the background task ID

**Output to user**:
```
Expo 開発サーバーを停止しました
```

### 4. Error Handling

- **Already running**: If server is already running, inform user and ask if they want to restart
- **Not found when stopping**: Inform user that no server is currently running
- **Port in use**: Suggest killing the existing process or using a different port

## Common Scenarios

### Scenario 1: User says "start the dev server"
- Navigate to app directory
- Run `npx expo start` in background
- Display next steps

### Scenario 2: User says "dev-serverを止めて" or "/dev-server stop"
- Find and kill expo start processes
- Confirm server stopped

### Scenario 3: Server already running
- Inform user
- Ask if they want to restart or continue with existing server

## Success Indicators

**Starting**:
- Command executed in background
- Task ID returned
- No error messages

**Stopping**:
- Process killed successfully
- Confirmation message shown

## Common Issues

- **Not in app directory**: Remind user that command must be run from APPNAME directory
- **Port already in use**: Another process may be using port 8081
- **Metro bundler cache issues**: Suggest `npx expo start -c` to clear cache
