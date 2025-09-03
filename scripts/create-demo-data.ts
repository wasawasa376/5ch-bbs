import { PrismaClient } from "@prisma/client";
import { makeAnonId } from "../lib/id";

const prisma = new PrismaClient();

async function createDemoData() {
  // ニュース板のスレッド
  const newsThread1 = await prisma.thread.create({
    data: {
      boardId: 1, // news
      title: "【速報】AIが新たな技術革新を発表",
      bumpedAt: new Date(Date.now() - 1000 * 60 * 30), // 30分前
    },
  });

  const newsThread2 = await prisma.thread.create({
    data: {
      boardId: 1,
      title: "今年のプログラミング言語トレンド予想",
      bumpedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2時間前
    },
  });

  // 技術板のスレッド
  const techThread1 = await prisma.thread.create({
    data: {
      boardId: 2, // tech
      title: "Next.js 15の新機能について語ろう",
      bumpedAt: new Date(Date.now() - 1000 * 60 * 15), // 15分前
    },
  });

  const techThread2 = await prisma.thread.create({
    data: {
      boardId: 2,
      title: "TypeScriptで困った時の解決法",
      bumpedAt: new Date(Date.now() - 1000 * 60 * 45), // 45分前
    },
  });

  // 生活板のスレッド
  const lifeThread1 = await prisma.thread.create({
    data: {
      boardId: 3, // life
      title: "おすすめのカフェを教えて",
      bumpedAt: new Date(Date.now() - 1000 * 60 * 20), // 20分前
    },
  });

  const lifeThread2 = await prisma.thread.create({
    data: {
      boardId: 3,
      title: "週末の過ごし方アイデア募集",
      bumpedAt: new Date(Date.now() - 1000 * 60 * 60), // 1時間前
    },
  });

  // 各スレッドに投稿を追加
  const threads = [
    { thread: newsThread1, posts: [
      { name: "名無しさん", body: "これは画期的な発表ですね！", ua: "browser1" },
      { name: "テック好き", body: "詳細な情報が待ち遠しいです", ua: "browser2" },
      { name: "名無しさん", body: "どんな業界に影響するんでしょうか？", ua: "browser3" },
    ]},
    { thread: newsThread2, posts: [
      { name: "プログラマー太郎", body: "TypeScriptは確実に伸びると思う", ua: "browser4" },
      { name: "名無しさん", body: "Rustも注目ですよね", ua: "browser5" },
    ]},
    { thread: techThread1, posts: [
      { name: "Next.js信者", body: "App Routerが安定してきて良い感じ", ua: "browser6" },
      { name: "フロントエンド職人", body: "Turbopackでビルドがかなり早くなった", ua: "browser7" },
      { name: "名無しさん", body: "まだPages Routerから移行できてない...", ua: "browser8" },
      { name: "React大好き", body: "Server Componentsが便利すぎる", ua: "browser9" },
    ]},
    { thread: techThread2, posts: [
      { name: "TS初心者", body: "型エラーが解決できません助けて", ua: "browser10" },
      { name: "TypeScriptマスター", body: "どんなエラーですか？コード見せてください", ua: "browser11" },
    ]},
    { thread: lifeThread1, posts: [
      { name: "コーヒー愛好家", body: "渋谷の○○カフェがおすすめです", ua: "browser12" },
      { name: "名無しさん", body: "Wi-Fi環境重視なら△△がいいよ", ua: "browser13" },
      { name: "カフェ巡り", body: "新宿にある□□も穴場です", ua: "browser14" },
    ]},
    { thread: lifeThread2, posts: [
      { name: "休日満喫派", body: "映画館でゆっくり過ごすのが好き", ua: "browser15" },
      { name: "アウトドア派", body: "天気良い日は公園でピクニック！", ua: "browser16" },
    ]},
  ];

  for (const { thread, posts } of threads) {
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      await prisma.post.create({
        data: {
          threadId: thread.id,
          no: i + 1,
          name: post.name,
          idHash: makeAnonId({ ua: post.ua, threadId: thread.id }),
          body: post.body,
          createdAt: new Date(Date.now() - 1000 * 60 * (posts.length - i) * 5), // 5分間隔
        },
      });
    }
  }

  console.log("✅ デモデータの作成が完了しました！");
}

createDemoData()
  .catch((e) => {
    console.error("❌ エラー:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
