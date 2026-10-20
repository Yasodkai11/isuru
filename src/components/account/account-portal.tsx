"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUserAction, logoutAction, CurrentUserSession } from "@/actions/auth";
import {
  CustomerProfileData,
  getCustomerProfileAction,
  updateCustomerProfileAction,
} from "@/actions/customer";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoldDivider } from "@/components/layout/gold-divider";
import { formatCurrency } from "@/lib/utils";
import {
  User,
  ShieldCheck,
  ShoppingBag,
  Inbox,
  LogOut,
  Sparkles,
  Lock,
  ExternalLink,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  Calendar,
  MapPin,
  ArrowRight,
  Crown,
  Edit3,
  Save,
  X,
  Phone,
} from "lucide-react";

interface OrderSummary {
  id: string;
  created_at: string;
  total_amount: number;
  currency: string;
  status: string;
  shipping_address: string;
  notes?: string;
}

interface InquirySummary {
  id: string;
  created_at: string;
  gem_name?: string;
  message: string;
  status: string;
  reply_notes?: string | null;
}

export function AccountPortal() {
  const router = useRouter();
  const [session, setSession] = useState<CurrentUserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [inquiries, setInquiries] = useState<InquirySummary[]>([]);
  const [profile, setProfile] = useState<CustomerProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "inquiries" | "profile">("orders");
  const [loggingOut, setLoggingOut] = useState(false);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editPostalCode, setEditPostalCode] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAccountData() {
      try {
        const userSession = await getCurrentUserAction();
        if (!isMounted) return;

        setSession(userSession);

        if (userSession.isAuthenticated && userSession.user) {
          const supabase = createClient();

          // 1. Fetch user orders
          const { data: userOrders } = await supabase
            .from("orders")
            .select("id, created_at, total_amount, currency, status, shipping_address, notes")
            .or(`user_id.eq.${userSession.user.id},email.eq.${userSession.user.email}`)
            .order("created_at", { ascending: false });

          if (isMounted && userOrders) {
            setOrders(userOrders as OrderSummary[]);
          }

          // 2. Fetch user inquiries (now allowed for customer via updated RLS)
          const { data: userInquiries } = await supabase
            .from("inquiries")
            .select("id, created_at, gem_name, message, status, reply_notes")
            .eq("email", userSession.user.email)
            .order("created_at", { ascending: false });

          if (isMounted && userInquiries) {
            setInquiries(userInquiries as InquirySummary[]);
          }

          // 3. Fetch user profile from public.profiles
          const profileRes = await getCustomerProfileAction(userSession.user.id);
          if (isMounted && profileRes.success && profileRes.data) {
            setProfile(profileRes.data);
            setEditFullName(profileRes.data.fullName || userSession.user.fullName || "");
            setEditPhone(profileRes.data.phone || "");
            setEditAddress(profileRes.data.shippingAddress || "");
            setEditCity(profileRes.data.city || "");
            setEditCountry(profileRes.data.country || "");
            setEditPostalCode(profileRes.data.postalCode || "");
          } else if (isMounted) {
            setEditFullName(userSession.user.fullName || "");
          }
        }
      } catch (err) {
        console.error("Account load error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAccountData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);

    const result = await updateCustomerProfileAction({
      fullName: editFullName,
      phone: editPhone,
      shippingAddress: editAddress,
      city: editCity,
      country: editCountry,
      postalCode: editPostalCode,
    });

    setSavingProfile(false);

    if (result.success) {
      setProfileMessage({ text: result.message, type: "success" });
      setIsEditingProfile(false);
      if (session?.user) {
        const refreshed = await getCustomerProfileAction(session.user.id);
        if (refreshed.success && refreshed.data) {
          setProfile(refreshed.data);
        }
      }
    } else {
      setProfileMessage({ text: result.message || "Failed to update profile.", type: "error" });
    }
  };

  const handleSignOut = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    await logoutAction();
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#B8924A]/30 border-t-[#5E0F1E] rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-[0.25em] text-[#B8924A] font-semibold">
          Loading Collector Archive...
        </p>
      </div>
    );
  }

  // Not authenticated
  if (!session?.isAuthenticated || !session.user) {
    return (
      <div className="max-w-md mx-auto bg-[#FDFBF7] border border-[#B8924A]/30 p-8 sm:p-10 text-center space-y-6 shadow-sm my-12">
        <div className="inline-flex p-3 rounded-full bg-[#5E0F1E]/10 border border-[#5E0F1E]/20 text-[#5E0F1E]">
          <User className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold block">
            Private Patron Access
          </span>
          <h2 className="font-serif text-3xl text-[#5E0F1E]">Collector Sign In Required</h2>
          <p className="text-xs text-[#2B2B2B]/70 leading-relaxed">
            Please sign in with Google or your registered email to view your gemstone acquisitions, vault certificates, and concierge requests.
          </p>
        </div>

        <GoldDivider className="my-4" />

        <div className="space-y-3">
          <Link href="/login?redirect=/account" className="block">
            <Button variant="primary" className="w-full text-xs uppercase tracking-widest py-3.5">
              Sign In to Your Vault
            </Button>
          </Link>
          <Link href="/register" className="block">
            <Button variant="outline" className="w-full text-xs uppercase tracking-widest py-3.5">
              Register New Patron Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { user, isAdmin } = session;

  return (
    <div className="space-y-8 animate-gentle-fade max-w-6xl mx-auto">
      {/* Top Welcome Card */}
      <div className="bg-[#FDFBF7] border border-[#B8924A]/30 p-6 sm:p-8 shadow-xs rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#5E0F1E] text-[#FAF6EE] flex items-center justify-center font-serif text-xl sm:text-2xl font-bold border-2 border-[#B8924A]/40 shadow-sm shrink-0">
            {user.fullName
              ? user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "YG"}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#5E0F1E] font-medium leading-tight">
                {user.fullName}
              </h2>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-[#5E0F1E] text-[#FAF6EE] px-2.5 py-0.5 rounded-xs font-semibold shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-[#D4AF67]" />
                  Staff Administrator
                </span>
              )}
            </div>
            <p className="text-xs text-[#2B2B2B]/70">{user.email}</p>
            <p className="text-[11px] text-[#B8924A] uppercase tracking-widest font-medium">
              Registered Ceylon Patron • NGJA Registry Archive
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {isAdmin && (
            <Link href="/admin">
              <Button
                variant="primary"
                className="text-xs uppercase tracking-widest py-2.5 px-4 flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF67]" />
                <span>Admin Vault Console</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </Button>
            </Link>
          )}

          <Button
            variant="outline"
            onClick={handleSignOut}
            disabled={loggingOut}
            className="text-xs uppercase tracking-widest py-2.5 px-4 text-red-700 hover:bg-red-50 hover:text-red-800 border-red-200 flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? "Signing Out..." : "Sign Out"}</span>
          </Button>
        </div>
      </div>

      {/* Admin Notice Banner if staff */}
      {isAdmin && (
        <div className="p-4 bg-gradient-to-r from-[#5E0F1E]/10 via-[#B8924A]/10 to-transparent border border-[#B8924A]/40 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#5E0F1E] text-[#D4AF67] rounded-xs shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#5E0F1E] uppercase tracking-wider">
                Staff Custodian Privileges Active
              </p>
              <p className="text-xs text-[#2B2B2B]/75">
                You have authorized access to the physical inventory, gemstone orders, and client CRM console.
              </p>
            </div>
          </div>
          <Link
            href="/admin"
            className="text-xs uppercase tracking-wider text-[#5E0F1E] font-bold hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>Open Admin Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-[#B8924A]/20 flex gap-6 text-xs uppercase tracking-[0.2em] font-medium">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === "orders"
              ? "border-[#5E0F1E] text-[#5E0F1E] font-semibold"
              : "border-transparent text-[#2B2B2B]/60 hover:text-[#5E0F1E]"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Acquisitions & Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("inquiries")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === "inquiries"
              ? "border-[#5E0F1E] text-[#5E0F1E] font-semibold"
              : "border-transparent text-[#2B2B2B]/60 hover:text-[#5E0F1E]"
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Concierge Inquiries ({inquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === "profile"
              ? "border-[#5E0F1E] text-[#5E0F1E] font-semibold"
              : "border-transparent text-[#2B2B2B]/60 hover:text-[#5E0F1E]"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Security & Details</span>
        </button>
      </div>

      {/* Tab Content: Orders */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-[#FDFBF7] border border-[#B8924A]/25 p-12 text-center space-y-4 rounded-xs">
              <Package className="w-10 h-10 text-[#B8924A]/60 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-serif text-xl text-[#5E0F1E]">No Gemstone Acquisitions Yet</h3>
                <p className="text-xs text-[#2B2B2B]/70 max-w-sm mx-auto">
                  When you acquire natural Ceylon sapphires or request armored delivery, your orders and certificates will appear here.
                </p>
              </div>
              <Link href="/gems" className="inline-block pt-2">
                <Button variant="primary" className="text-xs uppercase tracking-widest py-3 px-6">
                  Browse Precious Gemstones
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#FDFBF7] border border-[#B8924A]/30 p-5 rounded-xs space-y-3 hover:border-[#B8924A] transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#B8924A]/20">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#B8924A] font-semibold">
                        Acquisition Reference
                      </span>
                      <p className="font-serif text-lg text-[#5E0F1E] font-medium">{order.id}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider text-[#2B2B2B]/60 block">
                          Total Value
                        </span>
                        <span className="font-serif font-bold text-base text-[#5E0F1E]">
                          {formatCurrency(order.total_amount)}
                        </span>
                      </div>

                      <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-xs bg-[#5E0F1E]/10 text-[#5E0F1E] border border-[#5E0F1E]/20">
                        {order.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 text-xs text-[#2B2B2B]/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#B8924A]" />
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#B8924A] shrink-0" />
                      <span className="truncate">{order.shipping_address}</span>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="p-2.5 bg-[#F2EADB]/40 border border-[#B8924A]/20 rounded-xs text-[11px] text-[#2B2B2B]/70">
                      {order.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Inquiries */}
      {activeTab === "inquiries" && (
        <div className="space-y-4">
          {inquiries.length === 0 ? (
            <div className="bg-[#FDFBF7] border border-[#B8924A]/25 p-12 text-center space-y-4 rounded-xs">
              <Inbox className="w-10 h-10 text-[#B8924A]/60 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-serif text-xl text-[#5E0F1E]">No Inquiries on Record</h3>
                <p className="text-xs text-[#2B2B2B]/70 max-w-sm mx-auto">
                  Have a bespoke stone in mind? Consult our gemological concierge for private viewings or laboratory requests.
                </p>
              </div>
              <Link href="/contact" className="inline-block pt-2">
                <Button variant="outline" className="text-xs uppercase tracking-widest py-3 px-6">
                  Contact Gemological Concierge
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="bg-[#FDFBF7] border border-[#B8924A]/30 p-5 rounded-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base text-[#5E0F1E] font-medium">
                      {inq.gem_name || "General Consultation"}
                    </span>
                    <span className="px-2.5 py-0.5 text-[10px] uppercase font-semibold bg-[#1B3A8A]/10 text-[#1B3A8A] rounded-xs">
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#2B2B2B]/80 leading-relaxed italic bg-[#F2EADB]/40 p-3 rounded-xs border border-[#B8924A]/15">
                    &ldquo;{inq.message}&rdquo;
                  </p>
                  {inq.reply_notes && (
                    <div className="bg-[#FAF6EE] p-3 rounded-xs border-l-2 border-[#5E0F1E] space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#5E0F1E] font-semibold block">
                        Concierge Atelier Response:
                      </span>
                      <p className="text-xs text-[#2B2B2B]/90 font-medium">
                        {inq.reply_notes}
                      </p>
                    </div>
                  )}
                  <p className="text-[10px] text-[#2B2B2B]/60">
                    Logged: {new Date(inq.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Profile & Security */}
      {activeTab === "profile" && (
        <div className="bg-[#FDFBF7] border border-[#B8924A]/30 p-6 sm:p-8 rounded-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#B8924A]/20">
            <div className="space-y-1">
              <h3 className="font-serif text-xl text-[#5E0F1E]">Patron Profile & Delivery Coordinates</h3>
              <p className="text-xs text-[#2B2B2B]/70">
                Your authenticated gemstone client records and delivery address in the Ceylon vault registry.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setIsEditingProfile(!isEditingProfile);
                setProfileMessage(null);
              }}
              className="text-xs uppercase tracking-wider py-2 px-4 self-start sm:self-auto flex items-center gap-2 border-[#B8924A]"
            >
              {isEditingProfile ? (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5 text-[#B8924A]" />
                  <span>Edit Coordinates</span>
                </>
              )}
            </Button>
          </div>

          {profileMessage && (
            <div
              className={`p-3.5 rounded-xs text-xs flex items-center gap-2 animate-gentle-fade ${
                profileMessage.type === "success"
                  ? "bg-emerald-50 border border-emerald-300 text-emerald-900"
                  : "bg-red-50 border border-red-300 text-red-900"
              }`}
            >
              {profileMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
              )}
              <span>{profileMessage.text}</span>
            </div>
          )}

          {isEditingProfile ? (
            /* Editing Form */
            <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Full Legal Name *</Label>
                  <Input
                    id="edit-name"
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    placeholder="Full legal name"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-phone">Contact Phone / WhatsApp *</Label>
                  <Input
                    id="edit-phone"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-address">Primary Shipping Address (Armoured Courier)</Label>
                <Input
                  id="edit-address"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="Street address, building, suite"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-city">City / Jurisdiction</Label>
                  <Input
                    id="edit-city"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    placeholder="e.g. Geneva, London, New York"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-country">Country of Residence</Label>
                  <Input
                    id="edit-country"
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    placeholder="e.g. Switzerland"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-postal">Postal / Zip Code</Label>
                  <Input
                    id="edit-postal"
                    value={editPostalCode}
                    onChange={(e) => setEditPostalCode(e.target.value)}
                    placeholder="e.g. 1204"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={savingProfile}
                  className="text-xs uppercase tracking-widest py-3 px-6 flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingProfile ? "Saving Coordinates..." : "Save Coordinates to Vault"}</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditingProfile(false)}
                  className="text-xs uppercase tracking-wider py-3 px-4"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            /* Display Cards */
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-[#F2EADB]/50 border border-[#B8924A]/25 rounded-xs">
                  <span className="text-[10px] uppercase text-[#B8924A] font-semibold block">Full Legal Name</span>
                  <span className="font-medium text-[#2B2B2B] text-sm mt-0.5 block">{profile?.fullName || user.fullName}</span>
                </div>

                <div className="p-4 bg-[#F2EADB]/50 border border-[#B8924A]/25 rounded-xs">
                  <span className="text-[10px] uppercase text-[#B8924A] font-semibold block">Contact Email</span>
                  <span className="font-medium text-[#2B2B2B] text-sm mt-0.5 block">{user.email}</span>
                </div>

                <div className="p-4 bg-[#F2EADB]/50 border border-[#B8924A]/25 rounded-xs">
                  <span className="text-[10px] uppercase text-[#B8924A] font-semibold block">Phone / WhatsApp</span>
                  <span className="font-medium text-[#2B2B2B] text-sm mt-0.5 block">
                    {profile?.phone || "Not yet configured"}
                  </span>
                </div>

                <div className="p-4 bg-[#F2EADB]/50 border border-[#B8924A]/25 rounded-xs">
                  <span className="text-[10px] uppercase text-[#B8924A] font-semibold block">Patron Loyalty Tier</span>
                  <span className="font-medium text-[#5E0F1E] text-sm mt-0.5 block capitalize flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-[#B8924A]" />
                    {profile?.tier ? profile.tier.replace(/_/g, " ") : "Private Client"}
                  </span>
                </div>
              </div>

              {/* Delivery Address Card */}
              <div className="p-4 bg-[#F2EADB]/35 border border-[#B8924A]/25 rounded-xs space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#5E0F1E] font-semibold text-xs">
                    <MapPin className="w-4 h-4 text-[#B8924A]" />
                    <span>Default Courier Delivery Coordinates</span>
                  </div>
                  {profile?.shippingAddress && (
                    <span className="text-[10px] uppercase text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-xs font-semibold">
                      Autofills at Checkout
                    </span>
                  )}
                </div>

                {profile?.shippingAddress ? (
                  <p className="text-xs text-[#2B2B2B]/85 leading-relaxed pl-6">
                    {profile.shippingAddress}
                    {profile.city && `, ${profile.city}`}
                    {profile.postalCode && ` ${profile.postalCode}`}
                    {profile.country && ` • ${profile.country}`}
                  </p>
                ) : (
                  <p className="text-xs text-[#2B2B2B]/60 italic pl-6">
                    No shipping address saved yet. Click &ldquo;Edit Coordinates&rdquo; above or enter your address during checkout to save it automatically.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#B8924A]/20 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[11px] text-[#2B2B2B]/60 max-w-md">
              Official export declarations, NGJA gemstone permits, and courier insurance will be issued matching your saved coordinates.
            </p>

            <Button
              variant="outline"
              onClick={handleSignOut}
              className="text-xs uppercase tracking-widest text-red-700 hover:bg-red-50 border-red-200"
            >
              <LogOut className="w-3.5 h-3.5 mr-2" />
              Sign Out from Device
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
