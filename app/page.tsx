"use client";

import { QrCode } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { VCardForm } from "./components/VCardForm";
import { QRCodePreview } from "./components/QRCodePreview";
import { VCardFormData } from "./types";
import { generateVCardData } from "./utils/vcard";

export default function Home() {
  const [qrCode, setQrCode] = useState<string>("");
  const { register, watch } = useForm<VCardFormData>();
  const formValues = watch();

  useEffect(() => {
    const generateQRCode = async () => {
      const vCardData = generateVCardData(formValues);

      try {
        const url = await QRCode.toDataURL(vCardData, {
          margin: 1,
          width: 256,
          errorCorrectionLevel: 'L',
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
        setQrCode(url);
      } catch (err) {
        console.error("Error generating QR code:", err);
      }
    };

    generateQRCode();
  }, [formValues]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <QrCode className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            vCard QR Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Create your digital business card in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <VCardForm register={register} />
          </div>
          <QRCodePreview qrCode={qrCode} />
        </div>
      </div>
    </main>
  );
}