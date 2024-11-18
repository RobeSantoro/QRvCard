"use client";

import { QrCode } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { VCardForm } from "./components/VCardForm";
import { LinkForm } from "./components/LinkForm";
import { QRCodePreview } from "./components/QRCodePreview";
import { QRType, VCardFormData, LinkFormData } from "./types";
import { generateVCardData } from "./utils/vcard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [qrCode, setQrCode] = useState<string>("");
  const [qrType, setQRType] = useState<QRType>("vcard");
  const { register: registerVCard, watch: watchVCard } = useForm<VCardFormData>();
  const { register: registerLink, watch: watchLink } = useForm<LinkFormData>();
  
  const vCardValues = watchVCard();
  const linkValues = watchLink();

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        let content = "";
        
        if (qrType === "vcard") {
          // Only generate vCard if at least one field has content
          const hasContent = Object.values(vCardValues).some(value => value?.trim());
          if (hasContent) {
            content = generateVCardData(vCardValues);
          }
        } else {
          // For links, only generate if URL is valid
          const url = linkValues.url?.trim();
          if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            content = url;
          }
        }

        if (content) {
          const url = await QRCode.toDataURL(content, {
            margin: 1,
            width: 400,
            color: {
              dark: '#000000',
              light: '#ffffff',
            },
          });
          setQrCode(url);
        } else {
          setQrCode("");
        }
      } catch (err) {
        console.error("Error generating QR code:", err);
        setQrCode("");
      }
    };

    generateQRCode();
  }, [qrType, vCardValues, linkValues]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <QrCode className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            QR Generator
          </h1>
          <div className="max-w-xs mx-auto mb-4">
            <Select value={qrType} onValueChange={(value: QRType) => setQRType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select QR type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vcard">Digital Business Card (vCard)</SelectItem>
                <SelectItem value="link">Simple Link</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {qrType === "vcard" ? (
              <VCardForm register={registerVCard} />
            ) : (
              <LinkForm register={registerLink} />
            )}
          </div>
          <QRCodePreview qrCode={qrCode} />
        </div>
      </div>
    </main>
  );
}