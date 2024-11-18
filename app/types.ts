export type QRType = 'vcard' | 'link';

export interface VCardFormData {
  firstName: string;
  lastName: string;
  phone: string;
  jobTitle: string;
  company: string;
  email: string;
  website: string;
}

export interface LinkFormData {
  url: string;
}