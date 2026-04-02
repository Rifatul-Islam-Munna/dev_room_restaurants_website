"use client";

import {
  TrendingUp,
  Clock,
  BadgeDollarSign,
  BookOpen,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { useQueryWrapper } from "@/api-hooks/react-query-wrapper";

type DashboardStats = {
  totalOrders: number;
  pendingOrders: number;
  revenueToday: number;
  menuItems: number;
};

type DashboardStatsResponse = {
  success: boolean;
  data: DashboardStats;
};

type TrendType = "up" | "warn" | "neutral";

type KpiCard = {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  trend: TrendType;
};

const formatCurrency = (amount: number) => {
  return `৳${amount.toLocaleString()}`;
};

function DashboardCardSkeleton() {
  return (
    <div
      className="bg-white dark:bg-stone-900
                 border border-stone-200 dark:border-stone-800
                 rounded-xl p-5 flex flex-col gap-3 animate-pulse"
    >
      <div className="flex items-start justify-between">
        <div className="h-3 w-24 rounded bg-stone-200 dark:bg-stone-800" />
        <div className="h-8 w-8 rounded-lg bg-stone-200 dark:bg-stone-800" />
      </div>

      <div className="h-8 w-28 rounded bg-stone-200 dark:bg-stone-800" />
      <div className="h-3 w-20 rounded bg-stone-200 dark:bg-stone-800" />
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading, isPending } =
    useQueryWrapper<DashboardStatsResponse>(
      ["get-dashboard-info"],
      `/dashboard/stats`,
    );

  const stats = data?.data;

  const KPI_CARDS: KpiCard[] = [
    {
      label: "Total Orders",
      value: stats ? stats.totalOrders.toLocaleString() : "0",
      sub: "All non-cancelled orders",
      icon: BookOpen,
      trend: "up",
    },
    {
      label: "Pending Orders",
      value: stats ? stats.pendingOrders.toLocaleString() : "0",
      sub: "Action needed",
      icon: Clock,
      trend: stats && stats.pendingOrders > 0 ? "warn" : "neutral",
    },
    {
      label: "Revenue Today",
      value: stats ? formatCurrency(stats.revenueToday) : "৳0",
      sub: "Today's revenue excluding cancelled orders",
      icon: BadgeDollarSign,
      trend: "up",
    },
    {
      label: "Menu Items",
      value: stats ? stats.menuItems.toLocaleString() : "0",
      sub: "Currently available items",
      icon: TrendingUp,
      trend: "neutral",
    },
  ];

  const loading = isLoading || isPending;

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* ── KPI Cards ── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <DashboardCardSkeleton key={i} />
            ))
          : KPI_CARDS.map((card) => (
              <div
                key={card.label}
                className="bg-white dark:bg-stone-900
                           border border-stone-200 dark:border-stone-800
                           rounded-xl p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-stone-400">
                    {card.label}
                  </span>

                  <div
                    className={`p-1.5 rounded-lg ${
                      card.trend === "up"
                        ? "bg-[#01696f]/10"
                        : card.trend === "warn"
                          ? "bg-amber-50 dark:bg-amber-900/20"
                          : "bg-stone-100 dark:bg-stone-800"
                    }`}
                  >
                    <card.icon
                      size={14}
                      className={
                        card.trend === "up"
                          ? "text-[#01696f] dark:text-teal-400"
                          : card.trend === "warn"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-stone-400"
                      }
                    />
                  </div>
                </div>

                <span className="font-serif text-2xl md:text-3xl text-stone-800 dark:text-stone-100 tabular-nums">
                  {card.value}
                </span>

                <div className="flex items-center gap-1 text-xs text-stone-400">
                  {card.trend === "up" && (
                    <ArrowUpRight
                      size={12}
                      className="text-[#01696f] dark:text-teal-400"
                    />
                  )}

                  <span
                    className={
                      card.trend === "up"
                        ? "text-[#01696f] dark:text-teal-400 font-medium"
                        : card.trend === "warn"
                          ? "text-amber-600 dark:text-amber-400 font-medium"
                          : ""
                    }
                  >
                    {card.sub}
                  </span>
                </div>
              </div>
            ))}
      </section>
    </div>
  );
}
