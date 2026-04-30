export const theme = {
  colors: {
    // Brand Palette - Updated to your new Teal
    primary: "#0F766E",
    onPrimary: "#ffffff",

    background: "#f4f7f9",
    onBackground: "#111827",

    surface: "#ffffff",
    onSurface: "#111827",
    onSurfaceVariant: "#6b7280",

    border: "#e5e7eb",
    outline: "#6b7280",
    outlineVariant: "#e5e7eb",

    // Container Palette - Using the new Teal for Primary Container
    primaryContainer: "#CCFBF1", // Light Teal Background
    onPrimaryContainer: "#0F766E", // Dark Teal Text

    // Using a muted Slate/Indigo for secondary elements
    secondaryContainer: "#F1F5F9",
    onSecondaryContainer: "#475569",

    // Status Palette (Tailwind-inspired for clarity)
    inProgress: { bg: "#CCFBF1", text: "#0F766E" }, // Matches your new Primary
    cooling: { bg: "#FEF3C7", text: "#92400e" },    // Amber
    validated: { bg: "#DCFCE7", text: "#166534" },  // Green
    error: { bg: "#FEE2E2", text: "#991B1B" },    // Red

    // Fixed color tokens for the BatchRow status logic
    primaryFixed: "#CCFBF1",
    onPrimaryFixedVariant: "#0F766E",
    secondaryFixed: "#F1F5F9",
    onSecondaryFixedVariant: "#475569",
    tertiaryFixed: "#DCFCE7",
    onTertiaryFixedVariant: "#166534",

    // Dark "Inverse" Look (Samsung OneUI style)
    inverseSurface: "#111827",
    inverseOnSurface: "#ffffff",

    // Surface variants for better card layering
    surfaceContainerLowest: "#ffffff",
    surfaceContainerLow: "#F8FAFC",
    surfaceContainer: "#F1F5F9",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    gutter: 24,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 99,
  },
};