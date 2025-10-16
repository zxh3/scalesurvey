import { LucideIcon } from "lucide-react";
import { z } from "zod";

// Question types
export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "text"
  | "rating"
  | "scale";

// Base question interface
export interface BaseQuestion {
  _id: string;
  surveyId: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  order: number;
  config: QuestionConfig;
}

// Question config types
export type QuestionConfig =
  | SingleChoiceConfig
  | MultipleChoiceConfig
  | TextConfig
  | RatingConfig
  | ScaleConfig;

export interface SingleChoiceConfig {
  options: QuestionOption[];
}

export interface MultipleChoiceConfig {
  options: QuestionOption[];
  minSelections?: number;
  maxSelections?: number;
}

export interface TextConfig {
  placeholder?: string;
  maxLength?: number;
}

export interface RatingConfig {
  maxRating: number;
}

export interface ScaleConfig {
  minValue: number;
  maxValue: number;
  minLabel?: string;
  maxLabel?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  order: number;
}

// Component prop interfaces
export interface QuestionEditorProps {
  question: BaseQuestion;
  onChange: (updates: Partial<BaseQuestion>) => void;
  onDelete: () => void;
  questionDef?: QuestionTypeDefinition;
}

export interface QuestionResponseProps {
  question: BaseQuestion;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export interface QuestionResultsProps {
  question: BaseQuestion;
  responses: any[];
}

// Validation result type
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// Question type definition for registry
export interface QuestionTypeDefinition {
  type: QuestionType;
  label: string;
  icon: LucideIcon;
  description: string;

  // Component for editing in survey builder
  EditorComponent: React.ComponentType<QuestionEditorProps>;

  // Component for rendering in live survey
  ResponseComponent: React.ComponentType<QuestionResponseProps>;

  // Component for displaying results
  ResultsComponent: React.ComponentType<QuestionResultsProps>;

  // Default config when creating new question
  defaultConfig: () => QuestionConfig;

  // Validation schema for config
  configSchema: z.ZodSchema;

  // Validation function for response values
  validate: (question: BaseQuestion, value: any) => ValidationResult;
}

// Validation schemas
export const optionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Option text is required"),
  order: z.number(),
});

export const singleChoiceConfigSchema = z.object({
  options: z
    .array(optionSchema)
    .min(2, "At least 2 options are required")
    .max(10, "Maximum 10 options allowed"),
});

export const multipleChoiceConfigSchema = z.object({
  options: z
    .array(optionSchema)
    .min(2, "At least 2 options are required")
    .max(10, "Maximum 10 options allowed"),
  minSelections: z.number().min(0).optional(),
  maxSelections: z.number().min(1).optional(),
});

export const textConfigSchema = z.object({
  placeholder: z.string().optional(),
  maxLength: z.number().min(1).max(5000).optional(),
});

export const ratingConfigSchema = z.object({
  maxRating: z.number().min(3).max(10),
});

export const scaleConfigSchema = z.object({
  minValue: z.number(),
  maxValue: z.number(),
  minLabel: z.string().optional(),
  maxLabel: z.string().optional(),
});
