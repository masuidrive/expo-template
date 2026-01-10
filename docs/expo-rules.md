# Claude Code .claude/rules/ ファイル仕様

## 目的

プロジェクト固有の指示をトピック別に分割し、複数の Markdown ファイルとして管理することで、大規模な CLAUDE.md を分割して読みやすくする[1]。`.claude/rules/` 配下のすべての Markdown ファイルはセッション開始時に自動で読み込まれ、プロジェクトルールとして適用される[1][2]。

## 主な項目

- 各ルールファイルは約500行未満に抑え、内容を簡潔にまとめる
- ルールはコードスタイル、テスト規約、セキュリティ要件などトピック別に作成し、必要に応じて階層的にサブディレクトリを利用して整理する[3]
- YAML フロントマターで条件（paths や if）を指定すれば、特定のファイルパスに対してのみそのルールを適用できる[2][4]

## ナビゲーション方針

- `.claude/rules/` はプロジェクトルート（または実行ディレクトリ）の `.claude/` ディレクトリ内に作成し、同階層の CLAUDE.md と併用できる[5]
- ルールファイルは機能別・フォルダー別に分け、不要になったルールは随時削除して最新状態を保つ[3]
- ユーザーレベルの共通ルールは `~/.claude/rules/` に置ける（プロジェクトルールより優先度が低い）[6]

## 回答・生成時の注意

- ルールファイル内の指示は簡潔かつ明瞭に書き、モデルが理解しやすいよう「重要」「必須」といった強調を適宜含める
- 命令の重複や矛盾を避け、古くなった情報は逐次更新または削除する[3]
- 条件付きルールは限定的に使用し、本当に特定ファイルにのみ適用する場合に留める[3]

---

# get-started

## 目的

Expo フレームワークによるクロスプラットフォームアプリ開発の導入方法を示す。基本的なセットアップ手順として、新規プロジェクトの作成から開発環境の準備、アプリ起動までの流れを理解する。Expo は「ファイルベースのルーティング」と「豊富なネイティブモジュール」を提供するオープンソースフレームワークであり[7]、初心者向けに設計されている。

## 主な項目

- **必要要件**: Node.js (LTS 推奨) のインストール。macOS、Windows (PowerShell/WSL2)、Linux がサポート対象[8]
- **プロジェクト作成**: `npx create-expo-app@latest` コマンドで既定のテンプレートプロジェクトを生成[9]。このテンプレートにはサンプルコードが含まれ、すぐに起動と動作確認が可能[9]
- **テンプレート選択**: 必要に応じて `--template` オプションで別テンプレートを指定できる[10]

## ナビゲーション

公式ドキュメントの「Introduction」→「Create a project」→「Set up your environment」→「Start developing」→「Next steps」の順で進める[11][9]。各ページは連続したクイックスタートを意図しており、段階的に環境構築から初期開発まで学べるようになっている。

## 回答・生成時の注意

コード生成時は必ず Node.js のバージョン要件を満たしていることを確認し、create-expo-app を使った初期化手順を推奨する。Expo Go の限界を超えた開発が必要になった場合は後述の Development Builds を案内する。

---

# develop

## 目的

開発作業を支援するツールや手法、ナビゲーション戦略をまとめる。Expo プロジェクトで使用する主要ツール（CLI、ビルドツール、デバッグツールなど）と、アプリ内の画面間遷移方法を理解する。

## 主な項目

- **Expo CLI**: プロジェクト作成時に自動で含まれる開発用 CLI。`npx expo start` で開発サーバを起動し、`expo build/run` 系のコマンドでビルド・実行が可能[12]。一般的なコマンド例（開始、lint、プリビルドなど）も記載されている[12]
- **EAS CLI**: Expo アカウントにログインし、EAS Build/Submit などのクラウドサービスを利用するための CLI。`npm install -g eas-cli` でインストールし、ビルドやアップデートの管理ができる[13][14]
- **Expo Doctor**: `npx expo-doctor` で実行し、依存関係や設定ファイルの不整合を診断・修正するツール[15]
- **Orbit, VS Code 等**: EAS 製品Orbit（ビルドインストール用アプリ）や、VS Code 用 Expo拡張など、開発体験を向上させるツール類が存在する[16][17]
- **ナビゲーションライブラリ**: React Native には組み込みナビゲーションがないため、通常はコミュニティ製のライブラリを選ぶ。主に React Navigation か Expo Router が推奨される[18][19]

