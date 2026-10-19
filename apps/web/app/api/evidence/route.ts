import { NextRequest, NextResponse } from 'next/server';
import { getLiveStore } from '@/lib/live-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const store = getLiveStore();
  return NextResponse.json(store.evidences);
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: JWT token required' }, { status: 401 });
    }

    const body = await req.json();
    const title = (body.title || '').trim();
    if (!title) {
      return NextResponse.json({ message: 'Evidence title is required' }, { status: 400 });
    }

    const store = getLiveStore();
    const promiseCode = (body.promiseCode || 'INFRA-01').toUpperCase();
    const matchedPromise =
      store.promises.find((p) => p.code?.toUpperCase() === promiseCode) || store.promises[0];

    const created = {
      id: `ev-admin-${Date.now()}`,
      title,
      titleBn: title,
      url: body.url || body.sourceUrl || 'https://wb.gov.in/gazette',
      sourceUrl: body.url || body.sourceUrl || 'https://wb.gov.in/gazette',
      publisher: body.publisher || 'Official State Gazette / Audit Cell',
      sourceType: body.sourceType || 'GAZETTE',
      sourceTier: (body.sourceTier || 'TIER_1') as 'TIER_1' | 'TIER_2' | 'TIER_3',
      extractedText: body.extractedText || title,
      extractedTextBn: body.extractedText || title,
      publishedAt: new Date().toISOString(),
      matchedPromiseCode: matchedPromise?.code || promiseCode,
      matchedPromiseTitle: matchedPromise?.titleEn || 'State Infrastructure Commitment',
      matchedPromiseTitleBn: matchedPromise?.titleBn || 'রাজ্য পরিকাঠামো প্রতিশ্রুতি',
      previousStatus: matchedPromise?.status || 'ANNOUNCED',
      proposedStatus: body.proposedStatus || 'UNDER_IMPLEMENTATION',
      districtCode: body.districtCode || 'KOL',
      districtNameEn: 'Kolkata',
      districtNameBn: 'কলকাতা',
      outlayCr: Number(body.outlayCr) || 320,
      confidenceScore: 0.97,
      reviewStatus: 'APPROVED' as const,
      isLiveWebFetched: false,
    };

    store.evidences.unshift(created);
    if (matchedPromise) {
      matchedPromise.status = created.proposedStatus;
      matchedPromise.evidenceItems = [
        {
          id: created.id,
          title: created.title,
          sourceType: created.sourceType,
          sourceTier: created.sourceTier,
          url: created.sourceUrl,
          extractedText: created.extractedText,
          verifiedAt: new Date().toISOString().slice(0, 10),
        },
        ...(matchedPromise.evidenceItems || []),
      ];
      matchedPromise.statusHistory = [
        ...(matchedPromise.statusHistory || []),
        {
          id: `hist-${Date.now()}`,
          status: created.proposedStatus,
          reason: `Verified via ${created.sourceTier} (${created.sourceType}): ${created.title}`,
          timestamp: new Date().toISOString(),
        },
      ];
    }

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Failed to submit evidence' }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, reviewStatus } = body;
    const store = getLiveStore();
    const ev = store.evidences.find((e) => e.id === id);
    if (!ev) {
      return NextResponse.json({ message: 'Evidence item not found' }, { status: 404 });
    }
    ev.reviewStatus = reviewStatus === 'REJECTED' ? 'REJECTED' : 'APPROVED';
    return NextResponse.json(ev);
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Failed to update review status' }, { status: 400 });
  }
}
