"use client";

import { useMutation, useQuery } from "convex/react";
import { AlertCircle, CheckCircle2, Clock, Info, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { hasSubmitted, recordSubmission } from "@/lib/db";
import { getFingerprint } from "@/lib/fingerprint";
import { questionTypeRegistry } from "@/lib/questions/init";
import type { BaseQuestion } from "@/types/questions";
import { api } from "../../../../convex/_generated/api";

type SurveyStatus =
  | "loading"
  | "not_found"
  | "draft"
  | "not_started"
  | "ended"
  | "active"
  | "submitted"
  | "already_submitted";

// Helper component for status messages
function StatusMessage({
  icon: Icon,
  title,
  description,
  iconColor = "text-muted-foreground",
  buttons,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  iconColor?: string;
  buttons?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className={`flex items-center gap-2 ${iconColor}`}>
            <Icon className="h-5 w-5" />
            <CardTitle>{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
          {buttons}
        </CardContent>
      </Card>
    </div>
  );
}

export default function SurveyPage() {
  const params = useParams();
  const router = useRouter();
  const key = params.key as string;

  const survey = useQuery(api.surveys.getByKey, { key });
  const questions = useQuery(
    api.questions.getBySurvey,
    survey ? { surveyId: survey._id } : "skip",
  );
  const submitResponse = useMutation(api.responses.submit);

  const [userStatus, setUserStatus] = useState<
    "submitted" | "already_submitted" | null
  >(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fingerprint, setFingerprint] = useState<string>("");

  // Parse questions with configs (memoized to avoid repeated parsing)
  const parsedQuestions = useMemo<BaseQuestion[]>(() => {
    if (!questions) return [];
    return questions.map((q) => ({
      ...q,
      config: JSON.parse(q.config),
    }));
  }, [questions]);

  // Check if user has already submitted (external system sync - valid useEffect)
  useEffect(() => {
    const checkSubmission = async () => {
      if (!survey || survey === null) return;

      try {
        const fp = await getFingerprint();
        setFingerprint(fp);

        const submitted = await hasSubmitted(survey._id, fp);
        if (submitted) {
          setUserStatus("already_submitted");
        }
      } catch (error) {
        console.error("Failed to check submission:", error);
      }
    };

    checkSubmission();
  }, [survey]);

  // Compute status from survey data (no useEffect needed!)
  const status = useMemo<SurveyStatus>(() => {
    // User-initiated statuses take precedence
    if (userStatus === "submitted") return "submitted";
    if (userStatus === "already_submitted") return "already_submitted";

    // Survey data-driven statuses
    if (survey === undefined) return "loading";
    if (survey === null) return "not_found";
    if (survey.status === "draft") return "draft";
    if (survey.status === "closed") return "ended";

    const now = Date.now();
    if (survey.startDate && now < survey.startDate) return "not_started";
    if (survey.endDate && now > survey.endDate) return "ended";

    return "active";
  }, [survey, userStatus]);

  const handleAnswerChange = (questionId: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Clear error for this question
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
  };

  const validateAnswers = (): boolean => {
    if (parsedQuestions.length === 0) return false;

    const newErrors: Record<string, string> = {};

    // Validate each question using its type-specific validation function
    parsedQuestions.forEach((question) => {
      const questionDef = questionTypeRegistry.get(question.type);
      if (!questionDef) return;

      const result = questionDef.validate(question, answers[question._id]);
      if (!result.valid) {
        newErrors[question._id] = result.error || "Invalid answer";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper to record submission in local DB
  const recordLocalSubmission = async () => {
    if (fingerprint && survey) {
      await recordSubmission(survey._id, fingerprint);
    }
  };

  const handleSubmit = async () => {
    if (!validateAnswers() || !survey || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Format answers for submission
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, value]) => ({
          questionId,
          value,
        }),
      );

      await submitResponse({
        surveyId: survey._id,
        answers: JSON.stringify(formattedAnswers),
      });

      // Record submission in local DB for future visits
      await recordLocalSubmission();

      setUserStatus("submitted");
      // Keep button disabled - status change will hide the form
    } catch (error) {
      console.error("Failed to submit response:", error);

      // Check if this is a duplicate submission error
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const isDuplicateError = errorMessage.includes("already submitted");

      if (isDuplicateError) {
        // Treat duplicate submission as success
        await recordLocalSubmission();
        setUserStatus("submitted");
      } else {
        // Show error for other types of failures
        setIsSubmitting(false);
        alert("Failed to submit response. Please try again.");
      }
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
      <StatusMessage
        icon={XCircle}
        title="Survey Not Found"
        description="The survey you're looking for doesn't exist or has been removed."
        iconColor="text-destructive"
        buttons={
          <Button className="mt-4 w-full" onClick={() => router.push("/")}>
            Go to Home
          </Button>
        }
      />
    );
  }

  // Draft state
  if (status === "draft") {
    return (
      <StatusMessage
        icon={AlertCircle}
        title="Survey Not Published"
        description="This survey hasn't been published yet. Please check back later."
        buttons={
          <Button className="mt-4 w-full" onClick={() => router.push("/")}>
            Go to Home
          </Button>
        }
      />
    );
  }

  // Not started state
  if (status === "not_started" && survey?.startDate) {
    return (
      <StatusMessage
        icon={Clock}
        title="Survey Not Started"
        description={`This survey will be available starting ${new Date(survey.startDate).toLocaleDateString()}`}
        buttons={
          <Button className="mt-4 w-full" onClick={() => router.push("/")}>
            Go to Home
          </Button>
        }
      />
    );
  }

  // Ended state
  if (status === "ended") {
    return (
      <StatusMessage
        icon={XCircle}
        title="Survey Ended"
        description="This survey is no longer accepting responses."
        buttons={
          <>
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
          </>
        }
      />
    );
  }

  // Already submitted state
  if (status === "already_submitted") {
    return (
      <StatusMessage
        icon={Info}
        title="Already Submitted"
        description="You have already submitted a response to this survey. Multiple submissions are not allowed."
        buttons={
          <>
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
          </>
        }
      />
    );
  }

  // Submitted state
  if (status === "submitted") {
    return (
      <StatusMessage
        icon={CheckCircle2}
        title="Response Submitted!"
        description="Thank you for completing this survey. Your response has been recorded."
        iconColor="text-primary"
        buttons={
          <>
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
          </>
        }
      />
    );
  }

  // Active survey - render form
  if (!survey || parsedQuestions.length === 0) {
    return null;
  }

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
                    onChange={(value) =>
                      handleAnswerChange(question._id, value)
                    }
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
