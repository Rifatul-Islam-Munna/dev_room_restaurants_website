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
import { useUser } from "@/lib/useUser";
import { logoutUser } from "@/actions/auth";
import { useRouter } from "next/navigation";

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
  },
  {
    label: "Menu Items",
    icon: UtensilsCrossed,
    href: "/admin/menu",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const router = useRouter();

  const handelUserLogout = async () => {
    await logoutUser();
    router.push("/");
  };
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

            {/* User info */}
            <div
              className="flex items-center gap-3 pl-3
                         border-l border-stone-100 dark:border-stone-800"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-stone-700 dark:text-stone-200">
                  {user?.fullName ?? "admin"}
                </p>
                <p className="text-[10px] text-stone-400">{user?.email}</p>
              </div>
              <button
                onClick={handelUserLogout}
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
