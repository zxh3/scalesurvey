"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Zap, Lock, BarChart, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const features = [
	{
		icon: Zap,
		title: "Instant Creation",
		description:
			"No account needed. Start creating surveys immediately without any sign-up friction.",
	},
	{
		icon: Lock,
		title: "Secret Code Access",
		description:
			"Get a unique admin code when you create a survey. Use it to edit and manage your survey anytime.",
	},
	{
		icon: BarChart,
		title: "Live Results",
		description:
			"Choose whether participants can view real-time results. Perfect for interactive sessions.",
	},
	{
		icon: Calendar,
		title: "Flexible Scheduling",
		description:
			"Set start and end dates, save drafts, and publish when you're ready. Full control over timing.",
	},
];

export function Features() {
	return (
		<section className="relative py-12 px-4 overflow-hidden">
			<div className="max-w-6xl mx-auto relative z-10">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
						Everything you need to run surveys
					</h2>
					<p className="text-lg text-muted-foreground">
						Simple, powerful features designed for quick survey creation
					</p>
				</div>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								whileHover={{ y: -5, transition: { duration: 0.2 } }}
							>
								<Card className="border-2 h-full hover:shadow-lg transition-shadow">
									<CardHeader>
										<motion.div
											className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
											whileHover={{ rotate: 360, scale: 1.1 }}
											transition={{ duration: 0.5 }}
										>
											<Icon className="h-6 w-6 text-primary" />
										</motion.div>
										<CardTitle className="text-xl">{feature.title}</CardTitle>
									</CardHeader>
									<CardContent>
										<CardDescription className="text-base">
											{feature.description}
										</CardDescription>
									</CardContent>
								</Card>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
