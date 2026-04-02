"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { sileo } from "sileo";
import { useQueryWrapper } from "@/api-hooks/react-query-wrapper";
import { useCartStore } from "@/store/use-cart-store";
import DishCard from "@/components/custom/common/dish-card";
import {
  type ApiListResponse,
  type MenuItem,
} from "@/components/custom/admin/menu/MenuItemsPage";

type MenuItemResponse = {
  success: boolean;
  data: MenuItem;
};

const EMPTY_MENU_ITEMS: MenuItem[] = [];
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=600&auto=format&fit=crop";

function DetailSkeleton() {
  return (
    <main className="pt-24 pb-24 px-4 md:px-6 container mx-auto animate-pulse">
      <div className="h-4 w-32 rounded bg-stone-200 dark:bg-stone-800 mb-8" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_420px]">
        <div className="aspect-[4/3] rounded-[2rem] bg-stone-200 dark:bg-stone-800" />
        <div className="rounded-[2rem] border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 md:p-8 space-y-5">
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded-full bg-stone-200 dark:bg-stone-800" />
            <div className="h-6 w-24 rounded-full bg-stone-200 dark:bg-stone-800" />
          </div>
          <div className="h-10 w-3/4 rounded bg-stone-200 dark:bg-stone-800" />
          <div className="h-5 w-1/2 rounded bg-stone-200 dark:bg-stone-800" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-stone-200 dark:bg-stone-800" />
            <div className="h-4 w-full rounded bg-stone-200 dark:bg-stone-800" />
            <div className="h-4 w-5/6 rounded bg-stone-200 dark:bg-stone-800" />
          </div>
          <div className="h-16 w-full rounded-2xl bg-stone-200 dark:bg-stone-800" />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="h-12 rounded-full bg-stone-200 dark:bg-stone-800" />
            <div className="h-12 rounded-full bg-stone-200 dark:bg-stone-800" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DishDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const addToCart = useCartStore((state) => state.addToCart);
  const buyNow = useCartStore((state) => state.buyNow);
  const inCartQty = useCartStore((state) => state.getItemQty(id));

  const {
    data: itemRes,
    isLoading,
    isPending,
    error,
  } = useQueryWrapper<MenuItemResponse>(["menu-item", id], `/menu-item?id=${id}`);

  const item = itemRes?.data;
  const relatedUrl = item?.category
    ? `/menu-item?${new URLSearchParams({
        category: item.category,
        limit: "4",
      }).toString()}`
    : "";

  const { data: relatedRes } = useQueryWrapper<ApiListResponse<MenuItem[]>>(
    ["related-menu-items", item?.category],
    relatedUrl,
    { enabled: Boolean(relatedUrl) },
  );

  const relatedItems = (relatedRes?.data ?? EMPTY_MENU_ITEMS)
    .filter((dish) => dish._id !== id)
    .slice(0, 4);

  const loading = isLoading || isPending;

  const cartPayload = item
    ? {
        id: item._id,
        name: item.name,
        subtitle: item.subtitle ?? item.description ?? "",
        price: `৳${item.price.toLocaleString()}`,
        priceNum: item.price,
        image: item.image || DEFAULT_IMAGE,
        chefsPick: item.chefsPick,
        category: item.category,
        quantity,
      }
    : null;

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (!cartPayload || !item?.available) return;

    addToCart(cartPayload);
    sileo.success({
      title: `${item.name} added to cart`,
      description:
        quantity > 1 ? `${quantity} portions are now in your selection.` : "",
      duration: 2000,
      fill: "#e6f4f3",
    });
  };

  const handleBuyNow = () => {
    if (!cartPayload || !item?.available) return;

    buyNow(cartPayload);
    router.push("/cart/checkout");
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !item) {
    return (
      <main className="pt-24 pb-24 px-4 md:px-6 container mx-auto">
        <div className="max-w-2xl rounded-[2rem] border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-8 md:p-10 text-center mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">
            Dish Unavailable
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-stone-800 dark:text-stone-100 mb-3">
            We couldn&apos;t find that dish.
          </h1>
          <p className="text-sm text-stone-400 dark:text-stone-500 max-w-md mx-auto mb-8">
            It may have been removed from the menu or the link is no longer
            valid.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full bg-[#01696f] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-all hover:bg-[#014d52]"
          >
            <ArrowLeft size={14} />
            Back to Menu
          </Link>
        </div>
      </main>
    );
  }

  const description =
    item.description?.trim() ||
    item.subtitle?.trim() ||
    "This dish is currently waiting for its full description.";
  const formattedPrice = `৳${item.price.toLocaleString()}`;

  return (
    <main className="pt-24 pb-24 px-4 md:px-6 container mx-auto">
      <div className="mb-8">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-stone-400 transition-colors hover:text-[#01696f] dark:hover:text-teal-400"
        >
          <ArrowLeft size={14} />
          Back to Menu
        </Link>
      </div>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_420px] items-start">
        <div className="space-y-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-stone-100 dark:bg-stone-800">
            <Image
              src={item.image || DEFAULT_IMAGE}
              alt={item.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />

            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 md:p-5">
              {item.chefsPick ? (
                <span className="rounded-full bg-[#01696f] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  Chef&apos;s Pick
                </span>
              ) : (
                <span />
              )}

              <span className="rounded-full bg-white/90 dark:bg-stone-900/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#01696f] backdrop-blur-sm">
                {item.category}
              </span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-3">
                  Dish Details
                </p>
                <h1 className="font-serif text-4xl md:text-5xl text-stone-800 dark:text-stone-100 leading-tight">
                  {item.name}
                </h1>
                {item.subtitle && (
                  <p className="mt-3 text-base md:text-lg text-stone-500 dark:text-stone-400 font-light">
                    {item.subtitle}
                  </p>
                )}
              </div>

              <div className="shrink-0 rounded-2xl bg-stone-50 dark:bg-stone-800 px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  Price
                </p>
                <p className="mt-1 font-serif text-3xl text-[#01696f] dark:text-teal-400">
                  {formattedPrice}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 dark:bg-stone-800 px-4 py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  Category
                </p>
                <p className="mt-2 text-sm text-stone-700 dark:text-stone-200">
                  {item.category}
                </p>
              </div>
              <div className="rounded-2xl bg-stone-50 dark:bg-stone-800 px-4 py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  Availability
                </p>
                <p className="mt-2 text-sm text-stone-700 dark:text-stone-200">
                  {item.available ? "Available today" : "Unavailable today"}
                </p>
              </div>
              <div className="rounded-2xl bg-stone-50 dark:bg-stone-800 px-4 py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  In Your Cart
                </p>
                <p className="mt-2 text-sm text-stone-700 dark:text-stone-200">
                  {inCartQty > 0 ? `${inCartQty} selected` : "Not added yet"}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-stone-100 dark:border-stone-800 pt-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-3">
                Description
              </p>
              <p className="max-w-3xl text-sm md:text-base leading-7 text-stone-500 dark:text-stone-400">
                {description}
              </p>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-[2rem] border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">
              Make It Yours
            </p>

            <div className="mb-6 rounded-2xl bg-stone-50 dark:bg-stone-800 px-4 py-4">
              <p className="text-xs text-stone-400 uppercase tracking-widest">
                Selected Quantity
              </p>
              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={handleDecrease}
                  aria-label="Decrease quantity"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-stone-900 text-stone-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                >
                  <Minus size={14} />
                </button>

                <span className="text-2xl font-serif text-stone-800 dark:text-stone-100 tabular-nums">
                  {quantity}
                </span>

                <button
                  onClick={handleIncrease}
                  aria-label="Increase quantity"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#01696f] text-white transition-colors hover:bg-[#014d52]"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!item.available}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#01696f] px-5 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-all hover:bg-[#014d52] disabled:cursor-not-allowed disabled:bg-stone-300 dark:disabled:bg-stone-700"
              >
                <ShoppingCart size={14} />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!item.available}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-[#01696f]/20 px-5 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#01696f] transition-all hover:bg-[#01696f]/5 dark:text-teal-400 dark:hover:bg-teal-900/20 disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-400 dark:disabled:border-stone-800 dark:disabled:text-stone-600"
              >
                Buy Now
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="mt-6 space-y-3 border-t border-stone-100 dark:border-stone-800 pt-6">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 rounded-full bg-[#01696f]/10 p-1 text-[#01696f] dark:text-teal-400">
                  <Check size={12} />
                </span>
                <div>
                  <p className="text-sm font-medium text-stone-700 dark:text-stone-200">
                    Crafted fresh to order
                  </p>
                  <p className="text-xs text-stone-400">
                    Prepared with the same careful service shown across the rest
                    of the menu.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 rounded-full bg-[#01696f]/10 p-1 text-[#01696f] dark:text-teal-400">
                  <Check size={12} />
                </span>
                <div>
                  <p className="text-sm font-medium text-stone-700 dark:text-stone-200">
                    Direct checkout available
                  </p>
                  <p className="text-xs text-stone-400">
                    Buy now sends this dish straight to checkout with your
                    selected quantity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      {relatedItems.length > 0 && (
        <section className="mt-16 md:mt-20">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-3">
                More to Explore
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-stone-800 dark:text-stone-100">
                More from {item.category}
              </h2>
            </div>

            <Link
              href="/menu"
              className="self-start text-[10px] font-bold uppercase tracking-widest text-[#01696f] dark:text-teal-400"
            >
              View Full Menu
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {relatedItems.map((dish) => (
              <DishCard
                key={dish._id}
                id={dish._id}
                name={dish.name}
                subtitle={dish.subtitle ?? dish.description ?? ""}
                price={`৳${dish.price.toLocaleString()}`}
                priceNum={dish.price}
                image={dish.image}
                category={dish.category}
                chefsPick={dish.chefsPick}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}



