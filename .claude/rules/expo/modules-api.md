---
paths: modules/**/*, ios/**/*, android/**/*
---

# Expo Modules API

ネイティブコード（Swift/Kotlin）で拡張機能を追加するガイド。

## 概要

- Swift や Kotlin でネイティブモジュールやカスタムビューを作成
- React Native の Turbo Modules と同等のパフォーマンス
- JSI（JavaScript Interface）ベースで高速

## 用途例

- 既存の React Native モジュールがない機能
- 特定のデバイスセンサーや分析 SDK のラップ
- プラットフォーム固有の API アクセス

## 選択基準

| 条件 | 推奨 |
|------|------|
| C++ が必要 | Turbo Modules |
| 簡便に済む | Expo Modules API |
| 既存モジュールあり | そちらを使用 |

## 互換性

- 新アーキテクチャ対応
- 従来互換性あり
- アプリサイズへの影響は微小（数百KB程度）

## 基本構造

```typescript
// modules/my-module/index.ts
import { NativeModulesProxy } from 'expo-modules-core';

export default NativeModulesProxy.MyModule;
```

```swift
// modules/my-module/ios/MyModule.swift
import ExpoModulesCore

public class MyModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MyModule")

    Function("hello") { (name: String) -> String in
      return "Hello, \(name)!"
    }
  }
}
```

## コード生成時の注意

- 既存の Expo SDK で目的の機能が提供されていない場合に限り使用
- 開発難易度やメンテナンス負荷が高くなる点に触れる
- よほど必要な場合のみ選択

## 参照

- [Expo Modules API: Overview - Expo Documentation](https://docs.expo.dev/modules/overview/)
