"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Gemstone } from "@/types/gem";
import {
  AdminCategory,
  AdminOrder,
  OrderStatus,
  AdminEnquiry,
  EnquiryStatus,
  AdminCustomer,
  MediaAsset,
  AdminSEORecord,
  AdminSettingsData,
  AdminStaffMember,
} from "@/types/admin";
import { CATALOG_GEMS } from "@/lib/catalog-gems";
import {
  INITIAL_ADMIN_CATEGORIES,
  INITIAL_ADMIN_ORDERS,
  INITIAL_ADMIN_ENQUIRIES,
  INITIAL_ADMIN_CUSTOMERS,
  INITIAL_ADMIN_MEDIA,
  INITIAL_ADMIN_SEO,
  INITIAL_ADMIN_SETTINGS,
  INITIAL_ADMIN_STAFF,
} from "@/lib/admin-seed";

export interface AdminState {
  gemstones: Gemstone[];
  categories: AdminCategory[];
  orders: AdminOrder[];
  enquiries: AdminEnquiry[];
  customers: AdminCustomer[];
  mediaAssets: MediaAsset[];
  seoRecords: AdminSEORecord[];
  settings: AdminSettingsData;

  // Products CRUD
  setGemstones: (gemstones: Gemstone[]) => void;
  addGemstone: (gem: Gemstone) => void;
  updateGemstone: (id: string, partial: Partial<Gemstone>) => void;
  deleteGemstone: (id: string) => void;
  toggleStock: (id: string) => void;
  toggleFeatured: (id: string) => void;

  // Categories CRUD
  addCategory: (category: AdminCategory) => void;
  updateCategory: (id: string, partial: Partial<AdminCategory>) => void;
  deleteCategory: (id: string) => void;

  // Orders Workflow
  setOrders: (orders: AdminOrder[]) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderTracking: (orderId: string, carrier: string, trackingNumber: string) => void;
  addOrder: (order: AdminOrder) => void;
  deleteOrder: (orderId: string) => void;

  // Enquiries Workflow
  setEnquiries: (enquiries: AdminEnquiry[]) => void;
  updateEnquiryStatus: (id: string, status: EnquiryStatus, replyNotes?: string) => void;
  deleteEnquiry: (id: string) => void;

  // Customers
  updateCustomerNotes: (id: string, notes: string) => void;
  addCustomer: (customer: AdminCustomer) => void;

  // Media
  addMediaAsset: (asset: MediaAsset) => void;
  deleteMediaAsset: (id: string) => void;

  // SEO
  updateSEORecord: (id: string, partial: Partial<AdminSEORecord>) => void;

  // Settings
  updateSettings: (partial: Partial<AdminSettingsData>) => void;

  // Staff & Access Control
  staff: AdminStaffMember[];
  addStaffMember: (member: AdminStaffMember) => void;
  updateStaffMember: (id: string, partial: Partial<AdminStaffMember>) => void;
  updateStaffCredentials: (id: string, newEmail?: string, notes?: string) => void;
  deleteStaffMember: (id: string) => void;
  toggleStaffStatus: (id: string) => void;

  // Reset to initial defaults
  resetToDefaults: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      gemstones: [...CATALOG_GEMS],
      categories: [...INITIAL_ADMIN_CATEGORIES],
      orders: [...INITIAL_ADMIN_ORDERS],
      enquiries: [...INITIAL_ADMIN_ENQUIRIES],
      customers: [...INITIAL_ADMIN_CUSTOMERS],
      mediaAssets: [...INITIAL_ADMIN_MEDIA],
      seoRecords: [...INITIAL_ADMIN_SEO],
      settings: { ...INITIAL_ADMIN_SETTINGS },
      staff: [...INITIAL_ADMIN_STAFF],

      // Gemstones CRUD
      setGemstones: (gemstones) => {
        set({ gemstones });
      },

      addGemstone: (gem) => {
        set((state) => ({
          gemstones: [gem, ...state.gemstones],
        }));
      },

      updateGemstone: (id, partial) => {
        set((state) => ({
          gemstones: state.gemstones.map((g) => (g.id === id ? { ...g, ...partial } : g)),
        }));
      },

      deleteGemstone: (id) => {
        set((state) => ({
          gemstones: state.gemstones.filter((g) => g.id !== id),
        }));
      },

