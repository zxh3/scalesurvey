import { CircleDot } from "lucide-react";
import { nanoid } from "nanoid";
import { QuestionTypeDefinition, singleChoiceConfigSchema } from "@/types/questions";
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
};
