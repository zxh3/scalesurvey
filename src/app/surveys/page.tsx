"use client";

import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, LocalSurvey, updateSurveyAccess } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
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

export default function MySurveysPage() {
  const surveys = useLiveQuery(() => db.surveys.orderBy('lastAccessedAt').reverse().toArray());
  const [surveyToDelete, setSurveyToDelete] = useState<LocalSurvey | null>(null);

  const getStatusColor = (status: LocalSurvey['status']) => {
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
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  You haven't created any surveys yet.
                </p>
                <Button asChild>
                  <Link href="/create">Create Your First Survey</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {surveys.map((survey) => (
              <Card key={survey.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle>{survey.title}</CardTitle>
                        <Badge variant={getStatusColor(survey.status)}>
                          {survey.status}
                        </Badge>
                      </div>
                      {survey.description && (
                        <CardDescription className="mt-2">
                          {survey.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>
                        Created {formatDistanceToNow(survey.createdAt, { addSuffix: true })}
                      </div>
                      <div>
                        Last accessed {formatDistanceToNow(survey.lastAccessedAt, { addSuffix: true })}
                      </div>
                      <div className="font-mono text-xs bg-muted px-2 py-1 rounded inline-block">
                        Survey Key: {survey.key}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
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
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        onClick={() => handleAccessSurvey(survey.surveyId)}
                      >
                        <Link href={`/admin/${survey.adminCode}`}>
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSurveyToDelete(survey)}
                      >
                        <Trash2 className="h-4 w-4" />
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
      <AlertDialog open={!!surveyToDelete} onOpenChange={() => setSurveyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete survey from local storage?</AlertDialogTitle>
            <AlertDialogDescription>
              This will only remove the survey from your local device. The survey data
              will remain on the server and can still be accessed with the admin code.
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
