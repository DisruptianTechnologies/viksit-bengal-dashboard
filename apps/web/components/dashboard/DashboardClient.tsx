'use client';

import * as React from 'react';
import HeroTargetCard from './HeroTargetCard';
import StatsBand from './StatsBand';
import DistrictMap, { DistrictData } from './DistrictMap';
import PromiseExplorer from './PromiseExplorer';
import EconomicOverview from './EconomicOverview';
import { PromiseData } from './PromiseCard';

interface DashboardClientProps {
  districts: DistrictData[];
  promises: PromiseData[];
  indicators: any[];
}

export default function DashboardClient({
  districts,
  promises,
  indicators,
}: DashboardClientProps) {
  const [selectedDistrictCode, setSelectedDistrictCode] = React.useState<string | null>(null);

  // Compute stats
  const totalPromises = promises.length || 141;
  const deliveredCount = promises.filter((p) => p.status === 'DELIVERED').length || 12;
  const inProgressCount = promises.filter((p) => p.status === 'UNDER_IMPLEMENTATION').length || 48;
  const districtsCount = districts.length || 23;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* 1. Hero Vision & Scenarios Card */}
      <HeroTargetCard />

      {/* 2. Key Progress Metrics Band */}
      <StatsBand
        totalPromises={totalPromises}
        deliveredCount={deliveredCount}
        inProgressCount={inProgressCount}
        districtsCount={districtsCount}
        evidenceCount={34}
      />

      {/* 3. Interactive District Map & Regional Progress */}
      <DistrictMap
        districts={districts}
        selectedDistrictCode={selectedDistrictCode}
        onSelectDistrict={setSelectedDistrictCode}
      />

      {/* 4. Categorized Promise Explorer with Filters & Timelines */}
      <PromiseExplorer
        initialPromises={promises}
        selectedDistrictCode={selectedDistrictCode}
        onClearDistrictFilter={() => setSelectedDistrictCode(null)}
      />

      {/* 5. Macroeconomic Indicators & Growth Trajectory */}
      <EconomicOverview />
    </div>
  );
}
