# 5ch風匿名掲示板 MVP

モダンなUIを持つ匿名掲示板のローカル実装キット

## 🌟 特徴

- **匿名投稿**: 会員登録不要で投稿可能
- **モダンUI**: ダークモード対応、アニメーション、レスポンシブデザイン
- **匿名ID**: スレッド単位でUA基準の短縮ハッシュID
- **トリップ**: `名前#秘密` 形式での識別
- **sage機能**: スレッド一覧の上げ下げ制御
- **連投規制**: レート制限（10秒間隔）
- **リアルタイム更新**: 4秒間隔でのSWR更新

## 🚀 技術スタック

- **Frontend**: Next.js 15 (Pages Router), TypeScript, Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **UI**: shadcn/ui, Framer Motion
- **Deployment**: Vercel

## 🛠️ ローカル開発

### 前提条件
- Node.js 18+
- npm or yarn

### セットアップ

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルにDATABASE_URLとID_SALTを設定

# データベースのセットアップ
npm run db:push
npm run db:seed

# 開発サーバーの起動
npm run dev
```

### 利用可能なスクリプト

- `npm run dev` - 開発サーバーを起動
- `npm run build` - プロダクションビルド
- `npm run start` - プロダクションサーバーを起動
- `npm run db:push` - Prismaでデータベーススキーマを同期
- `npm run db:seed` - 初期データを投入

## 📁 プロジェクト構成

```
bbs-mvp/
├ prisma/           # DB関連（スキーマ・シード）
├ lib/              # ユーティリティ（DB接続・ID生成・レート制限）
├ pages/            # Pages Router（API・フロント）
├ components/       # UIコンポーネント（shadcn/ui）
├ styles/           # Tailwind CSS
└ scripts/          # ユーティリティスクリプト
```

## 🌐 デプロイ

### Vercel + Supabase

1. **Supabaseプロジェクト作成**
   - [Supabase](https://supabase.com) でプロジェクト作成
   - DATABASE_URLを取得

2. **Vercelデプロイ**
   - GitHubリポジトリをVercelに接続
   - 環境変数（DATABASE_URL, ID_SALT）を設定

3. **データベース初期化**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

## 📱 使い方

1. 板一覧から任意の板をクリック
2. 新規スレッド作成・投稿ができます
3. トリップ機能は `名無し#abc` のような形式で使用
4. ダークモード切り替えは右上のボタンから

## 🔧 カスタマイズ

- **新しい板の追加**: `prisma/seed.ts` を編集
- **UI調整**: `components/` ディレクトリのコンポーネント編集
- **レート制限の調整**: `lib/rate-limit.ts` を編集

## 📄 ライセンス

MIT License