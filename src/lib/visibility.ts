// Team rule (2026-11-14): the live site shows only verified data. Vercel previews and local
// dev also show unverified records, always under an "Unverified" badge, so the team can review
// the UI before the data is checked. VERCEL_ENV is "production" only for the deploy of `main`.
export const showUnverified = process.env.VERCEL_ENV !== "production";

export const visible = <T extends { verified: boolean }>(items: T[]) => (showUnverified ? items : items.filter((i) => i.verified));
