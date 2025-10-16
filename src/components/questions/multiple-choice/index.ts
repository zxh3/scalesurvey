import { CheckSquare } from "lucide-react";
import { nanoid } from "nanoid";
import { QuestionTypeDefinition, multipleChoiceConfigSchema } from "@/types/questions";
import { MultipleChoiceEditor } from "./multiple-choice-editor";
import { MultipleChoiceResponse } from "./multiple-choice-response";
import { MultipleChoiceResults } from "./multiple-choice-results";

export const multipleChoiceDefinition: QuestionTypeDefinition = {
  type: "multiple_choice",
  label: "Multiple Choice",
  icon: CheckSquare,
  description: "Participants can select multiple options from a list",

  EditorComponent: MultipleChoiceEditor,
  ResponseComponent: MultipleChoiceResponse,
  ResultsComponent: MultipleChoiceResults,

  defaultConfig: () => ({
    options: [
      { id: nanoid(), text: "", order: 0 },
      { id: nanoid(), text: "", order: 1 },
    ],
  }),

  configSchema: multipleChoiceConfigSchema,
};
