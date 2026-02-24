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
} from "lucide-react";
import { Link, useLocation } from "react-router";

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

  return (
    <header className="sticky top-0 z-50 bg-[#0e0e0e]/95 backdrop-blur-md border-b border-white/5">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-accent tracking-wide shrink-0"
        >
          حساباتي
        </Link>

        {/* Desktop Nav links — center */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all duration-200 ${
                location.pathname === item.href
                  ? "text-white bg-white/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link
            to="/login"
            className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all duration-200"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden lg:inline">تسجيل الدخول</span>
          </Link>

          <Link
            to="/register"
            className="flex items-center gap-1.5 text-sm font-bold text-black bg-accent hover:bg-accent/90 px-4 py-1.5 rounded-lg transition-all duration-200"
            style={{ boxShadow: "0 0 16px rgba(212,175,55,0.3)" }}
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden lg:inline">إنشاء حساب</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0e0e0e] p-2 space-y-1 absolute w-full shadow-2xl">
          <div className="flex flex-col space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between text-sm font-medium px-4 py-3 rounded-xl transition-all ${
                  location.pathname === item.href
                    ? "text-accent bg-accent/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{item.title}</span>
                {/* <span className="text-gray-500 opacity-70">{item.icon}</span> */}
              </Link>
            ))}
          </div>

          <div className="h-px bg-white/5 my-2"></div>

          <div className="flex flex-col space-y-3">
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between text-sm font-medium text-gray-300 hover:text-white px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-200"
            >
              <span>تسجيل الدخول</span>
              <span className="text-gray-500 opacity-70">
                <LogIn className="w-4 h-4" />
              </span>
            </Link>

            <Link
              to="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-sm font-bold text-black bg-accent hover:bg-accent/90 px-4 py-3 rounded-xl transition-all duration-200"
              style={{ boxShadow: "0 4px 14px rgba(212,175,55,0.25)" }}
            >
              <UserPlus className="w-5 h-5" />
              <span>إنشاء حساب</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default NavBar;
