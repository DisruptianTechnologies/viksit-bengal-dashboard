'use client';

import * as React from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { HeartHandshake } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { openSabaiFoundationModal } from "@/components/citizen/SabaiFoundationModal";

export default function Header() {
  const t = useTranslations("Navigation");
  const locale = useLocale();

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
        <div className="flex items-center justify-between gap-8 h-16">
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
            className="hidden md:flex items-center gap-6"
          >
            <Link
              href={`/${locale}`}
              className="min-h-[44px] py-2 text-sm font-medium text-white hover:underline underline-offset-4 transition-colors flex items-center whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              {locale === "bn" ? "সারসংক্ষেপ" : "Overview"}
            </Link>
            <Link
              href={`/${locale}/dashboard`}
              className="min-h-[44px] py-2 text-sm font-medium text-white hover:underline underline-offset-4 transition-colors flex items-center whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              {locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
            </Link>
            <Link
              href={`/${locale}/promises`}
              className="min-h-[44px] py-2 text-sm font-medium text-white hover:underline underline-offset-4 transition-colors flex items-center whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              {t("promises")}
            </Link>
            <Link
              href={`/${locale}/districts`}
              className="min-h-[44px] py-2 text-sm font-medium text-white hover:underline underline-offset-4 transition-colors flex items-center whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              {t("districts")}
            </Link>
            <Link
              href={`/${locale}/indicators`}
              className="min-h-[44px] py-2 text-sm font-medium text-white hover:underline underline-offset-4 transition-colors flex items-center whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              {t("indicators")}
            </Link>
            <Link
              href={`/${locale}/admin`}
              className="min-h-[44px] py-2 text-sm font-medium text-emerald-100 hover:text-white hover:underline underline-offset-4 transition-colors flex items-center whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            >
              {t("admin")}
            </Link>
          </nav>

          {/* Zone 3: Sabai Foundation Membership Trigger & Language Switcher */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={openSabaiFoundationModal}
              className="min-h-[40px] px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
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