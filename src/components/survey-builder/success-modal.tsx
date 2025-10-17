"use client";

import { AlertTriangle, Check, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QRCodeDisplay } from "@/components/qr-code-display";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  adminCode: string;
  surveyKey: string;
}

export function SuccessModal({
  open,
  onClose,
  adminCode,
  surveyKey,
}: SuccessModalProps) {
  const router = useRouter();
  const [copiedAdmin, setCopiedAdmin] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const surveyUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/survey/${surveyKey}`;
  const displayUrl = `${typeof window !== "undefined" ? window.location.host : ""}/survey/${surveyKey}`;

  const copyToClipboard = async (text: string, type: "admin" | "url") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "admin") {
        setCopiedAdmin(true);
        setTimeout(() => setCopiedAdmin(false), 2000);
      } else {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      }
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleManageSurvey = () => {
    router.push(`/admin/${adminCode}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Survey Created Successfully!</DialogTitle>
          <DialogDescription>
            Your survey has been created. Save your admin code to manage your
            survey later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Warning */}
          <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Save your admin code!</p>
              <p className="text-sm text-muted-foreground">
                This code cannot be recovered. You'll need it to edit or view
                results for your survey.
              </p>
            </div>
          </div>

          {/* Admin Code */}
          <div className="space-y-2">
            <Label htmlFor="admin-code">Admin Code</Label>
            <div className="flex gap-2">
              <Input
                id="admin-code"
                value={adminCode}
                readOnly
                className="font-mono text-lg"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(adminCode, "admin")}
              >
                {copiedAdmin ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Survey URL */}
          <div className="space-y-2">
            <Label htmlFor="survey-url">Survey URL</Label>
            <div className="flex gap-2">
              <Input
                id="survey-url"
                value={displayUrl}
                readOnly
                className="font-mono"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(surveyUrl, "url")}
              >
                {copiedUrl ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this URL with participants
            </p>
          </div>

          {/* QR Code */}
          <QRCodeDisplay
            value={surveyUrl}
            title="Share via QR Code"
            showUrl={false}
            size={180}
            downloadFileName={`survey-${surveyKey}-qr.png`}
          />

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Create Another Survey
            </Button>
            <Button className="flex-1" onClick={handleManageSurvey}>
              Manage Survey
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
