import type { QuestionType, QuestionTypeDefinition } from "@/types/questions";

// Question type registry
class QuestionTypeRegistry {
	private types = new Map<QuestionType, QuestionTypeDefinition>();

	register(definition: QuestionTypeDefinition) {
		this.types.set(definition.type, definition);
	}

	get(type: QuestionType): QuestionTypeDefinition | undefined {
		return this.types.get(type);
	}

	getAll(): QuestionTypeDefinition[] {
		return Array.from(this.types.values());
	}

	has(type: QuestionType): boolean {
		return this.types.has(type);
	}
}

export const questionTypeRegistry = new QuestionTypeRegistry();

// Helper to get question type or throw
export function getQuestionType(type: QuestionType): QuestionTypeDefinition {
	const definition = questionTypeRegistry.get(type);
	if (!definition) {
		throw new Error(`Question type "${type}" is not registered`);
	}
	return definition;
}
