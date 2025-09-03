import "@/styles/globals.css";
import type { AppProps } from "next/app";
import SiteHeader from "@/components/layout/site-header";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SiteHeader />
      <Component {...pageProps} />
      <Toaster />
    </ThemeProvider>
  );
}
