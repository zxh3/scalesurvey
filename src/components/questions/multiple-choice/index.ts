import { CheckSquare } from "lucide-react";
import { nanoid } from "nanoid";
import {
	type QuestionTypeDefinition,
	multipleChoiceConfigSchema,
	type MultipleChoiceConfig,
} from "@/types/questions";
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

	validate: (question, value) => {
		const config = question.config as MultipleChoiceConfig;
		const selectedOptions = (value as string[]) || [];

		// Check min selections first (applies even if optional)
		if (config.minSelections && selectedOptions.length < config.minSelections) {
			return {
				valid: false,
				error: `Please select at least ${config.minSelections} ${
					config.minSelections === 1 ? "option" : "options"
				}`,
			};
		}

		// Check if required (not optional) - if no minSelections, use standard check
		if (
			!question.optional &&
			!config.minSelections &&
			selectedOptions.length === 0
		) {
			return { valid: false, error: "This question is required" };
		}

		// If optional, no minSelections, and no selections, that's ok
		if (selectedOptions.length === 0) {
			return { valid: true };
		}

		// Check max selections (defensive check)
		if (config.maxSelections && selectedOptions.length > config.maxSelections) {
			return {
				valid: false,
				error: `Please select at most ${config.maxSelections} ${
					config.maxSelections === 1 ? "option" : "options"
				}`,
			};
		}

		// Check if all values are valid option IDs
		const validIds = config.options.map((opt) => opt.id);
		const hasInvalidId = selectedOptions.some((id) => !validIds.includes(id));
		if (hasInvalidId) {
			return { valid: false, error: "Invalid option selected" };
		}

		return { valid: true };
	},
};
