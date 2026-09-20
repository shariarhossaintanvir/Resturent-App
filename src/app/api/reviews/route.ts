import { NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/auth/rbac';
import { validateReviewInput } from '../../../lib/validation/schemas';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '../../../lib/security/rateLimiter';
import { logSecurityEvent } from '../../../lib/security/logger';
import { Review } from '../../../data/types';

// In-memory reviews collection
const reviewsRegistry: Review[] = [];

export async function POST(req: Request) {
  const { session, errorResponse } = await requireAuth(req);
  if (errorResponse || !session) return errorResponse;

  const ip = getClientIp(req);

  // Rate Limiting on Review Submissions
  const rateLimitResult = checkRateLimit(
    `review_${session.userId}`,
    RATE_LIMITS.REVIEW.limit,
    RATE_LIMITS.REVIEW.windowMs
  );

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: `Review rate limit exceeded. Please wait ${rateLimitResult.resetSeconds} seconds before submitting again.`,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimitResult.resetSeconds) },
      }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
  }

  const validation = validateReviewInput(body);
  if (!validation.isValid || !validation.sanitizedData) {
    return NextResponse.json({ error: validation.errors[0] }, { status: 400 });
  }

  const { restaurantId, restaurantName, rating, comment, foodName, tags } = validation.sanitizedData;

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    restaurantId,
    restaurantName,
    userId: session.userId,
    userName: session.name,
    userAvatar: session.avatar,
    rating,
    comment,
    date: new Date().toISOString().split('T')[0],
    foodName,
    tags,
    helpfulCount: 0,
  };

  reviewsRegistry.push(newReview);

  logSecurityEvent({
    event: 'ORDER_PLACED', // review recorded
    userId: session.userId,
    ip,
    path: '/api/reviews',
    resourceId: newReview.id,
    severity: 'INFO',
    details: {
      reviewId: newReview.id,
      restaurantId,
      rating,
    },
  });

  return NextResponse.json({ success: true, review: newReview }, { status: 201 });
}
