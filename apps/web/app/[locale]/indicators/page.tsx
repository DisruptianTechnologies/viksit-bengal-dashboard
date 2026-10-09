import * as React from 'react';
import { setRequestLocale } from 'next-intl/server';
import HeroTargetCard from '@/components/dashboard/HeroTargetCard';
import EconomicOverview from '@/components/dashboard/EconomicOverview';

export const dynamic = 'force-dynamic';

export default async function IndicatorsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-3xl font-extrabold text-ink">
          {locale === 'bn' ? '$১ ট্রিলিয়ন অর্থনীতির লক্ষ্য ও সূচক' : '$1 Trillion Economic Indicators'}
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          {locale === 'bn'
            ? 'পশ্চিমবঙ্গের জিএসডিপি বৃদ্ধি, শিল্পায়ন, রফতানি ও কর্মসংস্থানের সার্বিক রূপরেখা'
            : 'Detailed growth models, macroeconomic pillars, and capital investment projections towards 2033.'}
        </p>
      </div>

      <HeroTargetCard />
      <EconomicOverview />
    </div>
  );
}
