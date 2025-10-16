import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 max-w-[100vw] mx-auto">
        <Link
          href="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-lg font-bold">Scale Survey</span>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/create"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Create
            </Link>
            <Link
              href="/surveys"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              My Surveys
            </Link>
            <Link
              href="/access"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Access
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
