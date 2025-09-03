import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { parseNameAndTrip, makeAnonId } from "@/lib/id";
import { rateLimit } from "@/lib/rate-limit";

const GetPosts = z.object({ threadId: z.coerce.number(), page: z.coerce.number().optional() });
const AddPost = z.object({ threadId: z.number(), name: z.string().optional(), body: z.string().min(1), sage: z.boolean().optional() });

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method === "GET") {
    const parse = GetPosts.safeParse(req.query);
    if (!parse.success) {
      res.status(400).json({ error: parse.error.flatten() });
      return;
    }
    const { threadId, page = 1 } = parse.data;

    const take = 50;
    const skip = (page - 1) * take;
    const thread = await prisma.thread.findUnique({ where: { id: threadId } });
    if (!thread) {
      res.status(404).json({ error: "thread not found" });
      return;
    }

    const posts = await prisma.post.findMany({ where: { threadId }, orderBy: { id: "asc" }, skip, take });
    const count = await prisma.post.count({ where: { threadId } });
    res.json({ thread: { id: thread.id, title: thread.title }, posts, total: count, page, pageSize: take });
    return;
  }

  if (req.method === "POST") {
    const rl = rateLimit(`post:${req.headers["user-agent"] ?? "ua"}`, 10_000); // 同一UA 10秒
    if (!rl.ok) {
      res.status(429).json({ error: `Wait ${Math.ceil(rl.retryAfterMs!/1000)}s` });
      return;
    }

    const parse = AddPost.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: parse.error.flatten() });
      return;
    }
    const { threadId, name, body, sage } = parse.data;

    const thread = await prisma.thread.findUnique({ where: { id: threadId } });
    if (!thread) {
      res.status(404).json({ error: "thread not found" });
      return;
    }

    const { name: dispName, trip } = parseNameAndTrip(name);
    const ua = String(req.headers["user-agent"] || "ua");
    const idHash = makeAnonId({ ua, threadId });

    const last = await prisma.post.findFirst({ where: { threadId }, orderBy: { no: "desc" }, select: { no: true } });
    const no = (last?.no || 0) + 1;

    const post = await prisma.post.create({
      data: { threadId, no, name: dispName, trip, idHash, body, sage: !!sage },
    });

    if (!sage) {
      await prisma.thread.update({ where: { id: threadId }, data: { bumpedAt: new Date() } });
    }

    res.status(201).json({ ok: true, postId: post.id, no });
    return;
  }

  res.status(405).end();
}