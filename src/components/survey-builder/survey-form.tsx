"use client";

import { ArrowLeft, Save, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { QuestionBuilder } from "@/components/survey-builder/question-builder";
import { SurveyBasicInfo } from "@/components/survey-builder/survey-basic-info";
import { SurveySettings } from "@/components/survey-builder/survey-settings";
import { Button } from "@/components/ui/button";
import type { BaseQuestion } from "@/types/questions";

// Import question registry initialization
import "@/lib/questions/init";

export interface SurveyFormData {
  title: string;
  description: string;
  questions: BaseQuestion[];
  allowLiveResults: boolean;
  startDate?: Date;
  endDate?: Date;
}

interface SurveyFormProps {
  initialData?: Partial<SurveyFormData>;
  onSaveDraft?: (data: SurveyFormData) => Promise<void>;
  onPublish?: (data: SurveyFormData) => Promise<void>;
  onSave?: (data: SurveyFormData) => Promise<void>;
  onBack?: () => void;
  isSaving?: boolean;
  mode: "create" | "edit";
  showBackButton?: boolean;
}

export function SurveyForm({
  initialData,
  onSaveDraft,
  onPublish,
  onSave,
  onBack,
  isSaving = false,
  mode,
  showBackButton = false,
}: SurveyFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [questions, setQuestions] = useState<BaseQuestion[]>(
    initialData?.questions || [],
  );
  const [allowLiveResults, setAllowLiveResults] = useState(
    initialData?.allowLiveResults || false,
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData?.startDate,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialData?.endDate,
  );
  const [_validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [hasChanges, setHasChanges] = useState(false);

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setQuestions(initialData.questions || []);
      setAllowLiveResults(initialData.allowLiveResults || false);
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
    }
  }, [initialData]);

  const validateQuestions = (): boolean => {
    const errors: Record<string, string> = {};

    questions.forEach((question, index) => {
      if (!question.title.trim()) {
        errors[`question-${index}-title`] = "Question title is required";
      }

      if (
        question.type === "single_choice" ||
        question.type === "multiple_choice"
      ) {
        const config = question.config as any;
        if (!config.options || config.options.length < 2) {
          errors[`question-${index}-options`] =
            "At least 2 options are required";
        } else {
          const emptyOptions = config.options.filter(
            (opt: any) => !opt.text.trim(),
          );
          if (emptyOptions.length > 0) {
            errors[`question-${index}-options`] = "All options must have text";
          }
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getFormData = (): SurveyFormData => ({
    title: title.trim(),
    description: description.trim(),
    questions,
    allowLiveResults,
    startDate,
    endDate,
  });

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      alert("Please enter a survey title");
      return;
    }

    if (onSaveDraft) {
      await onSaveDraft(getFormData());
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      alert("Please enter a survey title");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question before publishing");
      return;
    }

    if (!validateQuestions()) {
      alert("Please fix validation errors before publishing");
      return;
    }

    if (onPublish) {
      await onPublish(getFormData());
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a survey title");
      return;
    }

    if (onSave) {
      await onSave(getFormData());
      setHasChanges(false);
    }
  };

  const markChanged = () => {
    if (mode === "edit") {
      setHasChanges(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      {showBackButton && onBack && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      )}

      {/* Basic Info */}
      <SurveyBasicInfo
        title={title}
        description={description}
        onTitleChange={(val) => {
          setTitle(val);
          markChanged();
        }}
        onDescriptionChange={(val) => {
          setDescription(val);
          markChanged();
        }}
      />

      {/* Question Builder */}
      <QuestionBuilder
        questions={questions}
        onChange={(newQuestions) => {
          setQuestions(newQuestions);
          markChanged();
        }}
      />

      {/* Settings */}
      <SurveySettings
        allowLiveResults={allowLiveResults}
        startDate={startDate}
        endDate={endDate}
        onAllowLiveResultsChange={(val) => {
          setAllowLiveResults(val);
          markChanged();
        }}
        onStartDateChange={(val) => {
          setStartDate(val);
          markChanged();
        }}
        onEndDateChange={(val) => {
          setEndDate(val);
          markChanged();
        }}
      />

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end pb-8">
        {mode === "create" && (
          <>
            {onSaveDraft && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleSaveDraft}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
            )}
            {onPublish && (
              <Button size="lg" onClick={handlePublish} disabled={isSaving}>
                <Send className="h-4 w-4 mr-2" />
                Publish Survey
              </Button>
            )}
          </>
        )}

        {mode === "edit" && onSave && (
          <Button
            size="lg"
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>
    </div>
  );
}
