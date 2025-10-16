"use client";

import { nanoid } from "nanoid";
import { Plus, X, GripVertical } from "lucide-react";
import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import type {
	QuestionEditorProps,
	SingleChoiceConfig,
	QuestionOption,
} from "@/types/questions";

function SortableOption({
	option,
	index,
	onUpdate,
	onRemove,
	canRemove,
}: {
	option: QuestionOption;
	index: number;
	onUpdate: (text: string) => void;
	onRemove: () => void;
	canRemove: boolean;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: option.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div ref={setNodeRef} style={style} className="flex items-center gap-2">
			<div
				{...attributes}
				{...listeners}
				className="cursor-grab active:cursor-grabbing"
			>
				<GripVertical className="h-4 w-4 text-muted-foreground" />
			</div>
			<Input
				value={option.text}
				onChange={(e) => onUpdate(e.target.value)}
				placeholder={`Option ${index + 1}`}
				className="flex-1"
			/>
			{canRemove && (
				<Button variant="ghost" size="icon" onClick={onRemove}>
					<X className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
}

export function SingleChoiceEditor({
	question,
	onChange,
	onDelete,
	questionDef,
}: QuestionEditorProps) {
	const config = question.config as SingleChoiceConfig;

	const updateConfig = (updates: Partial<SingleChoiceConfig>) => {
		onChange({
			config: { ...config, ...updates },
		});
	};

	const addOption = () => {
		const newOption: QuestionOption = {
			id: nanoid(),
			text: "",
			order: config.options.length,
		};
		updateConfig({
			options: [...config.options, newOption],
		});
	};

	const updateOption = (optionId: string, text: string) => {
		updateConfig({
			options: config.options.map((opt) =>
				opt.id === optionId ? { ...opt, text } : opt,
			),
		});
	};

	const removeOption = (optionId: string) => {
		const newOptions = config.options
			.filter((opt) => opt.id !== optionId)
			.map((opt, index) => ({ ...opt, order: index }));
		updateConfig({ options: newOptions });
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) {
			return;
		}

		const oldIndex = config.options.findIndex((opt) => opt.id === active.id);
		const newIndex = config.options.findIndex((opt) => opt.id === over.id);

		const newOptions = [...config.options];
		const [movedOption] = newOptions.splice(oldIndex, 1);
		newOptions.splice(newIndex, 0, movedOption);

		// Update order
		const reorderedOptions = newOptions.map((opt, index) => ({
			...opt,
			order: index,
		}));

		updateConfig({ options: reorderedOptions });
	};

	return (
		<Card className="p-4 space-y-4">
			{/* Question Type Badge */}
			{questionDef && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground pb-2 border-b">
					<questionDef.icon className="h-4 w-4" />
					<span className="font-medium">{questionDef.label}</span>
				</div>
			)}

			<div className="flex items-start justify-between gap-4">
				<div className="flex-1 space-y-4">
					{/* Question Title */}
					<div className="space-y-2">
						<Label htmlFor={`question-title-${question._id}`}>
							Question Title *
						</Label>
						<Input
							id={`question-title-${question._id}`}
							value={question.title}
							onChange={(e) => onChange({ title: e.target.value })}
							placeholder="Enter your question"
						/>
					</div>

					{/* Question Description */}
					<div className="space-y-2">
						<Label htmlFor={`question-desc-${question._id}`}>
							Description (optional)
						</Label>
						<Textarea
							id={`question-desc-${question._id}`}
							value={question.description || ""}
							onChange={(e) => onChange({ description: e.target.value })}
							placeholder="Add additional context or instructions"
							rows={2}
						/>
					</div>

					{/* Options */}
					<div className="space-y-2">
						<Label>Answer Options</Label>
						<DndContext
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={config.options.map((opt) => opt.id)}
								strategy={verticalListSortingStrategy}
							>
								<div className="space-y-2">
									{config.options.map((option, index) => (
										<SortableOption
											key={option.id}
											option={option}
											index={index}
											onUpdate={(text) => updateOption(option.id, text)}
											onRemove={() => removeOption(option.id)}
											canRemove={config.options.length > 2}
										/>
									))}
								</div>
							</SortableContext>
						</DndContext>
						<Button
							variant="outline"
							size="sm"
							onClick={addOption}
							className="w-full"
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Option
						</Button>
					</div>

					{/* Required Toggle */}
					<div className="flex items-center justify-between">
						<Label htmlFor={`required-${question._id}`}>
							Optional question
						</Label>
						<Switch
							id={`required-${question._id}`}
							checked={question.optional}
							onCheckedChange={(checked) => onChange({ optional: checked })}
						/>
					</div>
				</div>

				{/* Delete Button */}
				<Button variant="ghost" size="icon" onClick={onDelete}>
					<X className="h-4 w-4" />
				</Button>
			</div>
		</Card>
	);
}
