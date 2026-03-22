// Global Holiday List for Marwadi University (Ex: 2026)
// Add or remove dates in YYYY-MM-DD format as needed.
export const HOLIDAYS = [
  '2026-01-14', // UTTARAYAN
  '2026-01-17', // 3RD SATURDAY
  '2026-01-26', // REPUBLIC DAY
  '2026-02-07', // SPECIAL HOLIDAY
  '2026-02-14', // 2ND SATURDAY
  '2026-02-21', // 3RD SATURDAY
  '2026-03-04', // DHULETI
  '2026-03-14', // 2ND SATURDAY
  '2026-03-21', // EID / 3RD SATURDAY
  '2026-03-26', // RAM NAVAMI
  '2026-08-15', // INDEPENDENCE DAY
  '2026-08-28', // RAKSHABANDHAN
  '2026-09-03', // SAPTAM
  '2026-09-04', // JANMASTHMI
  '2026-09-05', // NAVAM
  '2026-09-19', // 3RD SATURDAY
  '2026-10-02', // GANDHI JAYANTI
  '2026-10-10', // 2ND SATURDAY
  '2026-10-17', // 3RD SATURDAY
  '2026-10-21', // DUSHERRA
  '2026-11-07', // CHHOTI DIWALI
  '2026-11-08', // DIWALI
  '2026-11-09', // SPECIAL HOLIDAY
  '2026-11-10', // NEW YEAR
  '2026-11-11', // BHAI DUJ
  '2026-11-12', // SPECIAL HOLIDAY
  '2026-11-13', // SPECIAL HOLIDAY
  '2026-11-14', // 2ND SATURDAY
  '2026-12-12', // 2ND SATURDAY
  '2026-12-19', // 3RD SATURDAY
  '2026-12-25', // CHRISTMAS
];

/**
 * Calculates exactly how many classes were conducted and attended
 * @param {string} startDate - 'YYYY-MM-DD'
 * @param {Array<number>} activeDays - Array of integers representing days of week the class is held (0=Sun, 1=Mon...6=Sat)
 * @param {number} percentage - The percentage attendance from the student portal (0-100)
 * @returns {Object} { total: number, attended: number }
 */
export function calculateExactClasses(startDateStr, activeDays, percentage) {
  if (!startDateStr || !activeDays || activeDays.length === 0) {
    return { total: 0, attended: 0 };
  }

  const start = new Date(startDateStr);
  
  // Use "yesterday" as the default end date if the portal usually updates data up to yesterday.
  // We'll just use "today" but not include today's classes to be safe, simulating "till yesterday".
  const end = new Date();
  end.setHours(0,0,0,0);

  // Convert holiday strings to timestamps at midnight for easy comparison
  const holidayTimestamps = HOLIDAYS.map(d => {
    const hDate = new Date(d);
    hDate.setHours(0,0,0,0);
    return hDate.getTime();
  });

  let totalConducted = 0;

  // Iterate from start date to end date
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    const timestamp = d.getTime();
    const dayOfWeek = d.getDay();

    // Skip if it is not a day this subject is taught
    if (!activeDays.includes(dayOfWeek)) {
      continue;
    }

    // Skip if it's a known holiday
    if (holidayTimestamps.includes(timestamp)) {
      continue;
    }

    // This is a valid working day for this subject!
    totalConducted++;
  }

  // Calculate attended classes based on the percentage provided
  // E.g., 64% of 16 classes = 10.24 classes -> round to 10
  const decimalPercentage = Math.min(Math.max(percentage, 0), 100) / 100;
  const attendedClasses = Math.round(totalConducted * decimalPercentage);

  return {
    total: totalConducted,
    attended: attendedClasses
  };
}
