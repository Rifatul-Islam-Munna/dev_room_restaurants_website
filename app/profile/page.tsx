"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Star,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";

/* ── Tracking step config ── */
type TrackStep = "Placed" | "Preparing" | "Ready" | "Delivered";

const TRACK_STEPS: TrackStep[] = ["Placed", "Preparing", "Ready", "Delivered"];

const STEP_LABELS: Record<TrackStep, string> = {
  Placed: "Order Placed",
  Preparing: "Kitchen Preparing",
  Ready: "Ready for Delivery",
  Delivered: "Delivered",
};

type ActiveOrder = {
  id: string;
  items: string[];
  total: number;
  step: TrackStep;
  time: string;
  address: string;
};

const ACTIVE_ORDERS: ActiveOrder[] = [
  {
    id: "#SR-4931",
    items: ["Truffle Tagliatelle ×2", "Single Origin Espresso ×1"],
    total: 4550,
    step: "Preparing",
    time: "Placed at 8:42 PM · Est. 30–45 min",
    address: "24/B Crescent Estate, Gulshan 2, Dhaka",
  },
  {
    id: "#SR-4932",
    items: ["Wild Atlantic Poke Bowl ×1"],
    total: 1250,
    step: "Ready",
    time: "Placed at 8:55 PM · Est. 5–10 min",
    address: "24/B Crescent Estate, Gulshan 2, Dhaka",
  },
];

/* ── Step colors ── */
const stepIndex = (s: TrackStep) => TRACK_STEPS.indexOf(s);

export default function ProfileHomePage() {
  const [orders] = useState<ActiveOrder[]>(ACTIVE_ORDERS);

  return (
    <div className="space-y-8">
      {/* ── User card ── */}
      <div
        className="bg-white dark:bg-stone-900
                      border border-stone-200 dark:border-stone-800
                      rounded-2xl overflow-hidden"
      >
        {/* Top banner */}
        <div className="h-24 bg-gradient-to-r from-[#01696f] to-[#014d52]" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-10 mb-4">
            <div
              className="w-20 h-20 rounded-full bg-[#01696f]
                            border-4 border-white dark:border-stone-900
                            flex items-center justify-center"
            >
              <span className="text-white font-serif font-bold text-3xl">
                R
              </span>
            </div>
            {/* Online badge */}
            <span
              className="absolute bottom-1 right-1 w-4 h-4 bg-green-400
                             rounded-full border-2 border-white dark:border-stone-900"
            />
          </div>

          {/* Name + info */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-stone-800 dark:text-stone-100">
                Rifat Islam
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Member since January 2025
              </p>

              <div className="mt-3 space-y-1.5">
                <p className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <Mail size={12} className="text-stone-400" />
                  rifat@example.com
                </p>
                <p className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <Phone size={12} className="text-stone-400" />
                  +880 1712-345678
                </p>
                <p className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <MapPin size={12} className="text-stone-400" />
                  Gulshan 2, Dhaka
                </p>
              </div>
            </div>

            {/* Edit profile button */}
            <button
              className="self-start shrink-0 px-5 py-2 rounded-full border
                               border-stone-200 dark:border-stone-700
                               text-xs font-semibold text-stone-600 dark:text-stone-300
                               hover:bg-stone-100 dark:hover:bg-stone-800
                               transition-colors"
            >
              Edit Profile
            </button>
          </div>

          {/* Stats row */}
          <div
            className="grid grid-cols-3 gap-3 mt-6 pt-5
                          border-t border-stone-100 dark:border-stone-800"
          >
            {[
              { icon: ShoppingBag, label: "Total Orders", value: "38" },
              { icon: TrendingUp, label: "Total Spent", value: "৳1,24,500" },
              { icon: Star, label: "Avg. Rating", value: "4.9 ★" },
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

      {/* ── Active orders / tracking ── */}
      <div className="space-y-4">
        <div>
          <h3 className="font-serif text-xl text-stone-800 dark:text-stone-100">
            Active Orders
          </h3>
          <p className="text-xs text-stone-400 mt-0.5 italic">
            Track your current deliveries in real time.
          </p>
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
            const currentStep = stepIndex(order.step);
            return (
              <div
                key={order.id}
                className="bg-white dark:bg-stone-900
                           border border-stone-200 dark:border-stone-800
                           rounded-2xl p-5 md:p-6 space-y-5"
              >
                {/* Order header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-sm font-bold text-[#01696f] dark:text-teal-400">
                      {order.id}
                    </span>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {order.time}
                    </p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20
                                   text-amber-700 dark:text-amber-400
                                   text-[10px] font-bold uppercase tracking-wider shrink-0"
                  >
                    {order.step}
                  </span>
                </div>

                {/* Items */}
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-stone-100 dark:bg-stone-800
                                 text-stone-600 dark:text-stone-300
                                 text-[11px] font-medium rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Progress tracker */}
                <div className="relative">
                  {/* Track line */}
                  <div
                    className="absolute top-3.5 left-3.5 right-3.5 h-0.5
                                  bg-stone-200 dark:bg-stone-700"
                  />
                  {/* Filled line */}
                  <div
                    className="absolute top-3.5 left-3.5 h-0.5
                               bg-[#01696f] dark:bg-teal-500 transition-all duration-700"
                    style={{
                      width: `${(currentStep / (TRACK_STEPS.length - 1)) * 100}%`,
                      right: "auto",
                    }}
                  />

                  {/* Steps */}
                  <div className="relative flex justify-between">
                    {TRACK_STEPS.map((step, idx) => {
                      const done = idx < currentStep;
                      const active = idx === currentStep;
                      return (
                        <div
                          key={step}
                          className="flex flex-col items-center gap-2"
                        >
                          {/* Circle */}
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
                          {/* Label */}
                          <span
                            className={`text-[9px] uppercase tracking-widest font-bold text-center leading-tight
                              ${
                                active || done
                                  ? "text-[#01696f] dark:text-teal-400"
                                  : "text-stone-300 dark:text-stone-600"
                              }`}
                          >
                            {STEP_LABELS[step].split(" ")[0]}
                            <br />
                            {STEP_LABELS[step].split(" ").slice(1).join(" ")}
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
                      {order.address}
                    </span>
                  </div>
                  <span className="font-serif font-bold text-sm text-[#01696f] dark:text-teal-400 tabular-nums">
                    ৳{order.total.toLocaleString()}
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
