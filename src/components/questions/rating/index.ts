import { Star } from "lucide-react";
import {
  QuestionTypeDefinition,
  ratingConfigSchema,
  RatingConfig,
} from "@/types/questions";
import { RatingEditor } from "./rating-editor";
import { RatingResponse } from "./rating-response";
import { RatingResults } from "./rating-results";

export const ratingQuestionType: QuestionTypeDefinition = {
  type: "rating",
  label: "Star Rating",
  icon: Star,
  description: "Star rating from 1 to 10",

  EditorComponent: RatingEditor,
  ResponseComponent: RatingResponse,
  ResultsComponent: RatingResults,

  defaultConfig: () => ({
    maxRating: 5,
  }),

  configSchema: ratingConfigSchema,

  validate: (question, value) => {
    const config = question.config as RatingConfig;
    const rating = value as number;

    // Check if required (not optional)
    if (!question.optional && !rating) {
      return { valid: false, error: "This question is required" };
    }

    // If optional and no value, that's ok
    if (!rating) {
      return { valid: true };
    }

    // Check range
    if (rating < 1 || rating > config.maxRating) {
      return {
        valid: false,
        error: `Rating must be between 1 and ${config.maxRating}`,
      };
    }

    return { valid: true };
  },
};
