import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";
import Container from "@/components/layout/container";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, MessageSquare, Clock, Users, ArrowLeft } from "lucide-react";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function BoardPage() {
  const router = useRouter();
  const { slug } = router.query as { slug: string };
  const { data } = useSWR(() => slug && `/api/threads?boardSlug=${slug}`, fetcher);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sage, setSage] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  async function createThread() {
    setIsCreating(true);
    const res = await fetch("/api/threads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ boardSlug: slug, title, body, sage }) });
    if (!res.ok) {
      const e = await res.json();
      toast.error("作成失敗", { description: e.error ? JSON.stringify(e.error) : String(res.status) });
      setIsCreating(false);
      return;
    }
    const { threadId } = await res.json();
    toast.success("スレ作成", { description: `#${threadId} を作成しました` });
    router.push(`/thread/${threadId}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Container className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ヘッダー */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                板一覧に戻る
              </Button>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {data?.board?.name || slug}
            </h1>
            <p className="text-muted-foreground mt-2">スレッド一覧・新規投稿</p>
          </div>

          {/* 新規スレ作成 */}
          <motion.div 
            initial={{ opacity: 0, y: -6 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-0 bg-gradient-to-br from-card to-card/80 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  新規スレッド作成
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  placeholder="スレッドタイトルを入力..." 
                  value={title} 
                  onChange={e => setTitle(e.target.value)}
                  className="border-0 bg-muted/50"
                />
                <Textarea 
                  placeholder="最初の投稿内容を入力..." 
                  value={body} 
                  onChange={e => setBody(e.target.value)}
                  className="border-0 bg-muted/50 min-h-[100px]"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input 
                      type="checkbox" 
                      checked={sage} 
                      onChange={e => setSage(e.target.checked)}
                      className="rounded"
                    /> 
                    sage（スレを上げない）
                  </label>
                  <Button 
                    onClick={createThread}
                    disabled={!title.trim() || !body.trim() || isCreating}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {isCreating ? "作成中..." : "スレを立てる"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* スレ一覧 */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              スレッド一覧
            </h2>
            <div className="grid gap-3">
              {data?.threads?.map((t: { id: number; title: string; bumpedAt: string; _count: { posts: number } }, index: number) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                >
                  <Link href={`/thread/${t.id}`}>
                    <Card className="group border-0 bg-gradient-to-r from-card to-card/80 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium group-hover:text-primary transition-colors truncate">
                              {t.title}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{t._count.posts}レス</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(t.bumpedAt).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="ml-4">
                            #{t.id}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
