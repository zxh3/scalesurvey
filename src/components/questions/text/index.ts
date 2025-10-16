import { QuestionTypeDefinition } from "@/types/questions";
import { TextEditor } from "./text-editor";
import { TextResponse } from "./text-response";
import { TextResults } from "./text-results";

export const textQuestionType: QuestionTypeDefinition = {
  type: "text",
  label: "Text Response",
  description: "Open-ended text input",
  EditorComponent: TextEditor,
  ResponseComponent: TextResponse,
  ResultsComponent: TextResults,
  defaultConfig: {
    placeholder: "",
    maxLength: undefined,
  },
};
