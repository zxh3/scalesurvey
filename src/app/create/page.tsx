"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { SuccessModal } from "@/components/survey-builder/success-modal";
import { SiteHeader } from "@/components/site-header";
import { saveSurvey } from "@/lib/db";
import {
  SurveyForm,
  SurveyFormData,
} from "@/components/survey-builder/survey-form";

export default function CreateSurveyPage() {
  const createSurvey = useMutation(api.surveys.create);
  const addQuestion = useMutation(api.questions.add);
  const publishSurvey = useMutation(api.surveys.publish);

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdSurvey, setCreatedSurvey] = useState<{
    surveyId: string;
    adminCode: string;
    key: string;
  } | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveDraft = async (data: SurveyFormData) => {
    setIsSaving(true);
    try {
      const result = await createSurvey({
        title: data.title,
        description: data.description || undefined,
        allowLiveResults: data.allowLiveResults,
        startDate: data.startDate?.getTime(),
        endDate: data.endDate?.getTime(),
      });

      // Store in IndexedDB
      await saveSurvey({
        surveyId: result.surveyId as string,
        adminCode: result.adminCode,
        key: result.key,
        title: data.title,
        description: data.description || undefined,
        status: "draft",
        createdAt: Date.now(),
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

  const handlePublish = async (data: SurveyFormData) => {
    setIsSaving(true);
    try {
      // 1. Create the survey
      const result = await createSurvey({
        title: data.title,
        description: data.description || undefined,
        allowLiveResults: data.allowLiveResults,
        startDate: data.startDate?.getTime(),
        endDate: data.endDate?.getTime(),
      });

      const surveyId = result.surveyId;
      const adminCode = result.adminCode;

      // 2. Save all questions
      for (const question of data.questions) {
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

      // 4. Store in IndexedDB
      await saveSurvey({
        surveyId,
        adminCode,
        key: result.key,
        title: data.title,
        description: data.description || undefined,
        status: "published",
        createdAt: Date.now(),
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

        {/* Survey Form */}
        <SurveyForm
          mode="create"
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          isSaving={isSaving}
        />
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
