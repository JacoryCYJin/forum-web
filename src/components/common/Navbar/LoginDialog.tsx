'use client';

import React, { useState, useRef } from 'react';

interface LoginDialogProps {
  visible: boolean;
  onClose: () => void;
}

// 认证流程步骤
enum AuthStep {
  LOGIN = 'login',
  REGISTER = 'register',
  AVATAR = 'avatar',
  TAGS = 'tags'
}

// 登录面板组件
interface LoginPanelProps {
  phone: string;
  setPhone: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleLogin: () => void;
  toggleAuthMode: () => void;
  onClose: () => void;
  isSliding: boolean;
}

const LoginPanel: React.FC<LoginPanelProps> = ({
  phone,
  setPhone,
  password,
  setPassword,
  handleLogin,
  toggleAuthMode,
  onClose,
  isSliding
}) => {
  return (
    <div className={`auth-panel ${isSliding ? 'slide-out-right' : ''}`}>
      <h2 className="text-2xl font-bold mb-6 text-center">登录</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">账号</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md bg-gray-100"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">密码</label>
        <input
          type="password"
          className="w-full px-3 py-2 border rounded-md bg-gray-100"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mt-8">
        <button
          onClick={handleLogin}
          className="w-full py-3 px-4 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
        >
          登录
        </button>
        <div className="mt-4 text-center">
          <button
            onClick={toggleAuthMode}
            className="text-sm text-gray-600 hover:text-primary"
          >
            没有账号，注册
          </button>
        </div>
      </div>
      <div className="absolute bottom-2 right-2">
        <button
          onClick={onClose}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          忘记密码
        </button>
      </div>
    </div>
  );
};

// 注册面板组件
interface RegisterPanelProps {
  phone: string;
  setPhone: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleRegister: () => void;
  toggleAuthMode: () => void;
  isSliding: boolean;
}

const RegisterPanel: React.FC<RegisterPanelProps> = ({
  phone,
  setPhone,
  password,
  setPassword,
  handleRegister,
  toggleAuthMode,
  isSliding
}) => {
  return (
    <div className={`auth-panel ${isSliding ? 'slide-out-left' : ''}`}>
      <h2 className="text-2xl font-bold mb-6 text-center">注册</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">手机号</label>
        <input
          type="tel"
          className="w-full px-3 py-2 border rounded-md bg-gray-100"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">密码</label>
        <input
          type="password"
          className="w-full px-3 py-2 border rounded-md bg-gray-100"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex items-center mb-6">
        <input type="checkbox" id="agreement" className="mr-2" />
        <label htmlFor="agreement" className="text-sm text-gray-600">同意协议</label>
      </div>
      <div className="mt-8">
        <button
          onClick={handleRegister}
          className="w-full py-3 px-4 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
        >
          注册
        </button>
        <div className="mt-4 text-center">
          <button
            onClick={toggleAuthMode}
            className="text-sm text-gray-600 hover:text-primary"
          >
            已有账号，返回登录
          </button>
        </div>
      </div>
    </div>
  );
};

// 头像设置面板组件
interface AvatarPanelProps {
  nickname: string;
  setNickname: (value: string) => void;
  avatar: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAvatarSubmit: () => void;
  skipCurrentStep: () => void;
}

