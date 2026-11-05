const subjects = [
  "Forest trail",
  "City skyline",
  "Coastal cliffs",
  "Alpine lake",
  "Summer garden",
  "Market street",
  "Evening lights",
  "Mountain pass",
  "Quiet waterfront",
  "Desert road",
  "Woodland",
  "Old town",
];
const formats = [
  "Photo print",
  "Postcard set",
  "Framed print",
  "Canvas print",
  "Travel journal",
  "Desk calendar",
  "Mini poster",
  "Art card",
  "Gallery print",
  "Collector edition",
];

export const products = Array.from({ length: 111 }, (_, index) => ({
  id: index + 1,
  name: `${subjects[index % subjects.length]} · ${formats[Math.floor(index / subjects.length)]}`,
  cents: 179 + ((index * 1733 + 6985) % 9500),
}));

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
export function formatPrice(cents: number) {
  return usd.format(cents / 100);
}
