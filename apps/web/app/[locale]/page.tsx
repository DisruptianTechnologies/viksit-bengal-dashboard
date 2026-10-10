import * as React from 'react';
import { setRequestLocale } from 'next-intl/server';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { getDistricts, getPromises, getIndicators } from '@/lib/api';
import seedData from '../../../../packages/database/prisma/seed-data.json';

export const dynamic = 'force-dynamic';

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  let districts: any[] = [];
  let promises: any[] = [];
  let indicators: any[] = [];

  try {
    const [d, p, ind] = await Promise.all([
      getDistricts().catch(() => null),
      getPromises().catch(() => null),
      getIndicators().catch(() => null),
    ]);

    districts = d && Array.isArray(d) && d.length > 0 ? d : (seedData.districts || []);
    promises = p && Array.isArray(p) && p.length > 0 ? p : (seedData.promises || []);
    indicators = ind && Array.isArray(ind) ? ind : (seedData.indicators || []);
  } catch {
    districts = seedData.districts || [];
    promises = seedData.promises || [];
    indicators = seedData.indicators || [];
  }

  // Format districts if from seedData
  const formattedDistricts = districts.map((d: any, i: number) => ({
    id: d.id || `dist-${i}`,
    code: d.code,
    nameEn: d.nameEn,
    nameBn: d.nameBn,
    population: d.population || 3500000,
    area: d.area,
    gsdpShare: d.gsdpShare || +(2.5 + ((i % 5) * 1.5)).toFixed(2),
    promiseCount: d.promiseCount || 6,
  }));

  return (
    <main className="min-h-screen bg-stone-50/60 pb-16">
      <DashboardClient
        locale={locale}
        districts={formattedDistricts}
        promises={promises}
        indicators={indicators}
      />
    </main>
  );
}
