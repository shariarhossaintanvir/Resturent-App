import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '../../../../lib/auth/session';

export async function GET(req: Request) {
  const session = await getSessionFromRequest(req);

  if (!session) {
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.userId,
      name: session.name,
      email: session.email,
      role: session.role,
      restaurantId: session.restaurantId,
      avatar: session.avatar,
    },
  });
}
