"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { QuestionResponseProps, ScaleConfig } from "@/types/questions";

export function ScaleResponse({
  question,
  value,
  onChange,
}: QuestionResponseProps) {
  const config = question.config as ScaleConfig;
  const selectedValue = value as number | undefined;
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  // Generate scale values
  const scaleValues = Array.from(
    { length: config.maxValue - config.minValue + 1 },
    (_, i) => config.minValue + i
  );

  return (
    <div className="space-y-3">
      <Label>
        {question.title}
        {question.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {question.description && (
        <p className="text-sm text-muted-foreground">{question.description}</p>
      )}

      <div className="space-y-3">
        {/* Scale Labels */}
        <div className="flex justify-between text-sm text-muted-foreground px-1">
          <span>{config.minLabel || config.minValue}</span>
          <span>{config.maxLabel || config.maxValue}</span>
        </div>

        {/* Scale Buttons */}
        <div className="flex gap-2 justify-between">
          {scaleValues.map((scaleValue) => {
            const isSelected = selectedValue === scaleValue;
            const isHovered = hoveredValue === scaleValue;

            return (
              <button
                key={scaleValue}
                type="button"
                onClick={() => onChange(scaleValue)}
                onMouseEnter={() => setHoveredValue(scaleValue)}
                onMouseLeave={() => setHoveredValue(null)}
                className={`
                  flex-1 min-w-[40px] h-12 rounded-lg border-2 transition-all
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary font-semibold"
                      : isHovered
                      ? "bg-accent border-accent-foreground/20"
                      : "bg-background border-border hover:border-accent-foreground/40"
                  }
                `}
              >
                {scaleValue}
              </button>
            );
          })}
        </div>

        {/* Selected Value Display */}
        {selectedValue !== undefined && (
          <p className="text-sm text-muted-foreground text-center">
            Selected: {selectedValue}
            {selectedValue === config.minValue && config.minLabel
              ? ` (${config.minLabel})`
              : selectedValue === config.maxValue && config.maxLabel
              ? ` (${config.maxLabel})`
              : ""}
          </p>
        )}
      </div>
    </div>
  );
}
