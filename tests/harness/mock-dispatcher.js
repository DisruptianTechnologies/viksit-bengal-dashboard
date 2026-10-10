/**
 * Viksit Bengal Dashboard - Authoritative In-Memory Specification Dispatcher
 * Provides an authoritative reference model matching PROJECT.md interface contracts.
 * Used for offline verification and behavioral contract validation.
 */

import { DISTRICTS_23, USERS, ENUMS, SAMPLE_PROMISE, SAMPLE_EVIDENCE } from './fixtures.js';

export class MockDispatcher {
  constructor() {
    this.reset();
  }

  reset() {
    this.districts = DISTRICTS_23.map((d, index) => ({
      id: `dist-${index + 1}`,
      code: d.code,
      nameEn: d.nameEn,
      nameBn: d.nameBn,
      population: 4000000 + index * 200000,
      gsdpShare: +(2.5 + (index % 5) * 1.5).toFixed(2),
      promiseCount: 2 + (index % 4)
    }));

    this.promises = [
      {
        id: 'prom-1',
        ...SAMPLE_PROMISE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusHistory: [
          { status: 'ANNOUNCED', timestamp: '2026-01-01T00:00:00Z', comment: 'Official manifesto commitment' },
          { status: 'UNDER_IMPLEMENTATION', timestamp: '2026-03-01T00:00:00Z', comment: 'Work commenced' }
        ],
        evidenceItems: [],
        updates: []
      }
    ];

    this.evidence = [
      {
        id: 'ev-1',
        promiseId: 'prom-1',
        ...SAMPLE_EVIDENCE,
        status: 'PENDING',
        uploadedBy: 'researcher@viksitbengal.gov.in',
        createdAt: new Date().toISOString()
      }
    ];

    this.indicators = [
      {
        id: 'ind-1',
        code: 'GSDP_GROWTH',
        nameEn: 'GSDP Annual Growth Rate',
        nameBn: 'রাজ্যের জিএসডিপি বার্ষিক বৃদ্ধির হার',
        unit: '%',
        currentValue: 8.4,
        targetValue: 12.5,
        values: [
          { year: 2024, value: 7.8 },
          { year: 2025, value: 8.4 }
        ]
      },
      {
        id: 'ind-2',
        code: 'TRILLION_USD_PROGRESS',
        nameEn: '$1T GSDP Economy Target Milestone',
        nameBn: '$১ ট্রিলিয়ন অর্থনীতি রূপান্তর অগ্রগতি',
        unit: 'Billion USD',
        currentValue: 240,
        targetValue: 1000,
        values: [
          { year: 2026, scenario: 'CONSERVATIVE', value: 230 },
          { year: 2026, scenario: 'BASE_CASE', value: 240 },
          { year: 2026, scenario: 'AMBITIOUS', value: 260 }
        ]
      }
    ];

    this.users = { ...USERS };
  }

  generateJwt(user) {
    const payload = {
      sub: user.email,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 3600
    };
    const b64 = Buffer.from(JSON.stringify(payload)).toString('base64');
    return `mock.header.${b64}.signature`;
  }

  verifyJwt(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7);
    const parts = token.split('.');
    let payloadPart = null;
    let signaturePart = null;

    if (parts.length === 3) {
      payloadPart = parts[1];
      signaturePart = parts[2];
    } else if (parts.length === 4) {
      payloadPart = parts[2];
      signaturePart = parts[3];
    } else {
      return null;
    }

    if (signaturePart !== 'signature') return null;

