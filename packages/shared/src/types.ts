export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export interface ScrapedSourceDto {
  id: string;
  name: string;
  url: string;
  sourceType: string;
  sourceTier: 'TIER_1' | 'TIER_2' | 'TIER_3';
  categoryTag?: string;
  isActive: boolean;
  lastScrapedAt?: string;
}

export interface ScrapeRunSummary {
  id: string;
  startedAt: string;
  completedAt?: string;
  status: 'RUNNING' | 'SUCCESS' | 'FAILED';
  itemsDiscovered: number;
  itemsMatched: number;
  itemsPendingReview: number;
  logDetails?: string;
}

export interface DailyDeltaTransition {
  promiseCode: string;
  titleEn: string;
  titleBn: string;
  previousStatus: string;
  currentStatus: string;
  districtNameEn: string;
  districtNameBn: string;
  outlayCr?: number;
  sourcePublisher: string;
  sourceTier: string;
  sourceUrl?: string;
  timestamp: string;
}

export interface DailySectorVelocity {
  sectorCode: string;
  sectorEn: string;
  sectorBn: string;
  activeCount: number;
  deltaToday: number;
  outlayCr: number;
}

export interface DailyTallyMetrics {
  date: string;
  lastSyncedAt?: string;
  liveSyncMode?: 'LIVE_WEB_AND_GEMINI' | 'LIVE_RSS_VERIFIED' | 'DAILY_DELTA_ENGINE';
  activeSourcesCount?: number;
  todayVerifiedItemsCount: number;
  todayPromisesMovedCount: number;
  totalDeliveredPromises: number;
  totalUnderImplementation: number;
  totalFundedAmountCr: number;
  dailyDelta?: {
    dateKey: string;
    previousDateKey: string;
    netNewEvidenceDelta: number;
    promisesProgressedDelta: number;
    outlaySanctionedDeltaCr: number;
    gsdpTrajectoryDeltaBps: number;
    headlineSummaryEn: string;
    headlineSummaryBn: string;
    transitions: DailyDeltaTransition[];
    sectorVelocity: DailySectorVelocity[];
  };
  recentEvidences: Array<{
    id: string;
    title: string;
    titleBn?: string;
    publisher?: string;
    sourceUrl?: string;
    sourceTier: string;
    publishedAt?: string;
    matchedPromiseCode?: string;
    matchedPromiseTitle?: string;
    matchedPromiseTitleBn?: string;
    proposedStatus?: string;
    previousStatus?: string;
    outlayCr?: number;
    confidenceScore?: number;
    districtCode?: string;
    isLiveWebFetched?: boolean;
    excerpt?: string;
  }>;
}

export interface ChatCitation {
  promiseCode?: string;
  promiseTitle?: string;
  sourceTitle: string;
  sourceUrl?: string;
  sourceTier: string;
  publishedAt?: string;
}

export interface ChatQueryRequest {
  message: string;
  locale?: 'en' | 'bn';
  conversationId?: string;
  contextDistrictCode?: string;
  contextCategoryCode?: string;
}

export interface ChatQueryResponse {
  answer: string;
  locale: 'en' | 'bn';
  citations: ChatCitation[];
  suggestedFollowUps: string[];
  matchedPromises?: Array<{
    code: string;
    title: string;
    status: string;
  }>;
}

export interface CitizenEvidenceSubmissionDto {
  promiseCode: string;
  title: string;
  sourceUrl?: string;
  excerpt?: string;
  districtCode?: string;
  submitterEmail?: string;
}
