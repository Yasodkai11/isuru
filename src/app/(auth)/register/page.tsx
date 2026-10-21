import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { GoldDivider } from "@/components/layout/gold-divider";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Register Collector Account",
    description: "Create your private account to manage unheated Ceylon gemstone acquisitions and provenance archives.",
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: "/register",
    },
  };
}

export default function RegisterPage() {
  return (
    <div className="py-16 bg-[#FAF6EE] min-h-[75vh] flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-[#FDFBF7] border border-[#B8924A]/30 p-8 sm:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8924A] font-semibold block">
              Join Our Patron Circle
            </span>
            {/* Strictly the single H1 for this page */}
            <h1 className="font-serif text-3xl text-[#5E0F1E] font-normal">
              Register Collector Account
            </h1>
            <p className="text-xs text-[#2B2B2B]/70 leading-relaxed">
              Gain advance notice of rare rough crystal recoveries from Ratnapura and reserve private viewings.
            </p>
          </div>

          <GoldDivider className="my-4" />

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
