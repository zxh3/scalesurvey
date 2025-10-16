"use client";

import { formatDistanceToNow } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";
import {
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db, type LocalSurvey, updateSurveyAccess } from "@/lib/db";

export default function MySurveysPage() {
  const surveys = useLiveQuery(() =>
    db.surveys.orderBy("lastAccessedAt").reverse().toArray(),
  );
  const [surveyToDelete, setSurveyToDelete] = useState<LocalSurvey | null>(
    null,
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const getStatusColor = (status: LocalSurvey["status"]) => {
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

  const handleDelete = async () => {
    if (surveyToDelete?.id) {
      await db.surveys.delete(surveyToDelete.id);
      setSurveyToDelete(null);
    }
  };

  const handleAccessSurvey = async (surveyId: string) => {
    await updateSurveyAccess(surveyId);
  };

  const handleCopyAdminCode = async (adminCode: string) => {
    try {
      await navigator.clipboard.writeText(adminCode);
      setCopiedCode(adminCode);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error("Failed to copy admin code:", error);
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
          <div className="grid gap-6">
            {surveys.map((survey) => (
              <Card key={survey.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header Section */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold truncate">
                            {survey.title}
                          </h3>
                          <Badge
                            variant={getStatusColor(survey.status)}
                            className="shrink-0"
                          >
                            {survey.status}
                          </Badge>
                        </div>
                        {survey.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {survey.description}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-9 w-9 text-muted-foreground hover:text-destructive"
                        onClick={() => setSurveyToDelete(survey)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium">Survey Key:</span>
                        <code className="px-2 py-1 bg-muted rounded font-mono">
                          {survey.key}
                        </code>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium">Admin Code:</span>
                        <code className="px-2 py-1 bg-muted rounded font-mono">
                          {survey.adminCode}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => handleCopyAdminCode(survey.adminCode)}
                        >
                          {copiedCode === survey.adminCode ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Created:</span>{" "}
                        {formatDistanceToNow(survey.createdAt, {
                          addSuffix: true,
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Last accessed:</span>{" "}
                        {formatDistanceToNow(survey.lastAccessedAt, {
                          addSuffix: true,
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        asChild
                        onClick={() => handleAccessSurvey(survey.surveyId)}
                      >
                        <Link href={`/admin/${survey.adminCode}`}>
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                        onClick={() => handleAccessSurvey(survey.surveyId)}
                      >
                        <Link
                          href={`/survey/${survey.key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Survey
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
