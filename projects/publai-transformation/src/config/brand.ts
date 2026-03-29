/**
 * PublAI Brand Configuration
 *
 * Primary Green (#61BA5E), Dark Accents (#1A1A1A), White text
 * Serif headers (Playfair Display), Sans-serif body (Inter)
 */

import type { Theme } from '../../../../lib/theme';

export const brandName = 'publai';

export const brand = {
  name: 'PublAI',
  colors: {
    primary: '#61BA5E',
    primaryLight: '#7DD47A',
    primaryDark: '#4A9A48',
    accent: '#61BA5E',
    textDark: '#FFFFFF',
    textMedium: '#B0B0B0',
    textLight: '#666666',
    bgLight: '#1A1A1A',
    bgDark: '#0D0D0D',
    bgOverlay: 'rgba(97, 186, 94, 0.08)',
    divider: '#2A2A2A',
    shadow: 'rgba(0, 0, 0, 0.6)',
  },
  fonts: {
    heading: "'Playfair Display', Georgia, 'Times New Roman', serif",
    primary: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
  },
  spacing: { xs: 8, sm: 16, md: 24, lg: 48, xl: 80, xxl: 120 },
  borderRadius: { sm: 4, md: 8, lg: 16 },
  typography: {
    h1: { size: 80, weight: 700 },
    h2: { size: 60, weight: 700 },
    h3: { size: 44, weight: 600 },
    body: { size: 24, weight: 400 },
    label: { size: 16, weight: 500, letterSpacing: 3 },
  },
};

export const brandTheme: Theme = {
  colors: brand.colors,
  fonts: { primary: brand.fonts.primary, mono: brand.fonts.mono },
  spacing: brand.spacing,
  borderRadius: brand.borderRadius,
  typography: brand.typography,
};
