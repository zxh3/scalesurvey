"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { QuestionEditorProps, ScaleConfig } from "@/types/questions";

export function ScaleEditor({
  question,
  onChange,
  onDelete,
  questionDef,
}: QuestionEditorProps) {
  const config = question.config as ScaleConfig;

  const updateConfig = (updates: Partial<ScaleConfig>) => {
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

          {/* Scale Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`min-value-${question._id}`}>Minimum Value</Label>
              <Input
                id={`min-value-${question._id}`}
                type="number"
                value={config.minValue}
                onChange={(e) =>
                  updateConfig({
                    minValue: parseInt(e.target.value, 10) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`max-value-${question._id}`}>Maximum Value</Label>
              <Input
                id={`max-value-${question._id}`}
                type="number"
                value={config.maxValue}
                onChange={(e) =>
                  updateConfig({
                    maxValue: parseInt(e.target.value, 10) || 10,
                  })
                }
              />
            </div>
          </div>

          {/* Scale Labels */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`min-label-${question._id}`}>
                Minimum Label (optional)
              </Label>
              <Input
                id={`min-label-${question._id}`}
                value={config.minLabel || ""}
                onChange={(e) => updateConfig({ minLabel: e.target.value })}
                placeholder="e.g., Not at all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`max-label-${question._id}`}>
                Maximum Label (optional)
              </Label>
              <Input
                id={`max-label-${question._id}`}
                value={config.maxLabel || ""}
                onChange={(e) => updateConfig({ maxLabel: e.target.value })}
                placeholder="e.g., Extremely"
              />
            </div>
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
