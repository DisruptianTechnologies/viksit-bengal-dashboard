'use client';

import * as React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { HeartHandshake, LogIn, LogOut, ShieldCheck, Lock } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { openSabaiFoundationModal } from "@/components/citizen/SabaiFoundationModal";
import { useAuth } from "@/components/auth/AuthContext";

export default function Header() {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const { userProfile, authLoading, signInWithGoogle, signOutUser } = useAuth();

  return (
    <header
      role="banner"
      className="bg-primary text-white border-b border-emerald-900 shadow-md sticky top-0 z-40 transition-colors"
    >
      {/* Indian National Flag (Tricolour: Saffron, White, India Green) Ribbon */}
      <div className="w-full h-1.5 flex" aria-hidden="true">
        <div className="flex-1 bg-[#FF671F]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0A5C36]" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Single-element Brand Wordmark */}
          <Link
            href={`/${locale}`}
            className="font-extrabold text-lg tracking-tight text-white whitespace-nowrap shrink-0 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 ring-offset-primary rounded px-1 py-1"
            aria-label="Viksit Bengal Dashboard - Home"
          >
            {t("brand")}
          </Link>

          {/* Zone 2: Primary Navigation Landmark (Single-Line Links) */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-5"
          >
            <Link
              href={`/${locale}`}
              className="min-h-[44px] py-2 text-sm font-medium text-white hover:underline underline-offset-4 transition-colors flex items-center whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              {locale === "bn" ? "সারসংক্ষেপ" : "Overview"}
            </Link>
            <Link
              href={`/${locale}/dashboard`}
              className="min-h-[44px] py-2 text-sm font-medium text-white hover:underline underline-offset-4 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              {!userProfile && <Lock className="w-3 h-3 text-amber-300" aria-hidden="true" />}
              <span>{locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}</span>
            </Link>
            <Link
              href={`/${locale}/promises`}
              className="min-h-[44px] py-2 text-sm font-medium text-white hover:underline underline-offset-4 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              {!userProfile && <Lock className="w-3 h-3 text-amber-300" aria-hidden="true" />}
              <span>{t("promises")}</span>
            </Link>
            <Link
              href={`/${locale}/districts`}
              className="min-h-[44px] py-2 text-sm font-medium text-white hover:underline underline-offset-4 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              {!userProfile && <Lock className="w-3 h-3 text-amber-300" aria-hidden="true" />}
              <span>{t("districts")}</span>
            </Link>
            <Link
              href={`/${locale}/indicators`}
              className="min-h-[44px] py-2 text-sm font-medium text-white hover:underline underline-offset-4 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              {!userProfile && <Lock className="w-3 h-3 text-amber-300" aria-hidden="true" />}
              <span>{t("indicators")}</span>
            </Link>
            <Link
              href={`/${locale}/admin`}
              className="min-h-[44px] py-2 text-sm font-medium text-emerald-100 hover:text-white hover:underline underline-offset-4 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              {(!userProfile || userProfile.role === "CITIZEN") && (
                <Lock className="w-3 h-3 text-amber-300" aria-hidden="true" />
              )}
              <span>{t("admin")}</span>
            </Link>
          </nav>

          {/* Zone 3: Google Auth Status, Sabai Foundation Trigger & Language Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            {userProfile ? (
              <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-400/30 rounded-lg px-2.5 py-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" aria-hidden="true" />
                <span className="text-[11px] font-bold text-white max-w-[110px] truncate hidden sm:inline">
                  {userProfile.displayName || userProfile.email}
                </span>
                <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-amber-400 text-stone-950">
                  {userProfile.role}
                </span>
                <button
                  type="button"
                  onClick={() => void signOutUser()}
                  title={locale === "bn" ? "সাইন আউট" : "Sign Out"}
                  className="p-1 rounded hover:bg-emerald-900 text-emerald-100 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => void signInWithGoogle()}
                disabled={authLoading}
                className="min-h-[40px] px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-950 font-extrabold text-xs inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                <span>
                  {locale === "bn" ? "গুগল সাইন-ইন" : "Sign in with Google"}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={openSabaiFoundationModal}
              className="min-h-[40px] px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs hidden lg:inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
            >
              <HeartHandshake className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>
                {locale === "bn" ? "অনুদান ও সদস্যপদ" : "Donate · Membership"}
              </span>
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}