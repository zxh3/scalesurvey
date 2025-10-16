import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Scale Survey",
	description:
		"Create surveys in seconds. No sign-up required. Just create, share, and collect responses. Simple, fast, and completely anonymous.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem={false}
				>
					<ConvexClientProvider>{children}</ConvexClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
