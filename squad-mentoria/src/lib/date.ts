export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  // Backend stores UTC dates without timezone — mark as UTC so JS converts properly
  const utcStr = dateStr.endsWith("Z") ? dateStr : dateStr + "Z";
  const date = new Date(utcStr);
  return date.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return "";
  const utcStr = dateStr.endsWith("Z") ? dateStr : dateStr + "Z";
  const date = new Date(utcStr);
  return date.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}
