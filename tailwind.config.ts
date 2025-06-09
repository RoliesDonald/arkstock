import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Jika Anda menggunakan Pages Router
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Jika Anda menggunakan App Router
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Jika Anda menggunakan folder src
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0": { opacity: "0" },
          "100": { opacity: "1" },
        },
        "fade-out": {
          "0": { opacity: "1" },
          "100": { opacity: "0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        arkBlue: {
          50: "hsl(var(--arkBlue-50))",
          100: "hsl(var(--arkBlue-100))",
          200: "hsl(var(--arkBlue-200))",
          300: "hsl(var(--arkBlue-300))",
          400: "hsl(var(--arkBlue-400))",
          500: "hsl(var(--arkBlue-500))",
          600: "hsl(var(--arkBlue-600))",
          700: "hsl(var(--arkBlue-700))",
          800: "hsl(var(--arkBlue-800))",
          900: "hsl(var(--arkBlue-900))",
        },
        arkRed: {
          50: "hsl(var(--arkRed-50))",
          100: "hsl(var(--arkRed-100))",
          200: "hsl(var(--arkRed-200))",
          300: "hsl(var(--arkRed-300))",
          400: "hsl(var(--arkRed-400))",
          500: "hsl(var(--arkRed-500))",
          600: "hsl(var(--arkRed-600))",
          700: "hsl(var(--arkRed-700))",
          800: "hsl(var(--arkRed-800))",
          900: "hsl(var(--arkRed-900))",
        },
        arkOrange: {
          50: "hsl(var(--arkOrange-50))",
          100: "hsl(var(--arkOrange-100))",
          200: "hsl(var(--arkOrange-200))",
          300: "hsl(var(--arkOrange-300))",
          400: "hsl(var(--arkOrange-400))",
          500: "hsl(var(--arkOrange-500))",
          600: "hsl(var(--arkOrange-600))",
          700: "hsl(var(--arkOrange-700))",
          800: "hsl(var(--arkOrange-800))",
          900: "hsl(var(--arkOrange-900))",
        },
        arkGreen: {
          50: "hsl(var(--arkGreen-50))",
          100: "hsl(var(--arkGreen-100))",
          200: "hsl(var(--arkGreen-200))",
          300: "hsl(var(--arkGreen-300))",
          400: "hsl(var(--arkGreen-400))",
          500: "hsl(var(--arkGreen-500))",
          600: "hsl(var(--arkGreen-600))",
          700: "hsl(var(--arkGreen-700))",
          800: "hsl(var(--arkGreen-800))",
          900: "hsl(var(--arkGreen-900))",
        },
        arkBg: {
          // Nama kustom untuk background agar tidak tumpang tindih
          50: "hsl(var(--arkBackground-50))",
          100: "hsl(var(--arkBackground-100))",
          200: "hsl(var(--arkBackground-200))",
          300: "hsl(var(--arkBackground-300))",
          400: "hsl(var(--arkBackground-400))",
          500: "hsl(var(--arkBackground-500))",
          600: "hsl(var(--arkBackground-600))",
          700: "hsl(var(--arkBackground-700))",
          800: "hsl(var(--arkBackground-800))",
          900: "hsl(var(--arkBackground-900))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
