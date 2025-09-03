import { clsx } from "clsx";
export default function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("mx-auto max-w-4xl px-3", className)}>{children}</div>;
}
