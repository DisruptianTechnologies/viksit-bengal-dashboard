'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Calendar, ArrowUpRight, ShieldCheck, DollarSign } from 'lucide-react';
import { toBengaliNumerals } from '@viksit/shared';

interface ScenarioInfo {
  key: 'conservative' | 'base_case' | 'ambitious';
  targetUsd: number;
  cagr: number;
  inrRate: number;
  labelEn: string;
  labelBn: string;
  color: string;
  descEn: string;
  descBn: string;
}

const SCENARIOS: ScenarioInfo[] = [
  {
    key: 'conservative',
    targetUsd: 750,
    cagr: 10.5,
    inrRate: 88,
    labelEn: 'Conservative',
    labelBn: 'রক্ষণশীল',
    color: 'border-amber-400 bg-amber-50 text-amber-950',
    descEn: 'Assumes steady base growth with moderate export inflows and resilient agri-output.',
    descBn: 'মাঝারি রফতানি এবং কৃষির স্বাভাবিক প্রবৃদ্ধির ওপর ভিত্তি করে নির্ধারিত।'
  },
  {
    key: 'base_case',
    targetUsd: 1000,
    cagr: 13.0,
    inrRate: 85,
    labelEn: 'Base Case ($1T)',
    labelBn: 'ভিত্তিরেখা ($১ ট্রিলিয়ন)',
    color: 'border-primary bg-emerald-50 text-emerald-950',
    descEn: 'Consensus target driven by Tajpur deep seaport, industrial corridors, and tech exports.',
    descBn: 'তাজপুর গভীর সমুদ্র বন্দর, শিল্প করিডোর ও আইটি রফতানি দ্বারা চালিত প্রধান লক্ষ্যমাত্রা।'
  },
  {
    key: 'ambitious',
    targetUsd: 1250,
    cagr: 15.5,
    inrRate: 82,
    labelEn: 'Ambitious',
    labelBn: 'উচ্চাকাঙ্ক্ষী',
    color: 'border-blue-500 bg-blue-50 text-blue-950',
    descEn: 'Accelerated capital investment, global semiconductor and manufacturing supply chains.',
    descBn: 'ব্যাপক মূলধনী বিনিয়োগ, সেমিকন্ডাক্টর ও গ্লোবাল সাপ্লাই চেইন সম্প্রসারণের লক্ষ্য।'
  }
];

