/** @type {import('tailwindcss').Config} */

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(150px, 1fr))',
      },
      screens: {
        'feed_sm': '495px',
        'feed_md': '900px',
        'feed_lg': '1100px',
        'feed_xl': '1280px',
        'feed_2xl': '1536px',
      }
    }
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
export default config;

