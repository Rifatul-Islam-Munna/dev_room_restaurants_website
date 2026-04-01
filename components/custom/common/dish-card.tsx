"use client";

import Image from "next/image";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { sileo } from "sileo";
import { useCartStore } from "@/store/use-cart-store";

export interface DishCardProps {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  priceNum?: number;
  image?: string;
  chefsPick?: boolean;
  category?: string;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=600&auto=format&fit=crop";

export default function DishCard({
  id,
  name,
  subtitle,
  price,
  priceNum = 0,
  image = DEFAULT_IMAGE,
  chefsPick = false,
  category,
}: DishCardProps) {
  const qty = useCartStore((state) => state.getItemQty(id));
  const addToCart = useCartStore((state) => state.addToCart);
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);

  const handleInitialAdd = () => {
    addToCart({
      id,
      name,
      subtitle,
      price,
      priceNum,
      image,
      chefsPick,
      category,
      quantity: 1,
    });

    sileo.success({
      title: `${name} added to cart`,

      duration: 2000,
      fill: "#e6f4f3",
    });
  };

  const handlePlus = () => {
    increaseQty(id);
  };

  const handleMinus = () => {
    decreaseQty(id);
  };

  return (
    <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden bg-white dark:bg-stone-900">
      <div className="relative aspect-square w-full">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
        {category && (
          <span
            className="absolute top-3 right-3 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm
                       text-[#01696f] text-[10px] font-bold uppercase tracking-widest
                       px-2.5 py-1 rounded-full"
          >
            {category}
          </span>
        )}
        {chefsPick && (
          <span
            className="absolute top-3 left-3 bg-[#01696f] text-white
                       text-[10px] font-bold uppercase tracking-widest
                       px-2.5 py-1 rounded-full"
          >
            Chef&apos;s Pick
          </span>
        )}
      </div>

      <div className="px-3 py-3 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-serif text-sm font-semibold text-stone-800 dark:text-stone-100 leading-tight truncate">
              {name}
            </p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 leading-tight line-clamp-1 mt-0.5">
              {subtitle}
            </p>
          </div>
          <span className="text-xs font-bold text-[#01696f] dark:text-teal-400 shrink-0">
            {price}
          </span>
        </div>

        <div className="pt-1 border-t border-stone-100 dark:border-stone-800">
          {qty === 0 ? (
            <button
              onClick={handleInitialAdd}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-full
                         bg-stone-100 dark:bg-stone-800 text-[#01696f] dark:text-teal-400
                         text-[11px] font-semibold uppercase tracking-wider
                         hover:bg-[#01696f] hover:text-white
                         transition-colors duration-200"
            >
              <ShoppingCart size={11} />
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={handleMinus}
                aria-label="Decrease"
                className="w-7 h-7 rounded-full flex items-center justify-center
                           bg-stone-100 dark:bg-stone-800 text-stone-500
                           hover:bg-red-50 hover:text-red-500
                           transition-colors"
              >
                <Minus size={11} />
              </button>

              <span className="text-sm font-bold tabular-nums text-stone-800 dark:text-stone-100">
                {qty}
              </span>

              <button
                onClick={handlePlus}
                aria-label="Increase"
                className="w-7 h-7 rounded-full flex items-center justify-center
                           bg-[#01696f] text-white hover:bg-[#014d52]
                           transition-colors"
              >
                <Plus size={11} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
