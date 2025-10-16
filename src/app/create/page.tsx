"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { SurveyBasicInfo } from "@/components/survey-builder/survey-basic-info";
import { QuestionBuilder } from "@/components/survey-builder/question-builder";
import { SurveySettings } from "@/components/survey-builder/survey-settings";
import { Button } from "@/components/ui/button";
import { BaseQuestion } from "@/types/questions";
import { Save, Send } from "lucide-react";
import { SuccessModal } from "@/components/survey-builder/success-modal";
import { SiteHeader } from "@/components/site-header";

// Import question registry initialization
import "@/lib/questions/init";

export default function CreateSurveyPage() {
  const router = useRouter();
  const createSurvey = useMutation(api.surveys.create);
  const addQuestion = useMutation(api.questions.add);
  const publishSurvey = useMutation(api.surveys.publish);

  // Survey state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<BaseQuestion[]>([]);
  const [allowLiveResults, setAllowLiveResults] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdSurvey, setCreatedSurvey] = useState<{
    surveyId: string;
    adminCode: string;
    key: string;
  } | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateQuestions = (): boolean => {
    const errors: Record<string, string> = {};

    questions.forEach((question, index) => {
      if (!question.title.trim()) {
        errors[`question-${index}-title`] = "Question title is required";
      }

      if (question.type === "single_choice" || question.type === "multiple_choice") {
        const config = question.config as any;
        if (!config.options || config.options.length < 2) {
          errors[`question-${index}-options`] = "At least 2 options are required";
        } else {
          const emptyOptions = config.options.filter((opt: any) => !opt.text.trim());
          if (emptyOptions.length > 0) {
            errors[`question-${index}-options`] = "All options must have text";
          }
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      alert("Please enter a survey title");
      return;
    }

    setIsSaving(true);
    try {
      const result = await createSurvey({
        title: title.trim(),
        description: description.trim() || undefined,
        allowLiveResults,
        startDate: startDate?.getTime(),
        endDate: endDate?.getTime(),
      });

      setCreatedSurvey({
        surveyId: result.surveyId as string,
        adminCode: result.adminCode,
        key: result.key,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to create survey:", error);
      alert("Failed to create survey. Please try again.");
    } finally {
      setIsSaving(false);
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

    setIsSaving(true);
    try {
      // 1. Create the survey
      const result = await createSurvey({
        title: title.trim(),
        description: description.trim() || undefined,
        allowLiveResults,
        startDate: startDate?.getTime(),
        endDate: endDate?.getTime(),
      });

      const surveyId = result.surveyId as string;
      const adminCode = result.adminCode;

      // 2. Save all questions
      for (const question of questions) {
        await addQuestion({
          surveyId,
          adminCode,
          type: question.type,
          title: question.title,
          description: question.description,
          optional: question.optional,
          config: JSON.stringify(question.config),
        });
      }

      // 3. Publish the survey
      await publishSurvey({
        surveyId,
        adminCode,
      });

      setCreatedSurvey({
        surveyId,
        adminCode,
        key: result.key,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to publish survey:", error);
      alert("Failed to publish survey. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container max-w-5xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Survey
          </h1>
          <p className="text-muted-foreground mt-2">
            Build your survey with customizable questions
          </p>
        </div>

        <div className="space-y-8">
          {/* Basic Info */}
          <SurveyBasicInfo
            title={title}
            description={description}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
          />

          {/* Question Builder */}
          <QuestionBuilder
            questions={questions}
            onChange={setQuestions}
          />

          {/* Settings */}
          <SurveySettings
            allowLiveResults={allowLiveResults}
            startDate={startDate}
            endDate={endDate}
            onAllowLiveResultsChange={setAllowLiveResults}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pb-8">
            <Button
              variant="outline"
              size="lg"
              onClick={handleSaveDraft}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              size="lg"
              onClick={handlePublish}
              disabled={isSaving}
            >
              <Send className="h-4 w-4 mr-2" />
              Publish Survey
            </Button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {createdSurvey && (
        <SuccessModal
          open={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          adminCode={createdSurvey.adminCode}
          surveyKey={createdSurvey.key}
        />
      )}
    </div>
  );
}
