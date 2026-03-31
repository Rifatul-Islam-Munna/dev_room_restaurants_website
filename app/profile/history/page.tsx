"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Search, ReceiptText } from "lucide-react";

type HistoryOrder = {
  id: string;
  date: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: "Completed" | "Cancelled";
  address: string;
  paymentMethod: string;
};

const HISTORY: HistoryOrder[] = [
  {
    id: "#SR-4930",
    date: "Mar 30, 2026",
    items: [
      { name: "Wild Atlantic Poke Bowl", qty: 1, price: 1250 },
      { name: "Green Tea", qty: 2, price: 600 },
    ],
    total: 1850,
    status: "Completed",
    address: "24/B Crescent Estate, Gulshan 2",
    paymentMethod: "Cash on Delivery",
  },
  {
    id: "#SR-4918",
    date: "Mar 28, 2026",
    items: [
      { name: "Truffle Tagliatelle", qty: 2, price: 4200 },
      { name: "Espresso", qty: 1, price: 350 },
    ],
    total: 4550,
    status: "Completed",
    address: "24/B Crescent Estate, Gulshan 2",
    paymentMethod: "Cash on Delivery",
  },
  {
    id: "#SR-4905",
    date: "Mar 25, 2026",
    items: [{ name: "Obsidian Soufflé", qty: 1, price: 1600 }],
    total: 1600,
    status: "Cancelled",
    address: "24/B Crescent Estate, Gulshan 2",
    paymentMethod: "Cash on Delivery",
  },
  {
    id: "#SR-4892",
    date: "Mar 22, 2026",
    items: [
      { name: "Wild Mushroom Risotto", qty: 1, price: 2900 },
      { name: "Pinot Noir", qty: 1, price: 2650 },
    ],
    total: 5550,
    status: "Completed",
    address: "24/B Crescent Estate, Gulshan 2",
    paymentMethod: "Cash on Delivery",
  },
  {
    id: "#SR-4871",
    date: "Mar 18, 2026",
    items: [
      { name: "Wood-Fired Margherita", qty: 1, price: 1800 },
      { name: "Latte", qty: 2, price: 700 },
    ],
    total: 2500,
    status: "Completed",
    address: "24/B Crescent Estate, Gulshan 2",
    paymentMethod: "Cash on Delivery",
  },
  {
    id: "#SR-4850",
    date: "Mar 14, 2026",
    items: [
      { name: "Burrata & Heritage Tomato", qty: 1, price: 980 },
      { name: "Espresso", qty: 2, price: 700 },
    ],
    total: 1680,
    status: "Completed",
    address: "24/B Crescent Estate, Gulshan 2",
    paymentMethod: "Cash on Delivery",
  },
];

const STATUS_CONFIG = {
  Completed: {
    bg: "bg-teal-50 dark:bg-teal-900/20",
    text: "text-[#01696f] dark:text-teal-400",
    dot: "bg-[#01696f]",
  },
  Cancelled: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-500 dark:text-red-400",
    dot: "bg-red-400",
  },
};

