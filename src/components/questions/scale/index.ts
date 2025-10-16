import { Ruler } from "lucide-react";
import { QuestionTypeDefinition, scaleConfigSchema } from "@/types/questions";
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
};
