// Billy stores amounts as integers in the smallest currency unit (øre for DKK).
// These helpers isolate the conversion and formatting so the rest of the code
// never touches raw ints.

const DKK_FORMATTER = new Intl.NumberFormat("da-DK", {
  style: "currency",
  currency: "DKK",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function oreToDkk(ore: number): number {
  return ore / 100;
}

export function dkkToOre(dkk: number): number {
  return Math.round(dkk * 100);
}

export function formatDkk(ore: number): string {
  return DKK_FORMATTER.format(oreToDkk(ore));
}

// Billy sometimes returns amounts as decimal strings or floats depending on
// endpoint. Callers can normalise before passing to formatDkk.
export function formatAmount(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
}
