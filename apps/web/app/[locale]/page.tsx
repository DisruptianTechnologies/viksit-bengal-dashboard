import * as React from 'react';
import { setRequestLocale } from 'next-intl/server';
import LandingView from '@/components/landing/LandingView';
import { CitizenChatbot } from '@/components/chat/CitizenChatbot';
import { getDistricts, getPromises, getDailyTally } from '@/lib/api';
import seedData from '../../../../packages/database/prisma/seed-data.json';

export const dynamic = 'force-dynamic';

export default async function LandingHomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  let districts: any[] = [];
  let promises: any[] = [];
  let dailyTally = null;

  try {
    const [d, p, tally] = await Promise.all([
      getDistricts().catch(() => null),
      getPromises().catch(() => null),
      getDailyTally().catch(() => null),
    ]);

    districts = d && Array.isArray(d) && d.length > 0 ? d : (seedData.districts || []);
    promises = p && Array.isArray(p) && p.length > 0 ? p : (seedData.promises || []);
    dailyTally = tally;
  } catch {
    districts = seedData.districts || [];
    promises = seedData.promises || [];
    dailyTally = null;
  }

  const deliveredCount = promises.filter((p: any) => p.status === 'DELIVERED').length || 12;

  return (
    <main className="min-h-screen bg-stone-50/50">
      <LandingView
        locale={locale}
        districtsCount={districts.length || 23}
        promisesCount={promises.length || 141}
        deliveredCount={deliveredCount}
        initialTally={dailyTally}
      />
      {/* Floating bilingual Sonar Bondhu AI Chatbot accessible across landing page */}
      <CitizenChatbot locale={locale} />
    </main>
  );
}
