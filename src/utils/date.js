export function toISODate(day, month, year) {
  if (!day || !month || !year) return null;

  const d = String(day).padStart(2, "0");
  const m = String(month).padStart(2, "0");

  return `${year}-${m}-${d}`; // ISO 8601
}

export function formatISOToVN(isoDate) {
  if (!isoDate) return "";

  const [year, month, day] = isoDate.split("-");
  return `${day} tháng ${month}, ${year}`;
}

export function parseISODate(isoDate) {
  if (!isoDate) return { day: "", month: "", year: "" };

  const [year, month, day] = isoDate.split("-");
  return { day, month, year };
}