export default function HeroTargetCard() {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const [activeScenario, setActiveScenario] = React.useState<'conservative' | 'base_case' | 'ambitious'>('base_case');

  const scenario = SCENARIOS.find((s) => s.key === activeScenario) || SCENARIOS[1];
  const currentGsdpUsd = 210;
  const progressPercent = Math.min(Math.round((currentGsdpUsd / scenario.targetUsd) * 100), 100);
  const yearsRemaining = 7;

  const formatNum = (val: number | string) => {
    return locale === 'bn' ? toBengaliNumerals(val) : String(val);
  };

  return (
    <Card className="overflow-hidden border-2 border-emerald-900/10 shadow-xl bg-gradient-to-br from-white via-emerald-50/20 to-white">
      <CardHeader className="pb-4 border-b border-stone-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-primary border border-emerald-300">
                {locale === 'bn' ? 'রূপকল্প ২০৩০' : 'Vision 2030'}
              </span>
              <Badge variant="outline" className="font-semibold text-stone-700">
                {locale === 'bn' ? 'পশ্চিমবঙ্গ জিএসডিপি' : 'West Bengal GSDP Target'}
              </Badge>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink flex items-center gap-2 pt-1">
              <Target className="w-7 h-7 text-primary" aria-hidden="true" />
              {t('targetCardTitle')}
            </CardTitle>
            <CardDescription className="text-base text-stone-600 max-w-2xl">
              {t('targetCardDescription')}
            </CardDescription>
          </div>

          {/* Scenario Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-100 rounded-xl border border-stone-200">
            {SCENARIOS.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveScenario(s.key)}
                className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  activeScenario === s.key
                    ? 'bg-primary text-white shadow-md'
                    : 'text-stone-700 hover:bg-stone-200'
                }`}
                aria-pressed={activeScenario === s.key}
              >
                {locale === 'bn' ? s.labelBn : s.labelEn}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-600 text-xs font-medium">
              <span>{t('currentGsdp')}</span>
              <DollarSign className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-ink tracking-tight">
                ${formatNum(210)}B
              </span>
              <span className="text-xs text-stone-500 font-medium">
                ({formatNum('18.5')} {locale === 'bn' ? 'লাখ কোটি টাকা' : 'Lakh Cr'})
              </span>
            </div>
            <div className="mt-2 text-[11px] text-stone-500 font-medium">
              {locale === 'bn' ? 'ভিত্তি বছর: ২০২৪' : 'Base Year: 2024'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold">
              <span>{t('targetGsdp')}</span>
              <Target className="w-4 h-4 text-primary" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-primary tracking-tight">
                ${formatNum(scenario.targetUsd)}B
              </span>
              <span className="text-xs text-emerald-800 font-medium">
                ({formatNum(Math.round((scenario.targetUsd * scenario.inrRate) / 100))} {locale === 'bn' ? 'লাখ কোটি টাকা' : 'Lakh Cr'})
              </span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-700 font-medium">
              {locale === 'bn' ? 'লক্ষ্য বছর: ২০৩৩' : 'Target Year: 2033'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-600 text-xs font-medium">
              <span>{t('requiredCagr')}</span>
              <TrendingUp className="w-4 h-4 text-amber-700" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-amber-800 tracking-tight">
                {formatNum(scenario.cagr)}%
              </span>
              <span className="text-xs text-stone-500 font-medium">CAGR</span>
            </div>
            <div className="mt-2 text-[11px] text-stone-500 font-medium">
              ₹/{'$'} {formatNum(scenario.inrRate)} FX
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-stone-600 text-xs font-medium">
              <span>{t('yearsRemaining')}</span>
              <Calendar className="w-4 h-4 text-stone-700" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-ink tracking-tight">
                {formatNum(yearsRemaining)}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {locale === 'bn' ? 'বছর' : 'Years'}
              </span>
            </div>
            <div className="mt-2 text-[11px] text-stone-500 font-medium">
              {locale === 'bn' ? 'মেয়াদ: ২০২৬ - ২০৩১+' : 'Horizon: 2026 - 2031+'}
            </div>
          </div>
        </div>

        {/* Progress Towards Target */}
        <div className="space-y-2 p-4 bg-white rounded-xl border border-stone-200">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="text-ink flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              {locale === 'bn' ? 'বর্তমান অর্জনের অনুপাত' : 'Progress Towards Target'}
            </span>
            <span className="text-primary font-bold">{formatNum(progressPercent)}%</span>
          </div>
          <Progress
            value={progressPercent}
            className="h-3.5 bg-stone-100"
            indicatorClassName="bg-gradient-to-r from-emerald-600 to-primary"
            aria-label={`Current GSDP is ${progressPercent}% of the ${scenario.labelEn} target`}
          />
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium pt-1">
            <span>$0B</span>
            <span className="font-semibold text-stone-700">${formatNum(210)}B ({locale === 'bn' ? 'বর্তমান' : 'Current'})</span>
            <span>${formatNum(scenario.targetUsd)}B ({locale === 'bn' ? 'লক্ষ্যমাত্রা' : 'Target'})</span>
          </div>
        </div>

        {/* Contextual notes */}
        <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-start gap-2.5">
          <ArrowUpRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-ink font-bold">
              {locale === 'bn' ? scenario.labelBn : scenario.labelEn}:{' '}
            </strong>
            {locale === 'bn' ? scenario.descBn : scenario.descEn}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
