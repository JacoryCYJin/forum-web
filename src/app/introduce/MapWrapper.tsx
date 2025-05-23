'use client';

import { useState, useEffect } from 'react';
import dynamic from "next/dynamic";

// 使用dynamic导入地图组件，禁用SSR
const MapDisplay = dynamic(
  () => import("@/components/features/map/MapDisplay"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-gray-700">地图组件加载中...</p>
        </div>
      </div>
    )
  }
);

export default function MapWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100" style={{ minHeight: '500px' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-gray-700">准备加载地图...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full" style={{ minHeight: '500px' }}>
      <MapDisplay />
    </div>
  );
} 