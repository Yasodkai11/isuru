import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email address is required for certificate delivery"),
  phone: z.string().min(7, "Direct telephone number is required for insured courier delivery"),
  address: z.string().min(5, "Delivery address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  specialInstructions: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  itemIds: z.array(z.string()).min(1, "At least one gemstone must be in your order"),
  paymentMethod: z.enum(["bank_wire", "secure_escrow", "crypto", "concierge_card"]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
