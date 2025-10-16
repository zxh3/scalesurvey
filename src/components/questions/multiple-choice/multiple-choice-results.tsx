"use client";

import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import {
  QuestionResultsProps,
  MultipleChoiceConfig,
} from "@/types/questions";

export function MultipleChoiceResults({
  question,
  responses,
}: QuestionResultsProps) {
  const config = question.config as MultipleChoiceConfig;

  const results = useMemo(() => {
    const counts = new Map<string, number>();
    config.options.forEach((opt) => counts.set(opt.id, 0));

    responses.forEach((response) => {
      const selectedOptions = (response.value as string[]) || [];
      selectedOptions.forEach((optionId) => {
        counts.set(optionId, (counts.get(optionId) || 0) + 1);
      });
    });

    const total = responses.length;

    return config.options.map((option) => ({
      option,
      count: counts.get(option.id) || 0,
      percentage: total > 0 ? ((counts.get(option.id) || 0) / total) * 100 : 0,
    }));
  }, [config.options, responses]);

  const totalResponses = responses.length;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{question.title}</h3>
        {question.description && (
          <p className="text-sm text-muted-foreground">
            {question.description}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          {totalResponses} {totalResponses === 1 ? "response" : "responses"}
        </p>
      </div>

      <div className="space-y-3">
        {results.map(({ option, count, percentage }) => (
          <div key={option.id} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{option.text}</span>
              <span className="text-muted-foreground">
                {count} ({percentage.toFixed(1)}%)
              </span>
            </div>
            <Progress value={percentage} />
          </div>
        ))}
      </div>
    </div>
  );
}
