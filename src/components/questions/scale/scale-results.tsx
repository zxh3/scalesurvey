"use client";

import type { QuestionResultsProps, ScaleConfig } from "@/types/questions";

export function ScaleResults({ question, responses }: QuestionResultsProps) {
  const config = question.config as ScaleConfig;
  const scaleValues = responses.map((r) => r.value as number);

  // Calculate statistics
  const totalResponses = scaleValues.length;
  const averageValue =
    totalResponses > 0
      ? scaleValues.reduce((sum, val) => sum + val, 0) / totalResponses
      : 0;

  // Generate all possible scale values
  const allScaleValues = Array.from(
    { length: config.maxValue - config.minValue + 1 },
    (_, i) => config.minValue + i,
  );

  // Count responses for each scale value
  const valueCounts = allScaleValues.map((scaleValue) => ({
    value: scaleValue,
    count: scaleValues.filter((v) => v === scaleValue).length,
  }));

  const maxCount = Math.max(...valueCounts.map((vc) => vc.count), 1);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{question.title}</h3>
        {question.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {question.description}
          </p>
        )}
      </div>

      {/* Average Value Display */}
      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
        <div className="text-center">
          <div className="text-3xl font-bold">{averageValue.toFixed(1)}</div>
          <div className="text-sm text-muted-foreground">Average</div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>{config.minLabel || config.minValue}</span>
            <span>{config.maxLabel || config.maxValue}</span>
          </div>
          <div className="relative h-2 bg-background rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-primary rounded-full transition-all"
              style={{
                left: "0%",
                width: `${
                  ((averageValue - config.minValue) /
                    (config.maxValue - config.minValue)) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {totalResponses} {totalResponses === 1 ? "response" : "responses"}
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Response Distribution</p>
        <div className="space-y-2">
          {valueCounts.map(({ value, count }) => {
            const percentage =
              totalResponses > 0 ? (count / totalResponses) * 100 : 0;
            const barHeight = (count / maxCount) * 100;

            return (
              <div key={value} className="flex items-center gap-3">
                <div className="w-12 text-sm font-medium text-right">
                  {value}
                </div>
                <div className="flex-1 h-8 bg-muted rounded overflow-hidden flex items-center">
                  <div
                    className="h-full bg-primary transition-all duration-300 flex items-center justify-end px-2"
                    style={{ width: `${barHeight}%` }}
                  >
                    {count > 0 && (
                      <span className="text-xs text-primary-foreground font-medium">
                        {count}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground w-16 text-right">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
