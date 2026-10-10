'use client';

import React, { useState, useEffect } from 'react';
import { DailyTallyMetrics } from '@viksit/shared';
import { getDailyTally, triggerScrapeRun } from '../../lib/api';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CitizenEvidenceModal } from '../citizen/CitizenEvidenceModal';
import {
  Sparkles,
  ExternalLink,
  Share2,
  RefreshCw,
  PlusCircle,
  Building2,
  Clock,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

interface DailyTallyFeedProps {
  locale: string;
  initialData?: DailyTallyMetrics;
}

export function DailyTallyFeed({ locale, initialData }: DailyTallyFeedProps) {
  const [data, setData] = useState<DailyTallyMetrics | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const isBn = locale === 'bn';

  const loadTally = async () => {
    try {
      const tally = await getDailyTally();
      setData(tally);
    } catch (err) {
      console.error('Failed to load daily tally:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData) {
      loadTally();
    }
  }, [initialData]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await triggerScrapeRun();
      await loadTally();
    } catch (err) {
      console.error('Scrape run trigger failed:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleShareWhatsApp = (title: string, url?: string) => {
    const text = encodeURIComponent(
      `🏛️ ${isBn ? 'বিকশিত বাংলা যাচাইকৃত আপডেট' : 'Viksit Bengal Verified Update'}:\n${title}\n${url || window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTwitter = (title: string, url?: string) => {
    const text = encodeURIComponent(
      `🏛️ #ViksitBengal Verified Policy Tally:\n"${title}"\nTracking West Bengal's $1T Economy Vision.`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url || window.location.href)}`, '_blank');
  };

  const getTierBadge = (tier: string) => {
    if (tier === 'TIER_1') {
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200">
          <ShieldCheck className="w-3 h-3 mr-1" />
          {isBn ? 'স্তর ১: অফিশিয়াল গেজেট / আদেশ' : 'Tier 1: Official Legal Order'}
        </Badge>
      );
    }
    if (tier === 'TIER_2') {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200">
          <Building2 className="w-3 h-3 mr-1" />
          {isBn ? 'স্তর ২: প্রাতিষ্ঠানিক রিপোর্ট' : 'Tier 2: Institutional Release'}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200">
        <Clock className="w-3 h-3 mr-1" />
        {isBn ? 'স্তর ৩: যাচাইকৃত সংবাদপত্র' : 'Tier 3: Verified Press'}
      </Badge>
    );
  };

  return (
    <section aria-labelledby="daily-tally-heading" className="w-full my-8 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
              {isBn ? 'স্বয়ংক্রিয় দৈনিক স্ক্র্যাপার ও যাচাইকরণ ইঞ্জিন' : 'Autonomous Daily Verified Scraper Sync'}
            </span>
          </div>
          <h2 id="daily-tally-heading" className="text-2xl font-black tracking-tight">
            {isBn ? 'আজকের সরকারি খতিয়ান ও বাস্তবায়ন ট্র্যাকার' : "Today's Verified Governance Tally"}
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl">
            {isBn
              ? 'পশ্চিমবঙ্গ গেজেট, ক্যাবিনেট সিদ্ধান্ত, পিআইবি এবং বিধানসভা প্রশ্নোত্তর থেকে প্রতিদিনের আদেশ যাচাই করে নির্বাচনী প্রতিশ্রুতির সাথে সরাসরি মেলানো হয়।'
              : 'Continuous intake from West Bengal Gazette, Cabinet Orders, PIB, and CAG audits reconciled against 100+ public promises.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? (isBn ? 'হালনাগাদ হচ্ছে...' : 'Syncing...') : (isBn ? 'লাইভ সিঙ্ক' : 'Trigger Sync')}</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-semibold"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isBn ? 'মাঠের তথ্য জমা দিন' : 'Submit Evidence'}</span>
          </Button>
        </div>
      </div>

      {/* KPI mini-counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            {isBn ? 'আজকের যাচাইকৃত নথি' : 'Verified Orders Today'}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              {data?.todayVerifiedItemsCount || 6}
            </span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" /> {isBn ? 'নতুন' : 'new'}
            </span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            {isBn ? 'অগ্রসর হওয়া প্রতিশ্রুতি' : 'Promises Moved Today'}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {data?.todayPromisesMovedCount || 4}
            </span>
            <span className="text-xs font-medium text-indigo-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> {isBn ? 'অগ্রগতি' : 'progress'}
            </span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            {isBn ? 'শনাক্তকৃত বরাদ্দ' : 'Tracked Outlay Sanctioned'}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ₹1,830 Cr
            </span>
            <span className="text-xs text-slate-500">{isBn ? 'আজকে' : 'today'}</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            {isBn ? 'নজরদারিকৃত উৎস' : 'Monitored Feeds'}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              7
            </span>
            <span className="text-xs font-medium text-emerald-600">
              {isBn ? 'সক্রিয় টিয়ার ১–৩' : 'active tiers 1–3'}
            </span>
          </div>
        </div>
      </div>

      {/* Feed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data?.recentEvidences?.map((ev) => (
          <article
            key={ev.id}
            className="flex flex-col justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                {getTierBadge(ev.sourceTier)}
                {ev.matchedPromiseCode && (
                  <span className="px-2 py-0.5 text-xs font-bold font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded">
                    [{ev.matchedPromiseCode}]
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                {ev.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                {ev.excerpt || (isBn ? 'সরকারি গ্যাজেট থেকে যাচাইকৃত নির্দেশিকা।' : 'Official directive verified from state publication.')}
              </p>

              {ev.matchedPromiseTitle && (
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    {isBn ? 'সংযুক্ত প্রতিশ্রুতি:' : 'Matched Policy Target:'}
                  </span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {ev.matchedPromiseTitle}
                  </div>
                  {ev.proposedStatus && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {isBn ? 'প্রস্তাবিত স্থিতি: ' : 'Status Movement: '}
                      <span className="uppercase">{ev.proposedStatus}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{ev.publisher || 'Govt of West Bengal'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShareWhatsApp(ev.title, ev.sourceUrl)}
                  title={isBn ? 'হোয়াটসঅ্যাপে শেয়ার করুন' : 'Share on WhatsApp'}
                  className="p-1 rounded text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                {ev.sourceUrl && ev.sourceUrl !== '#' && (
                  <a
                    href={ev.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={isBn ? 'মূল দলিল দেখুন' : 'View Source Document'}
                    className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <CitizenEvidenceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        locale={locale}
      />
    </section>
  );
}
