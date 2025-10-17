"use client";

import { Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface QRCodeDisplayProps {
  value: string;
  title?: string;
  showUrl?: boolean;
  size?: number;
  downloadFileName?: string;
}

export function QRCodeDisplay({
  value,
  title = "Scan QR Code",
  showUrl = true,
  size = 200,
  downloadFileName = "qr-code.png",
}: QRCodeDisplayProps) {
  const qrRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = () => {
    const canvas = qrRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <Card className="p-6 flex flex-col items-center gap-4">
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">
          Scan with your phone to access the survey
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg">
        <QRCodeCanvas
          ref={qrRef}
          value={value}
          size={size}
          level="H"
          includeMargin={true}
        />
      </div>

      {showUrl && (
        <div className="text-center max-w-full">
          <p className="text-xs text-muted-foreground break-all">{value}</p>
        </div>
      )}

      <Button onClick={handleDownload} variant="outline" className="w-full">
        <Download className="mr-2 h-4 w-4" />
        Download QR Code
      </Button>
    </Card>
  );
}