## ナビゲーション

Expo Router は「ファイルベースルーティング」を提供し、`app/` ディレクトリ下のファイルが自動的にルートとして認識される[19]。React Navigation や他ライブラリも使用可能だが、新規プロジェクトでは Expo Router の利用が公式に推奨されている[19]。公式 CLI で生成されたプロジェクトにはデフォルトで Expo Router が組み込まれており、深いネイティブ連携や型安全なルーティングが特徴である。

## 回答・生成時の注意

生成するコードでは、Expo CLI の各コマンド（`expo start`, `expo run:ios` など）を正しく案内する。Expo Router を使う場合はファイル配置によるルーティングを説明し、もし他ライブラリを使うなら簡単に比較を加える。Expo Go を開発に使うかデバッグ用ビルドを使うか、状況に応じた選択を促す。

---

# user-interface

## 目的

アプリのユーザーインターフェースに関する基本要素（スプラッシュ画面、アプリアイコン、レイアウト、フォントなど）の設定方法を示す。ブランドやUXにおける重要な要素であり、適切に設定することでストア審査やユーザ体験を向上させる。

## 主な項目

- **スプラッシュ画面とアイコン**: アプリ起動時に表示される画面とアプリアイコンの設定手順を解説。例えば Figma のテンプレートを使った画像作成、app.json での expo-splash-screen プラグイン設定などが示される[20][21]
- **注意点**: 開発時に Expo Go や通常のデバッグビルドではスプラッシュ画面が正しくテストできない場合があるため、プレビュー用ビルドや本番ビルドでの確認が推奨される[21]。画像フォーマットは PNG を推奨し、背景色や透過の設定例が示される[22][23]
- **Safe Areas/System Bars/Fonts 等**: 画面の余白、ステータスバーの扱い、フォントの組み込み、カラーテーマ、アニメーション、永続ストレージなど、ユーザーインターフェースの各要素設定に関するページが連続して用意されている（ナビゲーションメニュー参照）[24]

## ナビゲーション

「Splash screen and app icon」→「Safe areas」→「System bars」→「Fonts」→「Assets」→「Color themes」→「Animation」→「Store data」→「Next steps」という順序で扱う[25]。各ページでは具体的な構成ファイル編集例が示されるため、実装時に該当ページを参照する。

## 回答・生成時の注意

スプラッシュ画面やアイコンの設定では、必ず expo-splash-screen プラグインの使用例を示し、Expo Go での動作制限にも触れる[21]。画像ファイルの前提条件（サイズ・形式・透明度など）についても触れ、間違った形式でビルドが失敗する旨を警告する[23]。

---

# development-builds

## 目的

Expo Go のサンドボックスを超えて、ネイティブモジュールや設定を自由に使うための開発ビルド（Dev Client）の概念と手順を説明する。自前のデバッグ用バイナリ（開発ビルド）を作成し、高度なネイティブ機能やテストを行うための指針を示す。

## 主な項目

- **開発ビルドとは**: Expo 独自のデバッグビルドであり、expo-dev-client ライブラリを含むことで追加機能（ネットワークインスペクタ、デプロイ管理UI など）を備える[26]。これにより、Expo Go では使えないネイティブライブラリやカスタム設定をアプリに組み込める[26]
- **Expo Go との違い**: 通常の `npx expo start` はデフォルトで Expo Go アプリと連携するが、Expo Go に含まれないネイティブ機能を使うには独自の開発ビルドを作成する必要がある[27]。開発ビルドは「独自のExpo Goアプリ」と考えることができ、任意のネイティブモジュールを含めたり設定変更後に再ビルドが可能となる[27]
- **手順概要**: Expo CLI や EAS CLI を使って開発ビルドを生成する。通常、プロジェクト作成時点では Expo Go を使っているが、ネイティブモジュール追加や詳細なテストが必要になった段階で、`eas build --profile development` などでビルドを行う（詳細は EAS Build のドキュメント参照）

