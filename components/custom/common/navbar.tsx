"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, LogIn, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isHaveAccessToken } from "@/actions/auth";
import { useUser } from "@/lib/useUser";
import { useCartStore } from "@/store/use-cart-store";
import { Badge } from "@/components/ui/badge";
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Cart", href: "/cart" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathName = usePathname();
  const { user } = useUser();

  useEffect(() => {
    isHaveAccessToken().then(setIsLoggedIn);
  }, [pathName]);
  const { totalItems } = useCartStore((state) => state);

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-xl shadow-sm dark:shadow-none transition-all",
        { hidden: pathName.startsWith("/admin") },
      )}
    >
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-2xl font-serif italic text-teal-900 dark:text-teal-500 tracking-tight"
        >
          Savoria
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-stone-600 dark:text-stone-400 hover:text-[#01696f] dark:hover:text-teal-300 transition-colors text-sm font-medium"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative p-2 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors"
          >
            <ShoppingCart
              size={20}
              className="text-teal-900 dark:text-teal-500"
            />
            {totalItems() > 0 && (
              <Badge
                className="absolute -top-1 -right-1
                 min-w-[18px] h-[18px] px-1
                 flex items-center justify-center
                 rounded-full text-[10px] font-bold leading-none
                 bg-[#01696f] hover:bg-[#01696f] text-white
                 pointer-events-none select-none"
              >
                {totalItems() > 99 ? "99+" : totalItems()}
              </Badge>
            )}
          </Link>

          {isLoggedIn ? (
            <Link
              href={user?.type === "admin" ? "/admin" : "/profile"}
              aria-label="Go to admin panel"
              className="hidden md:flex items-center justify-center
                         w-9 h-9 rounded-full
                         bg-[#01696f] hover:bg-[#014d52] active:scale-95
                         transition-all"
            >
              <UserCircle size={20} className="text-white" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden md:flex items-center gap-1.5
                         px-4 py-2 rounded-full
                         bg-[#01696f] hover:bg-[#014d52] active:scale-95
                         text-white text-xs font-semibold uppercase tracking-wider
                         transition-all"
            >
              <LogIn size={13} />
              Login
            </Link>
          )}

          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors"
          >
            {mobileOpen ? (
              <X size={20} className="text-teal-900 dark:text-teal-500" />
            ) : (
              <Menu size={20} className="text-teal-900 dark:text-teal-500" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-stone-50/95 dark:bg-stone-900/95 backdrop-blur-xl px-8 pb-6 flex flex-col border-t border-stone-200/20">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="text-stone-600 dark:text-stone-400 hover:text-[#01696f] text-sm font-medium py-3 border-b border-stone-200/20 last:border-0 transition-colors"
            >
              {label}
            </Link>
          ))}

          {isLoggedIn ? (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="mt-4 flex items-center justify-center gap-2
                         py-3 rounded-full
                         bg-[#01696f] hover:bg-[#014d52] active:scale-95
                         text-white text-xs font-semibold uppercase tracking-wider
                         transition-all"
            >
              <UserCircle size={16} />
              Admin Panel
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-4 flex items-center justify-center gap-2
                         py-3 rounded-full
                         bg-[#01696f] hover:bg-[#014d52] active:scale-95
                         text-white text-xs font-semibold uppercase tracking-wider
                         transition-all"
            >
              <LogIn size={13} />
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
