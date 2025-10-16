"use client";

import { nanoid } from "nanoid";
import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import type { BaseQuestion, QuestionType } from "@/types/questions";
import { questionTypeRegistry } from "@/lib/questions/init";
import { SortableQuestionCard } from "./sortable-question-card";

interface QuestionBuilderProps {
	questions: BaseQuestion[];
	onChange: (questions: BaseQuestion[]) => void;
}

export function QuestionBuilder({ questions, onChange }: QuestionBuilderProps) {
	const availableTypes = questionTypeRegistry.getAll();

	const addQuestion = (type: QuestionType) => {
		const questionDef = questionTypeRegistry.get(type);
		if (!questionDef) return;

		const newQuestion: BaseQuestion = {
			_id: nanoid(),
			surveyId: "", // Will be set when saving
			type,
			title: "",
			description: "",
			optional: false, // Questions are required by default
			order: questions.length,
			config: questionDef.defaultConfig(),
		};

		onChange([...questions, newQuestion]);
	};

	const updateQuestion = (
		questionId: string,
		updates: Partial<BaseQuestion>,
	) => {
		onChange(
			questions.map((q) => (q._id === questionId ? { ...q, ...updates } : q)),
		);
	};

	const deleteQuestion = (questionId: string) => {
		const newQuestions = questions
			.filter((q) => q._id !== questionId)
			.map((q, index) => ({ ...q, order: index }));
		onChange(newQuestions);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) {
			return;
		}

		const oldIndex = questions.findIndex((q) => q._id === active.id);
		const newIndex = questions.findIndex((q) => q._id === over.id);

		const newQuestions = [...questions];
		const [movedQuestion] = newQuestions.splice(oldIndex, 1);
		newQuestions.splice(newIndex, 0, movedQuestion);

		// Update order
		const reorderedQuestions = newQuestions.map((q, index) => ({
			...q,
			order: index,
		}));

		onChange(reorderedQuestions);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Questions</CardTitle>
				<CardDescription>
					Add and configure questions for your survey
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{questions.length === 0 ? (
					<div className="text-center py-12 border-2 border-dashed rounded-lg">
						<p className="text-muted-foreground mb-4">
							No questions yet. Add your first question to get started.
						</p>
					</div>
				) : (
					<DndContext
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={questions.map((q) => q._id)}
							strategy={verticalListSortingStrategy}
						>
							<div className="space-y-4">
								{questions.map((question) => (
									<SortableQuestionCard
										key={question._id}
										question={question}
										onUpdate={(updates) =>
											updateQuestion(question._id, updates)
										}
										onDelete={() => deleteQuestion(question._id)}
									/>
								))}
							</div>
						</SortableContext>
					</DndContext>
				)}

				{/* Add Question Button */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="w-full">
							<Plus className="h-4 w-4 mr-2" />
							Add Question
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-64">
						{availableTypes.map((typeDef) => {
							const Icon = typeDef.icon;
							return (
								<DropdownMenuItem
									key={typeDef.type}
									onClick={() => addQuestion(typeDef.type)}
								>
									<Icon className="h-4 w-4 mr-2" />
									<div>
										<div className="font-medium">{typeDef.label}</div>
										<div className="text-xs text-muted-foreground">
											{typeDef.description}
										</div>
									</div>
								</DropdownMenuItem>
							);
						})}
					</DropdownMenuContent>
				</DropdownMenu>
			</CardContent>
		</Card>
	);
}