## ナビゲーション

「Introduction to development builds」→「Expo Go to development build」→「Create a build on EAS」→「Use a build」→「Share with your team」→「Tools, workflows and extensions」→「Next steps」の順で読み進める[28]。各ページで開発ビルドの使い方や共有方法、CI でのワークフローなど詳細を確認する。

## 回答・生成時の注意

コードや説明では「Expo Go はプロトタイプ用途、開発ビルドは本番アプリへの移行前提」という点を強調する[27]。また、開発ビルド作成には開発機環境にネイティブビルドツール（Xcode/Android SDK）が必要であること、EAS Build を使う場合はクラウドサービス利用の注意点を補足する。

---

# config-plugins

## 目的

Expo のアプリ設定（app config）の拡張手段として、ネイティブプロジェクトの構成を自動化する「Config Plugins」の仕組みを説明する。アプリ設定で直接扱えないネイティブ項目を安全かつ再現可能に設定する方法を示す。

## 主な項目

- **Config Plugin とは**: Expo プロジェクトのプリビルドプロセス中にネイティブプロジェクト（android/ios ディレクトリ）を書き換えるカスタム設定ポイントである[29]。app.json の plugins 配下で定義し、JavaScript の関数でネイティブ設定を変更する
- **用途例**: アイコン生成やアプリ名設定、AndroidManifest.xml や Info.plist の修正など、アプリ設定だけではカバーできないネイティブ要素を指定できる[30]。CNG（継続的ネイティブ生成）プロジェクトでは手作業でネイティブファイルを編集せず、config plugin で変更を反映するのが推奨される[30]
- **特徴と構造**: Config plugin は通常 `with<PluginName>` という関数で定義し、複数のプラットフォーム向け関数で構成される[29][30]。プリビルド時にシリアライズ可能な戻り値として設定を返し、必要に応じて expo/config-plugins ライブラリのモッド関数を使って安全にファイル操作を行う

## ナビゲーション

「Introduction to config plugins」→「Create a config plugin」→「Mods」→「Best practices for development and debugging」の順で関連ガイドへ進む[31]。各ガイドで具体的なプラグイン作成例やデバッグ方法、mods の使い方を学ぶ。

## 回答・生成時の注意

Config plugin のコード例を示す際は、シンプルな JSON 変更ではなく JavaScript 関数でプラットフォームごとの設定を行う点を強調する[29][30]。プリビルドなしの場合は無効になるため、必ず `npx expo prebuild` を併用することを説明する。

---

# debugging

## 目的

開発中のデバッグとテストに関する指針をまとめる。エラー診断手法やテスト環境の整備方法を示し、バグ発見から修正までの流れをサポートする。

## 主な項目

- **Expo Doctor**: 前述の通り、依存関係や設定ミスを自動検出するコマンドラインツール（`npx expo-doctor`）の利用を推奨[15]。依存パッケージの互換性やアプリ設定の整合性チェックに有効である
- **デバッグツール**: React Native におけるブラウザデバッグ（リモートデバッガー、Reactotron など）や、コンソールログ出力の活用方法。アプリ内ログに関しては Sentry 等のエラーモニタリングサービスを後述の Monitoring で併用すると補強できる
- **テスト**: Expo には組み込みテスト環境はないが、Jest や React Native Testing Library を導入してユニットテストやスナップショットテストを行うのが一般的。develop セクションの設定を再利用しつつ、テスト用のツールと設定をプロジェクトに加える

## ナビゲーション

Expo ドキュメントには「Debugging」カテゴリの専用ページはないが、「Tools for development」や「Monitoring services」等のページに情報が分散している。エラー時は expo doctor や EAS Dashboad（ビルドログ）をまず確認し、該当する問題解決ドキュメントを参照する。

