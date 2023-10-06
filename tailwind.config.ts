const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      ...defaultTheme.fontFamily,
      serif: ["Merriweather", ...defaultTheme.fontFamily.serif],
      mono: ['"IBM Plex Mono"', ...defaultTheme.fontFamily.mono],
    },
  },
  plugins: [],
};
