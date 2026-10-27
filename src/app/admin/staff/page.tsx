"use client";

import React, { useState } from "react";
import {
  UserCheck,
  ShieldCheck,
  Key,
  Lock,
  Mail,
  Phone,
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Sparkles,
  ShieldAlert,
  Clock,
  Building2,
  Shield,
  Check,
} from "lucide-react";
import { useAdminStore } from "@/stores/admin-store";
import { AdminStaffMember, StaffRole, StaffStatus } from "@/types/admin";
import {
  createStaffMemberAction,
  updateStaffCredentialsAction,
  updateStaffMemberAction,
  deleteStaffMemberAction,
} from "@/actions/staff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";

const ROLE_CONFIG: Record<
  StaffRole,
  { label: string; bg: string; text: string; border: string; desc: string }
> = {
  super_admin: {
    label: "Super Administrator",
    bg: "bg-[#5E0F1E]/10",
    text: "text-[#5E0F1E]",
    border: "border-[#5E0F1E]/30",
    desc: "Full governance, staff onboarding, financial escrow, and NGJA signatory privileges.",
  },
  vault_custodian: {
    label: "Vault Custodian",
    bg: "bg-[#1B3A8A]/10",
    text: "text-[#1B3A8A]",
    border: "border-[#1B3A8A]/30",
    desc: "Physical vault clearance, armored transport handovers, and sealing protocols.",
  },
  gemologist: {
    label: "Staff Gemologist",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    desc: "Spectroscopy, microscopic cert reports, and NGJA / GRS dossier verification.",
  },
  concierge_agent: {
    label: "Client Concierge",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    desc: "Private viewing bookings, VIP collector dossiers, and customer inquiries.",
  },
  inventory_clerk: {
    label: "Inventory Clerk",
    bg: "bg-stone-100",
    text: "text-stone-700",
    border: "border-stone-300",
    desc: "Lapidary intake cataloging, rough gem batch logs, and high-res photography.",
  },
};

