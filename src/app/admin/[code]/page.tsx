"use client";

import { useMutation, useQuery } from "convex/react";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Send,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getSurveyBySurveyId,
  saveSurvey,
  updateSurveyAccess,
  updateSurveyStatus,
} from "@/lib/db";
import { api } from "../../../../convex/_generated/api";

export default function AdminDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const adminCode = params.code as string;

  const survey = useQuery(api.surveys.getByAdminCode, { adminCode });
  const questions = useQuery(
    api.questions.getBySurvey,
    survey ? { surveyId: survey._id } : "skip",
  );
  const responseCount = useQuery(
    api.responses.getCount,
    survey ? { surveyId: survey._id } : "skip",
  );

  const publishSurvey = useMutation(api.surveys.publish);
  const closeSurvey = useMutation(api.surveys.close);

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Save survey to local database when accessed via admin code
  useEffect(() => {
    const saveSurveyToLocal = async () => {
      if (!survey) return;

      try {
        // Check if survey already exists in local DB
        const existingSurvey = await getSurveyBySurveyId(survey._id);

        if (existingSurvey) {
          // Survey exists, update the last accessed time and status
          await updateSurveyStatus(survey._id, survey.status);
        } else {
          // Survey doesn't exist, save it
          await saveSurvey({
            surveyId: survey._id,
            adminCode: adminCode,
            key: survey.key,
            title: survey.title,
            description: survey.description,
            status: survey.status,
            createdAt: survey._creationTime,
          });
        }
      } catch (error) {
        console.error("Failed to save survey to local database:", error);
      }
    };

    saveSurveyToLocal();
  }, [survey, adminCode]);

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

  const surveyUrl = `${window.location.origin}/survey/${survey.key}`;

  const getStatusBadge = () => {
    switch (survey.status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "published":
        return <Badge variant="default">Published</Badge>;
      case "closed":
        return <Badge variant="outline">Closed</Badge>;
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handlePublish = async () => {
    if (!survey) return;

    setIsPublishing(true);
    try {
      await publishSurvey({
        surveyId: survey._id,
        adminCode,
      });
    } catch (error) {
      console.error("Failed to publish:", error);
      alert("Failed to publish survey. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleClose = async () => {
    if (!survey) return;

    if (
      !confirm(
        "Are you sure you want to close this survey? It will stop accepting responses.",
      )
    ) {
      return;
    }

    setIsClosing(true);
    try {
      await closeSurvey({
        surveyId: survey._id,
        adminCode,
      });
    } catch (error) {
      console.error("Failed to close:", error);
      alert("Failed to close survey. Please try again.");
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container max-w-5xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">{survey.title}</h1>
            {getStatusBadge()}
          </div>
          {survey.description && (
            <p className="text-muted-foreground">{survey.description}</p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Total Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{questions?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Total Responses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{responseCount || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {survey.status}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Survey URL */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Survey URL</CardTitle>
            <CardDescription>
              Share this URL with participants to collect responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                type="text"
                value={surveyUrl}
                readOnly
                className="flex-1 px-3 py-2 border rounded-md bg-muted font-mono text-sm"
              />
              <Button variant="outline" size="icon" onClick={copyUrl}>
                {copiedUrl ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(surveyUrl, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Info */}
        {(survey.startDate || survey.endDate) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {survey.startDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Starts:</span>
                  <span>{new Date(survey.startDate).toLocaleString()}</span>
                </div>
              )}
              {survey.endDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Ends:</span>
                  <span>{new Date(survey.endDate).toLocaleString()}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {survey.status === "draft" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/admin/${adminCode}/edit`)}
                >
                  Edit Survey
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={
                    isPublishing || !questions || questions.length === 0
                  }
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isPublishing ? "Publishing..." : "Publish Survey"}
                </Button>
                {questions && questions.length === 0 && (
                  <p className="text-sm text-muted-foreground w-full text-center">
                    Add at least one question before publishing
                  </p>
                )}
              </>
            )}

            {survey.status === "published" && (
              <>
                <Button
                  onClick={() => router.push(`/admin/${adminCode}/results`)}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Results
                </Button>

                <Button
                  variant="destructive"
                  onClick={handleClose}
                  disabled={isClosing}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {isClosing ? "Closing..." : "Close Survey"}
                </Button>
              </>
            )}

            {survey.status === "closed" && (
              <Button
                onClick={() => router.push(`/admin/${adminCode}/results`)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Results
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => router.push("/")}
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
