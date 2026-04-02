"use client";

import {
  ShoppingBag,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { useQueryWrapper } from "@/api-hooks/react-query-wrapper";
import { logoutUser } from "@/actions/auth";
import { useRouter } from "next/navigation";

type BackendOrderStatus = "Pending" | "Preparing" | "Serving" | "Completed";

type TrackStep = "Placed" | "Preparing" | "Ready" | "Delivered";

type OrderItem = {
  menuItemId: string;
  name: string;
  subtitle?: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
};

type ActiveOrder = {
  _id: string;
  id: string;
  orderNumber: string;
  items: OrderItem[];
  pricing: {
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    deliveryFee: number;
    total: number;
  };
  status: BackendOrderStatus;
  estimatedDeliveryTime?: string;
  createdAt: string;
  delivery: {
    street: string;
    area: string;
    city: string;
    postalCode: string;
    notes?: string;
    type: "delivery" | "takeout" | "table";
    tableNumber?: string;
  };
};

type UserInfo = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  address?: string;
  createdAt?: string;
};

type ActiveOrdersResponse = {
  success: boolean;
  data: {
    user: UserInfo | null;
    activeOrders: ActiveOrder[];
    totalOrders: number;
    cancelledOrders: number;
    totalSpent: number;
  };
};

/* ── Tracking step config ──────────────────────────────────────────────── */

const TRACK_STEPS: TrackStep[] = ["Placed", "Preparing", "Ready", "Delivered"];

const STEP_LABELS: Record<TrackStep, string> = {
  Placed: "Order Placed",
  Preparing: "Kitchen Preparing",
  Ready: "Ready for Delivery",
  Delivered: "Delivered",
};

const mapStatusToStep = (status: BackendOrderStatus): TrackStep => {
  switch (status) {
    case "Pending":
      return "Placed";
    case "Preparing":
      return "Preparing";
    case "Serving":
      return "Ready";
    case "Completed":
      return "Delivered";
    default:
      return "Placed";
  }
};

const getStepBadgeClass = (step: TrackStep) => {
  switch (step) {
    case "Placed":
      return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
    case "Preparing":
      return "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400";
    case "Ready":
      return "bg-teal-50 dark:bg-teal-900/20 text-[#01696f] dark:text-teal-400";
    case "Delivered":
      return "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400";
    default:
      return "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400";
  }
};

const stepIndex = (s: TrackStep) => TRACK_STEPS.indexOf(s);

/* ── Helpers ───────────────────────────────────────────────────────────── */

const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;

