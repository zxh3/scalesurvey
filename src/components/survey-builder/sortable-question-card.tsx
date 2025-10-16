"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { questionTypeRegistry } from "@/lib/questions/init";
import type { BaseQuestion } from "@/types/questions";

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
    <div ref={setNodeRef} style={style} className="flex gap-3 items-start">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="pt-4 cursor-grab active:cursor-grabbing flex-shrink-0"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Question Editor */}
      <div className="flex-1 min-w-0">
        <EditorComponent
          question={question}
          onChange={onUpdate}
          onDelete={onDelete}
          questionDef={questionDef}
        />
      </div>
    </div>
  );
}
