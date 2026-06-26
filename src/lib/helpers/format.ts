const indonesiaNumber = new Intl.NumberFormat("id-ID");
const indonesiaCurrency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatNumber(value: number) {
  return indonesiaNumber.format(value);
}

export function formatCurrency(value: number) {
  return indonesiaCurrency.format(value);
}

export function formatDate(
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
) {
  return new Intl.DateTimeFormat("id-ID", options).format(new Date(value));
}
