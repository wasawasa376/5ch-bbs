import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // セキュリティ: 本番環境でのみ、特定の認証トークンがある場合のみ実行
  const authToken = req.headers.authorization;
  if (authToken !== "Bearer setup-token-2024") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    // 板データの初期化
    const boards = [
      { slug: "news", name: "ニュース", description: "時事・速報", order: 0 },
      { slug: "tech", name: "技術", description: "開発・ガジェット", order: 1 },
      { slug: "life", name: "生活", description: "雑談・相談", order: 2 },
    ];

    for (const board of boards) {
      await prisma.board.upsert({
        where: { slug: board.slug },
        create: board,
        update: {},
      });
    }

    res.json({ 
      success: true, 
      message: "Database initialized successfully",
      boardsCreated: boards.length 
    });
  } catch (error) {
    console.error("Database setup error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Database setup failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
