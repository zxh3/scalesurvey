"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { Plus, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import {
  QuestionEditorProps,
  SingleChoiceConfig,
  QuestionOption,
} from "@/types/questions";

export function SingleChoiceEditor({
  question,
  onChange,
  onDelete,
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
        opt.id === optionId ? { ...opt, text } : opt
      ),
    });
  };

  const removeOption = (optionId: string) => {
    const newOptions = config.options
      .filter((opt) => opt.id !== optionId)
      .map((opt, index) => ({ ...opt, order: index }));
    updateConfig({ options: newOptions });
  };

  return (
    <Card className="p-4 space-y-4">
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
            <div className="space-y-2">
              {config.options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  <Input
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  {config.options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(option.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
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
