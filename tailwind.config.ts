import type { Config } from 'tailwindcss';
import theme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,mdx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', ...theme.fontFamily.sans] },
      backgroundColor: {
        DEFAULT: 'hsl(var(--background))',
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        muted: 'hsl(var(--muted))',
        accent: 'hsl(var(--accent))',
        danger: 'hsl(var(--danger))',
        warning: 'hsl(var(--warning))',
        success: 'hsl(var(--success))',
        input: 'hsl(var(--input))',
      },
      textColor: {
        DEFAULT: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent-foreground))',
        danger: 'hsl(var(--danger-foreground))',
        warning: 'hsl(var(--warning-foreground))',
        success: 'hsl(var(--success-foreground))',
      },
      borderColor: { DEFAULT: 'hsl(var(--border))', primary: 'hsl(var(--primary))' },
      ringColor: { DEFAULT: 'hsl(var(--ring))' },
      stroke: {
        primary: 'hsl(var(--primary))',
        warning: 'hsl(var(--warning))',
        danger: 'hsl(var(--danger))',
        success: 'hsl(var(--success))',
      },
    },
  },
  future: { hoverOnlyWhenSupported: true },
  corePlugins: { fontSize: false },
  plugins: [
    require('tailwindcss-fluid-type')({ settings: { ratioMin: 1.25, ratioMax: 1.4 } }),
    require('tailwindcss-animate'),
    plugin(({ addBase }) => {
      addBase({
        ':root': {
          '--background': '0 0% 4%',
          '--foreground': '0 0% 83%',
          '--muted': '0 0% 9%',
          '--muted-foreground': '0 0% 64%',
          '--primary': '0 0% 90%',
          '--primary-foreground': '0 0% 4%',
          '--secondary': '0 0% 25%',
          '--secondary-foreground': '0 0% 83%',
          '--accent': '',
          '--accent-foreground': '0 0% 90%',
          '--danger': '0 74% 42%',
          '--danger-foreground': '0 0% 83%',
          '--warning': '48 97% 77%',
          '--warning-foreground': '',
          '--success': '156 72% 67%',
          '--success-foreground': '',
          '--border': '0 0% 32%',
          '--ring': '0 0% 96%',
          '--input': '0 0% 15%',
        },
        '::backdrop': { '--background': '0 0% 4%' },
      });
    }),
  ],
} satisfies Config;
