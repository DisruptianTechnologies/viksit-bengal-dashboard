import * as React from 'react';
import { setRequestLocale } from 'next-intl/server';
import PromiseExplorer from '@/components/dashboard/PromiseExplorer';
import { getPromises } from '@/lib/api';
import seedData from '../../../../../packages/database/prisma/seed-data.json';

export const dynamic = 'force-dynamic';

export default async function PromisesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  let promises: any[] = [];
  try {
    const p = await getPromises().catch(() => null);
    promises = p && Array.isArray(p) && p.length > 0 ? p : (seedData.promises || []);
  } catch {
    promises = seedData.promises || [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-3xl font-extrabold text-ink">
          {locale === 'bn' ? 'সকল নীতিগত প্রতিশ্রুতি ও অগ্রগতি' : 'State Policy Commitments & Progress'}
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          {locale === 'bn'
            ? 'পশ্চিমবঙ্গ সরকারের সকল নির্বাচনী ও নীতিগত প্রতিশ্রুতির সার্বক্ষণিক পর্যবেক্ষণ ও বাস্তবায়ন অগ্রগতি'
            : 'Comprehensive tracking of all governmental commitments across 15 developmental sectors.'}
        </p>
      </div>
      <PromiseExplorer initialPromises={promises} />
    </div>
  );
}
