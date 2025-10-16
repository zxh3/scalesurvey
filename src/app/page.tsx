import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Footer } from "@/components/landing/footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col">
			<SiteHeader />
			<Hero />
			<Features />
			<HowItWorks />
			<Footer />
		</div>
	);
}