## 回答・生成時の注意

コード生成時に依存解決エラーやビルド失敗が出た場合は、Expo Doctor 実行やキャッシュクリア (`expo start --clear`) の提案などを含める。ユニットテストや静的解析ツールの導入例も補足で挙げるとよい。

---

# review-deploy-monitor

## 目的

ビルド後のレビュー配布、ストア申請、公開後の監視に関する手順をまとめる。テストやレビュー段階からユーザフィードバックの取得、アプリの公開とその後の安定運用まで一連の流れを扱う。

## 主な項目

- **配布・レビュー**: QA 用にアプリを共有する方法として、アプリストアのテストトラックや内部配布、開発ビルド＋EAS Update などを解説する[32][33]。Expo Go はプロダクション用途には使わず、リリースビルドや内部配布を用いることが推奨されている[34][33]
- **本番ビルド（Deploy）**: EAS Build またはローカルで本番用ビルド（リリースビルド）を作成し、Google Play/App Store に申請する方法を説明[35][36]。eas.json での設定例や、コマンド `eas build --platform <platform>` を使用する手順が示されている[37][38]。ストアへのアップロードにはそれぞれデベロッパーアカウントや証明書が必要である点も言及する
- **監視（Monitor）**: 公開後のアプリ利用状況やエラーを追跡する方法。Expo Insights（expo-insights ライブラリ）を使ってどのバージョンがどの程度使われているか分析できる[39]。さらに Sentry や LogRocket、Vexo、Bugsnag などの外部サービスを組み込み、クラッシュレポートやユーザ行動分析で問題検出・解決に活用する[40][41]

## ナビゲーション

「Distributing apps for review」→「Share previews with your team」→「EAS Submit/Metadata/Updates」→「Deploy web apps」→「Monitoring services」の順で読む[32][42]。各ステップで適切なEAS機能やドキュメントに誘導し、レビューから配布、申請、運用までを一気通貫でカバーする。

## 回答・生成時の注意

レビュー配布の説明では、Expo Go をテスト目的で使わないよう明示し[34]、代わりに内部配布やEAS UpdateのURL共有を活用する方法を説明する。ビルドの案内では、アプリ署名用鍵の管理やEAS Buildのダッシュボードリンク活用など、具体的な手順にも触れる。監視では、使用データ収集がオプトイン型であることや、ユーザプライバシーに留意すべき点（例: GDPR対応）を注意点として示す。

---

# core-concepts

## 目的

Expo の基本理念と提供する主要機能、サービスの全体像を俯瞰する。Expo が React Native アプリに対して提供する機能と、EAS (Expo Application Services) を含むエコシステムを理解する。

## 主な項目

- **Expo 本体**: Expo は Android、iOS、Web 上で動作するオープンソースフレームワークであり、ファイルベースのルーティングやクロスプラットフォーム UI コンポーネント、豊富なネイティブモジュールを提供する[43]。expo npm パッケージを既存の React Native プロジェクトにインストールするだけで、多数の機能（ビルド・プリビルド・CLI・Expo Go など）が利用可能になる
- **ツールと機能**: Expo SDK（公式提供のモジュール群）、Expo CLI、Expo Go、React Native の統合、TypeScript サポート、PC からのビルド支援（prebuild・開発サーバ）などが挙げられる[43][44]。特徴として「すべての機能は無料・オプションで、未使用の機能はアプリに影響を与えない」点が強調されている[44]
- **EAS (Expo Application Services)**: Expo チーム提供のクラウドサービス群で、アプリのビルドや提出、アップデート配信などをサポートする[45]。EAS は Expo プロジェクトに限らず任意の React Native アプリで利用でき、ビルドインフラや OTA アップデート等の機能を提供する

## ナビゲーション

「Tools and features」→「Services」のセクションで、上記の各要素（Expo SDK、Modules API、prebuild、CLI、Go、EAS）へのリンクがまとめられている[46][47]。これらを参考に、興味のある機能やサービスの詳細ページへ進むのがよい。

## 回答・生成時の注意

