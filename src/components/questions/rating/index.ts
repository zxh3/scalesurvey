import { Star } from "lucide-react";
import { QuestionTypeDefinition, ratingConfigSchema } from "@/types/questions";
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
};