const formatMemberSince = (date?: string) => {
  if (!date) return "Member information unavailable";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const formatOrderTime = (createdAt: string, estimatedDeliveryTime?: string) => {
  const placedTime = new Date(createdAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return estimatedDeliveryTime
    ? `Placed at ${placedTime} · Est. ${estimatedDeliveryTime}`
    : `Placed at ${placedTime}`;
};

const getAddressText = (order: ActiveOrder) => {
  if (order.delivery.type === "table") {
    return `Table ${order.delivery.tableNumber || ""}`.trim();
  }

  if (order.delivery.type === "takeout") {
    return "Takeout";
  }

  return `${order.delivery.street}, ${order.delivery.area}, ${order.delivery.city}`;
};

function ProfileSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden">
        <div className="h-24 bg-stone-200 dark:bg-stone-800" />
        <div className="px-6 pb-6">
          <div className="relative -mt-10 mb-4">
            <div className="w-20 h-20 rounded-full bg-stone-200 dark:bg-stone-800 border-4 border-white dark:border-stone-900" />
          </div>
          <div className="space-y-3">
            <div className="h-6 w-40 rounded bg-stone-200 dark:bg-stone-800" />
            <div className="h-4 w-32 rounded bg-stone-200 dark:bg-stone-800" />
            <div className="space-y-2">
              <div className="h-3 w-52 rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-3 w-40 rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-3 w-36 rounded bg-stone-200 dark:bg-stone-800" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 md:p-6 space-y-5"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 rounded bg-stone-200 dark:bg-stone-800" />
                <div className="h-3 w-40 rounded bg-stone-200 dark:bg-stone-800" />
              </div>
              <div className="h-6 w-20 rounded-full bg-stone-200 dark:bg-stone-800" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-28 rounded-full bg-stone-200 dark:bg-stone-800" />
              <div className="h-6 w-32 rounded-full bg-stone-200 dark:bg-stone-800" />
            </div>
            <div className="h-16 rounded bg-stone-200 dark:bg-stone-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProfileHomePage() {
  const { data, isLoading, isPending } = useQueryWrapper<ActiveOrdersResponse>(
    ["profile-active-orders"],
    "/order/active",
  );
  const router = useRouter();

  const loading = isLoading || isPending;

  const user = data?.data?.user;
  const orders = data?.data?.activeOrders ?? [];
  const totalOrders = data?.data?.totalOrders ?? 0;
  const cancelledOrders = data?.data?.cancelledOrders ?? 0;
  const totalSpent = data?.data?.totalSpent ?? 0;

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "U";
  const handelLogout = async () => {
    await logoutUser();
    router.push("/");
  };
  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* ── User card ── */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-[#01696f] to-[#014d52]" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-10 mb-4">
            <div
              className="w-20 h-20 rounded-full bg-[#01696f]
                         border-4 border-white dark:border-stone-900
                         flex items-center justify-center overflow-hidden"
            >
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-serif font-bold text-3xl">
                  {avatarLetter}
                </span>
              )}
            </div>

            <span
              className="absolute bottom-1 right-1 w-4 h-4 bg-green-400
                         rounded-full border-2 border-white dark:border-stone-900"
            />
          </div>

          {/* Name + info */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-stone-800 dark:text-stone-100">
                {user?.name || "Unknown User"}
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Member since {formatMemberSince(user?.createdAt)}
              </p>

              <div className="mt-3 space-y-1.5">
                <p className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <Mail size={12} className="text-stone-400" />
                  {user?.email || "No email provided"}
                </p>
                <p className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <Phone size={12} className="text-stone-400" />
                  {user?.phone || "No phone provided"}
                </p>
                <p className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <MapPin size={12} className="text-stone-400" />
                  {user?.address || "No address provided"}
                </p>
              </div>
            </div>

            <button
              onClick={handelLogout}
              className="self-start shrink-0 px-5 py-2 rounded-full border
                         border-stone-200 dark:border-stone-700
                         text-xs font-semibold text-stone-600 dark:text-stone-300
                         hover:bg-stone-100 dark:hover:bg-stone-800
                         transition-colors"
            >
              Log Out
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-6 pt-5 border-t border-stone-100 dark:border-stone-800">
            {[
              {
                icon: ShoppingBag,
                label: "Total Orders",
                value: totalOrders.toLocaleString(),
              },
              {
                icon: ShoppingBag,
                label: "Cancelled Orders",
                value: cancelledOrders.toLocaleString(),
              },
              {
                icon: TrendingUp,
                label: "Total Spent",
                value: formatCurrency(totalSpent),
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-xl md:text-2xl text-stone-800 dark:text-stone-100 tabular-nums">
                  {stat.value}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-serif text-xl text-stone-800 dark:text-stone-100">
            Active Orders
          </h3>
          <p className="text-xs text-stone-400 mt-0.5 italic">
            Track your current deliveries in real time.
          </p>
          {cancelledOrders > 0 && (
            <p className="text-xs text-stone-400 mt-1">
              {cancelledOrders} cancelled order
              {cancelledOrders === 1 ? "" : "s"} available in Order History.
            </p>
          )}
        </div>

        {orders.length === 0 ? (
          <div
            className="bg-white dark:bg-stone-900
                       border border-stone-200 dark:border-stone-800
                       rounded-2xl py-16 text-center"
          >
            <ShoppingBag
              size={36}
              className="mx-auto text-stone-200 dark:text-stone-700 mb-3"
              strokeWidth={1}
            />
            <p className="text-sm text-stone-400 italic">
              No active orders right now.
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const step = mapStatusToStep(order.status);
            const currentStep = stepIndex(step);

            return (
              <div
                key={order._id}
                className="bg-white dark:bg-stone-900
                           border border-stone-200 dark:border-stone-800
                           rounded-2xl p-5 md:p-6 space-y-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-sm font-bold text-[#01696f] dark:text-teal-400">
                      {order.orderNumber || order.id}
                    </span>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {formatOrderTime(
                        order.createdAt,
                        order.estimatedDeliveryTime,
                      )}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${getStepBadgeClass(step)}`}
                  >
                    {step}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {order.items.map((item, i) => (
                    <span
                      key={`${order._id}-${i}`}
                      className="px-3 py-1 bg-stone-100 dark:bg-stone-800
                                 text-stone-600 dark:text-stone-300
                                 text-[11px] font-medium rounded-full"
                    >
                      {item.name} ×{item.quantity}
                    </span>
                  ))}
                </div>

                {/* Progress tracker */}
                <div className="relative">
                  <div
                    className="absolute top-3.5 left-3.5 right-3.5 h-0.5
                               bg-stone-200 dark:bg-stone-700"
                  />
                  <div
                    className="absolute top-3.5 left-3.5 h-0.5
                               bg-[#01696f] dark:bg-teal-500 transition-all duration-700"
                    style={{
                      width: `${(currentStep / (TRACK_STEPS.length - 1)) * 100}%`,
                      right: "auto",
                    }}
                  />

                  <div className="relative flex justify-between">
                    {TRACK_STEPS.map((trackStep, idx) => {
                      const done = idx < currentStep;
                      const active = idx === currentStep;

                      return (
                        <div
                          key={trackStep}
                          className="flex flex-col items-center gap-2"
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center
                                        border-2 transition-all duration-300 relative z-10
                                        ${done ? "bg-[#01696f] border-[#01696f]" : ""}
                                        ${active ? "bg-white dark:bg-stone-900 border-[#01696f] ring-4 ring-[#01696f]/15" : ""}
                                        ${!done && !active ? "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700" : ""}`}
                          >
                            {done ? (
                              <CheckCircle2 size={14} className="text-white" />
                            ) : (
                              <span
                                className={`w-2 h-2 rounded-full
                                  ${active ? "bg-[#01696f]" : "bg-stone-300 dark:bg-stone-600"}`}
                              />
                            )}
                          </div>

                          <span
                            className={`text-[9px] uppercase tracking-widest font-bold text-center leading-tight
                              ${
                                active || done
                                  ? "text-[#01696f] dark:text-teal-400"
                                  : "text-stone-300 dark:text-stone-600"
                              }`}
                          >
                            {STEP_LABELS[trackStep].split(" ")[0]}
                            <br />
                            {STEP_LABELS[trackStep]
                              .split(" ")
                              .slice(1)
                              .join(" ")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="flex items-center justify-between pt-3
                             border-t border-stone-100 dark:border-stone-800"
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                    <MapPin size={11} />
                    <span className="truncate max-w-[200px]">
                      {getAddressText(order)}
                    </span>
                  </div>

                  <span className="font-serif font-bold text-sm text-[#01696f] dark:text-teal-400 tabular-nums">
                    {formatCurrency(order.pricing.total)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
