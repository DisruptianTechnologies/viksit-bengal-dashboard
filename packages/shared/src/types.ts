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

export interface DailyTallyMetrics {
  date: string;
  todayVerifiedItemsCount: number;
  todayPromisesMovedCount: number;
  totalDeliveredPromises: number;
  totalUnderImplementation: number;
  totalFundedAmountCr: number;
  recentEvidences: Array<{
    id: string;
    title: string;
    publisher?: string;
    sourceUrl?: string;
    sourceTier: string;
    publishedAt?: string;
    matchedPromiseCode?: string;
    matchedPromiseTitle?: string;
    proposedStatus?: string;
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
