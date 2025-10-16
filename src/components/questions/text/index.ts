import { AlignLeft } from "lucide-react";
import {
  type QuestionTypeDefinition,
  type TextConfig,
  textConfigSchema,
} from "@/types/questions";
import { TextEditor } from "./text-editor";
import { TextResponse } from "./text-response";
import { TextResults } from "./text-results";

export const textQuestionType: QuestionTypeDefinition = {
  type: "text",
  label: "Text Response",
  icon: AlignLeft,
  description: "Open-ended text input",

  EditorComponent: TextEditor,
  ResponseComponent: TextResponse,
  ResultsComponent: TextResults,

  defaultConfig: () => ({
    placeholder: "",
    maxLength: undefined,
  }),

  configSchema: textConfigSchema,

  validate: (question, value) => {
    const config = question.config as TextConfig;
    const textValue = (value as string) || "";

    // Check if required (not optional)
    if (!question.optional && !textValue.trim()) {
      return { valid: false, error: "This question is required" };
    }

    // If optional and no value, that's ok
    if (!textValue.trim()) {
      return { valid: true };
    }

    // Check max length
    if (config.maxLength && textValue.length > config.maxLength) {
      return {
        valid: false,
        error: `Text must be at most ${config.maxLength} characters`,
      };
    }

    return { valid: true };
  },
};
