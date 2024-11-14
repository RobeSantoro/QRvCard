import { VCardFormData } from "../types";

export function generateVCardData(formValues: VCardFormData): string {
  return `BEGIN:VCARD
VERSION:3.0
N:${formValues.lastName || ""};${formValues.firstName || ""};;;
FN:${formValues.firstName || ""} ${formValues.lastName || ""}
TITLE:${formValues.jobTitle || ""}
ORG:${formValues.company || ""}
TEL:${formValues.phone || ""}
EMAIL:${formValues.email || ""}
URL:${formValues.website || ""}
END:VCARD`;
}