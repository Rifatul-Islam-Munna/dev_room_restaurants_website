"use client";

import { useState, useMemo } from "react";
import { Eye, X, Search, ChevronDown } from "lucide-react";

type OrderStatus = "Preparing" | "Serving" | "Completed";

type OrderItem = { name: string; qty: number; price: number };

type Order = {
  id: string;
  customer: string;
  email: string;
  location: string;
  time: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  notes?: string;
};

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

const INITIAL_ORDERS: Order[] = [
  {
    id: "#SR-4921",
    customer: "Elena Richardson",
    email: "elena@example.com",
    location: "Table 12",
    time: "7:15 PM",
    date: "Mar 31, 2026",
    items: [
      { name: "Duck Confit", qty: 2, price: 4800 },
      { name: "Pinot Noir", qty: 1, price: 2650 },
    ],
    total: 12250,
    status: "Serving",
  },
  {
    id: "#SR-4922",
    customer: "Marcus Vane",
    email: "marcus@example.com",
    location: "Table 04",
    time: "7:30 PM",
    date: "Mar 31, 2026",
    items: [
      { name: "Oysters", qty: 12, price: 15600 },
      { name: "Champagne", qty: 1, price: 2500 },
    ],
    total: 18100,
    status: "Preparing",
  },
  {
    id: "#SR-4923",
    customer: "Sarah Jenkins",
    email: "sarah@example.com",
    location: "Takeout",
    time: "7:45 PM",
    date: "Mar 31, 2026",
    items: [{ name: "Wild Mushroom Risotto", qty: 1, price: 2900 }],
    total: 2900,
    status: "Completed",
    notes: "No onions please.",
  },
  {
    id: "#SR-4924",
    customer: "David Osei",
    email: "david@example.com",
    location: "Table 07",
    time: "8:00 PM",
    date: "Mar 31, 2026",
    items: [
      { name: "Truffle Tagliatelle", qty: 2, price: 4200 },
      { name: "Espresso", qty: 2, price: 700 },
    ],
    total: 9400,
    status: "Preparing",
  },
  {
    id: "#SR-4925",
    customer: "Priya Nair",
    email: "priya@example.com",
    location: "Table 01",
    time: "8:15 PM",
    date: "Mar 31, 2026",
    items: [
      { name: "Poke Bowl", qty: 1, price: 1250 },
      { name: "Green Tea", qty: 2, price: 600 },
    ],
    total: 3600,
    status: "Serving",
  },
  {
    id: "#SR-4926",
    customer: "Tom Baxter",
    email: "tom@example.com",
    location: "Table 09",
    time: "8:30 PM",
    date: "Mar 31, 2026",
    items: [
      { name: "Obsidian Soufflé", qty: 2, price: 3200 },
      { name: "Latte", qty: 2, price: 700 },
    ],
    total: 5600,
    status: "Completed",
  },
  {
    id: "#SR-4927",
    customer: "Amara Diallo",
    email: "amara@example.com",
    location: "Takeout",
    time: "8:45 PM",
    date: "Mar 31, 2026",
    items: [{ name: "Truffle Tagliatelle", qty: 1, price: 2100 }],
    total: 2100,
    status: "Preparing",
  },
];

