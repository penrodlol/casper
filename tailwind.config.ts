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
      keyframes: {
        'expand-down': { from: { height: '0' }, to: { height: 'var(--expansion-height, 0)' } },
        'expand-up': { from: { height: 'var(--expansion-height, 0)' }, to: { height: '0' } },
      },
      animation: {
        'expand-down': 'expand-down 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        'expand-up': 'expand-up 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  future: { hoverOnlyWhenSupported: true },
  plugins: [
    require('tailwindcss-fluid-type'),
    require('tailwindcss-animate'),
    plugin(({ addBase }) => {
      addBase({
        ':root': {
          '--background': '0 0% 4%',
          '--foreground': '0 0% 83%',
          '--muted': '0 0% 13%',
          '--muted-foreground': '0 0% 64%',
          '--primary': '0 0% 90%',
          '--primary-foreground': '0 0% 4%',
          '--secondary': '0 0% 25%',
          '--secondary-foreground': '0 0% 83%',
          '--accent': '',
          '--accent-foreground': '0 0% 90%',
          '--destructive': '0 74% 42%',
          '--destructive-foreground': '0 0% 83%',
          '--border': '0 0% 32%',
          '--ring': '0 0% 96%',
        },
        '::backdrop': { '--background': '0 0% 4%' },
      });
    }),
  ],
} satisfies Config;
