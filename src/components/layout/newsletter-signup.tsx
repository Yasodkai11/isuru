"use client";

import { useState } from "react";
import { ArrowRight, ArrowUp, CheckCircle2 } from "lucide-react";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group inline-flex items-center gap-2 uppercase tracking-[0.2em] text-[#D4AF67] hover:text-[#F3DFA2] cursor-pointer shrink-0"
    >
      Back to top
      <span className="w-7 h-7 rounded-full border border-[#D4AF67]/40 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5">
        <ArrowUp className="w-3 h-3" />
      </span>
    </button>
  );
}

export function NewsletterSignup() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  if (subscribed) {
    return (
      <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#D4AF67] border border-[#B8924A]/30 p-3">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>Thank you. You are enrolled for confidential acquisitions.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubscribe} className="flex border-b border-[#D4AF67]/50 focus-within:border-[#D4AF67] transition-colors">
      <label htmlFor="footer-email" className="sr-only">
        Email address
      </label>
      <input
        id="footer-email"
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="flex-1 bg-transparent py-2.5 text-sm sm:text-base font-light text-[#FAF6EE] placeholder:text-[#FAF6EE]/35 focus:outline-none"
      />
      <button
        type="submit"
        className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D4AF67] hover:text-[#F3DFA2] pl-3 cursor-pointer"
      >
        Subscribe
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </form>
  );
}