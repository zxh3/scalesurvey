// Initialize question type registry
import { questionTypeRegistry } from "./registry";
import { singleChoiceDefinition } from "@/components/questions/single-choice";
import { multipleChoiceDefinition } from "@/components/questions/multiple-choice";

// Register built-in question types
questionTypeRegistry.register(singleChoiceDefinition);
questionTypeRegistry.register(multipleChoiceDefinition);

// Export for convenience
export { questionTypeRegistry, getQuestionType } from "./registry";
