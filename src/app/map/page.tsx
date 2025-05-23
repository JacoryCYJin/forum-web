import Link from 'next/link';
import MapDisplay from '@/components/features/map/MapDisplay';

export default function MapPage() {
  return (
    <div className="relative w-full h-screen">
      {/* 地图组件占据整个屏幕 */}
      <MapDisplay />
      
      {/* 进入论坛按钮，固定在屏幕中间 */}
      <div className="absolute left-1/2 bottom-10 transform -translate-x-1/2 z-10">
        <Link 
          href="/" 
          className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          进入论坛
        </Link>
      </div>
    </div>
  );
}
