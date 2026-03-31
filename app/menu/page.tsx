"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ShoppingCart, ArrowRight } from "lucide-react";
import DishCard from "@/components/custom/common/dish-card";

/* ── Images ── */
const IMG_A =
  "https://images.unsplash.com/photo-1565895405137-3ca0cc5088c8?q=80&w=600&auto=format&fit=crop";
const IMG_B =
  "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=600&auto=format&fit=crop";
const IMG_C =
  "https://images.unsplash.com/photo-1697350671122-4ffda28f5a85?q=80&w=600&auto=format&fit=crop";

/* ── Data ── */
type MenuItem = {
  id: number;
  name: string;
  subtitle: string;
  price: string;
  priceNum: number;
  category: string;
  image: string;
  chefsPick?: boolean;
};

const MENU: MenuItem[] = [
  {
    id: 1,
    name: "Garlic Bread",
    subtitle: "House-made sourdough, herb-infused garlic butter, sea salt",
    price: "৳120",
    priceNum: 120,
    category: "Starters",
    image: IMG_A,
  },
  {
    id: 2,
    name: "Bruschetta",
    subtitle: "Ripe vine tomatoes, fresh basil, extra virgin olive oil",
    price: "৳180",
    priceNum: 180,
    category: "Starters",
    image: IMG_B,
  },
  {
    id: 3,
    name: "Grilled Chicken",
    subtitle: "Lemon-herb marinated, garlic mash, seasonal greens",
    price: "৳450",
    priceNum: 450,
    category: "Mains",
    image: IMG_C,
  },
  {
    id: 4,
    name: "Beef Tenderloin",
    subtitle: "Pan-seared, butter and thyme, red wine reduction",
    price: "৳750",
    priceNum: 750,
    category: "Mains",
    image: IMG_A,
    chefsPick: true,
  },
  {
    id: 5,
    name: "Truffle Pasta",
    subtitle: "Hand-cut tagliatelle, porcini, shaved black truffles",
    price: "৳520",
    priceNum: 520,
    category: "Pasta",
    image: IMG_B,
  },
  {
    id: 6,
    name: "Tiramisu",
    subtitle: "Espresso-soaked ladyfingers, rich mascarpone",
    price: "৳280",
    priceNum: 280,
    category: "Desserts",
    image: IMG_C,
  },
  {
    id: 7,
    name: "Chocolate Lava",
    subtitle: "Molten 70% dark chocolate, Madagascan vanilla gelato",
    price: "৳320",
    priceNum: 320,
    category: "Desserts",
    image: IMG_A,
  },
  {
    id: 8,
    name: "Grilled Sea Bass",
    subtitle: "Atlantic bass, burnt leek, emulsified herbs, sea salt",
    price: "৳580",
    priceNum: 580,
    category: "Grills",
    image: IMG_B,
  },
  {
    id: 9,
    name: "Wagyu Skewer",
    subtitle: "A5 Wagyu, smoky chimichurri, charred broccolini",
    price: "৳890",
    priceNum: 890,
    category: "Grills",
    image: IMG_C,
    chefsPick: true,
  },
];

const CATEGORIES = ["All", "Starters", "Mains", "Pasta", "Grills", "Desserts"];

type CartState = { count: number; total: number };

