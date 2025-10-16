"use client";

import type { QuestionResultsProps } from "@/types/questions";
import { Card } from "@/components/ui/card";

export function TextResults({ question, responses }: QuestionResultsProps) {
	const textResponses = responses.map((r) => r.value as string);

	return (
		<div className="space-y-4">
			<div>
				<h3 className="text-lg font-semibold">{question.title}</h3>
				{question.description && (
					<p className="text-sm text-muted-foreground mt-1">
						{question.description}
					</p>
				)}
			</div>

			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						{textResponses.length}{" "}
						{textResponses.length === 1 ? "response" : "responses"}
					</p>
				</div>

				<div className="space-y-2 max-h-96 overflow-y-auto">
					{textResponses.map((response, index) => (
						<Card key={index} className="p-3">
							<p className="text-sm whitespace-pre-wrap break-words">
								{response || "(No response)"}
							</p>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