type FilterTab = "All" | OrderStatus;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  const updateStatus = (id: string, status: OrderStatus) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchTab = activeTab === "All" || o.status === activeTab;
      const matchSearch =
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [orders, activeTab, search]);

  const counts = useMemo(
    () => ({
      All: orders.length,
      Preparing: orders.filter((o) => o.status === "Preparing").length,
      Serving: orders.filter((o) => o.status === "Serving").length,
      Completed: orders.filter((o) => o.status === "Completed").length,
    }),
    [orders],
  );

  const TABS: FilterTab[] = ["All", "Preparing", "Serving", "Completed"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div>
        <h1 className="font-serif italic text-3xl text-stone-800 dark:text-stone-100">
          Orders
        </h1>
        <p className="text-xs text-stone-400 mt-0.5 italic">
          Real-time floor management and logistics.
        </p>
      </div>

      {/* ── Filter tabs + search ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-1 bg-stone-100 dark:bg-stone-800 rounded-xl p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                ${
                  activeTab === tab
                    ? "bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100"
                    : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                }`}
            >
              {tab}
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                ${
                  activeTab === tab
                    ? tab === "Preparing"
                      ? "bg-amber-100 text-amber-700"
                      : tab === "Serving"
                        ? "bg-teal-100 text-[#01696f]"
                        : tab === "Completed"
                          ? "bg-stone-100 text-stone-500"
                          : "bg-stone-100 text-stone-500"
                    : "bg-stone-200 dark:bg-stone-700 text-stone-500"
                }`}
              >
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            type="text"
            placeholder="Search customer or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-stone-900
                       border border-stone-200 dark:border-stone-700 rounded-xl w-64
                       text-stone-700 dark:text-stone-200
                       placeholder:text-stone-300 dark:placeholder:text-stone-600
                       focus:outline-none focus:ring-2 focus:ring-[#01696f]/20 transition-all"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden bg-white dark:bg-stone-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800">
                {["Order ID", "Customer", "Items", "Total", "Status", ""].map(
                  (th) => (
                    <th
                      key={th}
                      className="px-5 py-3 text-[10px] uppercase tracking-widest font-bold text-stone-400 whitespace-nowrap"
                    >
                      {th}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center text-sm text-stone-400 italic"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const s = STATUS_CONFIG[order.status];
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-[#01696f] dark:text-teal-400 font-semibold">
                          {order.id}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                          {order.customer}
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          {order.location} · {order.time}
                        </p>
                      </td>
                      <td className="px-5 py-4 max-w-[200px]">
                        <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                          {order.items
                            .map((i) => `${i.name} ×${i.qty}`)
                            .join(", ")}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-serif text-sm font-semibold text-stone-700 dark:text-stone-200 tabular-nums">
                          ৳{order.total.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${s.bg}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`}
                          />
                          <div className="relative flex items-center gap-1">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                updateStatus(
                                  order.id,
                                  e.target.value as OrderStatus,
                                )
                              }
                              className={`bg-transparent border-none text-[11px] font-bold uppercase
                                          tracking-wider focus:outline-none cursor-pointer appearance-none pr-3 ${s.text}`}
                            >
                              {ALL_STATUSES.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              size={10}
                              className={`absolute right-0 pointer-events-none ${s.text}`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelected(order)}
                          className="p-1.5 rounded-lg text-stone-300 dark:text-stone-600
                                     hover:text-[#01696f] dark:hover:text-teal-400
                                     hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                          aria-label="View order details"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Order detail slide panel ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-stone-900/30 dark:bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          {/* Panel */}
          <div
            className="w-full max-w-md bg-white dark:bg-stone-900 h-full flex flex-col
                          border-l border-stone-200 dark:border-stone-800 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 dark:border-stone-800 sticky top-0 bg-white dark:bg-stone-900 z-10">
              <div>
                <p className="font-mono text-sm text-[#01696f] dark:text-teal-400 font-bold">
                  {selected.id}
                </p>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  {selected.date} · {selected.time}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-700
                           hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                  Customer
                </p>
                <p className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                  {selected.customer}
                </p>
                <p className="text-xs text-stone-400">{selected.email}</p>
                <p className="text-xs text-stone-400">{selected.location}</p>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                  Items Ordered
                </p>
                <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
                  {selected.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center px-4 py-3 bg-white dark:bg-stone-900"
                    >
                      <div>
                        <p className="text-sm text-stone-700 dark:text-stone-200">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-stone-400">
                          ×{item.qty}
                        </p>
                      </div>
                      <span className="text-sm font-semibold tabular-nums text-stone-700 dark:text-stone-200">
                        ৳{item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-4 py-3 bg-stone-50 dark:bg-stone-800/50">
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
                      Total
                    </p>
                    <span className="font-serif text-lg font-bold text-[#01696f] dark:text-teal-400 tabular-nums">
                      ৳{selected.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selected.notes && (
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                    Notes
                  </p>
                  <p className="text-sm text-stone-500 italic">
                    {selected.notes}
                  </p>
                </div>
              )}

              {/* Status update */}
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                  Update Status
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {ALL_STATUSES.map((st) => {
                    const cfg = STATUS_CONFIG[st];
                    const isActive = selected.status === st;
                    return (
                      <button
                        key={st}
                        onClick={() => {
                          updateStatus(selected.id, st);
                          setSelected({ ...selected, status: st });
                        }}
                        className={`py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-colors
                          ${
                            isActive
                              ? `${cfg.bg} ${cfg.text} border-2 border-current`
                              : "bg-stone-100 dark:bg-stone-800 text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 border-2 border-transparent"
                          }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
