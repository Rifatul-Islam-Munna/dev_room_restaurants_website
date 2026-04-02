"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  ReceiptText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useQueryWrapper } from "@/api-hooks/react-query-wrapper";

/* ── Types ─────────────────────────────────────────────────────────────── */

type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Serving"
  | "Completed"
  | "Cancelled";
type PaymentMethod = "Cash on Delivery" | "Card" | "Online";
type DeliveryType = "delivery" | "takeout" | "table";

type OrderItem = {
  menuItemId: string;
  name: string;
  subtitle?: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
};

type Order = {
  _id: string;
  id: string;
  orderNumber: string;
  customer: {
    userId?: string;
    name: string;
    email: string;
    phone: string;
  };
  delivery: {
    street: string;
    area: string;
    city: string;
    postalCode: string;
    notes?: string;
    type: DeliveryType;
    tableNumber?: string;
  };
  items: OrderItem[];
  itemCount: number;
  pricing: {
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    deliveryFee: number;
    total: number;
  };
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type OrdersResponse = {
  success: boolean;
  data: Order[];
  pagination: Pagination;
};

type FilterType = "All" | "Completed" | "Cancelled";

/* ── Config ────────────────────────────────────────────────────────────── */

const STATUS_CONFIG: Record<
  OrderStatus,
  { bg: string; text: string; dot: string }
> = {
  Pending: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-400",
  },
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

const LIMIT = 8;
const EMPTY_ORDERS: Order[] = [];

/* ── Helpers ───────────────────────────────────────────────────────────── */

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function OrderHistorySkeleton() {
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-stone-100 dark:bg-stone-800" />
            <div className="h-3 w-20 rounded bg-stone-100 dark:bg-stone-800" />
          </div>
          <div className="hidden sm:block h-4 w-40 rounded bg-stone-100 dark:bg-stone-800" />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-4 w-16 rounded bg-stone-100 dark:bg-stone-800" />
          <div className="hidden sm:block h-6 w-24 rounded-full bg-stone-100 dark:bg-stone-800" />
          <div className="h-4 w-4 rounded bg-stone-100 dark:bg-stone-800" />
        </div>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function OrderHistoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const query = new URLSearchParams();

  if (filter !== "All") {
    query.set("status", filter);
  }

  if (search.trim()) {
    query.set("search", search.trim());
  }

  query.set("page", String(page));
  query.set("limit", String(LIMIT));

  const { data, isLoading, isPending } = useQueryWrapper<OrdersResponse>(
    ["order-history", filter, search, page],
    `/order?${query.toString()}`,
  );

  const orders = data?.data ?? EMPTY_ORDERS;
  const pagination = data?.pagination;
  const filteredOrders = orders;

  const handleFilterChange = (value: FilterType) => {
    setFilter(value);
    setPage(1);
    setExpandedId(null);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    setExpandedId(null);
  };

  const handlePageChange = (newPage: number) => {
    if (!pagination) return;
    if (newPage < 1 || newPage > pagination.totalPages) return;

    setPage(newPage);
    setExpandedId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getVisiblePages = () => {
    if (!pagination) return [];
    const pages: number[] = [];
    const start = Math.max(1, pagination.page - 1);
    const end = Math.min(pagination.totalPages, pagination.page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const loading = isLoading || isPending;

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

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 bg-stone-100 dark:bg-stone-800 rounded-xl p-1 w-max">
          {(["All", "Completed", "Cancelled"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleFilterChange(tab)}
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

        <div className="relative flex-1 sm:max-w-xs">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            type="text"
            placeholder="Search order or dish..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm
                       bg-white dark:bg-stone-900
                       border border-stone-200 dark:border-stone-700 rounded-xl
                       text-stone-700 dark:text-stone-200
                       placeholder:text-stone-300 dark:placeholder:text-stone-600
                       focus:outline-none focus:ring-2 focus:ring-[#01696f]/20 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <OrderHistorySkeleton key={i} />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
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
          {filteredOrders.map((order) => {
            const s = STATUS_CONFIG[order.status];
            const isExpanded = expandedId === order._id;

            return (
              <div
                key={order._id}
                className="bg-white dark:bg-stone-900
                           border border-stone-200 dark:border-stone-800
                           rounded-2xl overflow-hidden"
              >
                {/* Row header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : order._id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4
                             hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div>
                      <p className="font-mono text-sm font-bold text-[#01696f] dark:text-teal-400">
                        {order.orderNumber || order.id}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="hidden sm:block text-xs text-stone-500 dark:text-stone-400 truncate max-w-[200px]">
                      {order.items.map((i) => i.name).join(", ")}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-serif font-bold text-sm text-stone-700 dark:text-stone-200 tabular-nums">
                      ৳{order.pricing.total.toLocaleString()}
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
                              ×{item.quantity}
                            </p>
                          </div>
                          <span className="text-sm font-semibold tabular-nums text-stone-600 dark:text-stone-300">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}

                      <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-stone-900">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                          Order Total
                        </p>
                        <span className="font-serif text-base font-bold text-[#01696f] dark:text-teal-400 tabular-nums">
                          ৳{order.pricing.total.toLocaleString()}
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
                          {order.delivery.type === "table"
                            ? `Table ${order.delivery.tableNumber || ""}`
                            : `${order.delivery.street}, ${order.delivery.area}, ${order.delivery.city}`}
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

                    {/* Optional notes */}
                    {order.notes && (
                      <div className="space-y-0.5">
                        <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                          Notes
                        </p>
                        <p className="text-stone-600 dark:text-stone-300 text-xs italic">
                          {order.notes}
                        </p>
                      </div>
                    )}

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

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-stone-400">
            Showing{" "}
            <span className="font-semibold text-stone-600 dark:text-stone-300">
              {(pagination.page - 1) * pagination.limit + 1}–
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-stone-600 dark:text-stone-300">
              {pagination.total}
            </span>{" "}
            orders
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className="h-8 w-8 flex items-center justify-center rounded-lg
                         border border-stone-200 dark:border-stone-700
                         text-stone-500 dark:text-stone-400
                         hover:bg-stone-100 dark:hover:bg-stone-800
                         disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>

            {getVisiblePages().map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`h-8 min-w-8 px-2.5 rounded-lg text-xs font-semibold transition-colors
                  ${
                    pagination.page === p
                      ? "bg-[#01696f] text-white"
                      : "border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                  }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="h-8 w-8 flex items-center justify-center rounded-lg
                         border border-stone-200 dark:border-stone-700
                         text-stone-500 dark:text-stone-400
                         hover:bg-stone-100 dark:hover:bg-stone-800
                         disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
