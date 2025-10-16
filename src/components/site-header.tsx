import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <span className="text-lg font-bold">Scale Survey</span>
        </Link>
        <div className="flex-1" />
        <ThemeToggle />
      </div>
    </header>
  );
}