export default function AdminStaffPage() {
  const {
    staff,
    addStaffMember,
    updateStaffMember,
    updateStaffCredentials,
    deleteStaffMember,
    toggleStaffStatus,
  } = useAdminStore();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Notifications
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [deleteConfirmMember, setDeleteConfirmMember] = useState<AdminStaffMember | null>(null);
  const [activeStaffTarget, setActiveStaffTarget] = useState<AdminStaffMember | null>(null);

  // Add Form State
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<StaffRole>("vault_custodian");
  const [newDepartment, setNewDepartment] = useState("Ratnapura Vault Logistics");
  const [newPhone, setNewPhone] = useState("+94 ");
  const [newCanManageGems, setNewCanManageGems] = useState(true);
  const [newCanManageOrders, setNewCanManageOrders] = useState(true);
  const [newCanManageStaff, setNewCanManageStaff] = useState(false);
  const [newCanExportData, setNewCanExportData] = useState(false);
  const [newNotes, setNewNotes] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // Credentials Modal State
  const [credNewEmail, setCredNewEmail] = useState("");
  const [credNewPassword, setCredNewPassword] = useState("");
  const [credConfirmPassword, setCredConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [credLoading, setCredLoading] = useState(false);

  // Edit Profile Modal State
  const [editFullName, setEditFullName] = useState("");
  const [editRole, setEditRole] = useState<StaffRole>("vault_custodian");
  const [editDepartment, setEditDepartment] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editStatus, setEditStatus] = useState<StaffStatus>("active");
  const [editCanManageGems, setEditCanManageGems] = useState(false);
  const [editCanManageOrders, setEditCanManageOrders] = useState(false);
  const [editCanManageStaff, setEditCanManageStaff] = useState(false);
  const [editCanExportData, setEditCanExportData] = useState(false);
  const [editNotes, setEditNotes] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const showToast = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Generate strong random password
  const generateStrongPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Filtered staff list
  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Open credentials modal
  const handleOpenCredentials = (member: AdminStaffMember) => {
    setActiveStaffTarget(member);
    setCredNewEmail(member.email);
    setCredNewPassword("");
    setCredConfirmPassword("");
    setShowPassword(false);
    setCredentialsModalOpen(true);
  };

  // Save new credentials (Email & Password)
  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStaffTarget) return;

    if (credNewPassword && credNewPassword.length < 6) {
      showToast("error", "Vault password must contain at least 6 characters.");
      return;
    }

    if (credNewPassword && credNewPassword !== credConfirmPassword) {
      showToast("error", "The entered passwords do not match. Please verify.");
      return;
    }

    setCredLoading(true);

    try {
      // 1. Call server action for Supabase Auth & DB sync
      const result = await updateStaffCredentialsAction({
        staffId: activeStaffTarget.id,
        authUserId: activeStaffTarget.authUserId,
        email: credNewEmail !== activeStaffTarget.email ? credNewEmail : undefined,
        password: credNewPassword || undefined,
      });

      // 2. Update local Zustand state
      updateStaffCredentials(
        activeStaffTarget.id,
        credNewEmail !== activeStaffTarget.email ? credNewEmail : undefined,
        credNewPassword
          ? `Password updated on ${new Date().toLocaleDateString("en-GB")}`
          : undefined
      );

      setCredLoading(false);
      setCredentialsModalOpen(false);
      showToast(
        "success",
        result.message || `Credentials for ${activeStaffTarget.fullName} have been updated.`
      );
    } catch {
      setCredLoading(false);
      showToast("error", "Could not complete credential update. Please check network.");
    }
  };

  // Open Edit Profile modal
  const handleOpenEditProfile = (member: AdminStaffMember) => {
    setActiveStaffTarget(member);
    setEditFullName(member.fullName);
    setEditRole(member.role);
    setEditDepartment(member.department);
    setEditPhone(member.phone || "");
    setEditStatus(member.status);
    setEditCanManageGems(member.canManageGems);
    setEditCanManageOrders(member.canManageOrders);
    setEditCanManageStaff(member.canManageStaff);
    setEditCanExportData(member.canExportData);
    setEditNotes(member.notes || "");
    setEditProfileModalOpen(true);
  };

  // Save Profile edits
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStaffTarget) return;

    setEditLoading(true);

    const partialData: Partial<AdminStaffMember> = {
      fullName: editFullName.trim(),
      role: editRole,
      department: editDepartment.trim(),
      phone: editPhone.trim() || undefined,
      status: editStatus,
      canManageGems: editCanManageGems,
      canManageOrders: editCanManageOrders,
      canManageStaff: editCanManageStaff,
      canExportData: editCanExportData,
      notes: editNotes.trim() || undefined,
    };

    try {
      await updateStaffMemberAction(activeStaffTarget.id, partialData);
      updateStaffMember(activeStaffTarget.id, partialData);
      setEditLoading(false);
      setEditProfileModalOpen(false);
      showToast("success", `Staff member "${editFullName}" updated successfully.`);
    } catch {
      setEditLoading(false);
      showToast("error", "Failed to update staff record.");
    }
  };

  // Handle Add New Staff
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim()) {
      showToast("error", "Please provide full name and a valid email address.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      showToast("error", "Password must be at least 6 characters.");
      return;
    }

    setAddLoading(true);

    try {
      const res = await createStaffMemberAction({
        fullName: newFullName,
        email: newEmail,
        password: newPassword || undefined,
        role: newRole,
        department: newDepartment,
        phone: newPhone,
        canManageGems: newCanManageGems,
        canManageOrders: newCanManageOrders,
        canManageStaff: newCanManageStaff,
        canExportData: newCanExportData,
        notes: newNotes,
      });

      if (res.data) {
        addStaffMember(res.data);
      }

      setAddLoading(false);
      setAddModalOpen(false);
      // Reset form
      setNewFullName("");
      setNewEmail("");
      setNewPassword("");
      setNewNotes("");
      showToast("success", `New staff member "${newFullName}" enrolled in the Vault Console.`);
    } catch {
      setAddLoading(false);
      showToast("error", "An error occurred while creating staff member.");
    }
  };

  // Delete staff
  const handleConfirmDelete = async () => {
    if (!deleteConfirmMember) return;

    if (deleteConfirmMember.role === "super_admin" && staff.filter((s) => s.role === "super_admin").length <= 1) {
      showToast("error", "Security restriction: You cannot delete the sole Super Administrator.");
      setDeleteConfirmMember(null);
      return;
    }

    await deleteStaffMemberAction(deleteConfirmMember.id, deleteConfirmMember.authUserId);
    deleteStaffMember(deleteConfirmMember.id);
    showToast("success", `Access revoked for ${deleteConfirmMember.fullName}.`);
    setDeleteConfirmMember(null);
  };

  // Summary Metrics
  const totalStaff = staff.length;
  const activeStaff = staff.filter((s) => s.status === "active").length;
  const superAdmins = staff.filter((s) => s.role === "super_admin").length;
  const vaultCustodians = staff.filter((s) => s.role === "vault_custodian").length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-xs border shadow-xl flex items-center gap-3 animate-gentle-fade max-w-md ${
            notification.type === "success"
              ? "bg-[#FAF6EE] border-emerald-500 text-emerald-900"
              : "bg-[#FAF6EE] border-red-500 text-red-900"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span className="text-xs font-medium">{notification.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#B8924A]/25">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#5E0F1E] font-medium tracking-wide">
              Staff & Vault Access Control
            </h1>
            <span className="px-2.5 py-1 text-xs uppercase font-bold tracking-widest bg-[#B8924A]/20 text-[#5E0F1E] border border-[#B8924A]/40 rounded-xs">
              Governance
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#2B2B2B]/75 mt-1">
            Manage authorized gemologists, vault custodians, and concierge staff. Control role privileges, update login emails, and securely reset passwords.
          </p>
        </div>

        <Button
          onClick={() => setAddModalOpen(true)}
          className="bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] text-sm font-semibold uppercase tracking-wider py-2.5 px-4 h-10 rounded-xs border border-[#B8924A]/40 flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#D4AF67]" />
          <span>Add Staff Member</span>
        </Button>
      </div>

      {/* KPI Cockpit Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-[#FDFBF7] border border-[#B8924A]/25 rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#2B2B2B]/70 mb-1">
            <span className="uppercase tracking-wider font-bold text-xs text-[#B8924A]">
              Total Staff
            </span>
            <UserCheck className="w-4 h-4 text-[#B8924A]" />
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-medium text-[#5E0F1E]">
            {totalStaff}
          </div>
          <p className="text-xs text-[#2B2B2B]/60 mt-1">
            {activeStaff} active in vault directory
          </p>
        </div>

        <div className="p-4 bg-[#FDFBF7] border border-[#B8924A]/25 rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#2B2B2B]/70 mb-1">
            <span className="uppercase tracking-wider font-bold text-xs text-[#1B3A8A]">
              Vault Custodians
            </span>
            <Shield className="w-4 h-4 text-[#1B3A8A]" />
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-medium text-[#1B3A8A]">
            {vaultCustodians}
          </div>
          <p className="text-xs text-[#2B2B2B]/60 mt-1">
            Physical handovers & armoring
          </p>
        </div>

        <div className="p-4 bg-[#FDFBF7] border border-[#B8924A]/25 rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#2B2B2B]/70 mb-1">
            <span className="uppercase tracking-wider font-bold text-xs text-[#5E0F1E]">
              Super Admins
            </span>
            <ShieldCheck className="w-4 h-4 text-[#5E0F1E]" />
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-medium text-[#5E0F1E]">
            {superAdmins}
          </div>
          <p className="text-xs text-[#2B2B2B]/60 mt-1">
            NGJA export & license signatories
          </p>
        </div>

        <div className="p-4 bg-[#FDFBF7] border border-[#B8924A]/25 rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#2B2B2B]/70 mb-1">
            <span className="uppercase tracking-wider font-bold text-xs text-emerald-700">
              Security Protocol
            </span>
            <Lock className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-medium text-emerald-800">
            NGJA-Cleared
          </div>
          <p className="text-xs text-emerald-700/80 mt-1">
            Encrypted RBAC & credential isolation
          </p>
        </div>
      </div>

      {/* Security Governance Notice */}
      <div className="p-4 bg-[#5E0F1E]/5 border border-[#5E0F1E]/20 rounded-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#5E0F1E] shrink-0 mt-0.5" />
        <div className="text-sm text-[#2B2B2B]/85 space-y-1">
          <p className="font-semibold text-[#5E0F1E]">
            Administrative Governance & Credential Modification Rule
          </p>
          <p className="leading-relaxed">
            As an administrator, modifying a staff member’s email or vault password takes effect immediately across both the Next.js Vault session and the connected Supabase Auth engine. Staff will be required to authenticate using the revised credentials upon their next login.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-[#FDFBF7] border border-[#B8924A]/25 rounded-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#B8924A] absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search staff by name, email, department, or role..."
            className="pl-9 bg-[#FAF6EE] border-[#B8924A]/30 text-sm h-10 w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#FAF6EE] border border-[#B8924A]/30 text-sm text-[#2B2B2B] h-10 px-3.5 py-2 rounded-xs focus:outline-none focus:border-[#5E0F1E]"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="vault_custodian">Vault Custodian</option>
            <option value="gemologist">Staff Gemologist</option>
            <option value="concierge_agent">Client Concierge</option>
            <option value="inventory_clerk">Inventory Clerk</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF6EE] border border-[#B8924A]/30 text-sm text-[#2B2B2B] h-10 px-3.5 py-2 rounded-xs focus:outline-none focus:border-[#5E0F1E]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="bg-[#FDFBF7] border border-[#B8924A]/25 rounded-xs overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F2EADB] border-b border-[#B8924A]/25 text-[#5E0F1E] uppercase text-xs tracking-wider font-bold">
              <tr>
                <th className="py-4 px-4">Staff Member</th>
                <th className="py-4 px-4">Role & Department</th>
                <th className="py-4 px-4">Contact & Login Email</th>
                <th className="py-4 px-4">Permissions</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Last Active</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B8924A]/15">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#2B2B2B]/60 italic">
                    <UserCheck className="w-8 h-8 mx-auto mb-2 text-[#B8924A]/50" />
                    No staff members match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member) => {
                  const roleStyle = ROLE_CONFIG[member.role] || ROLE_CONFIG.inventory_clerk;
                  const initials = member.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-[#FAF6EE]/80 transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-[#5E0F1E] text-[#FAF6EE] flex items-center justify-center font-serif font-bold text-sm border border-[#B8924A]/40 shadow-xs">
                              {initials}
                            </div>
                            <span
                              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-[#FAF6EE] ${
                                member.status === "active"
                                  ? "bg-emerald-500"
                                  : member.status === "suspended"
                                  ? "bg-amber-500"
                                  : "bg-stone-400"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-sm sm:text-base text-[#2B2B2B]">
                              {member.fullName}
                            </p>
                            <span className="text-xs text-[#2B2B2B]/60">
                              ID: {member.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role & Department */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-xs text-xs font-bold border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}
                          >
                            {roleStyle.label}
                          </span>
                          <p className="text-xs text-[#2B2B2B]/70 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#B8924A]" />
                            {member.department}
                          </p>
                        </div>
                      </td>

                      {/* Contact & Email */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-mono text-xs text-[#5E0F1E]">
                            <Mail className="w-3.5 h-3.5 text-[#B8924A] shrink-0" />
                            <span>{member.email}</span>
                          </div>
                          {member.phone && (
                            <p className="text-xs text-[#2B2B2B]/70 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-[#B8924A] shrink-0" />
                              <span>{member.phone}</span>
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Permissions matrix */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {member.canManageGems && (
                            <span className="px-2 py-0.5 bg-[#FAF6EE] border border-[#B8924A]/30 text-xs uppercase font-semibold text-[#5E0F1E]">
                              Gems
                            </span>
                          )}
                          {member.canManageOrders && (
                            <span className="px-2 py-0.5 bg-[#FAF6EE] border border-[#B8924A]/30 text-xs uppercase font-semibold text-[#1B3A8A]">
                              Orders
                            </span>
                          )}
                          {member.canManageStaff && (
                            <span className="px-2 py-0.5 bg-[#5E0F1E]/10 border border-[#5E0F1E]/30 text-xs uppercase font-semibold text-[#5E0F1E]">
                              Staff
                            </span>
                          )}
                          {member.canExportData && (
                            <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-xs uppercase font-semibold text-emerald-800">
                              Export
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {member.status === "active" ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Active
                          </span>
                        ) : member.status === "suspended" ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            Suspended
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-300">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Last Active */}
                      <td className="py-4 px-4 text-xs text-[#2B2B2B]/70">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#B8924A]" />
                          <span>{member.lastLogin || "Never"}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Change Email & Password */}
                          <button
                            onClick={() => handleOpenCredentials(member)}
                            className="p-2 text-[#B8924A] hover:text-[#5E0F1E] hover:bg-[#B8924A]/15 rounded-xs transition-colors cursor-pointer"
                            title="Change Email & Password Credentials"
                          >
                            <Key className="w-4 h-4" />
                          </button>

                          {/* Edit Profile */}
                          <button
                            onClick={() => handleOpenEditProfile(member)}
                            className="p-2 text-[#2B2B2B]/70 hover:text-[#5E0F1E] hover:bg-[#B8924A]/15 rounded-xs transition-colors cursor-pointer"
                            title="Edit Profile & Permissions"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Toggle Status */}
                          <button
                            onClick={() => {
                              toggleStaffStatus(member.id);
                              showToast(
                                "success",
                                `Status toggled to ${
                                  member.status === "active" ? "Suspended" : "Active"
                                } for ${member.fullName}`
                              );
                            }}
                            className="p-2 text-[#2B2B2B]/70 hover:text-amber-700 hover:bg-amber-50 rounded-xs transition-colors cursor-pointer"
                            title={
                              member.status === "active" ? "Suspend Access" : "Activate Access"
                            }
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>

                          {/* Delete Member */}
                          <button
                            onClick={() => setDeleteConfirmMember(member)}
                            className="p-2 text-[#2B2B2B]/70 hover:text-red-700 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                            title="Revoke & Delete Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: CHANGE CREDENTIALS (PASSWORD & EMAIL)            */}
      {/* ========================================================= */}
      <Modal
        isOpen={credentialsModalOpen}
        onClose={() => setCredentialsModalOpen(false)}
        size="md"
        title="Change Staff Credentials"
        description={
          activeStaffTarget
            ? `Update vault login email address and authentication password for ${activeStaffTarget.fullName}.`
            : "Update staff login credentials"
        }
      >
        <form onSubmit={handleSaveCredentials} className="space-y-4">
          {/* Target Identity Pill */}
          {activeStaffTarget && (
            <div className="p-3 bg-[#F2EADB] border border-[#B8924A]/30 rounded-xs flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-[#5E0F1E]">
                  {activeStaffTarget.fullName}
                </p>
                <p className="text-xs text-[#2B2B2B]/70">
                  Role: {ROLE_CONFIG[activeStaffTarget.role]?.label}
                </p>
              </div>
              <Badge variant="outline" className="text-xs uppercase font-mono">
                {activeStaffTarget.id}
              </Badge>
            </div>
          )}

          {/* Login Email */}
          <div>
            <Label htmlFor="cred-email" className="text-sm font-semibold text-[#2B2B2B]">
              Vault Login Email Address
            </Label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 text-[#B8924A] absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                id="cred-email"
                type="email"
                required
                value={credNewEmail}
                onChange={(e) => setCredNewEmail(e.target.value)}
                placeholder="staff@isurugems.com"
                className="pl-9 bg-[#FDFBF7] border-[#B8924A]/30 text-sm h-10"
              />
            </div>
            <p className="text-xs text-[#2B2B2B]/60 mt-1">
              Used to access both the Admin Vault Console and Supabase Auth.
            </p>
          </div>

          {/* New Password */}
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="cred-password" className="text-sm font-semibold text-[#2B2B2B]">
                New Vault Password
              </Label>
              <button
                type="button"
                onClick={() => {
                  const strong = generateStrongPassword();
                  setCredNewPassword(strong);
                  setCredConfirmPassword(strong);
                  setShowPassword(true);
                }}
                className="text-xs text-[#B8924A] hover:text-[#5E0F1E] font-medium flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF67]" />
                Generate Strong
              </button>
            </div>

            <div className="relative mt-1">
              <Key className="w-4 h-4 text-[#B8924A] absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                id="cred-password"
                type={showPassword ? "text" : "password"}
                value={credNewPassword}
                onChange={(e) => setCredNewPassword(e.target.value)}
                placeholder="Leave blank to keep existing password"
                className="pl-9 pr-10 bg-[#FDFBF7] border-[#B8924A]/30 text-sm h-10 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2B2B2B]/50 hover:text-[#5E0F1E]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (only if password typed) */}
          {credNewPassword && (
            <div>
              <Label htmlFor="cred-confirm-password" className="text-sm font-semibold text-[#2B2B2B]">
                Confirm New Password
              </Label>
              <div className="relative mt-1">
                <Lock className="w-4 h-4 text-[#B8924A] absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="cred-confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={credConfirmPassword}
                  onChange={(e) => setCredConfirmPassword(e.target.value)}
                  placeholder="Re-enter password to confirm"
                  className="pl-9 bg-[#FDFBF7] border-[#B8924A]/30 text-sm h-10 font-mono"
                />
              </div>
            </div>
          )}

          {/* Security advisory */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xs text-xs text-amber-900 leading-relaxed flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              Passwords must be securely communicated to the staff member. Isuru Gems vaults enforce 256-bit hash encryption.
            </span>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-[#B8924A]/20 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCredentialsModalOpen(false)}
              className="text-sm h-9 px-4 border-[#B8924A]/40 text-[#2B2B2B]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={credLoading}
              className="bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] text-sm font-semibold uppercase tracking-wider h-9 px-4 rounded-xs border border-[#B8924A]/40"
            >
              {credLoading ? "Updating..." : "Save Credentials"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL 2: ADD NEW STAFF MEMBER                             */}
      {/* ========================================================= */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        size="lg"
        title="Add Staff Member"
        description="Provision administrative credentials and granular authorization permissions for gemstone operations."
      >
        <form onSubmit={handleCreateStaff} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="new-name" className="text-sm font-semibold text-[#2B2B2B]">
                Full Legal Name *
              </Label>
              <Input
                id="new-name"
                required
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                placeholder="e.g. Ruwan Wickramasinghe"
                className="mt-1 bg-[#FDFBF7] border-[#B8924A]/30 text-sm h-10"
              />
            </div>

            {/* Email Address */}
            <div>
              <Label htmlFor="new-email" className="text-sm font-semibold text-[#2B2B2B]">
                Login Email Address *
              </Label>
              <Input
                id="new-email"
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="ruwan@isurugems.com"
                className="mt-1 bg-[#FDFBF7] border-[#B8924A]/30 text-sm h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Role */}
            <div>
              <Label htmlFor="new-role" className="text-sm font-semibold text-[#2B2B2B]">
                Staff Role Hierarchy *
              </Label>
              <select
                id="new-role"
                value={newRole}
                onChange={(e) => {
                  const role = e.target.value as StaffRole;
                  setNewRole(role);
                  if (role === "super_admin") {
                    setNewCanManageGems(true);
                    setNewCanManageOrders(true);
                    setNewCanManageStaff(true);
                    setNewCanExportData(true);
                  }
                }}
                className="mt-1 w-full bg-[#FDFBF7] border border-[#B8924A]/30 text-sm text-[#2B2B2B] h-10 px-3 py-2 rounded-xs focus:outline-none focus:border-[#5E0F1E]"
              >
                <option value="super_admin">Super Administrator</option>
                <option value="vault_custodian">Vault Custodian</option>
                <option value="gemologist">Staff Gemologist</option>
                <option value="concierge_agent">Client Concierge</option>
                <option value="inventory_clerk">Inventory Clerk</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <Label htmlFor="new-dept" className="text-sm font-semibold text-[#2B2B2B]">
                Department / Bureau
              </Label>
              <Input
                id="new-dept"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                placeholder="e.g. Ratnapura Vault Logistics"
                className="mt-1 bg-[#FDFBF7] border-[#B8924A]/30 text-sm h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <Label htmlFor="new-phone" className="text-sm font-semibold text-[#2B2B2B]">
                Direct Contact Phone
              </Label>
              <Input
                id="new-phone"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+94 77 000 0000"
                className="mt-1 bg-[#FDFBF7] border-[#B8924A]/30 text-sm h-10"
              />
            </div>

            {/* Initial Password */}
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="new-pass" className="text-sm font-semibold text-[#2B2B2B]">
                  Initial Vault Password
                </Label>
                <button
                  type="button"
                  onClick={() => setNewPassword(generateStrongPassword())}
                  className="text-xs text-[#B8924A] hover:text-[#5E0F1E] font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF67]" />
                  Generate
                </button>
              </div>
              <Input
                id="new-pass"
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="mt-1 bg-[#FDFBF7] border-[#B8924A]/30 text-sm h-10 font-mono"
              />
            </div>
          </div>

          {/* Granular Permission Checkboxes */}
          <div>
            <Label className="text-sm font-semibold text-[#2B2B2B] block mb-2">
              Granular Console Permissions
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-[#F2EADB]/60 border border-[#B8924A]/25 rounded-xs">
              <label className="flex items-center gap-2 text-sm text-[#2B2B2B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newCanManageGems}
                  onChange={(e) => setNewCanManageGems(e.target.checked)}
                  className="accent-[#5E0F1E] w-4 h-4"
                />
                <span>Manage Gems</span>
              </label>

              <label className="flex items-center gap-2 text-sm text-[#2B2B2B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newCanManageOrders}
                  onChange={(e) => setNewCanManageOrders(e.target.checked)}
                  className="accent-[#5E0F1E] w-4 h-4"
                />
                <span>Manage Orders</span>
              </label>

              <label className="flex items-center gap-2 text-sm text-[#2B2B2B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newCanManageStaff}
                  onChange={(e) => setNewCanManageStaff(e.target.checked)}
                  className="accent-[#5E0F1E] w-4 h-4"
                />
                <span>Manage Staff</span>
              </label>

              <label className="flex items-center gap-2 text-sm text-[#2B2B2B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newCanExportData}
                  onChange={(e) => setNewCanExportData(e.target.checked)}
                  className="accent-[#5E0F1E] w-4 h-4"
                />
                <span>Export Dossiers</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="new-notes" className="text-sm font-semibold text-[#2B2B2B]">
              Administrative Notes & Background
            </Label>
            <Input
              id="new-notes"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="e.g. NGJA certified gemologist, specialized in Corundum thermal treatment detection."
              className="mt-1 bg-[#FDFBF7] border-[#B8924A]/30 text-sm h-10"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-[#B8924A]/20 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddModalOpen(false)}
              className="text-sm h-9 px-4 border-[#B8924A]/40 text-[#2B2B2B]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addLoading}
              className="bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] text-sm font-semibold uppercase tracking-wider h-9 px-4 rounded-xs border border-[#B8924A]/40"
            >
              {addLoading ? "Enrolling..." : "Create Staff Profile"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL 3: EDIT PROFILE & PERMISSIONS                       */}
      {/* ========================================================= */}
      <Modal
        isOpen={editProfileModalOpen}
        onClose={() => setEditProfileModalOpen(false)}
        size="lg"
        title="Edit Staff Profile & Permissions"
        description={
          activeStaffTarget
            ? `Modify role, departmental assignments, and operational permissions for ${activeStaffTarget.fullName}.`
            : "Edit staff details"
        }
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name" className="text-sm font-semibold text-[#2B2B2B]">
                Full Legal Name
              </Label>
              <Input
                id="edit-name"
                required
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                className="mt-1 bg-[#FDFBF7] border-[#B8924A]/30 text-sm h-10"
              />
            </div>

            <div>
              <Label htmlFor="edit-dept" className="text-sm font-semibold text-[#2B2B2B]">
                Department
              </Label>
              <Input
                id="edit-dept"
                value={editDepartment}
                onChange={(e) => setEditDepartment(e.target.value)}
                className="mt-1 bg-[#FDFBF7] border-[#B8924A]/30 text-sm h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="edit-role" className="text-sm font-semibold text-[#2B2B2B]">
                Role Hierarchy
              </Label>
              <select
                id="edit-role"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as StaffRole)}
                className="mt-1 w-full bg-[#FDFBF7] border border-[#B8924A]/30 text-sm text-[#2B2B2B] h-10 px-3 py-2 rounded-xs focus:outline-none focus:border-[#5E0F1E]"
              >
                <option value="super_admin">Super Administrator</option>
                <option value="vault_custodian">Vault Custodian</option>
                <option value="gemologist">Staff Gemologist</option>
                <option value="concierge_agent">Client Concierge</option>
                <option value="inventory_clerk">Inventory Clerk</option>
              </select>
            </div>

            <div>
              <Label htmlFor="edit-status" className="text-sm font-semibold text-[#2B2B2B]">
                Status
              </Label>
              <select
                id="edit-status"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as StaffStatus)}
                className="mt-1 w-full bg-[#FDFBF7] border border-[#B8924A]/30 text-sm text-[#2B2B2B] h-10 px-3 py-2 rounded-xs focus:outline-none focus:border-[#5E0F1E]"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <Label htmlFor="edit-phone" className="text-sm font-semibold text-[#2B2B2B]">
                Contact Phone
              </Label>
              <Input
                id="edit-phone"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="mt-1 bg-[#FDFBF7] border-[#B8924A]/30 text-sm h-10"
              />
            </div>
          </div>

          {/* Granular Permission Checkboxes */}
          <div>
            <Label className="text-sm font-semibold text-[#2B2B2B] block mb-2">
              Granular Console Permissions
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-[#F2EADB]/60 border border-[#B8924A]/25 rounded-xs">
              <label className="flex items-center gap-2 text-sm text-[#2B2B2B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={editCanManageGems}
                  onChange={(e) => setEditCanManageGems(e.target.checked)}
                  className="accent-[#5E0F1E] w-4 h-4"
                />
                <span>Manage Gems</span>
              </label>

              <label className="flex items-center gap-2 text-sm text-[#2B2B2B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={editCanManageOrders}
                  onChange={(e) => setEditCanManageOrders(e.target.checked)}
                  className="accent-[#5E0F1E] w-4 h-4"
                />
                <span>Manage Orders</span>
              </label>

              <label className="flex items-center gap-2 text-sm text-[#2B2B2B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={editCanManageStaff}
                  onChange={(e) => setEditCanManageStaff(e.target.checked)}
                  className="accent-[#5E0F1E] w-4 h-4"
                />
                <span>Manage Staff</span>
              </label>

              <label className="flex items-center gap-2 text-sm text-[#2B2B2B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={editCanExportData}
                  onChange={(e) => setEditCanExportData(e.target.checked)}
                  className="accent-[#5E0F1E] w-4 h-4"
                />
                <span>Export Dossiers</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="edit-notes" className="text-sm font-semibold text-[#2B2B2B]">
              Administrative Notes
            </Label>
            <Input
              id="edit-notes"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="mt-1 bg-[#FDFBF7] border-[#B8924A]/30 text-sm h-10"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-[#B8924A]/20 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditProfileModalOpen(false)}
              className="text-sm h-9 px-4 border-[#B8924A]/40 text-[#2B2B2B]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={editLoading}
              className="bg-[#5E0F1E] hover:bg-[#420A15] text-[#FAF6EE] text-sm font-semibold uppercase tracking-wider h-9 px-4 rounded-xs border border-[#B8924A]/40"
            >
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL 4: DELETE CONFIRMATION                              */}
      {/* ========================================================= */}
      <Modal
        isOpen={Boolean(deleteConfirmMember)}
        onClose={() => setDeleteConfirmMember(null)}
        size="sm"
        title="Revoke Vault Access"
        description="Are you sure you want to revoke credentials and delete this staff member from the console?"
      >
        <div className="space-y-4">
          {deleteConfirmMember && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xs text-sm text-red-900 space-y-1">
              <p className="font-semibold">
                Revoking access for: {deleteConfirmMember.fullName}
              </p>
              <p className="text-xs font-mono">{deleteConfirmMember.email}</p>
              <p className="text-xs text-red-700/80 mt-1">
                This action revokes their vault authorization key and terminates active sessions immediately.
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirmMember(null)}
              className="text-sm h-9 px-4 border-[#B8924A]/40"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmDelete}
              className="bg-red-700 hover:bg-red-800 text-white text-sm h-9 px-4 font-semibold"
            >
              Confirm Revocation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
