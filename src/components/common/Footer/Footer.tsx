import Link from "next/link";
import Image from "next/image";

interface TeamMember {
  id: number;
  name: string;
  avatar: string;
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // 队员数据 - 使用在线占位图片
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

  return (
    <footer className="bg-white dark:bg-dark-primary text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-zinc-800 py-8 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg text-neutral-800 dark:text-white mb-4">
              关于我们
            </h3>
            <p className="mb-4">
              这是一个使用Next.js、Element Plus和Tailwind CSS构建的论坛网站。
            </p>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                className="h-8 w-8 text-primary"
              >
                <g>
                  <circle fill="currentColor" cx="10" cy="10" r="10" />
                  <path
                    fill="white"
                    d="M16.67,10A1.46,1.46,0,0,0,14.2,9a7.12,7.12,0,0,0-3.85-1.23L11,4.65,13.14,5.1a1,1,0,1,0,.13-0.61L10.82,4a0.31,0.31,0,0,0-.37.24L9.71,7.71a7.14,7.14,0,0,0-3.9,1.23A1.46,1.46,0,1,0,4.2,11.33a2.87,2.87,0,0,0,0,.44c0,2.24,2.61,4.06,5.83,4.06s5.83-1.82,5.83-4.06a2.87,2.87,0,0,0,0-.44A1.46,1.46,0,0,0,16.67,10Zm-10,1a1,1,0,1,1,1,1A1,1,0,0,1,6.67,11Zm5.81,2.75a3.84,3.84,0,0,1-2.47.77,3.84,3.84,0,0,1-2.47-.77,0.27,0.27,0,0,1,.38-0.38A3.27,3.27,0,0,0,10,14a3.28,3.28,0,0,0,2.09-.61A0.27,0.27,0,1,1,12.48,13.79Zm-0.18-1.71a1,1,0,1,1,1-1A1,1,0,0,1,12.29,12.08Z"
                  />
                </g>
              </svg>
              <span className="ml-2 text-xl font-bold">论坛</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-neutral-800 dark:text-white mb-4">
              快速链接
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-primary">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/popular" className="hover:text-primary">
                  热门
                </Link>
              </li>
              <li>
                <Link href="/category/tech" className="hover:text-primary">
                  技术
                </Link>
              </li>
              <li>
                <Link
                  href="/category/entertainment"
                  className="hover:text-primary"
                >
                  娱乐
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-neutral-800 dark:text-white mb-4">
              联系我们
            </h3>
            <div className="space-y-2">
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>chengyue.jin@outlook.com</span>
              </p>
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>+1 234 567 890</span>
              </p>
            </div>

            {/* 团队成员头像 */}
            <div className="relative h-12 mb-4">
              {teamMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="absolute rounded-full border-2 border-white dark:border-zinc-800 group cursor-pointer transition-all duration-300 ease-out hover:!z-50 hover:scale-110"
                  style={{
                    width: "40px",
                    height: "40px",
                    left: `${index * 25}px`,
                    zIndex: teamMembers.length - index,
                  }}
                >
                  <div className="w-full h-full overflow-hidden rounded-full bg-neutral-200">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={40}
                      height={40}
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  {/* 悬停显示的昵称 */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full pb-2 left-1/2 -translate-x-1/2 transform">
                    <div className="bg-white dark:bg-zinc-800 shadow-md rounded-md px-2 py-1 whitespace-nowrap text-xs text-neutral-900 dark:text-white">
                      {member.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* <Link href="/contact" className="text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-400 font-medium">
              发送消息 →
            </Link> */}
          </div>
        </div>

        <div className="border-t border-neutral-200 dark:border-zinc-800 mt-8 pt-6 text-center">
          <p>&copy; {currentYear} 论坛. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