/* ── Component ── */
export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartState>({ count: 0, total: 0 });

  const filtered = useMemo(() => {
    return MENU.filter((item) => {
      const matchCat =
        activeCategory === "All" || item.category === activeCategory;
      const matchSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  // ✅ No toast state — sileo fires toast from DishCard directly
  const handleAddToCart = (name: string, qty: number, priceNum: number) => {
    setCart((prev) => ({
      count: prev.count + qty,
      total: prev.total + priceNum * qty,
    }));
  };

  // New handler — delta can be +1 or -1
  const handleCartChange = (name: string, delta: number, priceNum: number) => {
    setCart((prev) => {
      const newCount = prev.count + delta;
      const newTotal = prev.total + priceNum * delta;
      // ✅ If everything removed, reset to zero cleanly
      return {
        count: Math.max(0, newCount),
        total: Math.max(0, newTotal),
      };
    });
  };

  return (
    // ✅ pb-32 on mobile leaves space for floating cart bar
    <main className="pt-20 pb-32 px-4 md:px-6 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <header className="mb-8 md:mb-12">
        <h1 className="font-serif italic text-4xl md:text-6xl text-[#01696f] dark:text-teal-400 mb-2 md:mb-3">
          Our Culinary Story
        </h1>
        <p className="text-stone-500 dark:text-stone-400 max-w-xl text-base md:text-lg font-light">
          Every dish is a chapter in our heritage, crafted with the finest
          ingredients and a passion for artisanal flavours.
        </p>
      </header>

      {/* ── Search + Filter — NOT sticky, scrolls away ── */}
      <section className="mb-8">
        <div className="flex flex-col gap-4">
          {/* Search — full width on mobile */}
          <div className="relative w-full md:w-80 group">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400
                         group-focus-within:text-[#01696f] transition-colors"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes..."
              className="w-full pl-10 pr-4 py-2.5
                         bg-stone-100 dark:bg-stone-800
                         rounded-xl border border-transparent
                         focus:outline-none focus:ring-2 focus:ring-[#01696f]/20
                         text-sm text-stone-700 dark:text-stone-300
                         placeholder:text-stone-400 transition-all"
            />
          </div>

          {/* Category pills — horizontal scroll on mobile */}
          <div
            className="flex items-center gap-2 overflow-x-auto
                          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-colors
                  ${
                    activeCategory === cat
                      ? "bg-[#01696f] text-white"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      {filtered.length > 0 ? (
        // ✅ 2-col on mobile, 3 on sm, 4 on lg, 5 on xl
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {filtered.map((item) => (
            <DishCard
              key={item.id}
              name={item.name}
              subtitle={item.subtitle}
              price={item.price}
              priceNum={item.priceNum}
              image={item.image}
              category={item.category}
              chefsPick={item.chefsPick}
              onCartChange={handleCartChange}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-stone-400 dark:text-stone-600 text-lg font-serif italic mb-1">
            No dishes found
          </p>
          <p className="text-stone-400 text-sm">
            Try a different search or category.
          </p>
        </div>
      )}

      {/* ── Experience Savoria banner ── */}
      <div
        className="mt-16 border border-stone-200 dark:border-stone-800 rounded-xl
                      px-5 py-6 md:px-8 md:py-7
                      flex flex-col sm:flex-row sm:items-center justify-between gap-4
                      bg-white dark:bg-stone-900"
      >
        <div>
          <h3 className="font-serif text-lg md:text-xl text-stone-800 dark:text-stone-100">
            Experience Savoria in person
          </h3>
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-1 max-w-sm">
            Join us for an evening of quiet intensity — reserve your table for a
            curated fine-dining experience crafted by our head chef.
          </p>
        </div>
        <Link
          href="/reservations"
          className="self-start sm:self-auto shrink-0 flex items-center gap-2
                     px-5 py-2.5 rounded-full bg-[#01696f] text-white
                     text-xs font-semibold uppercase tracking-widest
                     hover:bg-[#014d52] active:scale-95 transition-all"
        >
          Book Now
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* ── Floating cart bar — only when cart has items ── */}
      {cart.count > 0 && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                        w-[calc(100%-2rem)] max-w-sm md:max-w-md"
        >
          <div
            className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-lg
                          border border-stone-200 dark:border-stone-700
                          rounded-full px-3 py-2 flex items-center justify-between"
          >
            <div className="flex items-center gap-3 pl-1">
              <div className="relative">
                <ShoppingCart size={18} className="text-[#01696f]" />
                <span
                  className="absolute -top-1.5 -right-1.5 bg-[#01696f] text-white
                                 text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full"
                >
                  {cart.count}
                </span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                  Your Selection
                </span>
                <span className="text-xs font-bold text-[#01696f]">
                  ৳{cart.total.toLocaleString()}
                </span>
              </div>
            </div>

            <Link
              href="/cart"
              className="flex items-center gap-1.5 bg-[#01696f] text-white
                         px-4 py-2 rounded-full text-[11px] font-semibold
                         uppercase tracking-wider hover:bg-[#014d52]
                         active:scale-95 transition-all"
            >
              Checkout
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
