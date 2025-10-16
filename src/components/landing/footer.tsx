import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="py-12 px-4">
			<div className="max-w-6xl mx-auto">
				<Separator className="mb-8" />
				<div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center text-sm text-muted-foreground">
					<div>
						<p className="font-semibold text-foreground mb-1">Scale Survey</p>
						<p>&copy; {currentYear} Scale Survey. All rights reserved.</p>
					</div>
					<div className="flex gap-6">
						<Link
							href="https://github.com/anthropics/scalesurvey"
							className="hover:text-foreground transition-colors"
							target="_blank"
							rel="noopener noreferrer"
						>
							GitHub
						</Link>
						<Link
							href="/docs"
							className="hover:text-foreground transition-colors"
						>
							Documentation
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
