import { Gemstone } from "./gem";

export type OrderStatus =
  | "pending_verification"
  | "escrow_funded"
  | "customs_clearance"
  | "dispatched"
  | "delivered"
  | "cancelled";

export interface AdminOrderItem {
  gemId: string;
  name: string;
  variety: string;
  carat: number;
  price: number;
  image: string;
  certificateLab?: string;
  certificateNumber?: string;
}

export interface AdminOrder {
  id: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  city: string;
  country: string;
  postalCode?: string;
  totalAmount: number;
  currency: "USD" | "LKR";
  status: OrderStatus;
  paymentMethod: string;
  items: AdminOrderItem[];
  trackingCarrier?: string;
  trackingNumber?: string;
  notes?: string;
  customsDeclarationNumber?: string;
}

export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  image: string;
  varietyQuery?: string;
  productCount: number;
  featured: boolean;
  sortOrder: number;
}

export type EnquiryStatus = "pending" | "in_progress" | "replied" | "archived";
export type EnquiryType = "gem_consultation" | "wholesale_parcel" | "private_viewing" | "custom_cut";

export interface AdminEnquiry {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  gemId?: string;
  gemName?: string;
  type: EnquiryType;
  message: string;
  preferredCurrency: string;
  status: EnquiryStatus;
  replyNotes?: string;
  repliedAt?: string;
}

export type CustomerTier = "vip_collector" | "premier_connoisseur" | "trade_jeweller" | "private_client";

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  tier: CustomerTier;
  totalSpent: number;
  ordersCount: number;
  firstAcquisitionDate: string;
  lastAcquisitionDate: string;
  preferredVarieties: string[];
  notes?: string;
}

export type MediaType = "gem_photo" | "certificate_pdf" | "video" | "vault";

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: MediaType;
  size: string;
  dimensions?: string;
  format: string;
  createdAt: string;
  associatedGemSlug?: string;
  tag: string;
}

export interface AdminSEORecord {
  id: string;
  pagePath: string;
  pageTitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl: string;
  schemaType: "Product" | "CollectionPage" | "Organization" | "AboutPage" | "ContactPage";
  indexStatus: "indexed" | "noindex";
  lastAudited: string;
}

export interface AdminSettingsData {
  storeName: string;
  tagline: string;
  ngjaLicense: string;
  ratnapuraVaultAddress: string;
  colomboShowroomAddress: string;
  primaryEmail: string;
  conciergePhone: string;
  whatsappNumber: string;
  baseCurrency: "USD";
  exchangeRates: {
    USD: number;
    LKR: number;
    EUR: number;
    GBP: number;
    AED: number;
    SGD: number;
  };
  autoSyncRates: boolean;
  secureCourierPartners: string[];
  defaultEscrowDays: number;
  emailNotifications: {
    newOrder: boolean;
    newEnquiry: boolean;
    lowInventory: boolean;
    dailyDigest: boolean;
  };
  vatGstRate: number;
  customsExportFeeUsd: number;
}

export type StaffRole =
  | "super_admin"
  | "vault_custodian"
  | "gemologist"
  | "concierge_agent"
  | "inventory_clerk";

export type StaffStatus = "active" | "inactive" | "suspended";

export interface AdminStaffMember {
  id: string;
  authUserId?: string;
  fullName: string;
  email: string;
  role: StaffRole;
  department: string;
  phone?: string;
  status: StaffStatus;
  canManageGems: boolean;
  canManageOrders: boolean;
  canManageStaff: boolean;
  canExportData: boolean;
  lastLogin?: string;
  createdAt: string;
  notes?: string;
}
