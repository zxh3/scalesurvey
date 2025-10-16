import { Ruler } from "lucide-react";
import {
  QuestionTypeDefinition,
  scaleConfigSchema,
  ScaleConfig,
} from "@/types/questions";
import { ScaleEditor } from "./scale-editor";
import { ScaleResponse } from "./scale-response";
import { ScaleResults } from "./scale-results";

export const scaleQuestionType: QuestionTypeDefinition = {
  type: "scale",
  label: "Scale",
  icon: Ruler,
  description: "Numeric scale with custom range",

  EditorComponent: ScaleEditor,
  ResponseComponent: ScaleResponse,
  ResultsComponent: ScaleResults,

  defaultConfig: () => ({
    minValue: 1,
    maxValue: 10,
    minLabel: "",
    maxLabel: "",
  }),

  configSchema: scaleConfigSchema,

  validate: (question, value) => {
    const config = question.config as ScaleConfig;
    const scaleValue = value as number;

    // Check required
    if (question.required && scaleValue === undefined) {
      return { valid: false, error: "This question is required" };
    }

    // If not required and no value, that's ok
    if (scaleValue === undefined) {
      return { valid: true };
    }

    // Check range
    if (scaleValue < config.minValue || scaleValue > config.maxValue) {
      return {
        valid: false,
        error: `Value must be between ${config.minValue} and ${config.maxValue}`,
      };
    }

    return { valid: true };
  },
};
