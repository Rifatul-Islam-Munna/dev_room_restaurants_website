import Link from "next/link";
import {
  LayoutDashboard,
  ClockIcon,
  Settings,
  ChevronRight,
} from "lucide-react";

const NAV = [
  { label: "Overview", href: "/profile", icon: LayoutDashboard },
  { label: "Order History", href: "/profile/history", icon: ClockIcon },
  { label: "Settings", href: "/profile/settings", icon: Settings },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-stone-950 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* ── Mobile top tab bar ── */}
        <nav
          className="flex lg:hidden gap-1 bg-white dark:bg-stone-900
                        border border-stone-200 dark:border-stone-800
                        rounded-2xl p-1.5 mb-6"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex items-center justify-center gap-1.5
                         py-2.5 rounded-xl text-xs font-semibold
                         text-stone-400 hover:text-stone-700 dark:hover:text-stone-200
                         hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <item.icon size={13} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">
          {/* ── Desktop sidebar ── */}
          <aside className="hidden lg:block sticky top-24 space-y-1">
            {/* Mini user card */}

            {/* Nav links */}
            <div
              className="bg-white dark:bg-stone-900
                            border border-stone-200 dark:border-stone-800
                            rounded-2xl overflow-hidden"
            >
              {NAV.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-5 py-3.5
                              text-sm font-medium transition-colors group
                              hover:bg-stone-50 dark:hover:bg-stone-800
                              ${idx < NAV.length - 1 ? "border-b border-stone-100 dark:border-stone-800" : ""}
                              text-stone-600 dark:text-stone-400
                              hover:text-stone-900 dark:hover:text-stone-100`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={15} className="text-stone-400" />
                    {item.label}
                  </div>
                  <ChevronRight
                    size={13}
                    className="text-stone-300 group-hover:text-stone-500
                               group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>
              ))}
            </div>
          </aside>

          {/* ── Page content ── */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
