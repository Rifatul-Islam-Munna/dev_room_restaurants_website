"use client";

import { useState, useMemo } from "react";
import {
  Eye,
  X,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useQueryWrapper } from "@/api-hooks/react-query-wrapper";
import { useCommonMutationApi } from "@/api-hooks/use-api-mutation";
import { useQueryClient } from "@tanstack/react-query";

type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Serving"
  | "Completed"
  | "Cancelled";
type PaymentMethod = "Cash on Delivery" | "Card" | "Online";
type PaymentStatus = "pending" | "paid" | "failed";
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
  estimatedDeliveryTime?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
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
    bg: "bg-stone-100 dark:bg-stone-800",
    text: "text-stone-500 dark:text-stone-400",
    dot: "bg-stone-400",
  },
  Cancelled: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-500 dark:text-red-400",
    dot: "bg-red-400",
  },
};

const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { bg: string; text: string }
> = {
  pending: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
  },
  paid: {
    bg: "bg-teal-50 dark:bg-teal-900/20",
    text: "text-[#01696f] dark:text-teal-400",
  },
  failed: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-500 dark:text-red-400",
  },
};

const ALL_STATUSES: OrderStatus[] = [
  "Pending",
  "Preparing",
  "Serving",
  "Completed",
  "Cancelled",
];

type FilterTab = "All" | OrderStatus;
const TABS: FilterTab[] = [
  "All",
  "Pending",
  "Preparing",
  "Serving",
  "Completed",
  "Cancelled",
];

