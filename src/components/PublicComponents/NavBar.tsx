import { useState } from "react";
import {
  LogIn,
  UserPlus,
  MessageCircle,
  MonitorCloud,
  ShieldAlert,
  Youtube,
  Menu,
  X,
  ArrowLeftRight,
  UserRound,
} from "lucide-react";
import { Link, useLocation } from "react-router";

import { useUserStore } from "@/context/UserStore";
import { clearAuthCookies } from "@/lib/authCookies";

const navLinks = [
  {
    title: "الخدمات",
    href: "/services",
    icon: <MonitorCloud className="w-4 h-4" />,
  },
  {
    title: "الشروط والأحكام",
    href: "/terms",
    icon: <ShieldAlert className="w-4 h-4" />,
  },
  {
    title: "أسعار الصرف",
    href: "/exchange-rates",
    icon: <ArrowLeftRight className="w-4 h-4" />,
  },
  {
    title: "شروحات",
    href: "/tutorials",
    icon: <Youtube className="w-4 h-4" />,
  },
  {
    title: "تواصل معنا",
    href: "/contact",
    icon: <MessageCircle className="w-4 h-4" />,
  },
];

function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = () => {
    clearAuthCookies();
    clearUser();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0e0e0e]/95 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-6 px-4">
        <Link
          to="/"
          className="shrink-0 text-xl font-bold tracking-wide text-accent"
        >
          حساباتي
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-1 md:flex!">
          {navLinks.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-all duration-200 ${
                location.pathname === item.href
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-2 md:flex!">
          {user?.fullName ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-all duration-200 ${
                  location.pathname === "/profile"
                    ? "bg-accent/10 text-accent"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <UserRound className="h-4 w-4" />
                <span className="hidden lg:inline!">الملف الشخصي</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden lg:inline!">تسجيل الخروج</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden lg:inline!">تسجيل الدخول</span>
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-1.5 text-sm font-bold text-black transition-all duration-200 hover:bg-accent/90"
                style={{ boxShadow: "0 0 16px rgba(212,175,55,0.3)" }}
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden lg:inline!">إنشاء حساب</span>
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-400 hover:text-white focus:outline-none md:hidden"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="absolute w-full space-y-1 border-t border-white/5 bg-[#0e0e0e] p-2 shadow-2xl md:hidden">
          <div className="flex flex-col space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  location.pathname === item.href
                    ? "bg-accent/10 text-accent"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{item.title}</span>
              </Link>
            ))}
          </div>

          <div className="my-2 h-px bg-white/5"></div>

          <div className="flex flex-col space-y-3">
            {user?.fullName ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex! items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    location.pathname === "/profile"
                      ? "bg-accent/10 text-accent"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>الملف الشخصي</span>
                  <UserRound className="h-4 w-4" />
                </Link>

                <div className="rounded-xl bg-white/10 py-3 text-center text-white">
                  {user.fullName}
                </div>

                <button
                  onClick={handleLogout}
                  className="flex! w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white"
                >
                  <span>تسجيل الخروج</span>
                  <LogIn className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex! items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white"
                >
                  <span>تسجيل الدخول</span>
                  <LogIn className="h-4 w-4" />
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex! items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-black transition-all duration-200 hover:bg-accent/90"
                  style={{ boxShadow: "0 4px 14px rgba(212,175,55,0.25)" }}
                >
                  <UserPlus className="h-5 w-5" />
                  <span>إنشاء حساب</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default NavBar;
