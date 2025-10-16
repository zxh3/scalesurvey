"use client";

import { Star } from "lucide-react";
import { QuestionResultsProps, RatingConfig } from "@/types/questions";

export function RatingResults({ question, responses }: QuestionResultsProps) {
  const config = question.config as RatingConfig;
  const ratings = responses.map((r) => r.value as number);

  // Calculate statistics
  const totalResponses = ratings.length;
  const averageRating = totalResponses > 0
    ? ratings.reduce((sum, rating) => sum + rating, 0) / totalResponses
    : 0;

  // Count ratings for each star level
  const ratingCounts = Array.from({ length: config.maxRating }, (_, i) => {
    const starValue = i + 1;
    return {
      stars: starValue,
      count: ratings.filter((r) => r === starValue).length,
    };
  }).reverse(); // Show from highest to lowest

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

      {/* Average Rating Display */}
      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
        <div className="text-center">
          <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
          <div className="text-sm text-muted-foreground">
            out of {config.maxRating}
          </div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: config.maxRating }).map((_, index) => {
            const starValue = index + 1;
            const isFilled = starValue <= Math.round(averageRating);
            const isPartiallyFilled =
              starValue > Math.floor(averageRating) &&
              starValue <= Math.ceil(averageRating);

            return (
              <Star
                key={index}
                className={`h-6 w-6 ${
                  isFilled || isPartiallyFilled
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            );
          })}
        </div>
        <div className="text-sm text-muted-foreground ml-auto">
          {totalResponses} {totalResponses === 1 ? "response" : "responses"}
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Rating Distribution</p>
        {ratingCounts.map(({ stars, count }) => {
          const percentage = totalResponses > 0 ? (count / totalResponses) * 100 : 0;

          return (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium">{stars}</span>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-16 text-right">
                {count} ({percentage.toFixed(0)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
