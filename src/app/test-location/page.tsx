'use client';

import { useState } from 'react';
import { locationToAddress, parseLocationString } from '@/lib/utils/geoUtils';
import LocationDisplay from '@/components/common/LocationDisplay/LocationDisplay';

export default function TestLocationPage() {
  const [testLocation, setTestLocation] = useState('30.903480,121.885892');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    try {
      console.log('🧪 开始测试位置转换:', testLocation);
      
      // 测试坐标解析
      const coords = parseLocationString(testLocation);
      console.log('📍 坐标解析结果:', coords);
      
      // 测试地址转换
      const address = await locationToAddress(testLocation);
      console.log('🏠 地址转换结果:', address);
      
      setResult(`坐标: ${JSON.stringify(coords)}\n地址: ${address}`);
    } catch (error) {
      console.error('❌ 测试失败:', error);
      setResult(`错误: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">位置转换测试</h1>
      
      <div className="space-y-6">
        {/* 测试输入 */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">测试坐标</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={testLocation}
              onChange={(e) => setTestLocation(e.target.value)}
              placeholder="输入坐标，如：30.903480,121.885892"
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <button
              onClick={handleTest}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? '测试中...' : '测试转换'}
            </button>
          </div>
        </div>

        {/* LocationDisplay 组件测试 */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">LocationDisplay 组件测试</h2>
          <div className="space-y-2">
            <div>
              <strong>完整地址模式:</strong>
              <LocationDisplay 
                location={testLocation}
                showFullAddress={true}
                className="ml-2 text-blue-600"
              />
            </div>
            <div>
              <strong>简化地址模式:</strong>
              <LocationDisplay 
                location={testLocation}
                showFullAddress={false}
                className="ml-2 text-green-600"
              />
            </div>
          </div>
        </div>

        {/* 测试结果 */}
        {result && (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">测试结果</h2>
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )}

        {/* 环境变量检查 */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h2 className="text-lg font-semibold mb-2">环境变量检查</h2>
          <div className="text-sm space-y-1">
            <div>
              <strong>API密钥:</strong> 
              <span className="ml-2 font-mono text-xs">
                {process.env.NEXT_PUBLIC_AMAP_API_KEY ? 
                  `${process.env.NEXT_PUBLIC_AMAP_API_KEY.substring(0, 8)}...` : 
                  '未设置'
                }
              </span>
            </div>
            <div>
              <strong>安全密钥:</strong> 
              <span className="ml-2 font-mono text-xs">
                {process.env.NEXT_PUBLIC_AMAP_SECURITY_JS_CODE ? 
                  `${process.env.NEXT_PUBLIC_AMAP_SECURITY_JS_CODE.substring(0, 8)}...` : 
                  '未设置'
                }
              </span>
            </div>
          </div>
        </div>

        {/* 常见坐标测试 */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">常见坐标快速测试</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: '上海（纬度,经度）', coords: '30.903480,121.885892' },
              { name: '上海（经度,纬度）', coords: '121.885892,30.903480' },
              { name: '北京天安门', coords: '39.9042,116.4074' },
              { name: '广州', coords: '23.1291,113.2644' }
            ].map((item) => (
              <button
                key={item.coords}
                onClick={() => setTestLocation(item.coords)}
                className="p-3 text-left border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500 font-mono">{item.coords}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 