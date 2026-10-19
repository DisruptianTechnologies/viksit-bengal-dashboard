import { NextRequest, NextResponse } from 'next/server';
import { getLiveStore, getIstDateKey } from '@/lib/live-store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const store = getLiveStore();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const district = searchParams.get('district');

  let results = store.promises;
  if (status) {
    results = results.filter((p) => p.status?.toUpperCase() === status.toUpperCase());
  }
  if (category) {
    results = results.filter((p) => p.category?.code === category);
  }
  if (district) {
    results = results.filter((p) =>
      p.districts?.some((d: any) => d.districtCode?.toUpperCase() === district.toUpperCase())
    );
  }

  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: JWT token required' }, { status: 401 });
    }

    const body = await req.json();
    const code = (body.code || `INFRA-${Date.now().toString().slice(-2)}`).trim().toUpperCase();
    const titleEn = (body.titleEn || '').trim();
    const titleBn = (body.titleBn || titleEn).trim();

    if (!titleEn) {
      return NextResponse.json({ message: 'titleEn is required' }, { status: 400 });
    }

    const store = getLiveStore();
    const newPromise = {
      id: `promise-${code.toLowerCase()}-${Date.now()}`,
      code,
      titleEn,
      titleBn,
      descriptionEn: body.descriptionEn || titleEn,
      descriptionBn: body.descriptionBn || titleBn,
      status: (body.status || 'ANNOUNCED').toUpperCase(),
      confidence: 'A',
      isKeyPromise: true,
      category: {
        code: body.categoryCode || 'infrastructure',
        titleEn: 'Infrastructure & Connectivity',
        titleBn: 'পরিকাঠামো ও যোগাযোগ',
        icon: '🛣️',
      },
      responsibleDepartment: 'Public Works & Infrastructure Directorate, Govt of WB',
      districts: [{ districtCode: body.districtCode || 'KOL' }],
      statusHistory: [
        {
          id: `hist-${Date.now()}`,
          status: (body.status || 'ANNOUNCED').toUpperCase(),
          reason: 'Registered via Administrative CMS Governance Portal',
          timestamp: new Date().toISOString(),
        },
      ],
      evidenceItems: [
        {
          id: `ev-${Date.now()}`,
          title: `Cabinet Administrative Registration for ${code}: ${titleEn}`,
          sourceType: 'GAZETTE',
          sourceTier: 'TIER_1',
          url: 'https://wb.gov.in/gazette',
          extractedText: body.descriptionEn || titleEn,
          verifiedAt: getIstDateKey(0),
        },
      ],
    };

    store.promises.unshift(newPromise);
    store.evidences.unshift({
      id: `ev-cms-${Date.now()}`,
      title: `State Catalog Registration [${code}]: ${titleEn}`,
      titleBn: `রাজ্য প্রতিশ্রুতি তালিকায় নতুন নিবন্ধন [${code}]: ${titleBn}`,
      url: 'https://wb.gov.in/gazette',
      sourceUrl: 'https://wb.gov.in/gazette',
      publisher: 'State Cabinet Secretariat (CMS)',
      sourceType: 'GAZETTE',
      sourceTier: 'TIER_1',
      extractedText: body.descriptionEn || titleEn,
      extractedTextBn: body.descriptionBn || titleBn,
      publishedAt: new Date().toISOString(),
      matchedPromiseCode: code,
      matchedPromiseTitle: titleEn,
      matchedPromiseTitleBn: titleBn,
      previousStatus: 'ANNOUNCED',
      proposedStatus: newPromise.status,
      districtCode: body.districtCode || 'KOL',
      districtNameEn: 'Kolkata',
      districtNameBn: 'কলকাতা',
      outlayCr: 450,
      confidenceScore: 0.98,
      reviewStatus: 'APPROVED',
      isLiveWebFetched: false,
    });

    return NextResponse.json(newPromise, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Failed to create promise' }, { status: 400 });
  }
}
