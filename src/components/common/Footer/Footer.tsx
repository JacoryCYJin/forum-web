import Link from "next/link";
import Image from "next/image";
import { 
  Home, 
  Fire, 
  MapDraw, 
  Concern, 
  Code,
  VideoOne,
  Music,
  Chip,
  Mail,
  Phone
} from "@icon-park/react";

interface TeamMember {
  id: number;
  name: string;
  avatar: string;
}

interface QuickLink {
  name: string;
  path: string;
  icon: React.ReactElement;
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // 队员数据
  const teamMembers: TeamMember[] = [
    { id: 1, name: "芥子不才", avatar: "/images/avatars/jcy.jpg" },
    { id: 2, name: "迴憶Li待續ᝰ", avatar: "/images/avatars/cjp.png" },
    { id: 3, name: "寒星", avatar: "/images/avatars/gyh.jpg" },
    { id: 4, name: "🐦", avatar: "/images/avatars/yym.jpg" },
    { id: 5, name: "橙雨", avatar: "/images/avatars/gcy.jpg" },
    { id: 6, name: "菠萝会咬人", avatar: "/images/avatars/lhz.jpg" },
    { id: 7, name: "NST-L", avatar: "/images/avatars/lxy.jpg" },
    { id: 8, name: "PY0UN9", avatar: "/images/avatars/py.jpg" },
    { id: 9, name: "林墨大大", avatar: "/images/avatars/ylc.jpg" },
    { id: 10, name: "安景", avatar: "/images/avatars/jwz.jpg" },
  ];

  // 快速链接
  const quickLinks: QuickLink[] = [
    {
      name: "首页",
      path: "/",
      icon: <Home theme="outline" size="16" />
    },
    {
      name: "热门",
      path: "/popular", 
      icon: <Fire theme="outline" size="16" />
    },
    {
      name: "地图",
      path: "/introduce",
      icon: <MapDraw theme="outline" size="16" />
    },
    {
      name: "关注",
      path: "/like",
      icon: <Concern theme="outline" size="16" />
    }
  ];

  // 分类链接
  const categoryLinks: QuickLink[] = [
    {
      name: "技术",
      path: "/category/tech",
      icon: <Code theme="outline" size="16" />
    },
    {
      name: "科技",
      path: "/category/science",
      icon: <Chip theme="outline" size="16" />
    },
    {
      name: "娱乐",
      path: "/category/entertainment",
      icon: <VideoOne theme="outline" size="16" />
    },
    {
      name: "音乐",
      path: "/category/music",
      icon: <Music theme="outline" size="16" />
    }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-white via-neutral-50 to-neutral-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 text-neutral-600 dark:text-neutral-300">
      {/* 装饰性背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
      
      {/* 顶部装饰线 */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      
      <div className="relative container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* 关于我们 - 增强版 */}
          <div className="lg:col-span-1 space-y-6">
            {/* Logo和品牌 */}
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <img 
                    src="/images/logo.png" 
                    alt="OpenShare Logo" 
                    className="h-full w-full object-contain brightness-0 invert scale-150" 
                    />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-primary-hover/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              </div>
              <div className="ml-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-white dark:to-neutral-200 bg-clip-text text-transparent">
                  OpenShare
                </span>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  现代化社区平台
                </div>
              </div>
            </div>
            
            {/* 描述 */}
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              基于 Next.js、Element Plus 和 Tailwind CSS 构建的现代化论坛平台，为用户提供优质的交流体验和创新的社区功能。
            </p>
            
            {/* 团队成员头像 - 改进版 */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200 flex items-center">
                <svg className="w-4 h-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                开发团队
              </h4>
              <div className="relative h-12">
                {teamMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className="absolute rounded-full border-3 border-white dark:border-zinc-800 group cursor-pointer transition-all duration-500 ease-out hover:!z-50 hover:scale-125 hover:-translate-y-2"
                    style={{
                      width: "40px",
                      height: "40px",
                      left: `${index * 26}px`,
                      zIndex: teamMembers.length - index,
                    }}
                  >
                    <div className="w-full h-full overflow-hidden rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-zinc-600 dark:to-zinc-700">
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        width={40}
                        height={40}
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        unoptimized
                      />
                    </div>
                    {/* 悬停显示的昵称 - 改进版 */}
                    <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 bottom-full pb-3 left-1/2 -translate-x-1/2 transform group-hover:-translate-y-1">
                      <div className="bg-neutral-900 dark:bg-zinc-600 shadow-xl rounded-lg px-3 py-2 whitespace-nowrap text-xs text-white relative">
                        {member.name}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-neutral-900 dark:border-t-zinc-600"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 快速导航 - 增强版 */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-neutral-800 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              快速导航
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.path} 
                    className="group flex items-center space-x-3 text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-all duration-300 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-700/50"
                  >
                    <span className="group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 text-primary">
                      {link.icon}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 热门分类 - 增强版 */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-neutral-800 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              热门分类
            </h3>
            <ul className="space-y-3">
              {categoryLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.path} 
                    className="group flex items-center space-x-3 text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-all duration-300 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-700/50"
                  >
                    <span className="group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 text-primary">
                      {link.icon}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 联系我们 - 增强版 */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-neutral-800 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              联系我们
            </h3>
            <div className="space-y-4">
              <div className="group flex items-center space-x-3 text-neutral-600 dark:text-neutral-400 hover:text-primary transition-all duration-300 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-700/50">
                <Mail theme="outline" size="18" className="text-primary group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">chengyue.jin@outlook.com</span>
              </div>
              <div className="group flex items-center space-x-3 text-neutral-600 dark:text-neutral-400 hover:text-primary transition-all duration-300 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-700/50">
                <Phone theme="outline" size="18" className="text-primary group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">+1 234 567 890</span>
              </div>
            </div>

            {/* 社交媒体链接 - 增强版 */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">关注我们</h4>
              <div className="flex space-x-3">
                {[
                  { 
                    name: "Twitter", 
                    path: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z",
                    color: "hover:bg-blue-500"
                  },
                  { 
                    name: "Facebook", 
                    path: "M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z",
                    color: "hover:bg-blue-600"
                  },
                  { 
                    name: "GitHub", 
                    path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z",
                    color: "hover:bg-gray-700"
                  }
                ].map((social, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className={`group relative w-10 h-10 bg-neutral-100 dark:bg-zinc-700 rounded-xl flex items-center justify-center text-neutral-600 dark:text-neutral-400 ${social.color} hover:text-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-md hover:shadow-lg`}
                  >
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.path}/>
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-hover/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 底部版权信息 - 增强版 */}
        <div className="border-t border-gradient-to-r from-transparent via-neutral-200 dark:via-zinc-600 to-transparent mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                &copy; {currentYear} OpenShare. 保留所有权利。
              </p>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              {[
                { name: "隐私政策", path: "/privacy" },
                { name: "服务条款", path: "/terms" },
                { name: "帮助中心", path: "/help" }
              ].map((link, index) => (
                <Link 
                  key={index}
                  href={link.path} 
                  className="text-neutral-500 dark:text-neutral-400 hover:text-primary transition-all duration-300 relative group"
                >
                  {link.name}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
