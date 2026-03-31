"use client";
import {
  Bell,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  PlusCircle,
} from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/common/app-sidebar";

/* ── Define all nav items here — passed down to the reusable sidebar ── */
const NAV_ITEMS = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: "/admin",
    active: true,
  },
  {
    label: "Orders",
    icon: ShoppingBag,
    href: "/admin/orders",
    badge: 14, // pending count badge — update dynamically as needed
  },
  {
    label: "Menu Items",
    icon: UtensilsCrossed,
    href: "/admin/menu",
  },
  {
    label: "Add New Item",
    icon: PlusCircle,
    href: "/admin/menu/new",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {/* Sidebar receives all nav config from this layout */}
      <AppSidebar navItems={NAV_ITEMS} />

      <SidebarInset>
        {/* ── Top bar ── */}
        <header
          className="sticky top-0 z-40
                     bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl
                     border-b border-stone-100 dark:border-stone-800
                     px-5 py-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <SidebarTrigger
              className="text-stone-400 hover:text-stone-700
                         dark:hover:text-stone-200 transition-colors"
            />
            <div className="w-px h-5 bg-stone-200 dark:bg-stone-700" />
            <h2 className="font-serif italic text-base text-[#01696f] dark:text-teal-400">
              Admin Panel — Savoria
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button
              className="relative p-2 rounded-lg text-stone-400
                         hover:text-stone-700 dark:hover:text-stone-200
                         hover:bg-stone-100 dark:hover:bg-stone-800
                         transition-colors"
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-400 rounded-full" />
            </button>

            {/* User info */}
            <div
              className="flex items-center gap-3 pl-3
                         border-l border-stone-100 dark:border-stone-800"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-stone-700 dark:text-stone-200">
                  Admin Savoria
                </p>
                <p className="text-[10px] text-stone-400">admin@savoria.com</p>
              </div>
              <button
                className="p-2 rounded-lg text-stone-300 dark:text-stone-600
                           hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
                           transition-colors"
                aria-label="Log out"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-5 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
