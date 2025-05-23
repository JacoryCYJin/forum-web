import type { Metadata } from "next";
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: "地理社区 - 实时地图展示",
  description: "基于地理位置的实时社区平台，在地图上发现身边的话题",
  keywords: "地理社区, 地图, 实时, 社交, 地理位置",
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system" disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
