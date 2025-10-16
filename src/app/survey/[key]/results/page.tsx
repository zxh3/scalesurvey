"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, XCircle, Lock } from "lucide-react";
import { questionTypeRegistry } from "@/lib/questions/init";
import type { BaseQuestion } from "@/types/questions";

export default function LiveResultsPage() {
	const params = useParams();
	const router = useRouter();
	const key = params.key as string;

	const survey = useQuery(api.surveys.getByKey, { key });
	const questions = useQuery(
		api.questions.getBySurvey,
		survey ? { surveyId: survey._id } : "skip",
	);
	const responses = useQuery(
		api.responses.getForLiveResults,
		survey && survey.allowLiveResults ? { surveyId: survey._id } : "skip",
	);

	if (survey === undefined || questions === undefined) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading results...</p>
				</div>
			</div>
		);
	}

	if (survey === null) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-4">
				<Card className="max-w-md w-full">
					<CardHeader>
						<div className="flex items-center gap-2 text-destructive">
							<XCircle className="h-5 w-5" />
							<CardTitle>Survey Not Found</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<CardDescription>
							The survey you're looking for doesn't exist or has been removed.
						</CardDescription>
						<Button className="mt-4 w-full" onClick={() => router.push("/")}>
							Go to Home
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!survey.allowLiveResults) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-4">
				<Card className="max-w-md w-full">
					<CardHeader>
						<div className="flex items-center gap-2 text-muted-foreground">
							<Lock className="h-5 w-5" />
							<CardTitle>Results Not Available</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<CardDescription>
							Live results are not enabled for this survey.
						</CardDescription>
						<Button className="mt-4 w-full" onClick={() => router.push("/")}>
							Go to Home
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (responses === undefined) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading results...</p>
				</div>
			</div>
		);
	}

	// Parse questions and responses
	const parsedQuestions: BaseQuestion[] = questions.map((q) => ({
		...q,
		config: JSON.parse(q.config),
	}));

	const parsedResponses = responses.map((r) => ({
		...r,
		answers: JSON.parse(r.answers),
	}));

	// Group responses by question
	const responsesByQuestion = parsedQuestions.map((question) => {
		const questionResponses = parsedResponses
			.map((response) => {
				const answer = response.answers.find(
					(a: any) => a.questionId === question._id,
				);
				return answer ? { value: answer.value } : null;
			})
			.filter((r) => r !== null);

		return {
			question,
			responses: questionResponses,
		};
	});

	return (
		<div className="min-h-screen bg-background py-8 px-4">
			<div className="container max-w-3xl mx-auto">
				{/* Header */}
				<div className="mb-6">
					<Button
						variant="ghost"
						className="mb-4"
						onClick={() => router.push(`/survey/${key}`)}
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Survey
					</Button>

					<div className="mb-4">
						<h1 className="text-3xl font-bold">{survey.title}</h1>
						<p className="text-muted-foreground mt-1">Live Results</p>
					</div>

					<div className="flex items-center gap-4">
						<Badge variant="outline" className="text-base">
							{responses.length}{" "}
							{responses.length === 1 ? "Response" : "Responses"}
						</Badge>
						<Badge variant="default" className="text-base">
							Live Updates
						</Badge>
					</div>
				</div>

				{/* Results */}
				{responses.length === 0 ? (
					<Card>
						<CardContent className="pt-6 text-center py-12">
							<p className="text-muted-foreground">
								No responses yet. Be the first to submit your response!
							</p>
							<Button
								className="mt-4"
								onClick={() => router.push(`/survey/${key}`)}
							>
								Take Survey
							</Button>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-6">
						{responsesByQuestion.map(
							({ question, responses: questionResponses }) => {
								const questionDef = questionTypeRegistry.get(question.type);
								if (!questionDef) return null;

								const ResultsComponent = questionDef.ResultsComponent;

								return (
									<Card key={question._id}>
										<CardContent className="pt-6">
											<ResultsComponent
												question={question}
												responses={questionResponses}
											/>
										</CardContent>
									</Card>
								);
							},
						)}
					</div>
				)}
			</div>
		</div>
	);
}