const AvatarPanel: React.FC<AvatarPanelProps> = ({
  nickname,
  setNickname,
  avatar,
  fileInputRef,
  handleAvatarUpload,
  handleAvatarSubmit,
  skipCurrentStep
}) => {
  return (
    <div className="auth-panel">
      <h2 className="text-2xl font-bold mb-6 text-center">上传头像</h2>
      <div className="mb-6 flex flex-col items-center">
        <div 
          className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center cursor-pointer overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
        >
          {avatar ? (
            <img src={avatar} alt="头像预览" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500">上传头像</span>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleAvatarUpload}
        />
        <span className="text-sm text-gray-500 mt-2">上传头像</span>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">昵称</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md bg-gray-100"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>
      <div className="mt-8">
        <button
          onClick={handleAvatarSubmit}
          className="w-full py-3 px-4 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
        >
          下一步
        </button>
        <div className="mt-4 text-center">
          <button
            onClick={skipCurrentStep}
            className="text-sm text-gray-600 hover:text-primary"
          >
            跳过
          </button>
        </div>
      </div>
    </div>
  );
};

// 标签选择面板组件
interface TagsPanelProps {
  availableTags: string[];
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  handleTagsSubmit: () => void;
  skipCurrentStep: () => void;
}

const TagsPanel: React.FC<TagsPanelProps> = ({
  availableTags,
  selectedTags,
  toggleTag,
  handleTagsSubmit,
  skipCurrentStep
}) => {
  return (
    <div className="auth-panel">
      <h2 className="text-2xl font-bold mb-6 text-center">选择喜欢的分类</h2>
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        {availableTags.map((tag, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedTags.includes(tag)
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700'
            } transition-colors duration-200`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="mt-8">
        <button
          onClick={handleTagsSubmit}
          className="w-full py-3 px-4 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
        >
          完成
        </button>
        <div className="mt-4 text-center">
          <button
            onClick={skipCurrentStep}
            className="text-sm text-gray-600 hover:text-primary"
          >
            跳过
          </button>
        </div>
      </div>
    </div>
  );
};

// 主对话框组件
const LoginDialog: React.FC<LoginDialogProps> = ({ visible, onClose }) => {
  // 当前认证步骤
  const [currentStep, setCurrentStep] = useState<AuthStep>(AuthStep.LOGIN);
  
  // 表单数据
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // 滑动动画状态
  const [isSliding, setIsSliding] = useState(false);
  
  // 文件输入引用
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 可选标签列表
  const availableTags = [
    '生活', '摄影', '旅游', '摄影',
    'XXXXXX', 'XXXXXX', 'XXXXXX'
  ];

  // 处理登录
  const handleLogin = () => {
    console.log('登录信息:', { phone, password });
    onClose();
  };

  // 处理注册
  const handleRegister = () => {
    console.log('注册信息:', { phone, password });
    setCurrentStep(AuthStep.AVATAR);
  };

  // 处理头像上传
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理头像和昵称提交
  const handleAvatarSubmit = () => {
    console.log('头像和昵称:', { avatar, nickname });
    setCurrentStep(AuthStep.TAGS);
  };

  // 处理标签选择
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // 处理标签提交
  const handleTagsSubmit = () => {
    console.log('选择的标签:', selectedTags);
    onClose();
  };

  // 切换登录/注册模式
  const toggleAuthMode = (mode: AuthStep) => {
    setIsSliding(true);
    setTimeout(() => {
      setCurrentStep(mode);
      setIsSliding(false);
    }, 300);
  };

  // 跳过当前步骤
  const skipCurrentStep = () => {
    if (currentStep === AuthStep.AVATAR) {
      setCurrentStep(AuthStep.TAGS);
    } else if (currentStep === AuthStep.TAGS) {
      onClose();
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${visible ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div 
        className="bg-white rounded-lg shadow-xl relative z-10 overflow-hidden"
        style={{ width: '600px', height: '400px' }}
      >
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex h-full relative">
          {/* 红色区域 - 根据步骤调整位置，添加圆弧效果 */}
          <div className={`w-1/3 bg-primary transition-transform duration-300 ease-in-out relative ${
            currentStep === AuthStep.LOGIN 
              ? 'translate-x-0' 
              : 'translate-x-[200%]'
          }`}>
            {/* 圆弧凹陷效果 - 根据位置调整 */}
            {/* {currentStep === AuthStep.LOGIN ? (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-16 bg-white rounded-l-full"></div>
            ) : (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-16 bg-white rounded-r-full"></div>
            )} */}
          </div>
          
          {/* 白色内容区域 - 根据步骤调整位置 */}
          <div className={`w-2/3 p-6 flex items-center justify-center transition-transform duration-300 ease-in-out ${
            currentStep === AuthStep.LOGIN 
              ? 'translate-x-0 rounded-l-lg' 
              : '-translate-x-1/2 rounded-l-lg'
          }`}>
            {currentStep === AuthStep.LOGIN && (
              <LoginPanel 
                phone={phone}
                setPhone={setPhone}
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
                toggleAuthMode={() => toggleAuthMode(AuthStep.REGISTER)}
                onClose={onClose}
                isSliding={isSliding}
              />
            )}
            
            {currentStep === AuthStep.REGISTER && (
              <RegisterPanel
                phone={phone}
                setPhone={setPhone}
                password={password}
                setPassword={setPassword}
                handleRegister={handleRegister}
                toggleAuthMode={() => toggleAuthMode(AuthStep.LOGIN)}
                isSliding={isSliding}
              />
            )}
            
            {currentStep === AuthStep.AVATAR && (
              <AvatarPanel
                nickname={nickname}
                setNickname={setNickname}
                avatar={avatar}
                fileInputRef={fileInputRef}
                handleAvatarUpload={handleAvatarUpload}
                handleAvatarSubmit={handleAvatarSubmit}
                skipCurrentStep={skipCurrentStep}
              />
            )}
            
            {currentStep === AuthStep.TAGS && (
              <TagsPanel
                availableTags={availableTags}
                selectedTags={selectedTags}
                toggleTag={toggleTag}
                handleTagsSubmit={handleTagsSubmit}
                skipCurrentStep={skipCurrentStep}
              />
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .auth-panel {
          width: 100%;
          transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
          opacity: 1;
        }
        .slide-out-right {
          transform: translateX(100%);
          opacity: 0;
        }
        .slide-out-left {
          transform: translateX(-100%);
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default LoginDialog; 