"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { BaseQuestion } from "@/types/questions";
import { questionTypeRegistry } from "@/lib/questions/init";

interface SortableQuestionCardProps {
  question: BaseQuestion;
  onUpdate: (updates: Partial<BaseQuestion>) => void;
  onDelete: () => void;
}

export function SortableQuestionCard({
  question,
  onUpdate,
  onDelete,
}: SortableQuestionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const questionDef = questionTypeRegistry.get(question.type);

  if (!questionDef) {
    return null;
  }

  const EditorComponent = questionDef.EditorComponent;

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-8 top-4 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Question Editor */}
      <EditorComponent question={question} onChange={onUpdate} onDelete={onDelete} />
    </div>
  );
}
