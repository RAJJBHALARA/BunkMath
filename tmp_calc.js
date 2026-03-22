const start = new Date('2026-01-27');
const end = new Date('2026-03-22');

const holidays = [
  '2026-01-14', '2026-01-17', '2026-01-26', '2026-02-07', '2026-02-14',
  '2026-02-21', '2026-03-04', '2026-03-14', '2026-03-21', '2026-03-26'
].map(d => new Date(d).getTime());

let dayCounts = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 }; // Sun=0, Mon=1, etc.

for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
  const t = d.getTime();
  const dayOfWeek = d.getDay();
  
  // Skip if it's a holiday
  if (holidays.includes(t)) {
    continue;
  }
  
  dayCounts[dayOfWeek]++;
}

console.log("From Jan 27 to Mar 21 (Excluding Holidays):");
console.log("Mondays:", dayCounts[1]);
console.log("Tuesdays:", dayCounts[2]);
console.log("Wednesdays:", dayCounts[3]);
console.log("Thursdays:", dayCounts[4]);
console.log("Fridays:", dayCounts[5]);
console.log("Saturdays:", dayCounts[6]);
