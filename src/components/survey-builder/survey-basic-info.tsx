import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SurveyBasicInfoProps {
	title: string;
	description: string;
	onTitleChange: (title: string) => void;
	onDescriptionChange: (description: string) => void;
}

export function SurveyBasicInfo({
	title,
	description,
	onTitleChange,
	onDescriptionChange,
}: SurveyBasicInfoProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Basic Information</CardTitle>
				<CardDescription>
					Give your survey a title and optional description
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="survey-title">Survey Title *</Label>
					<Input
						id="survey-title"
						value={title}
						onChange={(e) => onTitleChange(e.target.value)}
						placeholder="Enter survey title"
						maxLength={200}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="survey-description">Description (optional)</Label>
					<Textarea
						id="survey-description"
						value={description}
						onChange={(e) => onDescriptionChange(e.target.value)}
						placeholder="Add a description to provide context for participants"
						rows={3}
						maxLength={1000}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
