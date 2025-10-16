import { AlignLeft } from "lucide-react";
import { QuestionTypeDefinition, textConfigSchema } from "@/types/questions";
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
};
