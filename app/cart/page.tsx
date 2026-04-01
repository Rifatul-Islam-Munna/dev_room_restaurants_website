"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  X,
  ArrowLeft,
  ArrowRight,
  ShoppingBasket,
  Banknote,
} from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";

const DELIVERY_FEE = 50;
const TAX_RATE = 0.05;

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const subtotal = items.reduce((sum, i) => sum + i.priceNum * i.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + DELIVERY_FEE;

  const isEmpty = items.length === 0;

  if (isEmpty) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <ShoppingBasket
          size={80}
          className="text-stone-300 dark:text-stone-700 mb-6"
          strokeWidth={1}
        />
        <h2 className="font-serif text-4xl text-[#01696f] dark:text-teal-400 mb-3">
          Your cart is empty
        </h2>
        <p className="text-stone-400 dark:text-stone-500 mb-8 max-w-sm text-sm">
          It seems you haven&apos;t selected any delicacies yet. Our kitchen is
          ready for your inspiration.
        </p>
        <Link
          href="/menu"
          className="flex items-center gap-2 bg-[#01696f] text-white px-8 py-3 rounded-full
                     text-sm font-semibold uppercase tracking-widest
                     hover:bg-[#014d52] active:scale-95 transition-all"
        >
          Browse Menu
          <ArrowRight size={14} />
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-10">
        <h1 className="font-serif italic text-4xl md:text-6xl text-[#01696f] dark:text-teal-400 font-light mb-2">
          Your Selection
        </h1>
        <p className="text-stone-400 dark:text-stone-500 italic text-sm md:text-base max-w-xl">
          Curated flavors ready for your table. Review your culinary journey
          before we begin preparation.
        </p>
      </header>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
        {/* LEFT: Cart items */}
        <section className="space-y-0">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={`flex gap-4 py-6 ${
                idx < items.length - 1
                  ? "border-b border-stone-100 dark:border-stone-800"
                  : ""
              }`}
            >
              {/* Thumbnail */}
              <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100 dark:bg-stone-800">
                <Image
                  src={item.image ?? ""}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 80px, 112px"
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-serif text-base md:text-lg text-stone-800 dark:text-stone-100 leading-tight">
                      {item.name}
                    </h3>
                    {item.subtitle && (
                      <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5 line-clamp-1">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                    className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full
                               text-stone-300 dark:text-stone-600
                               hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
                               transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Price row */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <span className="text-xs text-stone-400 uppercase tracking-widest">
                    ৳{item.priceNum.toLocaleString()} each
                  </span>

                  {/* Stepper */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      aria-label="Decrease"
                      className="w-7 h-7 rounded-full flex items-center justify-center
                                 bg-stone-100 dark:bg-stone-800 text-stone-500
                                 hover:bg-red-50 hover:text-red-400
                                 transition-colors"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="w-6 text-center text-sm font-bold tabular-nums text-stone-800 dark:text-stone-100">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      aria-label="Increase"
                      className="w-7 h-7 rounded-full flex items-center justify-center
                                 bg-stone-100 dark:bg-stone-800 text-stone-500
                                 hover:bg-[#01696f] hover:text-white
                                 transition-colors"
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  {/* Line total */}
                  <span className="text-sm font-bold text-[#01696f] dark:text-teal-400 tabular-nums">
                    ৳{(item.priceNum * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Back to menu */}
          <div className="pt-6">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-sm text-[#01696f] dark:text-teal-400
                         font-medium hover:underline group"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Continue Exploring Menu
            </Link>
          </div>
        </section>

        {/* RIGHT: Order summary (no promo) */}
        <aside className="lg:sticky lg:top-28">
          <div className="border border-stone-200 dark:border-stone-800 rounded-2xl p-6 bg-white dark:bg-stone-900">
            <h2 className="font-serif text-xl text-stone-800 dark:text-stone-100 mb-6">
              Order Summary
            </h2>

            {/* Line items */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-stone-500 dark:text-stone-400">
                <span>Subtotal</span>
                <span className="font-medium text-stone-700 dark:text-stone-200">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-stone-500 dark:text-stone-400">
                <span>Delivery Fee</span>
                <span className="font-medium text-stone-700 dark:text-stone-200">
                  ৳{DELIVERY_FEE}
                </span>
              </div>
              <div className="flex justify-between text-sm text-stone-500 dark:text-stone-400">
                <span>Tax (5%)</span>
                <span className="font-medium text-stone-700 dark:text-stone-200">
                  ৳{Math.round(tax).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 mb-6">
              <div className="flex justify-between items-end">
                <span className="font-serif text-base text-stone-800 dark:text-stone-100">
                  Total Amount
                </span>
                <div className="text-right">
                  <span className="text-2xl font-serif font-bold text-[#01696f] dark:text-teal-400 tabular-nums">
                    ৳{Math.round(total).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment method note */}
            <div className="mb-6 p-4 bg-stone-50 dark:bg-stone-800 rounded-xl flex items-start gap-3">
              <Banknote size={18} className="text-stone-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                  Cash on Delivery only
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  Pay at your doorstep upon arrival.
                </p>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/cart/checkout"
              className="w-full flex items-center justify-center gap-2
                         bg-[#01696f] text-white py-4 rounded-full
                         font-semibold text-sm uppercase tracking-widest
                         hover:bg-[#014d52] active:scale-95 transition-all group"
            >
              Proceed to Checkout
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
