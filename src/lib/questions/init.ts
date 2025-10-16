// Initialize question type registry
import { questionTypeRegistry } from "./registry";
import { singleChoiceDefinition } from "@/components/questions/single-choice";
import { multipleChoiceDefinition } from "@/components/questions/multiple-choice";
import { textQuestionType } from "@/components/questions/text";
import { ratingQuestionType } from "@/components/questions/rating";

// Register built-in question types
questionTypeRegistry.register(singleChoiceDefinition);
questionTypeRegistry.register(multipleChoiceDefinition);
questionTypeRegistry.register(textQuestionType);
questionTypeRegistry.register(ratingQuestionType);

// Export for convenience
export { questionTypeRegistry, getQuestionType } from "./registry";
