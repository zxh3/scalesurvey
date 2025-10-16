"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Label } from "@/components/ui/label";
import { QuestionResponseProps, RatingConfig } from "@/types/questions";

export function RatingResponse({
  question,
  value,
  onChange,
}: QuestionResponseProps) {
  const config = question.config as RatingConfig;
  const rating = (value as number) || 0;
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="space-y-3">
      <Label>
        {question.title}
        {!question.optional && <span className="text-destructive ml-1">*</span>}
      </Label>
      {question.description && (
        <p className="text-sm text-muted-foreground">{question.description}</p>
      )}
      <div className="flex gap-2">
        {Array.from({ length: config.maxRating }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= (hoveredRating || rating);

          return (
            <button
              key={index}
              type="button"
              onClick={() => onChange(starValue)}
              onMouseEnter={() => setHoveredRating(starValue)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  isFilled
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          );
        })}
      </div>
      {rating > 0 && (
        <p className="text-sm text-muted-foreground">
          {rating} out of {config.maxRating} stars
        </p>
      )}
    </div>
  );
}