const LIMIT = 10;
const EMPTY_ORDERS: Order[] = [];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Order | null>(null);
  const queryClient = useQueryClient();

  const query = new URLSearchParams();
  if (activeTab !== "All") query.set("status", activeTab);
  if (search.trim()) query.set("search", search.trim());
  query.set("page", String(page));
  query.set("limit", String(LIMIT));

  const { data: res, isLoading } = useQueryWrapper<OrdersResponse>(
    ["orders", activeTab, search, page],
    `/order?${query.toString()}`,
  );

  const { mutate: patchStatus } = useCommonMutationApi({
    method: "PATCH",
    url: `/order`,
  });

  const orders = res?.data ?? EMPTY_ORDERS;
  const pagination: Pagination | undefined = res?.pagination;

  const counts = useMemo(() => {
    const all: Record<FilterTab, number> = {
      All: pagination?.total ?? 0,
      Pending: 0,
      Preparing: 0,
      Serving: 0,
      Completed: 0,
      Cancelled: 0,
    };
    // count from currently loaded data as approximation
    orders.forEach((o) => {
      if (o.status in all) all[o.status as FilterTab]++;
    });
    return all;
  }, [orders, pagination]);

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    patchStatus(
      { status, id: orderId },
      {
        onSuccess: () => {
          // optimistically update selected panel if open
          if (selected && selected.id === orderId) {
            setSelected({ ...selected, status });
          }
          queryClient.refetchQueries({ queryKey: ["orders"], exact: false });
        },
      },
    );
  };

  const handlePageChange = (newPage: number) => {
    if (!pagination) return;
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getVisiblePages = () => {
    if (!pagination) return [];
    const pages: number[] = [];
    const start = Math.max(1, pagination.page - 1);
    const end = Math.min(pagination.totalPages, pagination.page + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-serif italic text-3xl text-stone-800 dark:text-stone-100">
          Orders
        </h1>
        <p className="text-xs text-stone-400 mt-0.5 italic">
          Real-time floor management and logistics.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-1 bg-stone-100 dark:bg-stone-800 rounded-xl p-1 w-max min-w-full">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap
                  ${
                    activeTab === tab
                      ? "bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 shadow-sm"
                      : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                  }`}
              >
                {tab}
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                    ${
                      activeTab === tab
                        ? tab === "Pending"
                          ? "bg-blue-100 text-blue-600"
                          : tab === "Preparing"
                            ? "bg-amber-100 text-amber-700"
                            : tab === "Serving"
                              ? "bg-teal-100 text-[#01696f]"
                              : tab === "Completed"
                                ? "bg-stone-100 text-stone-500"
                                : tab === "Cancelled"
                                  ? "bg-red-100 text-red-500"
                                : "bg-stone-100 text-stone-500"
                        : "bg-stone-200 dark:bg-stone-700 text-stone-500"
                    }`}
                >
                  {tab === "All" ? (pagination?.total ?? 0) : counts[tab]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative shrink-0">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            type="text"
            placeholder="Search customer or ID..."
            value={search}
            onChange={handleSearch}
            className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-stone-900
                       border border-stone-200 dark:border-stone-700 rounded-xl w-64
                       text-stone-700 dark:text-stone-200
                       placeholder:text-stone-300 dark:placeholder:text-stone-600
                       focus:outline-none focus:ring-2 focus:ring-[#01696f]/20 transition-all"
          />
        </div>
      </div>

      <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden bg-white dark:bg-stone-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800">
                {[
                  "Order",
                  "Customer",
                  "Delivery",
                  "Items",
                  "Total",
                  "Payment",
                  "Status",
                  "",
                ].map((th) => (
                  <th
                    key={th}
                    className="px-5 py-3 text-[10px] uppercase tracking-widest font-bold text-stone-400 whitespace-nowrap"
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {isLoading ? (
                Array.from({ length: LIMIT }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 rounded bg-stone-100 dark:bg-stone-800 animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center text-sm text-stone-400 italic"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const s = STATUS_CONFIG[order.status];
                  const ps = PAYMENT_STATUS_CONFIG[order.paymentStatus];
                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-[#01696f] dark:text-teal-400 font-semibold block">
                          {order.orderNumber}
                        </span>
                        <span className="font-mono text-[10px] text-stone-400">
                          {order.id}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                          {order.customer.name}
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          {order.customer.phone}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs text-stone-600 dark:text-stone-300 capitalize">
                          {order.delivery.type}
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5 max-w-[120px] truncate">
                          {order.delivery.area}, {order.delivery.city}
                        </p>
                      </td>

                      <td className="px-5 py-4 max-w-[160px]">
                        <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                          {order.items
                            .map((i) => `${i.name} ×${i.quantity}`)
                            .join(", ")}
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          {order.itemCount} item
                          {order.itemCount !== 1 ? "s" : ""}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-serif text-sm font-semibold text-stone-700 dark:text-stone-200 tabular-nums">
                          ৳{order.pricing.total.toLocaleString()}
                        </span>
                      </td>

                      {/* Payment status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ps.bg} ${ps.text}`}
                        >
                          {order.paymentStatus}
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
                                handleStatusChange(
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

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
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

      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-stone-900/30 dark:bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div
            className="w-full max-w-md bg-white dark:bg-stone-900 h-full flex flex-col
                        border-l border-stone-200 dark:border-stone-800 overflow-y-auto"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 dark:border-stone-800 sticky top-0 bg-white dark:bg-stone-900 z-10">
              <div>
                <p className="font-mono text-sm text-[#01696f] dark:text-teal-400 font-bold">
                  {selected.orderNumber}
                </p>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  {new Date(selected.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
                  {selected.customer.name}
                </p>
                <p className="text-xs text-stone-400">
                  {selected.customer.email}
                </p>
                <p className="text-xs text-stone-400">
                  {selected.customer.phone}
                </p>
              </div>

              {/* Delivery */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                  Delivery
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 capitalize">
                  {selected.delivery.type}
                  {selected.delivery.tableNumber
                    ? ` · Table ${selected.delivery.tableNumber}`
                    : ""}
                </p>
                <p className="text-xs text-stone-400">
                  {selected.delivery.street}, {selected.delivery.area},{" "}
                  {selected.delivery.city} - {selected.delivery.postalCode}
                </p>
                {selected.delivery.notes && (
                  <p className="text-xs text-stone-400 italic">
                    Note: {selected.delivery.notes}
                  </p>
                )}
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
                          ×{item.quantity}
                          {item.category ? ` · ${item.category}` : ""}
                        </p>
                      </div>
                      <span className="text-sm font-semibold tabular-nums text-stone-700 dark:text-stone-200">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}

                  {/* Pricing breakdown */}
                  <div className="px-4 py-3 bg-stone-50 dark:bg-stone-800/50 space-y-1.5">
                    <div className="flex justify-between text-xs text-stone-400">
                      <span>Subtotal</span>
                      <span>৳{selected.pricing.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-stone-400">
                      <span>Delivery Fee</span>
                      <span>
                        ৳{selected.pricing.deliveryFee.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-stone-400">
                      <span>
                        Tax ({(selected.pricing.taxRate * 100).toFixed(0)}%)
                      </span>
                      <span>
                        ৳{selected.pricing.taxAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-stone-200 dark:border-stone-700">
                      <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
                        Total
                      </p>
                      <span className="font-serif text-lg font-bold text-[#01696f] dark:text-teal-400 tabular-nums">
                        ৳{selected.pricing.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                  Payment
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {selected.paymentMethod}
                  </p>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${PAYMENT_STATUS_CONFIG[selected.paymentStatus].bg}
                      ${PAYMENT_STATUS_CONFIG[selected.paymentStatus].text}`}
                  >
                    {selected.paymentStatus}
                  </span>
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
                <div className="grid grid-cols-2 gap-2">
                  {ALL_STATUSES.map((st) => {
                    const cfg = STATUS_CONFIG[st];
                    const isActive = selected.status === st;
                    return (
                      <button
                        key={st}
                        onClick={() => {
                          handleStatusChange(selected.id, st);
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

              {/* Estimated delivery */}
              {selected.estimatedDeliveryTime && (
                <p className="text-xs text-stone-400 text-center italic">
                  Estimated delivery: {selected.estimatedDeliveryTime}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
