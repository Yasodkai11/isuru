import { z } from "zod";

export const wholesaleSchema = z.object({
  companyName: z.string().min(2, "Company / Atelier name is required"),
  contactName: z.string().min(2, "Representative name is required"),
  email: z.string().email("Valid business email is required"),
  phone: z.string().min(5, "Telephone or WhatsApp is required for business correspondence"),
  country: z.string().min(2, "Country is required"),
  parcelType: z.string().min(2, "Please select desired parcel type"),
  targetVolume: z.string().min(2, "Please select target volume / carat weight"),
  targetBudget: z.string().optional(),
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
});

export type WholesaleInput = z.infer<typeof wholesaleSchema>;
