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
  const [qrCodeSvg, setQrCodeSvg] = useState<string>("");
  const [qrType, setQRType] = useState<QRType>("vcard");
  const [qrStyle, setQrStyle] = useState<"positive" | "negative">("positive");
  const { register: registerVCard, watch: watchVCard } = useForm<VCardFormData>();
  const { register: registerLink, watch: watchLink } = useForm<LinkFormData>();
  
  const vCardValues = watchVCard();
  const linkValues = watchLink();

  const getThemeColors = () => {
    // Get computed styles to access the actual color values
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Get the actual color values from CSS variables
    const foreground = computedStyle.getPropertyValue('--foreground').trim();
    const background = computedStyle.getPropertyValue('--background').trim();
    
    // Convert HSL values to RGB
    const hslToRgb = (hsl: string) => {
      // Parse the HSL string which is in format "H S% L%"
      const [h, s, l] = hsl.split(' ').map(val => {
        // Remove % sign and convert to number
        const num = parseFloat(val.replace('%', ''));
        // For hue, just return the number
        if (val.includes('%')) {
          return num / 100; // Convert percentage to decimal
        }
        return num;
      });
      
      const s1 = s;
      const l1 = l;
      
      const c = (1 - Math.abs(2 * l1 - 1)) * s1;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l1 - c / 2;
      
      let r, g, b;
      if (h < 60) [r, g, b] = [c, x, 0];
      else if (h < 120) [r, g, b] = [x, c, 0];
      else if (h < 180) [r, g, b] = [0, c, x];
      else if (h < 240) [r, g, b] = [0, x, c];
      else if (h < 300) [r, g, b] = [x, 0, c];
      else [r, g, b] = [c, 0, x];
      
      const toHex = (n: number) => {
        const hex = Math.round((n + m) * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };

      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    // For debugging
    console.log('Foreground HSL:', foreground);
    console.log('Background HSL:', background);
    const fgColor = hslToRgb(foreground);
    const bgColor = hslToRgb(background);
    console.log('Foreground RGB:', fgColor);
    console.log('Background RGB:', bgColor);

    return {
      foreground: fgColor,
      background: bgColor
    };
  };

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrData = qrType === "vcard" ? generateVCardData(vCardValues) : linkValues.url;
        if (!qrData) {
          setQrCode("");
          setQrCodeSvg("");
          return;
        }
        // Always use true black and white for QR code
        const black = "#000000";
        const white = "#ffffff";
        // Positive: black on white, Negative: white on black
        const darkColor = qrStyle === "positive" ? black : white;
        const lightColor = qrStyle === "positive" ? white : black;
        // Generate PNG QR code
        const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
          width: 400,
          margin: 1,
          color: {
            dark: darkColor,
            light: lightColor,
          },
        });
        setQrCode(qrCodeDataUrl);
        // Generate SVG QR code
        const qrCodeSvgString = await QRCode.toString(qrData, {
          type: "svg",
          width: 400,
          margin: 1,
          color: {
            dark: darkColor,
            light: lightColor,
          },
        });
        setQrCodeSvg(qrCodeSvgString);
      } catch (error) {
        console.error("Error generating QR code:", error);
        setQrCode("");
        setQrCodeSvg("");
      }
    };
    generateQRCode();
  }, [qrType, qrStyle, vCardValues, linkValues]);

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <QrCode className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold text-foreground mb-4">
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
          <div className="bg-card text-card-foreground rounded-xl shadow-lg p-6">
            {qrType === "vcard" ? (
              <VCardForm register={registerVCard} />
            ) : (
              <LinkForm register={registerLink} />
            )}
          </div>
          <QRCodePreview
            qrCode={qrCode}
            qrCodeSvg={qrCodeSvg}
            qrType={qrType}
            vCardData={vCardValues}
            linkData={linkValues}
            onStyleChange={setQrStyle}
          />
        </div>
      </div>
    </main>
  );
}