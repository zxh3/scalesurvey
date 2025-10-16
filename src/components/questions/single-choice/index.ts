import { CircleDot } from "lucide-react";
import { nanoid } from "nanoid";
import {
  QuestionTypeDefinition,
  singleChoiceConfigSchema,
  SingleChoiceConfig,
} from "@/types/questions";
import { SingleChoiceEditor } from "./single-choice-editor";
import { SingleChoiceResponse } from "./single-choice-response";
import { SingleChoiceResults } from "./single-choice-results";

export const singleChoiceDefinition: QuestionTypeDefinition = {
  type: "single_choice",
  label: "Single Choice",
  icon: CircleDot,
  description: "Participants can select one option from a list",

  EditorComponent: SingleChoiceEditor,
  ResponseComponent: SingleChoiceResponse,
  ResultsComponent: SingleChoiceResults,

  defaultConfig: () => ({
    options: [
      { id: nanoid(), text: "", order: 0 },
      { id: nanoid(), text: "", order: 1 },
    ],
  }),

  configSchema: singleChoiceConfigSchema,

  validate: (question, value) => {
    const config = question.config as SingleChoiceConfig;

    // Check required
    if (question.required && !value) {
      return { valid: false, error: "This question is required" };
    }

    // If not required and no value, that's ok
    if (!value) {
      return { valid: true };
    }

    // Check if value is a valid option ID
    const validIds = config.options.map((opt) => opt.id);
    if (!validIds.includes(value as string)) {
      return { valid: false, error: "Invalid option selected" };
    }

    return { valid: true };
  },
};
