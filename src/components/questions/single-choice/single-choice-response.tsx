"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { QuestionResponseProps, SingleChoiceConfig } from "@/types/questions";

export function SingleChoiceResponse({
	question,
	value,
	onChange,
	error,
}: QuestionResponseProps) {
	const config = question.config as SingleChoiceConfig;

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<h3 className="text-lg font-medium">
					{question.title}
					{!question.optional && (
						<span className="text-destructive ml-1">*</span>
					)}
				</h3>
				{question.description && (
					<p className="text-sm text-muted-foreground">
						{question.description}
					</p>
				)}
			</div>

			<RadioGroup value={value || ""} onValueChange={onChange}>
				<div className="space-y-3">
					{config.options.map((option) => (
						<div key={option.id} className="flex items-center space-x-2">
							<RadioGroupItem
								value={option.id}
								id={`${question._id}-${option.id}`}
							/>
							<Label
								htmlFor={`${question._id}-${option.id}`}
								className="font-normal cursor-pointer"
							>
								{option.text}
							</Label>
						</div>
					))}
				</div>
			</RadioGroup>

			{error && <p className="text-sm text-destructive">{error}</p>}
		</div>
	);
}
