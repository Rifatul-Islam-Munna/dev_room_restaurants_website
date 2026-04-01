"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Banknote } from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";
import { useCommonMutationApi } from "@/api-hooks/use-api-mutation";

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

function Step({ n }: { n: number }) {
  return (
    <span className="w-7 h-7 rounded-full bg-[#01696f] text-white flex items-center justify-center text-xs font-bold shrink-0">
      {n}
    </span>
  );
}

type InputProps = {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  type?: string;
  placeholder: string;
  colSpan?: boolean;
};

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  colSpan = false,
}: InputProps) {
  return (
    <div className={colSpan ? "md:col-span-2 space-y-1.5" : "space-y-1.5"}>
      <label className="block text-[10px] uppercase tracking-widest font-semibold text-stone-400">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
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
}

export default function CheckoutPage() {
  const router = useRouter();

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const { mutate, isPending } = useCommonMutationApi({
    method: "POST",
    url: "/order",
    successMessage: "Order placed successfully",
    onSuccess: (res: any) => {
      clearCart?.();
      const returnedOrder = res?.data ?? res;
      const backendId = returnedOrder?.id ?? returnedOrder?._id ?? null;
      router.push(backendId ? `/profile?orderId=${backendId}` : "/profile");
    },
    onError: (err: any) => {
      setErrorMsg(err?.message || "Failed to place order.");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = items.reduce((s, i) => s + i.priceNum * i.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax + DELIVERY;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (items.length === 0) return;

    if (!form.name || !form.phone || !form.email) {
      setErrorMsg("Please fill in your name, phone and email.");
      return;
    }

    if (!form.street || !form.area || !form.city || !form.postal) {
      setErrorMsg("Please fill in your full delivery address.");
      return;
    }

    const payload = {
      customer: {
        name: form.name,
        email: form.email,
        phone: form.phone,
      },
      delivery: {
        street: form.street,
        area: form.area,
        city: form.city || "Dhaka",
        postalCode: form.postal,
        notes: form.notes || "",
        type: "delivery" as const,
      },
      items: items.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
      })),
      paymentMethod: "Cash on Delivery" as const,
      notes: form.notes || "",
    };

    mutate(payload);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h2 className="font-serif text-3xl text-[#01696f] dark:text-teal-400 mb-3">
          No items to checkout
        </h2>
        <p className="text-stone-400 dark:text-stone-500 mb-6 text-sm max-w-sm">
          Please add some dishes to your cart before proceeding to checkout.
        </p>
        <div className="flex gap-3">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-sm text-[#01696f] dark:text-teal-400 font-medium hover:underline group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Cart
          </Link>
          <Link
            href="/menu"
            className="flex items-center gap-2 bg-[#01696f] text-white px-6 py-2 rounded-full
                       text-sm font-semibold uppercase tracking-widest
                       hover:bg-[#014d52] active:scale-95 transition-all"
          >
            Browse Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
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
          <div className="space-y-6">
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
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Julian Thorne"
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="01XXXXXXXXX"
                />
                <Input
                  label="Email Address"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="j.thorne@savoria.com"
                  colSpan
                />
              </div>
            </section>

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
                  value={form.street}
                  onChange={handleChange}
                  placeholder="24/B, Crescent Estate"
                  colSpan
                />
                <Input
                  label="Area"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  placeholder="Gulshan 2"
                />
                <Input
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Dhaka"
                />
                <Input
                  label="Postal Code"
                  name="postal"
                  value={form.postal}
                  onChange={handleChange}
                  placeholder="1212"
                />

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

            <section className="border border-stone-200 dark:border-stone-800 rounded-xl p-6 bg-white dark:bg-stone-900">
              <div className="flex items-center gap-3 mb-6">
                <Step n={3} />
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

            {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

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

          <aside className="lg:sticky lg:top-28">
            <div className="border border-stone-200 dark:border-stone-800 rounded-2xl p-6 bg-white dark:bg-stone-900">
              <h3 className="font-serif italic text-xl text-[#01696f] dark:text-teal-400 mb-5">
                Your Selection
              </h3>

              <div className="space-y-4 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-100 dark:bg-stone-800">
                      <Image
                        src={item.image ?? ""}
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
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#01696f] dark:text-teal-400 tabular-nums shrink-0">
                      ৳{(item.priceNum * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

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

              <div className="flex justify-between items-end mb-6 pt-1 border-t border-stone-100 dark:border-stone-800">
                <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                  Total Amount
                </span>
                <span className="text-2xl font-serif font-bold text-[#01696f] dark:text-teal-400 tabular-nums">
                  ৳{total.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2
                           bg-[#01696f] text-white py-4 rounded-full
                           font-semibold text-sm uppercase tracking-widest
                           hover:bg-[#014d52] active:scale-95 transition-all group
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? "Placing..." : "Place Order"}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

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
