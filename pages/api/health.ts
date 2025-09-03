import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }

  // 環境変数の確認
  const hasDatabase = !!process.env.DATABASE_URL;
  const hasSalt = !!process.env.ID_SALT;
  const databasePrefix = process.env.DATABASE_URL?.substring(0, 20) + "...";

  res.json({
    status: "healthy",
    environment: process.env.NODE_ENV,
    database: {
      configured: hasDatabase,
      prefix: databasePrefix,
    },
    salt: {
      configured: hasSalt,
    },
    timestamp: new Date().toISOString(),
  });
}
