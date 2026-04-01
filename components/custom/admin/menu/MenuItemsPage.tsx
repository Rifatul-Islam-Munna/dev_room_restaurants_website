"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQueryWrapper } from "@/api-hooks/react-query-wrapper";
import { useCommonMutationApi } from "@/api-hooks/use-api-mutation";
import { PatchRequestAxios } from "@/api-hooks/api-hooks";
import { MenuItemSidebar } from "./MenuItemSidebar";

export type CategoryItem = {
  _id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
};

export type MenuItem = {
  _id: string;
  name: string;
  subtitle?: string;
  description?: string;
  category: string;
  price: number;
  image: string;
  available: boolean;
  chefsPick?: boolean;
};

export type ApiListResponse<T> = {
  success: boolean;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export default function MenuItemsPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [page, setPage] = useState(1);

  const menuUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "12");

    if (search.trim()) params.set("search", search.trim());
    if (activeCategory !== "All") params.set("category", activeCategory);

    return `/menu-item?${params.toString()}`;
  }, [page, search, activeCategory]);

  const { data: menuRes, isLoading } = useQueryWrapper<
    ApiListResponse<MenuItem[]>
  >(["menu-items", page, search, activeCategory], menuUrl);

  const { data: categoryRes } = useQueryWrapper<
    ApiListResponse<CategoryItem[]>
  >(["categories"], "/category");

  const items = menuRes?.data ?? [];
  const categories = categoryRes?.data ?? [];
  const tabs = ["All", ...categories.map((c) => c.name)];

  const deleteMenuMutation = useCommonMutationApi<
    { success: boolean; message: string },
    string
  >({
    url: "/menu-item",
    method: "DELETE",
    mutationKey: ["delete-menu-item"],
    successMessage: "Menu item deleted",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });

  const openCreate = () => {
    setSelectedItem(null);
    setOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const toggleAvailability = async (item: MenuItem) => {
    const [res, err] = await PatchRequestAxios(`/menu-items?id=${item._id}`, {
      available: !item.available,
    });

    if (!err && res) {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif italic text-3xl text-stone-800 dark:text-stone-100">
            Menu Items
          </h1>
          <p className="text-xs text-stone-400 mt-0.5 italic">
            Manage dishes, categories, and image uploads from one control panel.
          </p>
        </div>

        <Button
          onClick={openCreate}
          className="rounded-full bg-[#01696f] hover:bg-[#014d52] text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-1 flex-wrap bg-stone-100 dark:bg-stone-800 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveCategory(tab);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeCategory === tab
                  ? "bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100"
                  : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search menu..."
            className="pl-9 rounded-xl"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center text-sm text-stone-400 italic">
          Loading menu items...
        </div>
      ) : items.length === 0 ? (
        <div className="py-24 text-center text-sm text-stone-400 italic">
          No menu items found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((item) => (
              <div
                key={item._id}
                className={`group relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 ${
                  !item.available ? "opacity-60" : ""
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <Badge className="absolute top-3 left-3 rounded-full bg-white/90 text-stone-800 hover:bg-white">
                    {item.category}
                  </Badge>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-serif text-base text-stone-800 dark:text-stone-100 leading-tight">
                      {item.name}
                    </h4>
                    <span className="font-serif text-base text-[#01696f] dark:text-teal-400 shrink-0 tabular-nums">
                      ৳{item.price.toLocaleString()}
                    </span>
                  </div>

                  {item.subtitle ? (
                    <p className="text-[11px] text-stone-500 mb-1">
                      {item.subtitle}
                    </p>
                  ) : null}

                  <p className="text-[11px] text-stone-400 leading-relaxed line-clamp-2 mb-4">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.available}
                        onChange={() => toggleAvailability(item)}
                        className="sr-only"
                      />
                      <span className="text-[10px] font-bold uppercase text-stone-400">
                        {item.available ? "Available" : "Unavailable"}
                      </span>
                    </label>

                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 rounded-lg text-stone-300 dark:text-stone-600 hover:text-[#01696f] dark:hover:text-teal-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil size={13} />
                      </button>

                      <button
                        onClick={() => deleteMenuMutation.mutate(item._id)}
                        className="p-1.5 rounded-lg text-stone-300 dark:text-stone-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {menuRes?.pagination && menuRes.pagination.totalPages > 1 ? (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                disabled={!menuRes.pagination.hasPrevPage}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>

              <span className="text-sm text-stone-500">
                Page {menuRes.pagination.page} / {menuRes.pagination.totalPages}
              </span>

              <Button
                variant="outline"
                disabled={!menuRes.pagination.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          ) : null}
        </>
      )}

      <MenuItemSidebar
        open={open}
        onOpenChange={setOpen}
        item={selectedItem}
        categories={categories}
      />
    </div>
  );
}
