"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDebounce } from "use-debounce";
import DishCard from "@/components/custom/common/dish-card";
import { useQueryWrapper } from "@/api-hooks/react-query-wrapper";
import {
  ApiListResponse,
  CategoryItem,
  MenuItem,
} from "@/components/custom/admin/menu/MenuItemsPage";
import { useCartStore } from "@/store/use-cart-store"; // ← import store

function DishCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 animate-pulse">
      <div className="aspect-[4/3] bg-stone-200 dark:bg-stone-800" />
      <div className="p-3 md:p-4 space-y-2">
        <div className="h-4 w-2/3 rounded bg-stone-200 dark:bg-stone-800" />
        <div className="h-3 w-full rounded bg-stone-200 dark:bg-stone-800" />
        <div className="h-3 w-3/4 rounded bg-stone-200 dark:bg-stone-800" />
        <div className="h-4 w-16 rounded bg-stone-200 dark:bg-stone-800 pt-1" />
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);

  const cartCount = useCartStore((state) => state.totalItems());
  const cartTotal = useCartStore((state) => state.totalPrice());

  const { data: categoryRes, isLoading: isCategoryLoading } = useQueryWrapper<
    ApiListResponse<CategoryItem[]>
  >(["categories"], "/category");

  const query = new URLSearchParams();
  if (activeCategory !== "All") query.set("category", activeCategory);
  if (debouncedSearch.trim()) query.set("search", debouncedSearch.trim());
  query.set("page", String(page));

  const { data: menuRes, isLoading: isMenuLoading } = useQueryWrapper<
    ApiListResponse<MenuItem[]>
  >(
    ["menu-items", page, debouncedSearch, activeCategory],
    `/menu-item?${query.toString()}`,
  );

  const pagination = menuRes?.pagination;
  const currentPage = pagination?.page ?? page;
  const totalPages = pagination?.totalPages ?? 1;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getVisiblePages = () => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <main className="pt-20 pb-32 px-4 md:px-6 container mx-auto">
      <header className="mb-8 md:mb-12">
        <h1 className="font-serif italic text-4xl md:text-6xl text-[#01696f] dark:text-teal-400 mb-2 md:mb-3">
          Our Culinary Story
        </h1>
        <p className="text-stone-500 dark:text-stone-400 max-w-xl text-base md:text-lg font-light">
          Every dish is a chapter in our heritage, crafted with the finest
          ingredients and a passion for artisanal flavours.
        </p>
      </header>

      <section className="mb-8">
        <div className="flex flex-col gap-4">
          <div className="relative w-full md:w-80 group">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#01696f] transition-colors"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search dishes..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-100 dark:bg-stone-800 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#01696f]/20 text-sm text-stone-700 dark:text-stone-300 placeholder:text-stone-400 transition-all"
            />
          </div>

          <div className="relative">
            <div className="overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="flex w-max min-w-full items-center gap-2 py-1">
                <button
                  onClick={() => {
                    setActiveCategory("All");
                    setPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-colors shrink-0
                  ${
                    activeCategory === "All"
                      ? "bg-[#01696f] text-white"
                      : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"
                  }`}
                >
                  All
                </button>

                {isCategoryLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-8 w-20 rounded-full bg-stone-100 dark:bg-stone-800 animate-pulse shrink-0"
                      />
                    ))
                  : categoryRes?.data?.map((cat) => (
                      <button
                        key={cat?._id}
                        onClick={() => {
                          setActiveCategory(cat?.name);
                          setPage(1);
                        }}
                        className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-colors shrink-0
                        ${
                          activeCategory === cat?.name
                            ? "bg-[#01696f] text-white"
                            : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"
                        }`}
                      >
                        {cat?.name}
                      </button>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {isMenuLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <DishCardSkeleton key={i} />
          ))}
        </div>
      ) : (menuRes?.data?.length ?? 0) > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {menuRes?.data?.map((item) => (
              <DishCard
                key={item._id}
                id={item._id}
                name={item.name}
                subtitle={item.subtitle ?? ""}
                price={item?.price?.toString()}
                priceNum={item.price}
                image={item.image}
                category={item.category}
                chefsPick={item.chefsPick}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination?.hasPrevPage}
                className="h-9 px-3 rounded-full border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              {getVisiblePages().map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`h-9 min-w-9 px-3 rounded-full text-sm font-medium transition-colors
                  ${
                    currentPage === p
                      ? "bg-[#01696f] text-white"
                      : "border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination?.hasNextPage}
                className="h-9 px-3 rounded-full border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
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

      {cartCount > 0 && (
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
                  {cartCount}
                </span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                  Your Selection
                </span>
                <span className="text-xs font-bold text-[#01696f]">
                  ৳{cartTotal.toLocaleString()}
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
