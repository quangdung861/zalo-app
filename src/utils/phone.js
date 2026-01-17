export function formatPhoneVN(phone) {
  if (!phone) return "";

  const str = phone.toString();
  return str.replace(/(\d{3})(\d{3})(\d+)/, "$1 $2 $3");
}
