"use client";

import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import {
  SurveyForm,
  type SurveyFormData,
} from "@/components/survey-builder/survey-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BaseQuestion } from "@/types/questions";
import { api } from "../../../../../convex/_generated/api";

export default function EditSurveyPage() {
  const params = useParams();
  const router = useRouter();
  const adminCode = params.code as string;

  const survey = useQuery(api.surveys.getByAdminCode, { adminCode });
  const existingQuestions = useQuery(
    api.questions.getBySurvey,
    survey ? { surveyId: survey._id } : "skip",
  );

  const updateSurvey = useMutation(api.surveys.update);
  const addQuestion = useMutation(api.questions.add);
  const updateQuestion = useMutation(api.questions.update);
  const removeQuestion = useMutation(api.questions.remove);
  const reorderQuestions = useMutation(api.questions.reorder);

  const [isSaving, setIsSaving] = useState(false);

  // Prepare initial data for the form
  const initialData = useMemo(() => {
    if (!survey) return undefined;

    const loadedQuestions: BaseQuestion[] =
      existingQuestions?.map((q) => ({
        _id: q._id,
        surveyId: q.surveyId,
        type: q.type as any,
        title: q.title,
        description: q.description,
        optional: q.optional,
        order: q.order,
        config: JSON.parse(q.config),
      })) || [];

    return {
      title: survey.title,
      description: survey.description || "",
      questions: loadedQuestions,
      allowLiveResults: survey.allowLiveResults || false,
      startDate: survey.startDate ? new Date(survey.startDate) : undefined,
      endDate: survey.endDate ? new Date(survey.endDate) : undefined,
    };
  }, [survey, existingQuestions]);

  // Loading state
  if (survey === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading survey...</p>
        </div>
      </div>
    );
  }

  // Invalid admin code
  if (survey === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              <CardTitle>Invalid Admin Code</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The admin code you entered is invalid or doesn't match any survey.
            </p>
            <Button
              className="mt-4 w-full"
              onClick={() => router.push("/access")}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Cannot edit published survey
  if (survey.status !== "draft") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Cannot Edit Published Survey</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This survey has been published and cannot be edited.
            </p>
            <Button
              className="w-full"
              onClick={() => router.push(`/admin/${adminCode}`)}
            >
              Back to Admin Panel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = async (data: SurveyFormData) => {
    setIsSaving(true);
    try {
      // 1. Update survey metadata
      await updateSurvey({
        surveyId: survey._id,
        adminCode,
        title: data.title,
        description: data.description || undefined,
        allowLiveResults: data.allowLiveResults,
        startDate: data.startDate?.getTime(),
        endDate: data.endDate?.getTime(),
      });

      // 2. Sync questions
      const existingQuestionIds = new Set(
        existingQuestions?.map((q) => String(q._id)) || [],
      );

      const isExistingQuestion = (id: string) => {
        return existingQuestionIds.has(id);
      };

      // Delete removed questions
      const currentQuestionIds = new Set(
        data.questions
          .filter((q) => isExistingQuestion(q._id))
          .map((q) => q._id),
      );

      for (const existingId of existingQuestionIds) {
        if (!currentQuestionIds.has(existingId)) {
          await removeQuestion({
            questionId: existingId as any,
            adminCode,
          });
        }
      }

      // Add new questions and update existing ones
      const orderedQuestionIds: string[] = [];
      for (const question of data.questions) {
        if (!isExistingQuestion(question._id)) {
          // New question - add it
          const result = await addQuestion({
            surveyId: survey._id,
            adminCode,
            type: question.type,
            title: question.title,
            description: question.description,
            optional: question.optional,
            config: JSON.stringify(question.config),
          });
          orderedQuestionIds.push(result.questionId);
        } else {
          // Existing question - update it
          await updateQuestion({
            questionId: question._id as any,
            adminCode,
            title: question.title,
            description: question.description,
            optional: question.optional,
            config: JSON.stringify(question.config),
          });
          orderedQuestionIds.push(question._id);
        }
      }

      // Reorder questions
      if (orderedQuestionIds.length > 0) {
        await reorderQuestions({
          surveyId: survey._id,
          adminCode,
          questionIds: orderedQuestionIds as any,
        });
      }

      router.push(`/admin/${adminCode}`);
    } catch (error) {
      console.error("Failed to save survey:", error);
      alert("Failed to save survey. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container max-w-5xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Survey</h1>
            <p className="text-muted-foreground mt-2">
              Make changes to your draft survey
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/${adminCode}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
        </div>

        {/* Survey Form */}
        {initialData && (
          <SurveyForm
            mode="edit"
            initialData={initialData}
            onSave={handleSave}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}
