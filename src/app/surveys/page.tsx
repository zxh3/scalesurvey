"use client";

import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";
import {
  BarChart3,
  CheckCircle2,
  Copy,
  ExternalLink,
  Settings,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db, type LocalSurvey, updateSurveyAccess } from "@/lib/db";
import { api } from "../../../convex/_generated/api";

// Component to fetch and display live survey status
function SurveyCard({
  survey,
  onDelete,
}: {
  survey: LocalSurvey;
  onDelete: (survey: LocalSurvey) => void;
}) {
  const [copiedCode, setCopiedCode] = useState(false);

  // Fetch live survey data from Convex
  const liveData = useQuery(api.surveys.getByAdminCode, {
    adminCode: survey.adminCode,
  });

  const handleAccessSurvey = async (surveyId: string) => {
    await updateSurveyAccess(surveyId);
  };

  const handleCopyAdminCode = async (adminCode: string) => {
    try {
      await navigator.clipboard.writeText(adminCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      console.error("Failed to copy admin code:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "secondary";
      case "published":
        return "default";
      case "closed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Use live status if available, otherwise fall back to local status
  const displayStatus = liveData?.status || survey.status;

  return (
    <Card className="group hover:shadow-md transition-shadow flex flex-col">
      <CardContent className="p-5 flex flex-col flex-1">
        <div className="space-y-3 flex flex-col flex-1">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-base font-semibold truncate">
                  {survey.title}
                </h3>
                <Badge
                  variant={getStatusColor(displayStatus)}
                  className="shrink-0 text-xs"
                >
                  {displayStatus}
                </Badge>
              </div>
              {survey.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {survey.description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(survey)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Survey URL */}
          <div className="space-y-2 pt-2 border-t text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="font-medium shrink-0">Survey URL:</span>
              <code className="flex-1 px-1.5 py-0.5 bg-muted rounded font-mono text-[10px] truncate">
                {typeof window !== "undefined"
                  ? `${window.location.origin}/survey/${survey.key}`
                  : `/survey/${survey.key}`}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 shrink-0"
                onClick={() => {
                  const url = `${window.location.origin}/survey/${survey.key}`;
                  navigator.clipboard.writeText(url);
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 shrink-0"
                asChild
              >
                <Link
                  href={`/survey/${survey.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Info Grid */}
          <div className="space-y-2 pt-2 border-t text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="font-medium shrink-0">Admin Code:</span>
              <code className="px-1.5 py-0.5 bg-muted rounded font-mono text-[10px] truncate">
                {survey.adminCode}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 shrink-0 ml-auto"
                onClick={() => handleCopyAdminCode(survey.adminCode)}
              >
                {copiedCode ? (
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <div className="text-muted-foreground pt-1">
              <div>
                Created {formatDistanceToNow(survey.createdAt, { addSuffix: true })}
              </div>
              <div className="text-[10px] opacity-70">
                Accessed{" "}
                {formatDistanceToNow(survey.lastAccessedAt, { addSuffix: true })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2 border-t mt-auto">
            <Button
              variant="default"
              size="sm"
              className="w-full"
              asChild
              onClick={() => handleAccessSurvey(survey.surveyId)}
            >
              <Link href={`/admin/${survey.adminCode}`}>
                <Settings className="h-3.5 w-3.5 mr-2" />
                Admin Panel
              </Link>
            </Button>
            {displayStatus === "closed" && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                asChild
                onClick={() => handleAccessSurvey(survey.surveyId)}
              >
                <Link href={`/admin/${survey.adminCode}/results`}>
                  <BarChart3 className="h-3.5 w-3.5 mr-2" />
                  View Results
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MySurveysPage() {
  const surveys = useLiveQuery(() =>
    db.surveys.orderBy("lastAccessedAt").reverse().toArray(),
  );
  const [surveyToDelete, setSurveyToDelete] = useState<LocalSurvey | null>(
    null,
  );

  const handleDelete = async () => {
    if (surveyToDelete?.id) {
      await db.surveys.delete(surveyToDelete.id);
      setSurveyToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container max-w-5xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Surveys</h1>
          <p className="text-muted-foreground mt-2">
            Access and manage your surveys
          </p>
        </div>

        {/* Surveys List */}
        {!surveys || surveys.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16">
              <div className="text-center">
                <p className="text-muted-foreground mb-6">
                  You haven't created any surveys yet.
                </p>
                <Button asChild size="lg">
                  <Link href="/create">Create Your First Survey</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {surveys.map((survey) => (
              <SurveyCard
                key={survey.id}
                survey={survey}
                onDelete={setSurveyToDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!surveyToDelete}
        onOpenChange={() => setSurveyToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete survey from local storage?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will only remove the survey from your local device. The
              survey data will remain on the server and can still be accessed
              with the admin code.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
