import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }
  // ローカルMVPでは受け取ってOKを返すだけ
  res.json({ ok: true });
}
