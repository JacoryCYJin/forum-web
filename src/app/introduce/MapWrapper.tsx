'use client';

import dynamic from "next/dynamic";

// 使用dynamic导入地图组件，禁用SSR
const MapDisplay = dynamic(
  () => import("@/components/features/map/MapDisplay"),
  { ssr: false }
);

export default function MapWrapper() {
  return <MapDisplay />;
} 