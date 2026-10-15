"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Award,
  DollarSign,
  ShoppingBag,
  MapPin,
  Mail,
  Phone,
  Eye,
  Edit,
  Plus,
  Crown,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin-store";
import { AdminCustomer, CustomerTier } from "@/types/admin";
import { DataTable, ColumnDef, FilterOption } from "@/components/admin/data-table";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  getCustomersAction,
  adminUpdateCustomerAction,
  adminCreateCustomerAction,
} from "@/actions/customer";

export default function AdminCustomersPage() {
  const { customers: storeCustomers, updateCustomerNotes, addCustomer } = useAdminStore();
  const [customers, setCustomers] = useState<AdminCustomer[]>(storeCustomers);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [customerNotes, setCustomerNotes] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [creatingClient, setCreatingClient] = useState(false);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await getCustomersAction();
      if (res.success && res.data && res.data.length > 0) {
        setCustomers(res.data);
      }
    } catch {
      // Keep existing customers
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    getCustomersAction()
      .then((res) => {
        if (!active) return;
        if (res.success && res.data && res.data.length > 0) {
          setCustomers(res.data);
        }
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // New Customer Form State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCountry, setNewCountry] = useState("United States");
  const [newCity, setNewCity] = useState("");
  const [newTier, setNewTier] = useState<CustomerTier>("vip_collector");
  const [newSpent, setNewSpent] = useState("25000");
  const [newNotes, setNewNotes] = useState("");

  const openCustomerDetail = (cust: AdminCustomer) => {
    setSelectedCustomer(cust);
    setCustomerNotes(cust.notes || "");
  };

  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    setSavingNotes(true);

    try {
      await adminUpdateCustomerAction(selectedCustomer.id, { notes: customerNotes });
    } catch {}

    // Update local state and store
    updateCustomerNotes(selectedCustomer.id, customerNotes);
    setCustomers((prev) =>
      prev.map((c) => (c.id === selectedCustomer.id ? { ...c, notes: customerNotes } : c))
    );
    setSavingNotes(false);
    setSelectedCustomer(null);
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;
    setCreatingClient(true);

    const clientPayload = {
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim(),
      country: newCountry.trim(),
      city: newCity.trim(),
      tier: newTier,
      totalSpent: parseFloat(newSpent) || 0,
      notes: newNotes.trim(),
      preferredVarieties: ["Royal Blue Sapphire"],
    };

    try {
      const res = await adminCreateCustomerAction(clientPayload);
      if (res.success && res.data) {
        addCustomer(res.data);
        setCustomers((prev) => [res.data!, ...prev]);
      } else {
        const fallback: AdminCustomer = {
          id: `cust-${Date.now().toString().slice(-4)}`,
          name: clientPayload.name,
          email: clientPayload.email,
          phone: clientPayload.phone,
          country: clientPayload.country,
          city: clientPayload.city,
          tier: clientPayload.tier,
          totalSpent: clientPayload.totalSpent,
          ordersCount: 1,
          firstAcquisitionDate: new Date().toISOString().split("T")[0],
          lastAcquisitionDate: new Date().toISOString().split("T")[0],
          preferredVarieties: clientPayload.preferredVarieties,
          notes: clientPayload.notes,
        };
        addCustomer(fallback);
        setCustomers((prev) => [fallback, ...prev]);
      }
    } catch {
      // Fallback
    } finally {
      setCreatingClient(false);
      setAddModalOpen(false);
    }
  };

  const getTierBadge = (tier: CustomerTier) => {
    switch (tier) {
      case "vip_collector":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#5E0F1E] text-[#FAF6EE] flex items-center gap-1.5 w-fit shadow-xs">
            <Crown className="w-3.5 h-3.5 text-[#D4AF67]" />
            VIP Collector
          </span>
        );
      case "premier_connoisseur":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#B8924A]/20 text-[#5E0F1E] border border-[#B8924A]/40 flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-[#B8924A]" />
            Premier Connoisseur
          </span>
        );
      case "trade_jeweller":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1B3A8A]/10 text-[#1B3A8A] border border-[#1B3A8A]/30 w-fit">
            Trade Jeweller / Atelier
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 w-fit">
            Private Client
          </span>
        );
    }
  };

  const columns: ColumnDef<AdminCustomer>[] = [
    {
      key: "name",
      header: "Client Name & Email",
      sortable: true,
      sortValue: (row) => row.name,
      render: (row) => (
        <div>
          <span className="font-semibold text-sm sm:text-base text-[#2B2B2B] block">{row.name}</span>
          <span className="text-xs text-[#2B2B2B]/60">{row.email}</span>
        </div>
      ),
    },
    {
      key: "tier",
      header: "VIP Tier",
      sortable: true,
      sortValue: (row) => row.tier,
      render: (row) => getTierBadge(row.tier),
    },
    {
      key: "country",
      header: "Location",
      sortable: true,
      sortValue: (row) => row.country,
      render: (row) => (
        <span className="text-sm text-[#2B2B2B]/80 font-medium">
          {row.city}, {row.country}
        </span>
      ),
    },
    {
      key: "totalSpent",
      header: "Lifetime Value (LTV)",
      sortable: true,
      sortValue: (row) => row.totalSpent,
      render: (row) => (
        <span className="font-serif font-bold text-base text-[#5E0F1E]">
          {formatCurrency(row.totalSpent)}
        </span>
      ),
    },
    {
      key: "ordersCount",
      header: "Acquisitions",
      sortable: true,
      sortValue: (row) => row.ordersCount,
      render: (row) => (
        <span className="font-mono font-bold text-sm text-[#2B2B2B]">
          {row.ordersCount} Gem{row.ordersCount > 1 ? "s" : ""}
        </span>
      ),
    },
    {
      key: "preferredVarieties",
      header: "Preferred Gemstones",
      sortable: false,
      render: (row) => (
        <div className="flex flex-wrap gap-1.5 max-w-xs">
          {row.preferredVarieties.map((v, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-[#FAF6EE] border border-[#B8924A]/25 text-xs text-[#5E0F1E] font-medium rounded-xs"
            >
              {v}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Action",
      sortable: false,
      render: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => openCustomerDetail(row)}
          className="text-sm h-8 px-3 border-[#B8924A]/40 text-[#5E0F1E] hover:bg-[#B8924A]/10 font-semibold"
        >
          <span>Dossier</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      ),
    },
  ];

  const filterOptions: FilterOption[] = [
    {
      key: "tier",
      label: "VIP Tier",
      options: [
        { label: "VIP Collector", value: "vip_collector" },
        { label: "Premier Connoisseur", value: "premier_connoisseur" },
        { label: "Trade Jeweller", value: "trade_jeweller" },
        { label: "Private Client", value: "private_client" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#B8924A]/25">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-medium tracking-wide">
            Private Collectors & VIP CRM
          </h1>
          <p className="text-sm sm:text-base text-[#2B2B2B]/75 mt-1">
            Maintain relationship dossiers, preferences, and cumulative gemstone acquisitions for high-net-worth collectors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={loadCustomers}
            variant="outline"
            size="sm"
            disabled={loading}
            className="text-sm h-9 px-3.5 border-[#B8924A]/40 text-[#5E0F1E] flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#B8924A]" : ""}`} />
            <span>{loading ? "Syncing..." : "Refresh CRM"}</span>
          </Button>

          <Button
            onClick={() => setAddModalOpen(true)}
            size="sm"
            className="bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] text-sm h-9 px-4 font-semibold shrink-0"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Client Record
          </Button>
        </div>
      </div>

      {/* Customers Data Table */}
      <DataTable
        data={customers}
        columns={columns}
        searchPlaceholder="Search collectors by name, email, city, or country..."
        filterOptions={filterOptions}
        searchFilter={(row, query) =>
          row.name.toLowerCase().includes(query) ||
          row.email.toLowerCase().includes(query) ||
          row.country.toLowerCase().includes(query) ||
          row.city.toLowerCase().includes(query)
        }
        defaultSortKey="totalSpent"
        defaultSortDirection="desc"
        exportFilename="isuru-vip-collectors"
      />

      {/* Customer Detail & Notes Modal */}
      <Modal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer ? selectedCustomer.name : "Client Record"}
        description={selectedCustomer ? `${selectedCustomer.city}, ${selectedCustomer.country} • Contact: ${selectedCustomer.phone}` : ""}
        size="md"
      >
        {selectedCustomer && (
          <form onSubmit={handleSaveNotes} className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF6EE] border border-[#B8924A]/30 rounded-xs">
              <div>
                <span className="text-xs font-bold text-[#2B2B2B]/60 uppercase block">Lifetime Value</span>
                <span className="font-serif font-bold text-xl text-[#5E0F1E]">
                  {formatCurrency(selectedCustomer.totalSpent)}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-[#2B2B2B]/60 uppercase block">Total Orders</span>
                <span className="font-serif font-bold text-xl text-[#2B2B2B]">
                  {selectedCustomer.ordersCount} Completed
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-[#2B2B2B]/60 uppercase block">First Acquisition</span>
                <span className="font-medium text-[#2B2B2B]">{selectedCustomer.firstAcquisitionDate}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-[#2B2B2B]/60 uppercase block">Last Active</span>
                <span className="font-medium text-[#2B2B2B]">{selectedCustomer.lastAcquisitionDate}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-sm text-[#2B2B2B]">
                Private Concierge Notes & Inclusion Preferences
              </label>
              <textarea
                rows={4}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Collector criteria (e.g. only unheated 4ct+ Ceylon cushions, prefer GRS reports)..."
                className="w-full text-sm p-3 border border-[#B8924A]/30 bg-white rounded-xs focus:outline-none focus:border-[#5E0F1E]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#B8924A]/20">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedCustomer(null)}
                className="text-sm h-9 px-4 border-[#B8924A]/40"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={savingNotes}
                className="text-sm h-9 px-4 bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] font-semibold"
              >
                {savingNotes ? "Saving Notes..." : "Save Notes"}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Add New Customer Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Private Collector Record"
        description="Register a high-value client or wholesale atelier dossier in the private vault directory."
        size="md"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4 text-sm">
          <div className="space-y-1">
            <label className="font-semibold text-sm text-[#2B2B2B]">Client Full Name *</label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Victoria de Rothschild"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-sm text-[#2B2B2B]">Email Address *</label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="client@domain.com"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-sm text-[#2B2B2B]">Phone / WhatsApp</label>
              <Input
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+44 20 7946 0912"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-sm text-[#2B2B2B]">Country</label>
              <Input
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                placeholder="United Kingdom"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-sm text-[#2B2B2B]">City</label>
              <Input
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="London"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-sm text-[#2B2B2B]">VIP Tier</label>
              <select
                value={newTier}
                onChange={(e) => setNewTier(e.target.value as CustomerTier)}
                className="w-full text-sm p-2.5 border border-[#B8924A]/30 bg-white rounded-xs focus:outline-none focus:border-[#5E0F1E]"
              >
                <option value="vip_collector">VIP Collector</option>
                <option value="premier_connoisseur">Premier Connoisseur</option>
                <option value="trade_jeweller">Trade Jeweller</option>
                <option value="private_client">Private Client</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-sm text-[#2B2B2B]">Estimated Spend ($)</label>
              <Input
                type="number"
                value={newSpent}
                onChange={(e) => setNewSpent(e.target.value)}
                placeholder="25000"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-sm text-[#2B2B2B]">Initial Gemological Notes</label>
            <textarea
              rows={2}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Inclusion preferences, favorite sapphire colors..."
              className="w-full text-sm p-2.5 border border-[#B8924A]/30 bg-white rounded-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#B8924A]/20">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddModalOpen(false)}
              className="text-sm h-9 px-4 border-[#B8924A]/40"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={creatingClient}
              className="text-sm h-9 px-4 bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] font-semibold"
            >
              {creatingClient ? "Registering Client..." : "Register Client"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
