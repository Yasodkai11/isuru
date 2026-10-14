"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { AdminAuthBarrier } from "./admin-auth-barrier";
import { getCurrentUserAction, CurrentUserSession } from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [session, setSession] = useState<CurrentUserSession>({
    isAuthenticated: false,
    isAdmin: false,
    user: null,
  });

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    let isMounted = true;

    async function checkAuth() {
      try {
        const result = await getCurrentUserAction();
        if (isMounted) {
          setSession(result);
          setCheckingAuth(false);
        }
      } catch {
        if (isMounted) {
          setCheckingAuth(false);
        }
      }
    }

    checkAuth();

    // Listen for auth state changes on client
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      if (isMounted && !isLoginPage) {
        const updated = await getCurrentUserAction();
        setSession(updated);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isLoginPage]);

  // If this is the dedicated admin login page, render full width without admin chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state while verifying credentials
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#B8924A]/30 border-t-[#5E0F1E] rounded-full animate-spin" />
        <div className="space-y-1">
          <p className="font-serif text-lg text-[#5E0F1E]">Isuru Gems Ceylon</p>
          <p className="text-xs uppercase tracking-[0.2em] text-[#B8924A] font-semibold">
            Verifying Vault Access Clearance...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated or not an authorized staff member, show the security barrier
  if (!session.isAuthenticated || !session.isAdmin) {
    return <AdminAuthBarrier />;
  }

  return (
    <div className="admin-vault-shell min-h-screen flex bg-[#FAF6EE] text-[#2B2B2B]">
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        currentUser={session.user}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenMobile={() => setMobileSidebarOpen(true)}
          currentUser={session.user}
        />
        <main className="flex-1 p-5 sm:p-7 lg:p-9 max-w-7xl xl:max-w-[1440px] w-full mx-auto animate-gentle-fade">
          {children}
        </main>
      </div>
    </div>
  );
}
