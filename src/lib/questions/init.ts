// Initialize question type registry

import { multipleChoiceDefinition } from "@/components/questions/multiple-choice";
import { ratingQuestionType } from "@/components/questions/rating";
import { scaleQuestionType } from "@/components/questions/scale";
import { singleChoiceDefinition } from "@/components/questions/single-choice";
import { textQuestionType } from "@/components/questions/text";
import { questionTypeRegistry } from "./registry";

// Register built-in question types
questionTypeRegistry.register(singleChoiceDefinition);
questionTypeRegistry.register(multipleChoiceDefinition);
questionTypeRegistry.register(textQuestionType);
questionTypeRegistry.register(ratingQuestionType);
questionTypeRegistry.register(scaleQuestionType);

// Export for convenience
export { getQuestionType, questionTypeRegistry } from "./registry";
