import useSWR from "swr";
import Container from "@/components/layout/container";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { MessageCircle, TrendingUp, Users } from "lucide-react";

const fetcher = (url: string) => fetch(url).then(r => r.json());

const boardIcons = {
  news: TrendingUp,
  tech: MessageCircle,
  life: Users,
};

export default function Home() {
  const { data } = useSWR("/api/boards", fetcher);
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Container className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              板一覧
            </h1>
            <p className="text-muted-foreground">お好きな板を選んでスレッドを閲覧・投稿してください</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.boards?.map((b: { id: number; slug: string; name: string; description?: string }, index: number) => {
              const Icon = boardIcons[b.slug as keyof typeof boardIcons] || MessageCircle;
              return (
                <motion.div
                  key={b.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href={`/b/${b.slug}`}>
                    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 dark:from-card dark:to-card/50">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <CardHeader className="relative">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/10 p-2 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                              {b.name}
                            </CardTitle>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {b.slug}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="relative">
                        <p className="text-sm text-muted-foreground">{b.description}</p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                          <MessageCircle className="h-3 w-3" />
                          <span>スレッドを見る</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
