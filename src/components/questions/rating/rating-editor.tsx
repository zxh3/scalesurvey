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
  RatingConfig,
} from "@/types/questions";

export function RatingEditor({
  question,
  onChange,
  onDelete,
  questionDef,
}: QuestionEditorProps) {
  const config = question.config as RatingConfig;

  const updateConfig = (updates: Partial<RatingConfig>) => {
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

          {/* Max Rating */}
          <div className="space-y-2">
            <Label htmlFor={`max-rating-${question._id}`}>
              Number of Stars
            </Label>
            <Input
              id={`max-rating-${question._id}`}
              type="number"
              min={3}
              max={10}
              value={config.maxRating}
              onChange={(e) =>
                updateConfig({
                  maxRating: Math.min(10, Math.max(3, parseInt(e.target.value) || 5)),
                })
              }
            />
            <p className="text-xs text-muted-foreground">
              Choose between 3 and 10 stars (default: 5)
            </p>
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