    try {
      const payload = JSON.parse(Buffer.from(payloadPart, 'base64').toString('utf8'));
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
      return payload;
    } catch {
      return null;
    }
  }

  // --- Handlers ---

  handleLogin({ email, password }) {
    if (!email || !password) {
      return { status: 400, data: { message: 'Email and password required' } };
    }
    const found = Object.values(this.users).find(u => u.email === email && u.password === password);
    if (!found) {
      return { status: 401, data: { message: 'Invalid credentials' } };
    }
    const token = this.generateJwt(found);
    return {
      status: 200,
      data: {
        accessToken: token,
        user: { id: found.email, email: found.email, name: found.name, role: found.role }
      }
    };
  }

  handleGetMe(authHeader) {
    const user = this.verifyJwt(authHeader);
    if (!user) return { status: 401, data: { message: 'Unauthorized' } };
    return { status: 200, data: user };
  }

  handleGetDistricts() {
    return { status: 200, data: this.districts };
  }

  handleGetDistrictByCode(code) {
    if (!code || typeof code !== 'string') return { status: 400, data: { message: 'Invalid code' } };
    const found = this.districts.find(d => d.code.toUpperCase() === code.toUpperCase());
    if (!found) return { status: 404, data: { message: 'District not found' } };
    return {
      status: 200,
      data: {
        ...found,
        promises: this.promises,
        indicators: this.indicators
      }
    };
  }

  handleGetPromises(query = {}) {
    let result = [...this.promises];
    if (query.status) {
      result = result.filter(p => p.status === query.status);
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      result = result.filter(p => p.titleEn.toLowerCase().includes(s) || (p.titleBn && p.titleBn.includes(s)));
    }
    return { status: 200, data: result };
  }

  handleGetPromiseByCode(code) {
    const found = this.promises.find(p => p.code.toLowerCase() === code.toLowerCase());
    if (!found) return { status: 404, data: { message: 'Promise not found' } };
    return { status: 200, data: found };
  }

  handleCreatePromise(dto, authHeader) {
    const user = this.verifyJwt(authHeader);
    if (!user) return { status: 401, data: { message: 'Unauthorized' } };
    if (user.role !== 'ADMIN' && user.role !== 'RESEARCHER') {
      return { status: 403, data: { message: 'Forbidden: Requires ADMIN or RESEARCHER role' } };
    }

    if (!dto.code || !dto.titleEn || !dto.titleBn) {
      return { status: 400, data: { message: 'Validation failed: code, titleEn, titleBn required' } };
    }
    if (dto.status && !ENUMS.PromiseStatus.includes(dto.status)) {
      return { status: 400, data: { message: `Invalid status enum: ${dto.status}` } };
    }

    const allowedKeys = ['code', 'titleEn', 'titleBn', 'descriptionEn', 'descriptionBn', 'status', 'confidence', 'categoryId', 'isKeyPromise', 'deadlineDate'];
    const sanitizedDto = {};
    for (const key of allowedKeys) {
      if (dto[key] !== undefined) sanitizedDto[key] = dto[key];
    }

    const newPromise = {
      id: `prom-${Date.now()}`,
      ...sanitizedDto,
      status: sanitizedDto.status || 'NOT_STARTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [{ status: dto.status || 'NOT_STARTED', timestamp: new Date().toISOString() }],
      evidenceItems: [],
      updates: []
    };
    this.promises.push(newPromise);
    return { status: 201, data: newPromise };
  }

  handleUpdatePromiseStatus(code, { status, comment }, authHeader) {
    const user = this.verifyJwt(authHeader);
    if (!user) return { status: 401, data: { message: 'Unauthorized' } };
    if (user.role !== 'ADMIN') {
      return { status: 403, data: { message: 'Forbidden: Requires ADMIN role' } };
    }
    if (!ENUMS.PromiseStatus.includes(status)) {
      return { status: 400, data: { message: `Invalid PromiseStatus enum: ${status}` } };
    }
    const found = this.promises.find(p => p.code.toLowerCase() === code.toLowerCase());
    if (!found) return { status: 404, data: { message: 'Promise not found' } };

    found.status = status;
    found.updatedAt = new Date().toISOString();
    found.statusHistory.push({ status, comment, timestamp: new Date().toISOString() });
    return { status: 200, data: found };
  }

  handleGetEvidence(query = {}) {
    let result = [...this.evidence];
    if (query.promiseId) result = result.filter(e => e.promiseId === query.promiseId);
    if (query.status) result = result.filter(e => e.status === query.status);
    return { status: 200, data: result };
  }

  handleCreateEvidence(dto, authHeader) {
    const user = this.verifyJwt(authHeader);
    if (!user) return { status: 401, data: { message: 'Unauthorized' } };
    if (user.role !== 'ADMIN' && user.role !== 'RESEARCHER') {
      return { status: 403, data: { message: 'Forbidden' } };
    }
    if (!dto.title || !dto.url || !dto.sourceType || !dto.sourceTier) {
      return { status: 400, data: { message: 'Validation failed: title, url, sourceType, sourceTier are required' } };
    }
    if (!ENUMS.SourceTier.includes(dto.sourceTier)) {
      return { status: 400, data: { message: `Invalid source tier: ${dto.sourceTier}` } };
    }
    try {
      new URL(dto.url);
    } catch {
      return { status: 400, data: { message: 'Invalid URL format' } };
    }

    const newEvidence = {
      id: `ev-${Date.now()}`,
      ...dto,
      status: 'PENDING',
      uploadedBy: user.email,
      createdAt: new Date().toISOString()
    };
    this.evidence.push(newEvidence);
    return { status: 201, data: newEvidence };
  }

  handleReviewEvidence(id, { status, reviewComment }, authHeader) {
    const user = this.verifyJwt(authHeader);
    if (!user) return { status: 401, data: { message: 'Unauthorized' } };
    if (user.role !== 'ADMIN') {
      return { status: 403, data: { message: 'Forbidden: Requires ADMIN role' } };
    }
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return { status: 400, data: { message: 'Invalid review status' } };
    }
    const found = this.evidence.find(e => e.id === id);
    if (!found) return { status: 404, data: { message: 'Evidence item not found' } };

    found.status = status;
    found.reviewComment = reviewComment;
    found.reviewedAt = new Date().toISOString();
    return { status: 200, data: found };
  }

  handleGetIndicators() {
    return { status: 200, data: this.indicators };
  }

  handleCreateIndicatorValue(code, dto, authHeader) {
    const user = this.verifyJwt(authHeader);
    if (!user) return { status: 401, data: { message: 'Unauthorized' } };
    if (user.role !== 'ADMIN' && user.role !== 'RESEARCHER') {
      return { status: 403, data: { message: 'Forbidden' } };
    }
    if (typeof dto.year !== 'number' || typeof dto.value !== 'number') {
      return { status: 400, data: { message: 'Validation failed: year and value must be numbers' } };
    }
    const found = this.indicators.find(i => i.code === code);
    if (!found) return { status: 404, data: { message: 'Indicator not found' } };

    found.values.push(dto);
    found.currentValue = dto.value;
    return { status: 201, data: dto };
  }

  handleGetScraperSources() {
    return {
      status: 200,
      data: [
        { id: 'src-1', name: 'West Bengal Official Gazette', sourceType: 'GAZETTE', sourceTier: 'TIER_1', isActive: true },
        { id: 'src-2', name: 'PIB Kolkata', sourceType: 'STATISTICAL_RELEASE', sourceTier: 'TIER_1', isActive: true },
        { id: 'src-3', name: 'Egiye Bangla Orders', sourceType: 'GOVERNMENT_ORDER', sourceTier: 'TIER_1', isActive: true },
        { id: 'src-4', name: 'CAG Bengal Desk', sourceType: 'AUDIT', sourceTier: 'TIER_1', isActive: true },
        { id: 'src-5', name: 'Tea Board of India', sourceType: 'INSTITUTIONAL_REPORT', sourceTier: 'TIER_2', isActive: true },
        { id: 'src-6', name: 'The Telegraph Bengal Desk', sourceType: 'NEWSPAPER', sourceTier: 'TIER_3', isActive: true }
      ]
    };
  }

  handleRunScraperJob() {
    return {
      status: 200,
      data: {
        runId: 'run-mock-1',
        itemsDiscovered: 6,
        itemsMatched: 4,
        itemsPendingReview: 4
      }
    };
  }

  handleGetDailyTally() {
    return {
      status: 200,
      data: {
        date: new Date().toISOString(),
        todayVerifiedItemsCount: 6,
        todayPromisesMovedCount: 4,
        totalDeliveredPromises: 12,
        totalUnderImplementation: 38,
        totalFundedAmountCr: 1830,
        recentEvidences: [
          {
            id: 'ev-mock-1',
            title: 'West Bengal Gazette Order: Darjeeling Tea Replantation & GI Protection Special Grant',
            publisher: 'Department of Commerce & Industries',
            sourceTier: 'TIER_1',
            publishedAt: new Date().toISOString(),
            matchedPromiseCode: 'TEA-01',
            matchedPromiseTitle: 'Tea Industry Modernisation',
            proposedStatus: 'FUNDED',
            excerpt: '₹250 Crore sanctioned for tea replantation.'
          }
        ]
      }
    };
  }

  handleSubmitCitizenEvidence(dto) {
    return {
      status: 201,
      data: {
        success: true,
        evidenceId: `ev-cit-${Date.now()}`,
        message: 'Citizen evidence submitted successfully.'
      }
    };
  }

  handleQueryChat(dto) {
    const isBn = dto.locale === 'bn';
    return {
      status: 200,
      data: {
        answer: isBn
          ? 'পশ্চিমবঙ্গের ১ ট্রিলিয়ন ডলারের লক্ষ্যমাত্রা অর্জনে শিল্প, বন্দর করিডোর এবং চা শিল্পের উন্নয়ন সর্বোচ্চ অগ্রাধিকারে রয়েছে।'
          : 'West Bengal targets a $1 Trillion economy through modern port logistics, manufacturing corridors, and GI tea revitalization.',
        locale: dto.locale || 'en',
        citations: [
          {
            sourceTitle: 'State Economic & Governance Manifesto 2026',
            sourceUrl: 'https://wb.gov.in',
            sourceTier: 'TIER_1'
          }
        ],
        suggestedFollowUps: isBn
          ? ['চা শিল্পের প্রতিশ্রুতি', '১ কোটি চাকরির লক্ষ্যমাত্রা']
          : ['Tea industry promises', '1 crore youth jobs progress'],
        matchedPromises: [
          { code: 'TEA-01', title: 'Tea Modernisation', status: 'FUNDED' }
        ]
      }
    };
  }
}
