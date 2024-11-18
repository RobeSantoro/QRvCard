import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

interface QRCodePreviewProps {
  qrCode: string;
}

export function QRCodePreview({ qrCode }: QRCodePreviewProps) {
  const handlePngDownload = () => {
    if (qrCode) {
      const link = document.createElement('a');
      link.href = qrCode;
      link.download = 'vcard-qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 lg:sticky lg:top-4">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        QR Code Preview
      </h2>
      <div className="flex items-center justify-center p-4 bg-white rounded-lg">
        {qrCode ? (
          <img
            src={qrCode}
            alt="QR Code"
            className="w-64 h-64"
          />
        ) : (
          <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">Enter your details to generate QR code</p>
          </div>
        )}
      </div>
      <div className="mt-6 space-y-3">
        <Button 
          className="w-full" 
          onClick={() => window.print()}
          variant="outline"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button 
          className="w-full" 
          onClick={handlePngDownload}
          variant="secondary"
          disabled={!qrCode}
        >
          <Download className="mr-2 h-4 w-4" />
          Download PNG
        </Button>
      </div>
    </div>
  );
}