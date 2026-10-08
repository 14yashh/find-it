/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F4EDE0",
          light: "#FAF6EE",
          dark: "#E8DFC8",
        },
        ink: {
          DEFAULT: "#17181C",
          muted: "#4A4D57",
          faint: "#8F7066",
        },
        manila: {
          DEFAULT: "#EAD7A8",
          dark: "#D7C597",
        },
        "orange-action": "#FF5B14",
        stamp: {
          lost: "#C8312B",
          found: "#1E7B4F",
          returned: "#243C8F",
          pending: "#B45309",
          expired: "#4B5563",
          approved: "#1E7B4F",
          rejected: "#C8312B",
        },
        // Stitch MD3 tokens verbatim
        primary: {
          DEFAULT: "#aa3600",
          container: "#ff5b14",
          fixed: "#ffdbcf",
        },
        surface: {
          DEFAULT: "#faf8fe",
          dim: "#dad9df",
          container: "#efedf3",
          "container-low": "#f4f3f8",
          "container-high": "#e9e7ed",
          "container-highest": "#e3e2e7",
        },
        "on-surface": "#1a1b1f",
        "on-surface-variant": "#5b4138",
        outline: "#8f7066",
        "outline-variant": "#e4beb2",
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        heading: ['"Bricolage Grotesque"', 'sans-serif'],
        meta: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'hard-2': '2px 2px 0px #17181C',
        'hard-4': '4px 4px 0px #17181C',
        'hard-6': '6px 6px 0px #17181C',
        'hard-8': '8px 8px 0px #17181C',
      },
    },
  },
  plugins: [],
};
