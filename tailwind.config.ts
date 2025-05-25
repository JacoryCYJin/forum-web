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
          light: "#FF7043", // 浅色版本
          hover: "#FF5722", // 悬停色
          dark: "#E64A19", // 深色版本
          50: "#FFF3E0",
          100: "#FFE0B2",
          200: "#FFCC80",
          300: "#FFB74D",
          400: "#FFA726",
          500: "#FF4500",
          600: "#FF5722",
          700: "#E64A19",
          800: "#D84315",
          900: "#BF360C",
        },
        secondary: {
          DEFAULT: "#0079D3", // Reddit蓝色
          hover: "#0288D1",
          50: "#E3F2FD",
          100: "#BBDEFB",
          200: "#90CAF9",
          300: "#64B5F6",
          400: "#42A5F5",
          500: "#0079D3",
          600: "#0288D1",
          700: "#0277BD",
          800: "#01579B",
          900: "#01497C",
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F6F7F8",
          200: "#DAE0E6", // Reddit背景色
          300: "#EDEFF1", // Reddit卡片背景色
          400: "#878A8C",
          500: "#1A1A1B", // Reddit深色文本
          600: "#0F0F0F",
          700: "#0A0A0A",
          800: "#000000",
          900: "#000000",

          dark: {
            50: "#1A1A1B",
            100: "#272729",  // 卡片背景
            200: "#343536",  // 边框
            300: "#3A3B3C",
            400: "#666666",  // muted
            500: "#D7DADC",  // 前景文字
            600: "#EDEFF1",  // 浅灰文字
            700: "#F6F7F8",
            800: "#FAFAFA",
            900: "#FFFFFF",
          },
        },
        dark: {
          primary: "#1A1A1B", // Reddit深色模式背景
          secondary: "#272729", // Reddit深色模式卡片
          neutral: "#EDEFF1",
        },
        // 新增：输入框和表单相关颜色
        input: {
          background: {
            light: "#F6F7F8",
            dark: "#374151",
          },
          border: {
            light: "#E5E7EB",
            dark: "#4B5563",
            focus: "#FF4500", // 聚焦时的边框色为主题色
          },
          text: {
            light: "#1F2937",
            dark: "#F9FAFB",
          },
          placeholder: {
            light: "#9CA3AF",
            dark: "#6B7280",
          }
        },
        // 复选框颜色
        checkbox: {
          checked: "#FF4500",
          unchecked: {
            light: "#E5E7EB",
            dark: "#4B5563",
          }
        }
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
      borderRadius: {
        'dialog-left': '16px 0 0 16px',
        'dialog-right': '0 16px 16px 0',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
} satisfies Config;
