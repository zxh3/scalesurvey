"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { QuestionResponseProps, TextConfig } from "@/types/questions";

export function TextResponse({
  question,
  value,
  onChange,
}: QuestionResponseProps) {
  const config = question.config as TextConfig;
  const textValue = (value as string) || "";

  return (
    <div className="space-y-2">
      <Label htmlFor={`question-${question._id}`}>
        {question.title}
        {!question.optional && <span className="text-destructive ml-1">*</span>}
      </Label>
      {question.description && (
        <p className="text-sm text-muted-foreground">{question.description}</p>
      )}
      <Textarea
        id={`question-${question._id}`}
        value={textValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder={config.placeholder || "Enter your answer"}
        maxLength={config.maxLength}
        rows={4}
        required={!question.optional}
      />
      {config.maxLength && (
        <p className="text-xs text-muted-foreground text-right">
          {textValue.length} / {config.maxLength}
        </p>
      )}
    </div>
  );
}
