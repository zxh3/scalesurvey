"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Key } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export default function AccessPage() {
  const router = useRouter();
  const [adminCode, setAdminCode] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");

  // Format admin code with dash
  const handleCodeChange = (value: string) => {
    // Remove any non-alphanumeric characters
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

    // Add dash after 4 characters
    if (cleaned.length > 4) {
      setAdminCode(cleaned.slice(0, 4) + "-" + cleaned.slice(4, 8));
    } else {
      setAdminCode(cleaned);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (adminCode.length < 9) {
      setError("Please enter a valid admin code");
      return;
    }

    setIsChecking(true);

    try {
      // The query will be executed when we navigate, but we can check format first
      router.push(`/admin/${adminCode}`);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-3.5rem)]">
        <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Key className="h-5 w-5 text-primary" />
            <CardTitle>Access Your Survey</CardTitle>
          </div>
          <CardDescription>
            Enter your admin code to manage your survey and view results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-code">Admin Code</Label>
              <Input
                id="admin-code"
                type="text"
                placeholder="XXXX-XXXX"
                value={adminCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                maxLength={9}
                className="text-center text-lg font-mono tracking-wider"
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">
                Enter the 8-character code you received when creating the survey
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isChecking || adminCode.length < 9}>
              {isChecking ? "Checking..." : "Access Survey"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Don't have an admin code?
            </p>
            <Button variant="outline" onClick={() => router.push("/create")}>
              Create New Survey
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
