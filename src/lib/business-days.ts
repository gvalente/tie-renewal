import { eachDayOfInterval, isWeekend, format, addDays } from 'date-fns';

export function isBusinessDay(date: Date, holidays: string[]): boolean {
  if (isWeekend(date)) return false;
  return !holidays.includes(format(date, 'yyyy-MM-dd'));
}

export function countBusinessDays(start: Date, end: Date, holidays: string[]): number {
  if (end <= start) return 0;
  return eachDayOfInterval({ start: addDays(start, 1), end })
    .filter(d => isBusinessDay(d, holidays)).length;
}

export function addBusinessDays(start: Date, n: number, holidays: string[]): Date {
  let current = new Date(start);
  let count = 0;
  while (count < n) {
    current = addDays(current, 1);
    if (isBusinessDay(current, holidays)) count++;
  }
  return current;
}

export function calculateThresholdDate(submissionDate: Date, holidays: string[]): Date {
  return addBusinessDays(submissionDate, 20, holidays);
}

export interface TimelineStatus {
  businessDaysElapsed: number;
  businessDaysRemaining: number;
  thresholdDate: Date;
  isPastThreshold: boolean;
  percentComplete: number;
  urgency: 'normal' | 'approaching' | 'threshold' | 'past';
}

export function getTimelineStatus(
  submissionDate: Date,
  holidays: string[],
  today: Date = new Date()
): TimelineStatus {
  const elapsed = countBusinessDays(submissionDate, today, holidays);
  const thresholdDate = calculateThresholdDate(submissionDate, holidays);
  const capped = Math.min(elapsed, 20);

  return {
    businessDaysElapsed: elapsed,
    businessDaysRemaining: Math.max(0, 20 - elapsed),
    thresholdDate,
    isPastThreshold: today >= thresholdDate,
    percentComplete: Math.min(100, (capped / 20) * 100),
    urgency:
      elapsed >= 20
        ? 'past'
        : elapsed >= 18
        ? 'threshold'
        : elapsed >= 15
        ? 'approaching'
        : 'normal',
  };
}

export interface ExpiryDates {
  renewalWindowOpens: Date;
  expiryDate: Date;
  lateDeadline: Date;
  phase: 'too_early' | 'window_open' | 'urgent' | 'expired_can_file' | 'expired_too_late';
  daysUntilExpiry: number;
}

export function getExpiryDates(tieExpiry: Date, today: Date = new Date()): ExpiryDates {
  const windowOpens = addDays(tieExpiry, -60);
  const lateDeadline = addDays(tieExpiry, 90);
  const daysUntil = Math.ceil((tieExpiry.getTime() - today.getTime()) / 86400000);

  let phase: ExpiryDates['phase'];
  if (today < windowOpens) phase = 'too_early';
  else if (today < addDays(tieExpiry, -14)) phase = 'window_open';
  else if (today <= tieExpiry) phase = 'urgent';
  else if (today <= lateDeadline) phase = 'expired_can_file';
  else phase = 'expired_too_late';

  return {
    renewalWindowOpens: windowOpens,
    expiryDate: tieExpiry,
    lateDeadline,
    phase,
    daysUntilExpiry: daysUntil,
  };
}
