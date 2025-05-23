'use client';

import { useState } from 'react';

interface LoginDialogProps {
  visible: boolean;
  onClose: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ visible, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 这里只是模拟登录，实际项目中应该调用API
    console.log('登录信息:', { username, password });
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${visible ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-full max-w-md relative z-10">
        <div className="flex justify-between items-center border-b border-neutral-200 dark:border-zinc-700 p-4">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white">登录</h3>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-neutral-700 dark:text-neutral-200 text-sm font-medium mb-2">
              用户名
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-neutral-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-zinc-800 text-neutral-900 dark:text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
            />
          </div>
          <div className="mb-6">
            <label className="block text-neutral-700 dark:text-neutral-200 text-sm font-medium mb-2">
              密码
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-neutral-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-zinc-800 text-neutral-900 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <a href="#" className="text-primary hover:text-primary-hover">
                忘记密码?
              </a>
            </div>
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDialog; 