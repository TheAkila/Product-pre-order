import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-black': '#000000',
        'brand-white': '#FFFFFF',
        'brand-red': '#D00000',
        'brand-red-dark': '#9D0208',
        'brand-red-light': '#DC2F02',
      },
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'], // UI Elements
        heading: ['var(--font-outfit)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'], // Headings
        body: ['var(--font-ibm-plex)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'], // Body text
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'brand': '0 10px 15px -3px rgba(208, 0, 0, 0.2), 0 4px 6px -4px rgba(208, 0, 0, 0.1)',
        'brand-lg': '0 20px 25px -5px rgba(208, 0, 0, 0.2), 0 8px 10px -6px rgba(208, 0, 0, 0.1)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
