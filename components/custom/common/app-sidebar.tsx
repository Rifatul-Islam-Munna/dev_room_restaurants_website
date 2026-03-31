"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { CalendarDays } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type NavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: string | number;
};

type AppSidebarProps = {
  navItems: NavItem[];
};

export function AppSidebar({ navItems }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    // "offcanvas" = sidebar fully slides off-screen when trigger is clicked
    <Sidebar collapsible="offcanvas">
      {/* ── Brand ── */}
      <SidebarHeader className="h-16 border-b border-sidebar-border px-5 flex flex-row items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#01696f] flex items-center justify-center shrink-0">
          <span className="text-white font-serif font-bold text-sm leading-none">
            S
          </span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-serif italic text-sm text-[#01696f] dark:text-teal-400 leading-tight">
            Savoria Editorial
          </span>
          <span className="text-[9px] tracking-widest uppercase text-stone-400 leading-tight">
            Modern Maître D&apos;
          </span>
        </div>
      </SidebarHeader>

      {/* ── Nav items ── */}
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-widest uppercase text-stone-400 mb-1 px-4">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={
                        isActive
                          ? "bg-[#01696f]/10 text-[#01696f] dark:text-teal-400 font-medium hover:bg-[#01696f]/15"
                          : "text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800"
                      }
                    >
                      <Link href={item.href}>
                        <item.icon size={16} />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>

                    {item.badge !== undefined && (
                      <SidebarMenuBadge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold tabular-nums">
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer CTA ── */}
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <button
          className="w-full flex items-center justify-center gap-2
                     py-3 px-4 rounded-full
                     border border-[#01696f]/30 text-[#01696f] dark:text-teal-400
                     text-xs font-semibold uppercase tracking-wider
                     hover:bg-[#01696f]/5 dark:hover:bg-teal-900/20
                     transition-colors"
        >
          <CalendarDays size={13} />
          Reserve a Table
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