      toggleStock: (id) => {
        set((state) => ({
          gemstones: state.gemstones.map((g) =>
            g.id === id ? { ...g, inStock: !g.inStock } : g
          ),
        }));
      },

      toggleFeatured: (id) => {
        set((state) => ({
          gemstones: state.gemstones.map((g) =>
            g.id === id ? { ...g, featured: !g.featured } : g
          ),
        }));
      },

      // Categories
      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, category],
        }));
      },

      updateCategory: (id, partial) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...partial } : c)),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },

      // Orders
      setOrders: (orders) => {
        set({ orders });
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        }));
      },

      updateOrderTracking: (orderId, carrier, trackingNumber) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  trackingCarrier: carrier,
                  trackingNumber,
                  status: o.status === "customs_clearance" ? "dispatched" : o.status,
                }
              : o
          ),
        }));
      },

      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }));
      },

      deleteOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== orderId),
        }));
      },

      // Enquiries
      setEnquiries: (enquiries) => {
        set({ enquiries });
      },

      updateEnquiryStatus: (id, status, replyNotes) => {
        set((state) => ({
          enquiries: state.enquiries.map((e) =>
            e.id === id
              ? {
                  ...e,
                  status,
                  replyNotes: replyNotes !== undefined ? replyNotes : e.replyNotes,
                  repliedAt: status === "replied" ? new Date().toISOString() : e.repliedAt,
                }
              : e
          ),
        }));
      },

      deleteEnquiry: (id) => {
        set((state) => ({
          enquiries: state.enquiries.filter((e) => e.id !== id),
        }));
      },

      // Customers
      updateCustomerNotes: (id, notes) => {
        set((state) => ({
          customers: state.customers.map((c) => (c.id === id ? { ...c, notes } : c)),
        }));
      },

      addCustomer: (customer) => {
        set((state) => ({
          customers: [customer, ...state.customers],
        }));
      },

      // Media
      addMediaAsset: (asset) => {
        set((state) => ({
          mediaAssets: [asset, ...state.mediaAssets],
        }));
      },

      deleteMediaAsset: (id) => {
        set((state) => ({
          mediaAssets: state.mediaAssets.filter((m) => m.id !== id),
        }));
      },

      // SEO
      updateSEORecord: (id, partial) => {
        set((state) => ({
          seoRecords: state.seoRecords.map((s) =>
            s.id === id
              ? { ...s, ...partial, lastAudited: new Date().toISOString().split("T")[0] }
              : s
          ),
        }));
      },

      // Settings
      updateSettings: (partial) => {
        set((state) => ({
          settings: { ...state.settings, ...partial },
        }));
      },

      // Staff Management
      addStaffMember: (member) => {
        set((state) => ({
          staff: [member, ...state.staff],
        }));
      },

      updateStaffMember: (id, partial) => {
        set((state) => ({
          staff: state.staff.map((s) => (s.id === id ? { ...s, ...partial } : s)),
        }));
      },

      updateStaffCredentials: (id, newEmail, notes) => {
        set((state) => ({
          staff: state.staff.map((s) =>
            s.id === id
              ? {
                  ...s,
                  ...(newEmail ? { email: newEmail } : {}),
                  ...(notes ? { notes } : {}),
                }
              : s
          ),
        }));
      },

      deleteStaffMember: (id) => {
        set((state) => ({
          staff: state.staff.filter((s) => s.id !== id),
        }));
      },

      toggleStaffStatus: (id) => {
        set((state) => ({
          staff: state.staff.map((s) =>
            s.id === id
              ? {
                  ...s,
                  status: s.status === "active" ? "suspended" : "active",
                }
              : s
          ),
        }));
      },

      // Reset
      resetToDefaults: () => {
        set({
          gemstones: [...CATALOG_GEMS],
          categories: [...INITIAL_ADMIN_CATEGORIES],
          orders: [...INITIAL_ADMIN_ORDERS],
          enquiries: [...INITIAL_ADMIN_ENQUIRIES],
          customers: [...INITIAL_ADMIN_CUSTOMERS],
          mediaAssets: [...INITIAL_ADMIN_MEDIA],
          seoRecords: [...INITIAL_ADMIN_SEO],
          settings: { ...INITIAL_ADMIN_SETTINGS },
          staff: [...INITIAL_ADMIN_STAFF],
        });
      },
    }),
    {
      name: "isuru-gems-admin-store-v3",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : ({} as Storage))),
    }
  )
);
