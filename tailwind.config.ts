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
        destructive: 'hsl(var(--destructive))',
      },
      textColor: {
        DEFAULT: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive-foreground))',
      },
      borderColor: { DEFAULT: 'hsl(var(--border))', primary: 'hsl(var(--primary))' },
      ringColor: { DEFAULT: 'hsl(var(--ring))' },
    },
  },
  future: { hoverOnlyWhenSupported: true },
  plugins: [
    require('tailwindcss-fluid-type'),
    plugin(({ addBase, theme }) => {
      addBase({
        ':root': {
          '--background': '0 0% 4%',
          '--foreground': '0 0% 83%',
          '--muted': '',
          '--muted-foreground': '0 0% 64%',
          '--primary': '0 0% 90%',
          '--primary-foreground': '0 0% 4%',
          '--secondary': '',
          '--secondary-foreground': '',
          '--accent': '',
          '--accent-foreground': '',
          '--destructive': '',
          '--destructive-foreground': '',
          '--border': '0 0% 32%',
          '--ring': '',
        },
      });
    }),
  ],
} satisfies Config;
