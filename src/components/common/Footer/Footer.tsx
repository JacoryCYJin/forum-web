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
    <footer className="bg-white dark:bg-dark-primary text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 关于我们 */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-neutral-800 dark:text-white">论坛</span>
            </div>
            <p className="mb-4 text-sm leading-relaxed">
              基于 Next.js、Element Plus 和 Tailwind CSS 构建的现代化论坛平台，为用户提供优质的交流体验。
            </p>
            
            {/* 团队成员头像 */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">开发团队</h4>
              <div className="relative h-10">
                {teamMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className="absolute rounded-full border-2 border-white dark:border-zinc-800 group cursor-pointer transition-all duration-300 ease-out hover:!z-50 hover:scale-110"
                    style={{
                      width: "32px",
                      height: "32px",
                      left: `${index * 20}px`,
                      zIndex: teamMembers.length - index,
                    }}
                  >
                    <div className="w-full h-full overflow-hidden rounded-full bg-neutral-200">
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        width={32}
                        height={32}
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    {/* 悬停显示的昵称 */}
                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full pb-2 left-1/2 -translate-x-1/2 transform">
                      <div className="bg-neutral-800 dark:bg-zinc-700 shadow-lg rounded-md px-2 py-1 whitespace-nowrap text-xs text-white">
                        {member.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 快速导航 */}
          <div>
            <h3 className="font-semibold text-lg text-neutral-800 dark:text-white mb-4">
              快速导航
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.path} 
                    className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors group"
                  >
                    <span className="group-hover:scale-110 transition-transform">
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 热门分类 */}
          <div>
            <h3 className="font-semibold text-lg text-neutral-800 dark:text-white mb-4">
              热门分类
            </h3>
            <ul className="space-y-3">
              {categoryLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.path} 
                    className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors group"
                  >
                    <span className="group-hover:scale-110 transition-transform">
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 联系我们 */}
          <div>
            <h3 className="font-semibold text-lg text-neutral-800 dark:text-white mb-4">
              联系我们
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
                <Mail theme="outline" size="16" />
                <span className="text-sm">chengyue.jin@outlook.com</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
                <Phone theme="outline" size="16" />
                <span className="text-sm">+1 234 567 890</span>
              </div>
            </div>

            {/* 社交媒体链接 */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">关注我们</h4>
              <div className="flex space-x-3">
                <a 
                  href="#" 
                  className="w-8 h-8 bg-neutral-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-primary hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 bg-neutral-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-primary hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 bg-neutral-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-primary hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="border-t border-neutral-200 dark:border-zinc-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              &copy; {currentYear} 论坛. 保留所有权利。
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-neutral-500 dark:text-neutral-400 hover:text-primary transition-colors">
                隐私政策
              </Link>
              <Link href="/terms" className="text-neutral-500 dark:text-neutral-400 hover:text-primary transition-colors">
                服务条款
              </Link>
              <Link href="/help" className="text-neutral-500 dark:text-neutral-400 hover:text-primary transition-colors">
                帮助中心
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
