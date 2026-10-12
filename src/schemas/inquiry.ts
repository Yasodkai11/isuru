import { z } from "zod";

export const inquirySchema = z.object({
  gemId: z.string().optional(),
  gemName: z.string().optional(),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().optional(),
  country: z.string().min(2, "Please provide your country/region"),
  message: z.string().min(10, "Please provide specific inquiry details (minimum 10 characters)"),
  preferredCurrency: z.enum(["USD", "LKR"]).default("USD"),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
