"use client";

import { useQuery } from "convex/react";
import { AlertCircle, ArrowLeft, Download, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { questionTypeRegistry } from "@/lib/questions/init";
import type { BaseQuestion } from "@/types/questions";
import { api } from "../../../../../convex/_generated/api";

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const adminCode = params.code as string;

  const survey = useQuery(api.surveys.getByAdminCode, { adminCode });
  const questions = useQuery(
    api.questions.getBySurvey,
    survey ? { surveyId: survey._id } : "skip",
  );
  const responses = useQuery(
    api.responses.getBySurvey,
    survey ? { surveyId: survey._id, adminCode } : "skip",
  );

  if (
    survey === undefined ||
    questions === undefined ||
    responses === undefined
  ) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

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
            <CardDescription>
              The admin code you entered is invalid or doesn't match any survey.
            </CardDescription>
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

  // Parse questions and responses
  const parsedQuestions: BaseQuestion[] = questions.map((q) => ({
    ...q,
    config: JSON.parse(q.config),
  }));

  const parsedResponses = responses.map((r) => ({
    ...r,
    answers: JSON.parse(r.answers),
  }));

  // Group responses by question
  const responsesByQuestion = parsedQuestions.map((question) => {
    const questionResponses = parsedResponses
      .map((response) => {
        const answer = response.answers.find(
          (a: any) => a.questionId === question._id,
        );
        return answer ? { value: answer.value } : null;
      })
      .filter((r) => r !== null);

    return {
      question,
      responses: questionResponses,
    };
  });

  const handleExportCSV = () => {
    // Create CSV header
    const headers = [
      "Response ID",
      "Submitted At",
      ...parsedQuestions.map((q) => q.title),
    ];

    // Create CSV rows
    const rows = parsedResponses.map((response, index) => {
      const row = [
        index + 1,
        new Date(response.submittedAt).toLocaleString(),
        ...parsedQuestions.map((question) => {
          const answer = response.answers.find(
            (a: any) => a.questionId === question._id,
          );
          if (!answer) return "";

          if (Array.isArray(answer.value)) {
            return `"${answer.value.join(", ")}"`;
          }
          return `"${answer.value}"`;
        }),
      ];
      return row.join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");

    // Download CSV
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${survey.title.replace(/[^a-z0-9]/gi, "_")}_results.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.push(`/admin/${adminCode}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">{survey.title}</h1>
              <p className="text-muted-foreground mt-1">Survey Results</p>
            </div>
            {responses.length > 0 && (
              <Button onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-base">
              {responses.length}{" "}
              {responses.length === 1 ? "Response" : "Responses"}
            </Badge>
            <Badge variant="outline" className="text-base">
              {questions.length}{" "}
              {questions.length === 1 ? "Question" : "Questions"}
            </Badge>
          </div>
        </div>

        {/* No Responses State */}
        {responses.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No responses yet. Share your survey URL to start collecting
              responses.
            </AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {responses.length > 0 && (
          <div className="space-y-6">
            {responsesByQuestion.map(
              ({ question, responses: questionResponses }) => {
                const questionDef = questionTypeRegistry.get(question.type);
                if (!questionDef) return null;

                const ResultsComponent = questionDef.ResultsComponent;

                return (
                  <Card key={question._id}>
                    <CardContent className="pt-6">
                      <ResultsComponent
                        question={question}
                        responses={questionResponses}
                      />
                    </CardContent>
                  </Card>
                );
              },
            )}
          </div>
        )}
      </div>
    </div>
  );
}
