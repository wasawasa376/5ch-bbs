import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }
  const boards = await prisma.board.findMany({ orderBy: { order: "asc" } });
  res.json({ boards });
}
