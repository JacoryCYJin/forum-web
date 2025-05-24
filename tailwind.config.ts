import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "foreground-muted": "var(--foreground-muted)",
        "foreground-subtle": "var(--foreground-subtle)",
        primary: {
          DEFAULT: "#FF4500", // Reddit橙色
          light: "#FF7043", // 添加浅色版本
          hover: "#FF5722",
          dark: "#E64A19", // 添加深色版本
        },
        secondary: {
          DEFAULT: "#0079D3", // Reddit蓝色
          hover: "#0288D1",
        },
        neutral: {
          100: "#F6F7F8",
          200: "#DAE0E6", // Reddit背景色
          300: "#EDEFF1", // Reddit卡片背景色
          400: "#878A8C",
          500: "#1A1A1B", // Reddit深色文本
        },
        dark: {
          primary: "#1A1A1B", // Reddit深色模式背景
          secondary: "#272729", // Reddit深色模式卡片
        },
      },
      fontFamily: {
        sans: [
          'IBM Plex Sans',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'xs': '10px',
        'sm': '12px',
        'base': '14px',
        'lg': '16px',
        'xl': '18px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '28px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
} satisfies Config;
