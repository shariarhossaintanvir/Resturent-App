import { sanitizeText } from '../security/sanitize';

export interface ValidationResult<T> {
  isValid: boolean;
  errors: string[];
  sanitizedData?: T;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[+0-9\s-]{8,20}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates Login inputs
 */
export function validateLoginInput(body: unknown): ValidationResult<{ email: string; password: string }> {
  const errors: string[] = [];
  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: ['Request body must be a valid JSON object.'] };
  }

  const { email, password } = body as Record<string, unknown>;

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (typeof password !== 'string' || password.length === 0) {
    errors.push('Password is required.');
  } else if (password.length > 128) {
    errors.push('Password exceeds maximum allowed length.');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    sanitizedData: {
      email: (email as string).trim().toLowerCase(),
      password: password as string,
    },
  };
}

/**
 * Validates Registration inputs with strong password policy
 */
export function validateRegisterInput(body: unknown): ValidationResult<{
  name: string;
  email: string;
  phone: string;
  password: string;
}> {
  const errors: string[] = [];
  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: ['Request body must be a valid JSON object.'] };
  }

  const { name, email, phone, password } = body as Record<string, unknown>;

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 60) {
    errors.push('Name must be between 2 and 60 characters.');
  }

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (typeof phone !== 'string' || !PHONE_REGEX.test(phone.trim())) {
    errors.push('A valid contact phone number is required (e.g. +880 1819-456789).');
  }

  if (typeof password !== 'string') {
    errors.push('Password is required.');
  } else {
    if (password.length < 8) errors.push('Password must be at least 8 characters long.');
    if (!/[A-Z]/.test(password)) errors.push('Password must include at least one uppercase letter.');
    if (!/[0-9]/.test(password)) errors.push('Password must include at least one number.');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    sanitizedData: {
      name: sanitizeText(name as string, 60),
      email: (email as string).trim().toLowerCase(),
      phone: sanitizeText(phone as string, 25),
      password: password as string,
    },
  };
}

/**
 * Validates Table Reservation inputs
 */
export function validateReservationInput(body: unknown): ValidationResult<{
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
}> {
  const errors: string[] = [];
  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: ['Invalid reservation payload.'] };
  }

  const { restaurantId, restaurantName, date, time, guests, specialRequests } = body as Record<string, unknown>;

  if (typeof restaurantId !== 'string' || !restaurantId.trim()) {
    errors.push('A valid restaurant identifier is required.');
  }

  if (typeof date !== 'string' || !DATE_REGEX.test(date)) {
    errors.push('Reservation date must be formatted as YYYY-MM-DD.');
  } else {
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxFuture = new Date();
    maxFuture.setDate(maxFuture.getDate() + 60);

    if (bookingDate < today) {
      errors.push('Reservation date cannot be in the past.');
    } else if (bookingDate > maxFuture) {
      errors.push('Reservations can only be placed up to 60 days in advance.');
    }
  }

  if (typeof time !== 'string' || !time.trim()) {
    errors.push('Reservation dining time is required.');
  }

  const guestCount = Number(guests);
  if (isNaN(guestCount) || guestCount < 1 || guestCount > 20) {
    errors.push('Party size must be between 1 and 20 guests.');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    sanitizedData: {
      restaurantId: sanitizeText(restaurantId as string, 40),
      restaurantName: sanitizeText(restaurantName as string, 80),
      date: date as string,
      time: sanitizeText(time as string, 20),
      guests: Math.floor(guestCount),
      specialRequests: specialRequests ? sanitizeText(specialRequests as string, 300) : undefined,
    },
  };
}

/**
 * Validates Review inputs
 */
export function validateReviewInput(body: unknown): ValidationResult<{
  restaurantId: string;
  restaurantName: string;
  rating: number;
  comment: string;
  foodName?: string;
  tags?: string[];
}> {
  const errors: string[] = [];
  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: ['Invalid review payload.'] };
  }

  const { restaurantId, restaurantName, rating, comment, foodName, tags } = body as Record<string, unknown>;

  if (typeof restaurantId !== 'string' || !restaurantId.trim()) {
    errors.push('Restaurant ID is required.');
  }

  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5 || !Number.isInteger(numRating)) {
    errors.push('Review rating must be an integer between 1 and 5 stars.');
  }

  if (typeof comment !== 'string' || comment.trim().length < 5) {
    errors.push('Comment must be at least 5 characters long.');
  } else if (comment.length > 1000) {
    errors.push('Comment exceeds 1,000 character maximum.');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    sanitizedData: {
      restaurantId: sanitizeText(restaurantId as string, 40),
      restaurantName: sanitizeText(restaurantName as string, 80),
      rating: numRating,
      comment: sanitizeText(comment as string, 1000),
      foodName: foodName ? sanitizeText(foodName as string, 80) : undefined,
      tags: Array.isArray(tags) ? tags.map((t) => sanitizeText(String(t), 30)).slice(0, 5) : [],
    },
  };
}
