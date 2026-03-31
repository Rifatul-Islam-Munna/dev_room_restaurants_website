"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Banknote,
  CheckCircle2,
  Package,
  Clock,
} from "lucide-react";

/* ── Order items (Unsplash only) ── */
const ORDER_ITEMS = [
  {
    id: 1,
    name: "Wild Atlantic Poke Bowl",
    qty: 1,
    price: 1250,
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Truffle Tagliatelle",
    qty: 2,
    price: 2100,
    image:
      "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Single Origin Espresso",
    qty: 1,
    price: 350,
    image:
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=200&auto=format&fit=crop",
  },
];

const DELIVERY = 50;
const TAX_RATE = 0.05;

type FormData = {
  name: string;
  phone: string;
  email: string;
  street: string;
  area: string;
  city: string;
  postal: string;
  notes: string;
};

export default function CheckoutPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    street: "",
    area: "",
    city: "Dhaka",
    postal: "",
    notes: "",
  });
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId] = useState(`ORD-${Date?.now().toString().slice(-8)}`);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax + DELIVERY;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
  };

  /* ── Step badge ── */
  const Step = ({ n }: { n: number }) => (
    <span className="w-7 h-7 rounded-full bg-[#01696f] text-white flex items-center justify-center text-xs font-bold shrink-0">
      {n}
    </span>
  );

  /* ── Input ── */
  const Input = ({
    label,
    name,
    type = "text",
    placeholder,
    colSpan = false,
  }: {
    label: string;
    name: keyof FormData;
    type?: string;
    placeholder: string;
    colSpan?: boolean;
  }) => (
    <div className={colSpan ? "md:col-span-2 space-y-1.5" : "space-y-1.5"}>
      <label className="block text-[10px] uppercase tracking-widest font-semibold text-stone-400">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-stone-100 dark:bg-stone-800 rounded-lg px-4 py-3
                   text-sm text-stone-700 dark:text-stone-200
                   placeholder:text-stone-300 dark:placeholder:text-stone-600
                   border border-transparent
                   focus:outline-none focus:ring-2 focus:ring-[#01696f]/20
                   transition-all"
      />
    </div>
  );

  /* ── Success modal ── */
  if (orderPlaced) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center
                      bg-[#01696f]/10 backdrop-blur-md px-4"
      >
        <div
          className="bg-white dark:bg-stone-900 max-w-md w-full rounded-3xl p-8 text-center
                        border border-stone-200 dark:border-stone-700"
        >
          <div className="w-20 h-20 rounded-full bg-[#01696f] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} className="text-white" />
          </div>
          <h2 className="font-serif text-3xl text-[#01696f] dark:text-teal-400 font-bold mb-2">
            Order Placed!
          </h2>
          <p className="text-stone-400 text-sm mb-8">
            Your selection is now in the hands of our executive chefs. Prepare
            for an editorial dining experience.
          </p>

          <div className="bg-stone-50 dark:bg-stone-800 rounded-xl p-5 mb-8 text-left space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-stone-100 dark:border-stone-700">
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                Order ID
              </span>
              <span className="font-mono font-bold text-[#01696f] dark:text-teal-400 text-sm">
                #{orderId}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold flex items-center gap-1.5">
                <Clock size={12} /> Est. Arrival
              </span>
              <span className="font-bold text-stone-700 dark:text-stone-200 text-sm">
                30 – 45 minutes
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              className="w-full flex items-center justify-center gap-2
                               bg-[#01696f] text-white py-3.5 rounded-full
                               font-semibold text-sm uppercase tracking-widest
                               hover:bg-[#014d52] active:scale-95 transition-all"
            >
              <Package size={15} />
              Track Order
            </button>
            <Link
              href="/"
              className="w-full py-3 text-sm text-[#01696f] dark:text-teal-400 font-semibold
                         hover:underline transition-all text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main page ── */
  return (
    <main className="pt-24 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <header className="mb-10">
        <h1 className="font-serif italic text-4xl md:text-6xl text-[#01696f] dark:text-teal-400 font-light mb-2">
          Securing Your Table
        </h1>
        <p className="text-stone-400 dark:text-stone-500 text-sm md:text-base">
          A final touch before we prepare your masterpiece.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
          {/* ── LEFT: Form ── */}
          <div className="space-y-6">
            {/* 1. Contact */}
            <section className="border border-stone-200 dark:border-stone-800 rounded-xl p-6 bg-white dark:bg-stone-900">
              <div className="flex items-center gap-3 mb-6">
                <Step n={1} />
                <h2 className="font-serif text-xl text-stone-800 dark:text-stone-100">
                  Contact Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="Julian Thorne"
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="j.thorne@savoria.com"
                  colSpan
                />
              </div>
            </section>

            {/* 2. Delivery */}
            <section className="border border-stone-200 dark:border-stone-800 rounded-xl p-6 bg-white dark:bg-stone-900">
              <div className="flex items-center gap-3 mb-6">
                <Step n={2} />
                <h2 className="font-serif text-xl text-stone-800 dark:text-stone-100">
                  Delivery Address
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Street Address"
                  name="street"
                  placeholder="24/B, Crescent Estate"
                  colSpan
                />
                <Input label="Area" name="area" placeholder="Gulshan 2" />

                {/* City select */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-stone-400">
                    City
                  </label>
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full bg-stone-100 dark:bg-stone-800 rounded-lg px-4 py-3
                               text-sm text-stone-700 dark:text-stone-200
                               border border-transparent appearance-none
                               focus:outline-none focus:ring-2 focus:ring-[#01696f]/20 transition-all"
                  >
                    <option>Dhaka</option>
                    <option>Chittagong</option>
                    <option>Sylhet</option>
                    <option>Khulna</option>
                  </select>
                </div>

                <Input label="Postal Code" name="postal" placeholder="1212" />

                {/* Textarea */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-stone-400">
                    Delivery Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Gate code is 4452, please leave at the concierge."
                    className="w-full bg-stone-100 dark:bg-stone-800 rounded-lg px-4 py-3
                               text-sm text-stone-700 dark:text-stone-200
                               placeholder:text-stone-300 dark:placeholder:text-stone-600
                               border border-transparent resize-none
                               focus:outline-none focus:ring-2 focus:ring-[#01696f]/20 transition-all"
                  />
                </div>
              </div>
            </section>

            {/* 3. Order summary — accordion */}
            <section className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden bg-white dark:bg-stone-900">
              <button
                type="button"
                onClick={() => setSummaryOpen((v) => !v)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <Step n={3} />
                  <h2 className="font-serif text-xl text-stone-800 dark:text-stone-100">
                    Order Summary
                  </h2>
                  <span className="text-xs text-stone-400 ml-1">
                    ({ORDER_ITEMS.length} items)
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-[#01696f] transition-transform duration-300
                    ${summaryOpen ? "rotate-180" : ""}`}
                />
              </button>

              {summaryOpen && (
                <div className="px-6 pb-6 border-t border-stone-100 dark:border-stone-800 pt-4 space-y-4">
                  {ORDER_ITEMS.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-stone-100 dark:bg-stone-800">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-stone-700 dark:text-stone-200 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-stone-400">
                          Qty: {item.qty}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-[#01696f] dark:text-teal-400 tabular-nums shrink-0">
                        ৳{(item.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 4. Payment */}
            <section className="border border-stone-200 dark:border-stone-800 rounded-xl p-6 bg-white dark:bg-stone-900">
              <div className="flex items-center gap-3 mb-6">
                <Step n={4} />
                <h2 className="font-serif text-xl text-stone-800 dark:text-stone-100">
                  Payment Method
                </h2>
              </div>
              <label
                className="flex items-start gap-4 p-4 bg-stone-50 dark:bg-stone-800
                                 rounded-xl cursor-pointer border border-stone-200 dark:border-stone-700
                                 hover:border-[#01696f]/30 transition-colors"
              >
                <input
                  type="radio"
                  name="payment"
                  defaultChecked
                  className="mt-0.5 w-4 h-4 accent-[#01696f]"
                />
                <div>
                  <p className="font-semibold text-[#01696f] dark:text-teal-400 flex items-center gap-2 text-sm">
                    <Banknote size={15} />
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Settle the balance upon the arrival of your curated
                    selection.
                  </p>
                </div>
              </label>
            </section>

            {/* Back link — mobile only */}
            <div className="lg:hidden">
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 text-sm text-[#01696f] dark:text-teal-400
                           font-medium hover:underline group"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Back to Cart
              </Link>
            </div>
          </div>

          {/* ── RIGHT: Sticky summary ── */}
          <aside className="lg:sticky lg:top-28">
            <div
              className="border border-stone-200 dark:border-stone-800 rounded-2xl p-6
                            bg-white dark:bg-stone-900"
            >
              <h3 className="font-serif italic text-xl text-[#01696f] dark:text-teal-400 mb-5">
                Your Selection
              </h3>

              {/* Mini item list */}
              <div className="space-y-4 mb-5">
                {ORDER_ITEMS.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-100 dark:bg-stone-800">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-700 dark:text-stone-200 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-stone-400">
                        Qty: {item.qty}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#01696f] dark:text-teal-400 tabular-nums shrink-0">
                      ৳{(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-stone-100 dark:border-stone-800 pt-4 space-y-2.5 mb-5">
                <div className="flex justify-between text-sm text-stone-400">
                  <span>Subtotal</span>
                  <span className="text-stone-600 dark:text-stone-300 font-medium">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-stone-400">
                  <span>Delivery Fee</span>
                  <span className="text-stone-600 dark:text-stone-300 font-medium">
                    ৳{DELIVERY}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-stone-400">
                  <span>Tax (5%)</span>
                  <span className="text-stone-600 dark:text-stone-300 font-medium">
                    ৳{tax.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Grand total */}
              <div className="flex justify-between items-end mb-6 pt-1 border-t border-stone-100 dark:border-stone-800">
                <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                  Total Amount
                </span>
                <span className="text-2xl font-serif font-bold text-[#01696f] dark:text-teal-400 tabular-nums">
                  ৳{total.toLocaleString()}
                </span>
              </div>

              {/* CTA */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2
                           bg-[#01696f] text-white py-4 rounded-full
                           font-semibold text-sm uppercase tracking-widest
                           hover:bg-[#014d52] active:scale-95 transition-all group"
              >
                Place Order
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              {/* Back link — desktop */}
              <div className="hidden lg:block mt-4 text-center">
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-1.5 text-xs text-stone-400
                             hover:text-[#01696f] dark:hover:text-teal-400 transition-colors group"
                >
                  <ArrowLeft
                    size={12}
                    className="group-hover:-translate-x-0.5 transition-transform"
                  />
                  Back to Cart
                </Link>
              </div>

              <p className="text-center text-[9px] uppercase tracking-[0.15em] text-stone-300 dark:text-stone-600 mt-4">
                By placing this order you agree to Savoria&apos;s Terms of
                Service.
              </p>
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
}
