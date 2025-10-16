"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Clock, XCircle } from "lucide-react";
import { questionTypeRegistry } from "@/lib/questions/init";
import { BaseQuestion } from "@/types/questions";

type SurveyStatus = "loading" | "not_found" | "draft" | "not_started" | "ended" | "active" | "submitted";

export default function SurveyPage() {
  const params = useParams();
  const router = useRouter();
  const key = params.key as string;

  const survey = useQuery(api.surveys.getByKey, { key });
  const questions = useQuery(
    api.questions.getBySurvey,
    survey ? { surveyId: survey._id } : "skip"
  );
  const submitResponse = useMutation(api.responses.submit);

  const [status, setStatus] = useState<SurveyStatus>("loading");
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (survey === undefined) {
      setStatus("loading");
      return;
    }

    if (survey === null) {
      setStatus("not_found");
      return;
    }

    if (survey.status === "draft") {
      setStatus("draft");
      return;
    }

    if (survey.status === "closed") {
      setStatus("ended");
      return;
    }

    const now = Date.now();
    if (survey.startDate && now < survey.startDate) {
      setStatus("not_started");
      return;
    }

    if (survey.endDate && now > survey.endDate) {
      setStatus("ended");
      return;
    }

    setStatus("active");
  }, [survey]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Clear error for this question
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
  };

  const validateAnswers = (): boolean => {
    if (!questions) return false;

    const newErrors: Record<string, string> = {};

    questions.forEach((question) => {
      if (question.required && !answers[question._id]) {
        newErrors[question._id] = "This question is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateAnswers() || !survey) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Format answers for submission
      const formattedAnswers = Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        value,
      }));

      await submitResponse({
        surveyId: survey._id,
        answers: JSON.stringify(formattedAnswers),
      });

      setStatus("submitted");
    } catch (error) {
      console.error("Failed to submit response:", error);
      alert("Failed to submit response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading survey...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (status === "not_found") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              <CardTitle>Survey Not Found</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              The survey you're looking for doesn't exist or has been removed.
            </CardDescription>
            <Button className="mt-4 w-full" onClick={() => router.push("/")}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Draft state
  if (status === "draft") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>Survey Not Published</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              This survey hasn't been published yet. Please check back later.
            </CardDescription>
            <Button className="mt-4 w-full" onClick={() => router.push("/")}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not started state
  if (status === "not_started" && survey?.startDate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <CardTitle>Survey Not Started</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              This survey will be available starting{" "}
              {new Date(survey.startDate).toLocaleDateString()}
            </CardDescription>
            <Button className="mt-4 w-full" onClick={() => router.push("/")}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ended state
  if (status === "ended") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground">
              <XCircle className="h-5 w-5" />
              <CardTitle>Survey Ended</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              This survey is no longer accepting responses.
            </CardDescription>
            {survey?.allowLiveResults && (
              <Button
                className="mt-4 w-full"
                onClick={() => router.push(`/survey/${key}/results`)}
              >
                View Results
              </Button>
            )}
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => router.push("/")}
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Submitted state
  if (status === "submitted") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <CardTitle>Response Submitted!</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Thank you for completing this survey. Your response has been recorded.
            </CardDescription>
            {survey?.allowLiveResults && (
              <Button
                className="mt-4 w-full"
                onClick={() => router.push(`/survey/${key}/results`)}
              >
                View Results
              </Button>
            )}
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => router.push("/")}
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active survey - render form
  if (!survey || !questions) {
    return null;
  }

  // Parse questions with configs
  const parsedQuestions: BaseQuestion[] = questions.map((q) => ({
    ...q,
    config: JSON.parse(q.config),
  }));

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-3xl mx-auto">
        {/* Survey Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">{survey.title}</CardTitle>
            {survey.description && (
              <CardDescription className="text-base mt-2">
                {survey.description}
              </CardDescription>
            )}
          </CardHeader>
        </Card>

        {/* Questions */}
        <div className="space-y-6">
          {parsedQuestions.map((question) => {
            const questionDef = questionTypeRegistry.get(question.type);
            if (!questionDef) return null;

            const ResponseComponent = questionDef.ResponseComponent;

            return (
              <Card key={question._id}>
                <CardContent className="pt-6">
                  <ResponseComponent
                    question={question}
                    value={answers[question._id]}
                    onChange={(value) => handleAnswerChange(question._id, value)}
                    error={errors[question._id]}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Submit Button */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Response"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
