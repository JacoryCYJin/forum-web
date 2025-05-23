import type { Metadata } from "next";
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: "综合性社区论坛 - 信息交流与个性化推荐平台",
  description: "一个面向所有用户的互动型社区论坛，支持信息交流、资源分享与动态社交。在地图上发现身边的话题，让交流更智能、更有温度。",
  keywords: "论坛, 社区, 信息交流, 地图社交, 资源分享, 个性化推荐, 社交平台, Next.js, 综合性论坛",
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
