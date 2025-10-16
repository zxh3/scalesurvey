import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

interface SiteHeaderProps {
  centerTitle?: boolean;
}

export function SiteHeader({ centerTitle = false }: SiteHeaderProps) {
  if (centerTitle) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-center px-4 relative">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-lg font-bold">Scale Survey</span>
          </Link>
          <div className="absolute right-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }

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