アプリ生成時には必ず「Expo は完全にオープンソースで追加コストなし」という点を挿入し[43][44]、ユーザが「使わない機能が重くなるのでは」と誤解しないよう明示する。EAS に関しては、クラウド依存やアカウント登録の必要性（Apple・Googleの開発者登録など）にも触れる。

---

# workflow

## 目的

開発ビルド利用時のワークフローや便利な拡張機能についてまとめる。開発プロセスを円滑にするために利用可能な各種ツールや機能、CI/CD ワークフローの例などを提供する。

## 主な項目

- **トンネル機能**: `npx expo start --tunnel` により開発サーバをインターネット経由でアクセス可能にする。ファイアウォールや LAN 制限下でもチーム共有できるURLが生成される[48]
- **公開アップデート**: `eas update` コマンドで現在の JavaScript/アセット状態をバンドルし、Expoのホスティング上に「アップデート」として保存できる。開発ビルドはこれを読み込むことでソース変更を即時反映できる[49]
- **手動・QR/Deep Link**: 開発ビルド起動時に特定のアップデートや開発サーバのURLを手入力する機能、あるいはQRコードを生成してスキャンする機能が用意されている[50][51]。DeepLinkパラメータを使えば特定チャネルの更新を直接ロードすることもできる

## ナビゲーション

「Tools, workflows and extensions」ページに詳細がまとめられており、各セクションでトンネル、アップデート、深いリンク、QRコード等の使い方が紹介されている[48][49]。また、GitHub Actions と連携した自動化例（PRごとの更新配信など）も言及されている。

## 回答・生成時の注意

コード生成例では、必要に応じて `expo start --tunnel` の利用や `eas update` によるOTA配信を案内する。例えば「アプリをワイヤレスでテストするにはトンネルを利用する」「CIでの自動更新には disableOnboarding=1 パラメータ付きURL などの活用例」を含めると実践的である[48][49]。

---

# more-router-modules

## 目的

Expo Router の導入と利点を説明し、ルーティング機能を最大限に活用する方法を示す。ファイルベースルーティングの概念、ルート定義の自動化、深いリンク対応など、複雑なナビゲーションを簡潔に実装できる特徴に焦点を当てる。

## 主な項目

- **ファイルベースルーティング**: Expo Router はアプリの `app/` ディレクトリ内のファイル構造をそのままルートにマッピングする。ファイルを追加するだけで自動的にルーティングが生成される[52]。これにより、React Native アプリ全体で同一コードベースのルーティングが可能となる
- **機能と推奨**: 新規プロジェクトには `npx create-expo-app` 実行時点で Expo Router が組み込まれており、React Navigation 上に構築されたネイティブでプラットフォーム最適化されたルーターとして機能する[53][54]。全画面が自動的にユニバーサルリンク化され、オフライン対応・遅延バンドル・高速リフレッシュなど多くの機能を備える
- **既存ライブラリ**: もちろん React Navigation 等他のライブラリも使えるが、新規作成時は Expo Router 推奨。別ライブラリでは深いリンクやWeb対応などを自力で実装する必要がある旨を案内する[54]。なお、Wix の React Native Navigation は Expo 環境では非対応である点に注意する

## ナビゲーション

Expo Router の詳細ガイド（Router 101, ナビゲーションパターン, Advanced, Web など）へ誘導する。まずこの「Introduction」ページで基礎を学んだ後、必要に応じて各トピックページや参照リンクを参照する[52][53]。

## 回答・生成時の注意

ルート定義コードでは、画面コンポーネントファイルを `app/` 配下に配置する例を示し、URLへのマッピングが自動で行われることを強調する[52]。React Navigation を使う場合は独自にスタックやタブを定義する必要がある点との違いも補足する。

---

# modules-api

## 目的

Expo モジュール API の概要を示し、ネイティブコード（Swift/Kotlin）で拡張機能を追加する手段を解説する。通常の JavaScript/Expo モジュールでは実現しづらい高度な機能を実装する際に使われる。

## 主な項目

