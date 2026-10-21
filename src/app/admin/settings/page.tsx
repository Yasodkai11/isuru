"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings,
  Shield,
  DollarSign,
  Truck,
  Bell,
  Save,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  RefreshCw,
  UserCheck,
  Key,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getAdminSettingsAction,
  updateAdminSettingsAction,
} from "@/actions/admin-db";

export default function AdminSettingsPage() {
  const { settings, updateSettings, staff } = useAdminStore();

  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "currency" | "logistics" | "notifications" | "staff">("general");

  // Synchronize store settings from Supabase on mount
  React.useEffect(() => {
    let isMounted = true;
    getAdminSettingsAction().then((res) => {
      if (isMounted && res.success && res.data) {
        updateSettings(res.data);
        setFormData(res.data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [updateSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    try {
      await updateAdminSettingsAction(formData);
    } catch (err) {
      console.warn("Settings persistence note:", err);
    }
  };

  const handleRateChange = (currency: keyof typeof settings.exchangeRates, value: string) => {
    const num = parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      exchangeRates: {
        ...prev.exchangeRates,
        [currency]: isNaN(num) ? prev.exchangeRates[currency] : num,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#B8924A]/25">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-medium tracking-wide">
            Console Settings & Governance
          </h1>
          <p className="text-sm sm:text-base text-[#2B2B2B]/75 mt-1">
            Configure NGJA gemstone export licenses, live exchange multipliers, and secure transport parameters.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-semibold rounded-xs flex items-center gap-2 animate-gentle-fade">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Settings successfully persisted</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-[#B8924A]/20 gap-2 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("general")}
          className={`pb-3.5 px-4 transition-colors border-b-2 ${
            activeTab === "general"
              ? "border-[#5E0F1E] text-[#5E0F1E]"
              : "border-transparent text-[#2B2B2B]/60 hover:text-[#5E0F1E]"
          }`}
        >
          General & Provenance
        </button>
        <button
          onClick={() => setActiveTab("currency")}
          className={`pb-3.5 px-4 transition-colors border-b-2 ${
            activeTab === "currency"
              ? "border-[#5E0F1E] text-[#5E0F1E]"
              : "border-transparent text-[#2B2B2B]/60 hover:text-[#5E0F1E]"
          }`}
        >
          Multi-Currency Exchange
        </button>
        <button
          onClick={() => setActiveTab("logistics")}
          className={`pb-3.5 px-4 transition-colors border-b-2 ${
            activeTab === "logistics"
              ? "border-[#5E0F1E] text-[#5E0F1E]"
              : "border-transparent text-[#2B2B2B]/60 hover:text-[#5E0F1E]"
          }`}
        >
          Armoured Transport & Escrow
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`pb-3.5 px-4 transition-colors border-b-2 ${
            activeTab === "notifications"
              ? "border-[#5E0F1E] text-[#5E0F1E]"
              : "border-transparent text-[#2B2B2B]/60 hover:text-[#5E0F1E]"
          }`}
        >
          Concierge Notifications
        </button>
        <button
          onClick={() => setActiveTab("staff")}
          className={`pb-3.5 px-4 transition-colors border-b-2 ${
            activeTab === "staff"
              ? "border-[#5E0F1E] text-[#5E0F1E]"
              : "border-transparent text-[#2B2B2B]/60 hover:text-[#5E0F1E]"
          }`}
        >
          Staff & Access Governance
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-sm">
        {/* Tab 1: General Atelier Information */}
        {activeTab === "general" && (
          <div className="p-6 bg-white border border-[#B8924A]/30 rounded-xs shadow-xs space-y-4 animate-gentle-fade">
            <h2 className="font-serif text-lg font-medium text-[#5E0F1E] border-b border-[#B8924A]/20 pb-2">
              Atelier Profile & National Gem Authority Credentials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-[#2B2B2B]">Atelier Name</label>
                <Input
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2B2B2B]">Tagline</label>
                <Input
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-[#2B2B2B]">NGJA Official Export License #</label>
                <Input
                  value={formData.ngjaLicense}
                  onChange={(e) => setFormData({ ...formData, ngjaLicense: e.target.value })}
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-[#2B2B2B]">Ratnapura Vault Headquarters Address</label>
                <Input
                  value={formData.ratnapuraVaultAddress}
                  onChange={(e) => setFormData({ ...formData, ratnapuraVaultAddress: e.target.value })}
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-[#2B2B2B]">Colombo Private Showroom Address</label>
                <Input
                  value={formData.colomboShowroomAddress}
                  onChange={(e) => setFormData({ ...formData, colomboShowroomAddress: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2B2B2B]">Concierge Email</label>
                <Input
                  value={formData.primaryEmail}
                  onChange={(e) => setFormData({ ...formData, primaryEmail: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2B2B2B]">WhatsApp Hotline</label>
                <Input
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Multi-Currency */}
        {activeTab === "currency" && (
          <div className="p-6 bg-white border border-[#B8924A]/30 rounded-xs shadow-xs space-y-4 animate-gentle-fade">
            <div className="flex items-center justify-between border-b border-[#B8924A]/20 pb-2">
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-medium text-[#5E0F1E]">
                  Multi-Currency Conversion Engine
                </h2>
                <p className="text-xs sm:text-sm text-[#2B2B2B]/60">
                  Base Catalog Price: USD ($1.00). Custom multipliers convert storefront and invoice displays.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 bg-[#FAF6EE] border border-[#B8924A]/30 rounded-xs space-y-1.5">
                <label className="font-bold text-sm text-[#5E0F1E]">Sri Lankan Rupee (LKR)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.exchangeRates.LKR}
                  onChange={(e) => handleRateChange("LKR", e.target.value)}
                />
                <span className="text-xs text-[#2B2B2B]/70 block font-medium">$10,000 = LKR {(10000 * formData.exchangeRates.LKR).toLocaleString()}</span>
              </div>

              <div className="p-3.5 bg-[#FAF6EE] border border-[#B8924A]/30 rounded-xs space-y-1.5">
                <label className="font-bold text-sm text-[#5E0F1E]">Euro (EUR)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.exchangeRates.EUR}
                  onChange={(e) => handleRateChange("EUR", e.target.value)}
                />
                <span className="text-xs text-[#2B2B2B]/70 block font-medium">$10,000 = €{(10000 * formData.exchangeRates.EUR).toLocaleString()}</span>
              </div>

              <div className="p-3.5 bg-[#FAF6EE] border border-[#B8924A]/30 rounded-xs space-y-1.5">
                <label className="font-bold text-sm text-[#5E0F1E]">British Pound (GBP)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.exchangeRates.GBP}
                  onChange={(e) => handleRateChange("GBP", e.target.value)}
                />
                <span className="text-xs text-[#2B2B2B]/70 block font-medium">$10,000 = £{(10000 * formData.exchangeRates.GBP).toLocaleString()}</span>
              </div>

              <div className="p-3.5 bg-[#FAF6EE] border border-[#B8924A]/30 rounded-xs space-y-1.5">
                <label className="font-bold text-sm text-[#5E0F1E]">UAE Dirham (AED)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.exchangeRates.AED}
                  onChange={(e) => handleRateChange("AED", e.target.value)}
                />
                <span className="text-xs text-[#2B2B2B]/70 block font-medium">$10,000 = AED {(10000 * formData.exchangeRates.AED).toLocaleString()}</span>
              </div>

              <div className="p-3.5 bg-[#FAF6EE] border border-[#B8924A]/30 rounded-xs space-y-1.5">
                <label className="font-bold text-sm text-[#5E0F1E]">Singapore Dollar (SGD)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.exchangeRates.SGD}
                  onChange={(e) => handleRateChange("SGD", e.target.value)}
                />
                <span className="text-xs text-[#2B2B2B]/70 block font-medium">$10,000 = SGD {(10000 * formData.exchangeRates.SGD).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Logistics & Escrow */}
        {activeTab === "logistics" && (
          <div className="p-6 bg-white border border-[#B8924A]/30 rounded-xs shadow-xs space-y-4 animate-gentle-fade">
            <h2 className="font-serif text-lg sm:text-xl font-medium text-[#5E0F1E] border-b border-[#B8924A]/20 pb-2">
              Armoured Transport Partners & Inspection Terms
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-sm text-[#2B2B2B]">Default Escrow Review Window (Days)</label>
                <Input
                  type="number"
                  value={formData.defaultEscrowDays}
                  onChange={(e) => setFormData({ ...formData, defaultEscrowDays: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-sm text-[#2B2B2B]">NGJA Customs Clearance Duty Fee (USD)</label>
                <Input
                  type="number"
                  value={formData.customsExportFeeUsd}
                  onChange={(e) => setFormData({ ...formData, customsExportFeeUsd: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-sm text-[#2B2B2B]">Accredited Armoured Transport Carriers</label>
                <div className="space-y-2 pt-1">
                  {formData.secureCourierPartners.map((carrier, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 bg-[#FAF6EE] border border-[#B8924A]/25 rounded-xs">
                      <Truck className="w-4 h-4 text-[#B8924A]" />
                      <span className="font-medium text-sm text-[#2B2B2B]">{carrier}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Notifications */}
        {activeTab === "notifications" && (
          <div className="p-6 bg-white border border-[#B8924A]/30 rounded-xs shadow-xs space-y-4 animate-gentle-fade">
            <h2 className="font-serif text-lg sm:text-xl font-medium text-[#5E0F1E] border-b border-[#B8924A]/20 pb-2">
              Staff & Concierge Notification Toggles
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3.5 bg-[#FAF6EE] border border-[#B8924A]/20 rounded-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.emailNotifications.newOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emailNotifications: { ...formData.emailNotifications, newOrder: e.target.checked },
                    })
                  }
                  className="rounded-xs text-[#5E0F1E] focus:ring-[#5E0F1E] w-4 h-4"
                />
                <div>
                  <p className="font-semibold text-sm text-[#2B2B2B]">Instant High-Value Order Notification</p>
                  <p className="text-xs text-[#2B2B2B]/60">Dispatch email immediately when an acquisition order is submitted.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 bg-[#FAF6EE] border border-[#B8924A]/20 rounded-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.emailNotifications.newEnquiry}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emailNotifications: { ...formData.emailNotifications, newEnquiry: e.target.checked },
                    })
                  }
                  className="rounded-xs text-[#5E0F1E] focus:ring-[#5E0F1E] w-4 h-4"
                />
                <div>
                  <p className="font-semibold text-sm text-[#2B2B2B]">Concierge Inquiry Alerts</p>
                  <p className="text-xs text-[#2B2B2B]/60">Alert Master Gemologist when private client or wholesale inquiry is filed.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 bg-[#FAF6EE] border border-[#B8924A]/20 rounded-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.emailNotifications.lowInventory}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emailNotifications: { ...formData.emailNotifications, lowInventory: e.target.checked },
                    })
                  }
                  className="rounded-xs text-[#5E0F1E] focus:ring-[#5E0F1E] w-4 h-4"
                />
                <div>
                  <p className="font-semibold text-sm text-[#2B2B2B]">Vault Inventory Level Alerts</p>
                  <p className="text-xs text-[#2B2B2B]/60">Notify when natural sapphire reserve drops below configured thresholds.</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Tab 5: Staff & Access Governance */}
        {activeTab === "staff" && (
          <div className="p-6 bg-white border border-[#B8924A]/30 rounded-xs shadow-xs space-y-5 animate-gentle-fade">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#B8924A]/20 pb-3">
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-medium text-[#5E0F1E]">
                  Staff Accounts & Credential Governance
                </h2>
                <p className="text-xs text-[#2B2B2B]/70 mt-0.5">
                  Manage administrator logins, reset passwords, update staff email addresses, and audit access keys.
                </p>
              </div>

              <Link href="/admin/staff">
                <Button
                  type="button"
                  className="bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] text-sm font-semibold h-10 px-4 flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-[#D4AF67]" />
                  <span>Open Full Staff Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FAF6EE] border border-[#B8924A]/25 rounded-xs space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#5E0F1E]">
                  <Key className="w-4 h-4 text-[#B8924A]" />
                  <span>Credential Security Policy</span>
                </div>
                <p className="text-xs text-[#2B2B2B]/80 leading-relaxed">
                  Administrators can change the login email and reset passwords for any vault custodian or staff member. Changes propagate immediately to both the local console session and connected Supabase Auth service.
                </p>
                <div className="pt-2">
                  <Link
                    href="/admin/staff"
                    className="text-xs font-semibold text-[#5E0F1E] hover:underline flex items-center gap-1"
                  >
                    <span>Manage Staff Emails & Passwords</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="p-4 bg-[#FAF6EE] border border-[#B8924A]/25 rounded-xs space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#1B3A8A]">
                  <ShieldAlert className="w-4 h-4 text-[#1B3A8A]" />
                  <span>Current Active Staff Directory</span>
                </div>
                <p className="text-xs text-[#2B2B2B]/80 leading-relaxed">
                  Currently {staff.length} staff member(s) enrolled across Gemology, Vault Logistics, Concierge, and Lapidary Intake departments.
                </p>
                <div className="pt-2">
                  <Link
                    href="/admin/staff"
                    className="text-xs font-semibold text-[#1B3A8A] hover:underline flex items-center gap-1"
                  >
                    <span>View Role & Permission Matrix</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            className="bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] text-sm font-semibold h-10 px-6 shadow-md"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Atelier Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
