import Link from "next/link";
import Container from "./container";
import { MessageSquare } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SiteHeader() {
  return (
    <div className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors">
          <MessageSquare className="h-5 w-5" />
          匿名掲示板
        </Link>
        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground">MVP (local)</div>
          <ThemeToggle />
        </div>
      </Container>
    </div>
  );
}
