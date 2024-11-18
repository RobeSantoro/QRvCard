import { VCardFormData } from "../types";

export function generateVCardData(formValues: VCardFormData): string {
  // Clean and format the values, replacing undefined/null with empty strings
  const firstName = formValues.firstName?.trim() || "";
  const lastName = formValues.lastName?.trim() || "";
  const phone = formValues.phone?.trim() || "";
  const jobTitle = formValues.jobTitle?.trim() || "";
  const company = formValues.company?.trim() || "";
  const email = formValues.email?.trim() || "";
  const website = formValues.website?.trim() || "";

  return `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};;;
FN:${firstName} ${lastName}
TITLE:${jobTitle}
ORG:${company}
TEL:${phone}
EMAIL:${email}
URL:${website}
END:VCARD`;
}