- **概要**: Expo Modules API を使うと、Swift や Kotlin でネイティブモジュールやカスタムビューを書き、Expo アプリに組み込める[55]。React Native の Turbo Modules と同等のパフォーマンスを持ち、最新の言語機能を活用できるよう設計されている
- **用途例**: 既存の React Native モジュールがない機能（特定のデバイスセンサーや分析SDKなど）を使いたい場合に、そのSDKをラップするネイティブコードを自作して統合するケース。C++が必要ならTurbo Modulesを検討し、より簡便に済むなら Expo Modules API を選択すると公式で案内されている[56]
- **互換性**: Expo Modules API は新アーキテクチャ対応かつ従来互換性があり、アプリサイズへの影響は微小（数百KB程度）である[55][57]。パフォーマンスは Turbo Modules と同様で、JSI（JavaScript Interface）ベースのため高速

## ナビゲーション

「Overview」ページから「Get started」や「Tutorials」、リファレンスへのリンクがある[58]。ネイティブモジュール開発の基本ガイドやサンプルコードを参照するとよい。

## 回答・生成時の注意

コード生成では、既存のExpo モジュール一覧（Expo SDK）で目的の機能が提供されていない場合に限り、Modules API でカスタムモジュールを書くことを示唆する[55]。開発難易度やメンテナンス負荷が高くなる点にも触れ、よほど必要な場合のみ選択するようにする。

---

# 参考資料

各セクションで引用した Expo公式ドキュメントを参照し、最新の情報に基づいてルールを作成しています[7][9][12][19][20][26][29][32][59][43][48][52][55]。各項目では、該当ドキュメントのセクション名・目的・主な内容を簡潔にまとめ、実装時の注意点や回答時のポイントを強調しています。

## 参照リンク

- [1] [3] [5] [6] [What is .claude/rules/ in Claude Code | ClaudeLog](https://claudelog.com/faqs/what-are-claude-rules/)
- [2] [24 Claude Code Tips: #claude_code_advent_calendar - DEV Community](https://dev.to/oikon/24-claude-code-tips-claudecodeadventcalendar-52b5)
- [4] [CLAUDE.md Patterns That Actually Work | Elegant Software Solutions](https://www.elegantsoftwaresolutions.com/blog/claude-code-mastery-claude-md-patterns)
- [7] [11] [Introduction - Expo Documentation](https://docs.expo.dev/get-started/introduction/)
- [8] [9] [10] [Create a project - Expo Documentation](https://docs.expo.dev/get-started/create-a-project/)
- [12] [13] [14] [15] [16] [17] [Tools for development - Expo Documentation](https://docs.expo.dev/develop/tools/)
- [18] [19] [Navigation in Expo and React Native apps - Expo Documentation](https://docs.expo.dev/develop/app-navigation/)
- [20] [21] [22] [23] [24] [25] [Splash screen and app icon - Expo Documentation](https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/)
- [26] [27] [28] [Introduction to development builds - Expo Documentation](https://docs.expo.dev/develop/development-builds/introduction/)
- [29] [30] [31] [Introduction to config plugins - Expo Documentation](https://docs.expo.dev/config-plugins/introduction/)
- [32] [33] [34] [Overview of distributing apps for review - Expo Documentation](https://docs.expo.dev/review/overview/)
- [35] [36] [37] [38] [Build your project for app stores - Expo Documentation](https://docs.expo.dev/deploy/build-project/)
- [39] [40] [41] [42] [59] [Monitoring services - Expo Documentation](https://docs.expo.dev/monitoring/services/)
- [43] [44] [45] [46] [47] [Core concepts - Expo Documentation](https://docs.expo.dev/core-concepts/)
- [48] [49] [50] [51] [Tools, workflows and extensions - Expo Documentation](https://docs.expo.dev/develop/development-builds/development-workflows/)
- [52] [53] [54] [Introduction to Expo Router - Expo Documentation](https://docs.expo.dev/router/introduction/)
- [55] [56] [57] [58] [Expo Modules API: Overview - Expo Documentation](https://docs.expo.dev/modules/overview/)
