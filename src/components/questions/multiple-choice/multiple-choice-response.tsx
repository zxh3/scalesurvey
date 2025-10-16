"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  QuestionResponseProps,
  MultipleChoiceConfig,
} from "@/types/questions";

export function MultipleChoiceResponse({
  question,
  value,
  onChange,
  error,
}: QuestionResponseProps) {
  const config = question.config as MultipleChoiceConfig;
  const selectedOptions = (value as string[]) || [];

  const handleToggle = (optionId: string) => {
    const newSelection = selectedOptions.includes(optionId)
      ? selectedOptions.filter((id) => id !== optionId)
      : [...selectedOptions, optionId];

    // Check max selections
    if (
      config.maxSelections &&
      newSelection.length > config.maxSelections
    ) {
      return;
    }

    onChange(newSelection);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">
          {question.title}
          {question.required && <span className="text-destructive ml-1">*</span>}
        </h3>
        {question.description && (
          <p className="text-sm text-muted-foreground">
            {question.description}
          </p>
        )}
        {(config.minSelections || config.maxSelections) && (
          <p className="text-sm text-muted-foreground">
            {config.minSelections && config.maxSelections
              ? `Select ${config.minSelections}-${config.maxSelections} options`
              : config.minSelections
              ? `Select at least ${config.minSelections} ${
                  config.minSelections === 1 ? "option" : "options"
                }`
              : `Select up to ${config.maxSelections} ${
                  config.maxSelections === 1 ? "option" : "options"
                }`}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {config.options.map((option) => {
          const isChecked = selectedOptions.includes(option.id);
          const isDisabled =
            !isChecked &&
            config.maxSelections !== undefined &&
            selectedOptions.length >= config.maxSelections;

          return (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${question._id}-${option.id}`}
                checked={isChecked}
                onCheckedChange={() => handleToggle(option.id)}
                disabled={isDisabled}
              />
              <Label
                htmlFor={`${question._id}-${option.id}`}
                className={`font-normal cursor-pointer ${
                  isDisabled ? "text-muted-foreground" : ""
                }`}
              >
                {option.text}
              </Label>
            </div>
          );
        })}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
