import { NextRequest, NextResponse } from 'next/server';
import seedData from '../../../../../../packages/database/prisma/seed-data.json';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const users = seedData.users || [];
    const matched = users.find(
      (u: any) =>
        u.email.toLowerCase() === String(email || '').trim().toLowerCase() &&
        u.password === password
    );

    if (!matched) {
      return NextResponse.json(
        { message: 'Invalid credentials. Please use one of the authorized demo accounts.' },
        { status: 401 }
      );
    }

    const payload = Buffer.from(
      JSON.stringify({
        sub: matched.email,
        email: matched.email,
        name: matched.name,
        role: matched.role,
        iat: Date.now(),
      })
    ).toString('base64url');

    return NextResponse.json({
      accessToken: `vb_jwt_${payload}`,
      user: {
        id: `usr-${matched.role.toLowerCase()}`,
        email: matched.email,
        name: matched.name,
        role: matched.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Authentication failed' }, { status: 400 });
  }
}
