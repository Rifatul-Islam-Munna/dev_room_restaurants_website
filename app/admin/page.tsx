"use client";

import { useState } from "react";
import {
  TrendingUp,
  Clock,
  BadgeDollarSign,
  BookOpen,
  Eye,
  ArrowUpRight,
} from "lucide-react";

/* ── Types ── */
type OrderStatus = "Preparing" | "Serving" | "Completed";

type Order = {
  id: string;
  customer: string;
  location: string;
  time: string;
  items: string;
  total: string;
  status: OrderStatus;
};

/* ── Static data ── */
const INITIAL_ORDERS: Order[] = [
  {
    id: "#SR-4921",
    customer: "Elena Richardson",
    location: "Table 12",
    time: "7:15 PM",
    items: "Duck Confit ×2, Pinot Noir...",
    total: "৳12,250",
    status: "Serving",
  },
  {
    id: "#SR-4922",
    customer: "Marcus Vane",
    location: "Table 04",
    time: "7:30 PM",
    items: "Oysters ×12, Champagne...",
    total: "৳18,100",
    status: "Preparing",
  },
  {
    id: "#SR-4923",
    customer: "Sarah Jenkins",
    location: "Takeout",
    time: "7:45 PM",
    items: "Wild Mushroom Risotto ×1",
    total: "৳2,900",
    status: "Completed",
  },
  {
    id: "#SR-4924",
    customer: "David Osei",
    location: "Table 07",
    time: "8:00 PM",
    items: "Truffle Tagliatelle ×2, Espresso...",
    total: "৳9,400",
    status: "Preparing",
  },
  {
    id: "#SR-4925",
    customer: "Priya Nair",
    location: "Table 01",
    time: "8:15 PM",
    items: "Poke Bowl ×1, Green Tea...",
    total: "৳3,600",
    status: "Serving",
  },
];

/* ── KPI data ── */
const KPI_CARDS = [
  {
    label: "Total Orders",
    value: "1,284",
    sub: "+12% this week",
    icon: BookOpen,
    trend: "up",
  },
  {
    label: "Pending Orders",
    value: "14",
    sub: "Action needed",
    icon: Clock,
    trend: "warn",
  },
  {
    label: "Revenue Today",
    value: "৳48,200",
    sub: "vs ৳39,000 avg",
    icon: BadgeDollarSign,
    trend: "up",
  },
  {
    label: "Menu Items",
    value: "48",
    sub: "6 Seasonal",
    icon: TrendingUp,
    trend: "neutral",
  },
];

/* ── Status badge config ── */
const STATUS_CONFIG: Record<
  OrderStatus,
  { bg: string; text: string; dot: string }
> = {
  Preparing: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-400",
  },
  Serving: {
    bg: "bg-teal-50 dark:bg-teal-900/20",
    text: "text-[#01696f] dark:text-teal-400",
    dot: "bg-[#01696f]",
  },
  Completed: {
    bg: "bg-stone-100 dark:bg-stone-800",
    text: "text-stone-500 dark:text-stone-400",
    dot: "bg-stone-400",
  },
};

const ALL_STATUSES: OrderStatus[] = ["Preparing", "Serving", "Completed"];

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* ── KPI Cards ── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((card) => (
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
                        ? "text-amber-600"
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
                      ? "text-amber-600 font-medium"
                      : ""
                }
              >
                {card.sub}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* ── Orders Table ── */}
      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-serif text-xl text-stone-800 dark:text-stone-100">
              Recent Service Activity
            </h3>
            <p className="text-xs text-stone-400 mt-0.5 italic">
              Real-time floor management and logistics.
            </p>
          </div>
          <button
            className="text-[11px] font-bold uppercase tracking-widest
                       text-[#01696f] dark:text-teal-400 hover:underline"
          >
            View All Orders
          </button>
        </div>

        {/* Table wrapper — horizontal scroll on mobile */}
        <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800">
                  {["Order ID", "Customer", "Items", "Total", "Status", ""].map(
                    (th) => (
                      <th
                        key={th}
                        className="px-5 py-3 text-[10px] uppercase tracking-widest
                                   font-bold text-stone-400 whitespace-nowrap"
                      >
                        {th}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 bg-white dark:bg-stone-900">
                {orders.map((order) => {
                  const s = STATUS_CONFIG[order.status];
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                    >
                      {/* Order ID */}
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-[#01696f] dark:text-teal-400 font-semibold">
                          {order.id}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                          {order.customer}
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          {order.location} · {order.time}
                        </p>
                      </td>

                      {/* Items */}
                      <td className="px-5 py-4 max-w-[180px]">
                        <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                          {order.items}
                        </p>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4">
                        <span className="font-serif text-sm font-semibold text-stone-700 dark:text-stone-200 tabular-nums">
                          {order.total}
                        </span>
                      </td>

                      {/* Status — interactive select */}
                      <td className="px-5 py-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${s.bg}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`}
                          />
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateStatus(
                                order.id,
                                e.target.value as OrderStatus,
                              )
                            }
                            className={`bg-transparent border-none text-[11px] font-bold
                                        uppercase tracking-wider focus:outline-none
                                        cursor-pointer ${s.text}`}
                          >
                            {ALL_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <button
                          className="p-1.5 rounded-lg text-stone-300 dark:text-stone-600
                                     hover:text-[#01696f] dark:hover:text-teal-400
                                     hover:bg-stone-100 dark:hover:bg-stone-800
                                     transition-colors"
                          aria-label="View order"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
