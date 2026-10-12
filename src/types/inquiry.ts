export interface GemInquiry {
  id?: string;
  gemId?: string;
  gemName?: string;
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  message: string;
  preferredCurrency: "USD" | "LKR";
  status?: "pending" | "contacted" | "completed";
  createdAt?: string;
}

export interface CheckoutDetails {
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  city: string;
  country: string;
  notes?: string;
  items: {
    gemId: string;
    gemName: string;
    price: number;
  }[];
  totalAmount: number;
}
