// Initialize question type registry
import { questionTypeRegistry } from "./registry";
import { singleChoiceDefinition } from "@/components/questions/single-choice";
import { multipleChoiceDefinition } from "@/components/questions/multiple-choice";
import { textQuestionType } from "@/components/questions/text";

// Register built-in question types
questionTypeRegistry.register(singleChoiceDefinition);
questionTypeRegistry.register(multipleChoiceDefinition);
questionTypeRegistry.register(textQuestionType);

// Export for convenience
export { questionTypeRegistry, getQuestionType } from "./registry";
