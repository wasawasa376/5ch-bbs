import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const CreateThread = z.object({ boardSlug: z.string(), title: z.string().min(1), body: z.string().min(1), sage: z.boolean().optional() });

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method === "GET") {
    const { boardSlug } = req.query;
    if (!boardSlug || typeof boardSlug !== "string") {
      res.status(400).json({ error: "boardSlug" });
      return;
    }
    const board = await prisma.board.findUnique({ where: { slug: boardSlug } });
    if (!board) {
      res.status(404).json({ error: "board not found" });
      return;
    }
    const threads = await prisma.thread.findMany({
      where: { boardId: board.id, isArchived: false },
      orderBy: [{ bumpedAt: "desc" }],
      take: 100,
      select: { id: true, title: true, bumpedAt: true, _count: { select: { posts: true } } },
    });
    res.json({ board, threads });
    return;
  }

  if (req.method === "POST") {
    const rl = rateLimit(`thread:${req.headers["user-agent"] ?? "ua"}`, 15_000); // 全体15秒
    if (!rl.ok) {
      res.status(429).json({ error: `Wait ${Math.ceil(rl.retryAfterMs!/1000)}s` });
      return;
    }

    const parse = CreateThread.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: parse.error.flatten() });
      return;
    }
    const { boardSlug, title, body, sage } = parse.data;

    const board = await prisma.board.findUnique({ where: { slug: boardSlug } });
    if (!board) {
      res.status(404).json({ error: "board not found" });
      return;
    }

    // スレ作成 + 最初の投稿
    const thread = await prisma.thread.create({ data: { boardId: board.id, title } });
    await prisma.post.create({ data: { threadId: thread.id, no: 1, name: "名無しさん", idHash: "OPID", body, sage: !!sage } });

    if (!sage) {
      await prisma.thread.update({ where: { id: thread.id }, data: { bumpedAt: new Date() } });
    }
    res.status(201).json({ threadId: thread.id });
    return;
  }

  res.status(405).end();
}