// ─── Color Palettes ───────────────────────────────────────────────────────────
// 60% neutral · 30% surface · 10% teal accent

const light = {
  // ── Brand (10% accent) ────────────────────────────────────────────────────
  primary: "#0F766E",   // teal
  onPrimary: "#ffffff",
  primaryContainer: "#CCFBF1",   // light teal — badge bg
  onPrimaryContainer: "#0D5F58",   // darker teal for text on light teal

  // ── Backgrounds & Surfaces (60% neutral) ──────────────────────────────────
  background: "#f4f7f9",   // off-white — never pure white
  surfaceContainerLowest: "#ffffff",   // card surfaces
  surfaceContainerLow: "#f8fafc",   // input backgrounds
  surfaceContainer: "#f1f5f9",   // tab bar, chips
  surfaceContainerHigh: "#e9edf0",
  surfaceContainerHighest: "#e2e8f0",

  // ── Text ─────────────────────────────────────────────────────────────────
  onSurface: "#111827",   // near-black — avoids pure #000
  onSurfaceVariant: "#6b7280",   // secondary text
  onBackground: "#111827",

  // ── Borders ──────────────────────────────────────────────────────────────
  outline: "#9ca3af",   // placeholder, helper text
  outlineVariant: "#e5e7eb",   // card borders, dividers

  // ── Secondary ────────────────────────────────────────────────────────────
  secondaryContainer: "#f1f5f9",
  onSecondaryContainer: "#475569",

  // ── Semantic status ───────────────────────────────────────────────────────
  error: "#dc2626",
  errorContainer: "#fee2e2",
  onError: "#ffffff",
  onErrorContainer: "#991b1b",

  successContainer: "#dcfce7",
  onSuccessContainer: "#166534",

  warningContainer: "#fef3c7",
  onWarningContainer: "#92400e",

  // ── Badge tokens ─────────────────────────────────────────────────────────
  primaryFixed: "#CCFBF1",
  onPrimaryFixedVariant: "#0F766E",
  secondaryFixed: "#f1f5f9",
  onSecondaryFixedVariant: "#475569",
  tertiaryFixed: "#dcfce7",
  onTertiaryFixedVariant: "#166534",

  // ── Inverse ──────────────────────────────────────────────────────────────
  inverseSurface: "#1f2937",   // dark card — not pure black
  inverseOnSurface: "#f9fafb",
};

const dark = {
  // ── Brand ────────────────────────────────────────────────────────────────
  // Lighter teal in dark mode — original #0F766E would fail contrast on dark bg
  primary: "#2DD4BF",
  onPrimary: "#003731",
  primaryContainer: "#0D4F4A",   // muted teal container
  onPrimaryContainer: "#99F6E4",

  // ── Backgrounds & Surfaces ───────────────────────────────────────────────
  // Never pure black — use dark grays with subtle warmth
  background: "#0f1117",   // darkest layer
  surfaceContainerLowest: "#161b22",   // cards
  surfaceContainerLow: "#1c2230",   // input backgrounds
  surfaceContainer: "#21293a",   // tab bar, chips
  surfaceContainerHigh: "#273040",
  surfaceContainerHighest: "#2d3748",

  // ── Text ─────────────────────────────────────────────────────────────────
  onSurface: "#e2e8f0",   // near-white — not pure #fff
  onSurfaceVariant: "#94a3b8",
  onBackground: "#e2e8f0",

  // ── Borders ──────────────────────────────────────────────────────────────
  outline: "#64748b",
  outlineVariant: "#2d3748",

  // ── Secondary ────────────────────────────────────────────────────────────
  secondaryContainer: "#1e293b",
  onSecondaryContainer: "#94a3b8",

  // ── Semantic status ───────────────────────────────────────────────────────
  error: "#f87171",
  errorContainer: "#3b1515",
  onError: "#1a0000",
  onErrorContainer: "#fca5a5",

  successContainer: "#14532d",
  onSuccessContainer: "#86efac",

  warningContainer: "#451a03",
  onWarningContainer: "#fcd34d",

  // ── Badge tokens ─────────────────────────────────────────────────────────
  primaryFixed: "#0D4F4A",
  onPrimaryFixedVariant: "#2DD4BF",
  secondaryFixed: "#1e293b",
  onSecondaryFixedVariant: "#94a3b8",
  tertiaryFixed: "#14532d",
  onTertiaryFixedVariant: "#86efac",

  // ── Inverse ──────────────────────────────────────────────────────────────
  inverseSurface: "#e2e8f0",
  inverseOnSurface: "#1f2937",
};

// ─── Shared tokens (same in both modes) ──────────────────────────────────────
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  gutter: 24,
};

const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 99,
};

// ─── Exports ──────────────────────────────────────────────────────────────────
export const lightTheme = { colors: light, spacing, borderRadius };
export const darkTheme = { colors: dark, spacing, borderRadius };

// Default export stays as light so existing `import { theme }` imports don't break
export const theme = lightTheme;