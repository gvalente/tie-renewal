import { describe, it, expect } from 'vitest';
import {
  isBusinessDay,
  countBusinessDays,
  addBusinessDays,
  calculateThresholdDate,
  getTimelineStatus,
  getExpiryDates,
} from '../business-days';
import { SPANISH_HOLIDAYS } from '../holidays';

describe('isBusinessDay', () => {
  it('returns true for a regular weekday', () => {
    expect(isBusinessDay(new Date('2026-03-02'), SPANISH_HOLIDAYS)).toBe(true); // Monday
  });

  it('returns false for Saturday', () => {
    expect(isBusinessDay(new Date('2026-03-07'), SPANISH_HOLIDAYS)).toBe(false);
  });

  it('returns false for Sunday', () => {
    expect(isBusinessDay(new Date('2026-03-08'), SPANISH_HOLIDAYS)).toBe(false);
  });

  it('returns false for a Spanish national holiday', () => {
    expect(isBusinessDay(new Date('2026-04-03'), SPANISH_HOLIDAYS)).toBe(false); // Good Friday
  });

  it('returns false for New Year', () => {
    expect(isBusinessDay(new Date('2026-01-01'), SPANISH_HOLIDAYS)).toBe(false);
  });
});

describe('countBusinessDays', () => {
  it('returns 0 when end <= start', () => {
    expect(countBusinessDays(new Date('2026-03-05'), new Date('2026-03-05'), SPANISH_HOLIDAYS)).toBe(0);
    expect(countBusinessDays(new Date('2026-03-05'), new Date('2026-03-04'), SPANISH_HOLIDAYS)).toBe(0);
  });

  it('counts a simple week (Mon to Fri = 4 business days, excluding start)', () => {
    // Mon Mar 2 to Fri Mar 6: Tue, Wed, Thu, Fri = 4 business days
    expect(countBusinessDays(new Date('2026-03-02'), new Date('2026-03-06'), SPANISH_HOLIDAYS)).toBe(4);
  });

  it('skips weekends', () => {
    // Fri Mar 6 to Mon Mar 9: Mon = 1 business day
    expect(countBusinessDays(new Date('2026-03-06'), new Date('2026-03-09'), SPANISH_HOLIDAYS)).toBe(1);
  });

  it('skips holidays', () => {
    // Around Good Friday 2026 (Apr 3)
    // Apr 1 (Wed) to Apr 6 (Mon): Thu Apr 2, Fri Apr 3 (holiday), Mon Apr 6 = 2 business days
    expect(countBusinessDays(new Date('2026-04-01'), new Date('2026-04-06'), SPANISH_HOLIDAYS)).toBe(2);
  });

  it('counts business days for the founder scenario: Mar 2 to Apr 6', () => {
    // March 2 (Mon) 2026 to April 6 (Mon) 2026
    // Good Friday Apr 3 is a holiday
    const elapsed = countBusinessDays(new Date('2026-03-02'), new Date('2026-04-06'), SPANISH_HOLIDAYS);
    // March: 2(Mon start, excluded) 3,4,5,6 (4) + 9,10,11,12,13 (5) + 16,17,18,19,20 (5) + 23,24,25,26,27 (5) + 30,31 (2) = 21
    // April: 1,2 (2) + 3 (holiday, skip) + 6 (1) = 3
    // Total = 21 + 3 = 24
    expect(elapsed).toBe(24);
  });
});

describe('addBusinessDays', () => {
  it('adds business days correctly', () => {
    // Starting from Mon Mar 2, add 5 business days = Mon Mar 9
    const result = addBusinessDays(new Date('2026-03-02'), 5, SPANISH_HOLIDAYS);
    expect(result.toISOString().slice(0, 10)).toBe('2026-03-09');
  });

  it('skips holidays when adding', () => {
    // Starting from Wed Apr 1, add 2 business days
    // Apr 2 (1), Apr 3 is Good Friday (skip), Apr 6 (2)
    const result = addBusinessDays(new Date('2026-04-01'), 2, SPANISH_HOLIDAYS);
    expect(result.toISOString().slice(0, 10)).toBe('2026-04-06');
  });
});

describe('calculateThresholdDate', () => {
  it('calculates 20 business days from submission', () => {
    // From Mar 2, 2026 + 20 business days
    const threshold = calculateThresholdDate(new Date('2026-03-02'), SPANISH_HOLIDAYS);
    // 20 business days from March 2 (excluding start day)
    expect(threshold.toISOString().slice(0, 10)).toBe('2026-03-29');
  });
});

describe('getTimelineStatus', () => {
  it('returns normal urgency for early days', () => {
    const status = getTimelineStatus(
      new Date('2026-03-02'),
      SPANISH_HOLIDAYS,
      new Date('2026-03-10')
    );
    expect(status.urgency).toBe('normal');
    expect(status.isPastThreshold).toBe(false);
    expect(status.businessDaysRemaining).toBeGreaterThan(5);
  });

  it('returns past urgency when past 20 days', () => {
    const status = getTimelineStatus(
      new Date('2026-03-02'),
      SPANISH_HOLIDAYS,
      new Date('2026-04-06')
    );
    expect(status.urgency).toBe('past');
    expect(status.isPastThreshold).toBe(true);
    expect(status.businessDaysRemaining).toBe(0);
    expect(status.percentComplete).toBe(100);
  });

  it('returns approaching urgency near threshold', () => {
    const status = getTimelineStatus(
      new Date('2026-03-02'),
      SPANISH_HOLIDAYS,
      new Date('2026-03-23') // ~15 business days in
    );
    expect(status.urgency).toBe('approaching');
  });
});

describe('getExpiryDates', () => {
  it('calculates correct phases', () => {
    const expiry = new Date('2026-06-15');

    // Too early (more than 60 days before)
    const tooEarly = getExpiryDates(expiry, new Date('2026-03-01'));
    expect(tooEarly.phase).toBe('too_early');

    // Window open (within 60 days, more than 14 days before)
    const windowOpen = getExpiryDates(expiry, new Date('2026-05-01'));
    expect(windowOpen.phase).toBe('window_open');

    // Urgent (within 14 days)
    const urgent = getExpiryDates(expiry, new Date('2026-06-05'));
    expect(urgent.phase).toBe('urgent');

    // Expired but can still file (within 90 days after)
    const expiredCanFile = getExpiryDates(expiry, new Date('2026-07-01'));
    expect(expiredCanFile.phase).toBe('expired_can_file');

    // Too late (more than 90 days after)
    const tooLate = getExpiryDates(expiry, new Date('2026-10-01'));
    expect(tooLate.phase).toBe('expired_too_late');
  });

  it('calculates correct key dates', () => {
    const expiry = new Date('2026-06-15');
    const dates = getExpiryDates(expiry);
    expect(dates.renewalWindowOpens.toISOString().slice(0, 10)).toBe('2026-04-16');
    expect(dates.lateDeadline.toISOString().slice(0, 10)).toBe('2026-09-13');
  });
});