export default function OrderHistoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Completed" | "Cancelled">(
    "All",
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return HISTORY.filter((o) => {
      const matchFilter = filter === "All" || o.status === filter;
      const matchSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.items.some((i) =>
          i.name.toLowerCase().includes(search.toLowerCase()),
        );
      return matchFilter && matchSearch;
    });
  }, [search, filter]);

  const totalSpent = HISTORY.filter((o) => o.status === "Completed").reduce(
    (sum, o) => sum + o.total,
    0,
  );

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="font-serif italic text-3xl text-stone-800 dark:text-stone-100">
          Order History
        </h1>
        <p className="text-xs text-stone-400 mt-0.5 italic">
          Your complete culinary journey with Savoria.
        </p>
      </div>

      {/* ── Summary strip ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Orders", value: HISTORY.length },
          {
            label: "Completed",
            value: HISTORY.filter((o) => o.status === "Completed").length,
          },
          { label: "Total Spent", value: `৳${totalSpent.toLocaleString()}` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-stone-900
                       border border-stone-200 dark:border-stone-800
                       rounded-xl p-4 text-center"
          >
            <p className="font-serif text-xl text-stone-800 dark:text-stone-100 tabular-nums">
              {stat.value}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Status filter */}
        <div className="flex gap-1 bg-stone-100 dark:bg-stone-800 rounded-xl p-1">
          {(["All", "Completed", "Cancelled"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors
                ${
                  filter === tab
                    ? "bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100"
                    : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            type="text"
            placeholder="Search order or dish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm
                       bg-white dark:bg-stone-900
                       border border-stone-200 dark:border-stone-700 rounded-xl
                       text-stone-700 dark:text-stone-200
                       placeholder:text-stone-300 dark:placeholder:text-stone-600
                       focus:outline-none focus:ring-2 focus:ring-[#01696f]/20 transition-all"
          />
        </div>
      </div>

      {/* ── Order list ── */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <ReceiptText
            size={40}
            className="mx-auto text-stone-200 dark:text-stone-700 mb-3"
            strokeWidth={1}
          />
          <p className="text-sm text-stone-400 italic">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const s = STATUS_CONFIG[order.status];
            const isExpanded = expandedId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-stone-900
                           border border-stone-200 dark:border-stone-800
                           rounded-2xl overflow-hidden"
              >
                {/* Row header — always visible */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4
                             hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors text-left"
                >
                  {/* Left: ID + date */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div>
                      <p className="font-mono text-sm font-bold text-[#01696f] dark:text-teal-400">
                        {order.id}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        {order.date}
                      </p>
                    </div>
                    <div className="hidden sm:block text-xs text-stone-500 dark:text-stone-400 truncate max-w-[200px]">
                      {order.items.map((i) => i.name).join(", ")}
                    </div>
                  </div>

                  {/* Right: total + status + toggle */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-serif font-bold text-sm text-stone-700 dark:text-stone-200 tabular-nums">
                      ৳{order.total.toLocaleString()}
                    </span>
                    <div
                      className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${s.bg} ${s.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {order.status}
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={14} className="text-stone-400" />
                    ) : (
                      <ChevronDown size={14} className="text-stone-400" />
                    )}
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-stone-100 dark:border-stone-800 px-5 py-5 space-y-4">
                    {/* Mobile status */}
                    <div
                      className={`sm:hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${s.bg} ${s.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {order.status}
                    </div>

                    {/* Items table */}
                    <div
                      className="divide-y divide-stone-100 dark:divide-stone-800
                                    border border-stone-100 dark:border-stone-800 rounded-xl overflow-hidden"
                    >
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between px-4 py-3 bg-stone-50 dark:bg-stone-800/50"
                        >
                          <div>
                            <p className="text-sm text-stone-700 dark:text-stone-200">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-stone-400">
                              ×{item.qty}
                            </p>
                          </div>
                          <span className="text-sm font-semibold tabular-nums text-stone-600 dark:text-stone-300">
                            ৳{item.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      {/* Total row */}
                      <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-stone-900">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                          Total Paid
                        </p>
                        <span className="font-serif text-base font-bold text-[#01696f] dark:text-teal-400 tabular-nums">
                          ৳{order.total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-0.5">
                        <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                          Delivery Address
                        </p>
                        <p className="text-stone-600 dark:text-stone-300">
                          {order.address}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                          Payment Method
                        </p>
                        <p className="text-stone-600 dark:text-stone-300">
                          {order.paymentMethod}
                        </p>
                      </div>
                    </div>

                    {/* Reorder CTA */}
                    {order.status === "Completed" && (
                      <button
                        className="w-full py-3 rounded-full border border-[#01696f]/30
                                   text-[#01696f] dark:text-teal-400
                                   text-xs font-semibold uppercase tracking-wider
                                   hover:bg-[#01696f]/5 dark:hover:bg-teal-900/20 transition-colors"
                      >
                        Reorder This
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
