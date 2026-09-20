import { Reservation } from '../../data/types';
import { defaultMockReservations } from '../../data/mockData';

const reservationsRegistry: Map<string, Reservation> = new Map();
let isSeeded = false;

function ensureReservationsSeeded() {
  if (isSeeded) return;
  for (const res of defaultMockReservations) {
    reservationsRegistry.set(res.id, { ...res });
  }
  isSeeded = true;
}

export function getAllReservations(): Reservation[] {
  ensureReservationsSeeded();
  return Array.from(reservationsRegistry.values());
}

export function saveReservation(reservation: Reservation): Reservation {
  ensureReservationsSeeded();
  reservationsRegistry.set(reservation.id, { ...reservation });
  return reservation;
}

export function cancelServerReservation(id: string): boolean {
  ensureReservationsSeeded();
  const res = reservationsRegistry.get(id);
  if (!res) return false;
  res.status = 'Cancelled';
  reservationsRegistry.set(id, res);
  return true;
}
