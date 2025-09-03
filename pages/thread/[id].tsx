import { useRouter } from "next/router";
import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Send, ArrowLeft, User, Hash, Clock, MessageSquare } from "lucide-react";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ThreadPage() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data, mutate } = useSWR(() => id && `/api/posts?threadId=${id}`, fetcher, { refreshInterval: 4000 });

  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [sage, setSage] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [data?.posts?.length]);

  async function submitPost() {
    if (!body.trim()) return;
    setIsPosting(true);
    const res = await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ threadId: Number(id), name, body, sage }) });
    if (!res.ok) {
      const e = await res.json();
      toast.error("投稿失敗", { description: e.error ? JSON.stringify(e.error) : String(res.status) });
      setIsPosting(false);
      return;
    }
    setBody("");
    mutate();
    setIsPosting(false);
    toast.success("投稿完了");
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
                onClick={() => router.back()}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                戻る
              </Button>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {data?.thread?.title || `スレッド #${id}`}
            </h1>
            <p className="text-muted-foreground mt-2">
              {data?.posts?.length ? `${data.posts.length}件の投稿` : "読み込み中..."}
            </p>
          </div>

          {/* 投稿一覧 */}
          <div className="mb-8 space-y-4">
            {data?.posts?.map((p: { id: number; no: number; name: string; trip?: string; idHash: string; body: string; createdAt: string }, index: number) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
              >
                <Card className="border-0 bg-gradient-to-r from-card to-card/80 shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                      <Badge variant="outline" className="font-mono">
                        #{p.no}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{p.name}</span>
                        {p.trip && <span className="text-primary font-mono">{p.trip}</span>}
                      </div>
                      <div className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        <span className="font-mono">{p.idHash}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(p.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                      {p.body}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            <div ref={endRef} />
          </div>

          {/* 投稿フォーム */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }}
            className="sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 rounded-xl border"
          >
            <Card className="border-0 bg-gradient-to-br from-card to-card/80 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  新規投稿
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  placeholder="名前（任意。トリップは name#secret）" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="border-0 bg-muted/50"
                />
                <Textarea 
                  placeholder="投稿内容を入力..." 
                  value={body} 
                  onChange={e => setBody(e.target.value)}
                  className="border-0 bg-muted/50 min-h-[100px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      submitPost();
                    }
                  }}
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
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Ctrl+Enter で投稿</span>
                    <Button 
                      onClick={submitPost}
                      disabled={!body.trim() || isPosting}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {isPosting ? "投稿中..." : "書き込む"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
