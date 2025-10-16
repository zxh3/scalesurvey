"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import {
  QuestionEditorProps,
  TextConfig,
} from "@/types/questions";

export function TextEditor({
  question,
  onChange,
  onDelete,
  questionDef,
}: QuestionEditorProps) {
  const config = question.config as TextConfig;

  const updateConfig = (updates: Partial<TextConfig>) => {
    onChange({
      config: { ...config, ...updates },
    });
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

          {/* Placeholder */}
          <div className="space-y-2">
            <Label htmlFor={`placeholder-${question._id}`}>
              Placeholder Text (optional)
            </Label>
            <Input
              id={`placeholder-${question._id}`}
              value={config.placeholder || ""}
              onChange={(e) => updateConfig({ placeholder: e.target.value })}
              placeholder="Enter placeholder text"
            />
          </div>

          {/* Max Length */}
          <div className="space-y-2">
            <Label htmlFor={`max-length-${question._id}`}>
              Maximum Length (optional)
            </Label>
            <Input
              id={`max-length-${question._id}`}
              type="number"
              min={1}
              max={5000}
              value={config.maxLength || ""}
              onChange={(e) =>
                updateConfig({
                  maxLength: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              placeholder="No limit"
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of characters allowed (1-5000)
            </p>
          </div>

          {/* Required Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor={`required-${question._id}`}>
              Required question
            </Label>
            <Switch
              id={`required-${question._id}`}
              checked={question.required}
              onCheckedChange={(checked) => onChange({ required: checked })}
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
