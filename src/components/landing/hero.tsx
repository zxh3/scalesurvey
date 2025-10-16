import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedGridBackground } from "./animated-grid-background";

export function Hero() {
	return (
		<section className="relative flex flex-col items-center justify-center min-h-[70vh] px-4 text-center overflow-hidden pb-8">
			<AnimatedGridBackground />
			<div className="max-w-3xl space-y-6 relative z-10">
				<div className="space-y-2">
					<p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
						Scale Survey
					</p>
					<h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
						Create Surveys in Seconds
					</h1>
				</div>
				<p className="text-xl text-muted-foreground sm:text-2xl">
					No sign-up required. Just create, share, and collect responses.
					<br />
					Simple, fast, and completely anonymous.
				</p>
				<div className="flex flex-col gap-4 sm:flex-row sm:justify-center pt-4">
					<Button size="lg" className="text-lg h-12 px-8 min-w-[260px]" asChild>
						<Link href="/create">Create Survey</Link>
					</Button>
					<Button
						size="lg"
						variant="outline"
						className="text-lg h-12 px-8 min-w-[260px]"
						asChild
					>
						<Link href="/access">Access Existing Survey</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
