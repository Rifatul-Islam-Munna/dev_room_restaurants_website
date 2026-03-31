"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Plus, Pencil, Trash2, X, ImageIcon } from "lucide-react";

type Category = "Starters" | "Main Course" | "Pasta" | "Dessert" | "Beverage";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  category: Category;
  price: number;
  image: string;
  available: boolean;
};

const CATEGORIES: Category[] = [
  "Starters",
  "Main Course",
  "Pasta",
  "Dessert",
  "Beverage",
];

const INITIAL_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: "Roasted Heritage Duck",
    description: "Berry reduction, roasted root vegetables, pan jus.",
    category: "Main Course",
    price: 3800,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
    available: true,
  },
  {
    id: 2,
    name: "Wild Mushroom Risotto",
    description: "Arborio rice, porcini, shaved truffle, aged parmigiano.",
    category: "Main Course",
    price: 2900,
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=600&auto=format&fit=crop",
    available: true,
  },
  {
    id: 3,
    name: "Obsidian Soufflé",
    description: "Dark Valrhona chocolate, raspberry dust, crème anglaise.",
    category: "Dessert",
    price: 1600,
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=600&auto=format&fit=crop",
    available: false,
  },
  {
    id: 4,
    name: "Wild Atlantic Poke Bowl",
    description: "Sustainably sourced salmon, citrus ponzu, black rice.",
    category: "Starters",
    price: 1250,
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop",
    available: true,
  },
  {
    id: 5,
    name: "Truffle Tagliatelle",
    description: "Hand-rolled pasta, Umbrian summer truffles, parmigiano.",
    category: "Pasta",
    price: 2100,
    image:
      "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?q=80&w=600&auto=format&fit=crop",
    available: true,
  },
  {
    id: 6,
    name: "Single Origin Espresso",
    description: "Ethiopian Yirgacheffe, jasmine and citrus notes.",
    category: "Beverage",
    price: 350,
    image:
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=600&auto=format&fit=crop",
    available: true,
  },
  {
    id: 7,
    name: "Burrata & Heritage Tomato",
    description: "Stracciatella, aged balsamic, sea salt, micro basil.",
    category: "Starters",
    price: 980,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop",
    available: true,
  },
  {
    id: 8,
    name: "Wood-Fired Margherita",
    description: "San Marzano tomato, fior di latte, fresh basil.",
    category: "Main Course",
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop",
    available: true,
  },
];

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "Starters" as Category,
  price: "",
  image: "",
  available: true,
};

type FilterTab = "All" | Category;

const CAT_COLORS: Record<Category, string> = {
  Starters: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  "Main Course":
    "bg-teal-50 dark:bg-teal-900/20 text-[#01696f] dark:text-teal-400",
  Pasta: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
  Dessert: "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
  Beverage: "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400",
};

export default function MenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>(INITIAL_ITEMS);
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [search, setSearch] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  /* ── Derived ── */
  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchTab = activeTab === "All" || i.category === activeTab;
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [items, activeTab, search]);

  const TABS: FilterTab[] = ["All", ...CATEGORIES];

  /* ── Handlers ── */
  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setPanelOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      category: item.category,
      price: String(item.price),
      image: item.image,
      available: item.available,
    });
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price) return;
    if (editingId !== null) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editingId ? { ...i, ...form, price: Number(form.price) } : i,
        ),
      );
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...form,
          price: Number(form.price),
        },
      ]);
    }
    closePanel();
  };

  const confirmDelete = (id: number) => setDeleteId(id);

  const handleDelete = () => {
    if (deleteId !== null) {
      setItems((prev) => prev.filter((i) => i.id !== deleteId));
      setDeleteId(null);
    }
  };

  const toggleAvailable = (id: number) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, available: !i.available } : i)),
    );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif italic text-3xl text-stone-800 dark:text-stone-100">
            Menu Items
          </h1>
          <p className="text-xs text-stone-400 mt-0.5 italic">
            Manage the editorial selection for the current season.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#01696f] text-white
                     px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider
                     hover:bg-[#014d52] active:scale-95 transition-all shrink-0"
        >
          <Plus size={14} />
          Add New
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-1 flex-wrap bg-stone-100 dark:bg-stone-800 rounded-xl p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                ${
                  activeTab === tab
                    ? "bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100"
                    : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-stone-900
                       border border-stone-200 dark:border-stone-700 rounded-xl w-56
                       text-stone-700 dark:text-stone-200
                       placeholder:text-stone-300 dark:placeholder:text-stone-600
                       focus:outline-none focus:ring-2 focus:ring-[#01696f]/20 transition-all"
          />
        </div>
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center text-sm text-stone-400 italic">
          No menu items found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`group relative bg-white dark:bg-stone-900
                          border border-stone-200 dark:border-stone-800
                          rounded-2xl overflow-hidden transition-all duration-300
                          hover:-translate-y-0.5
                          ${!item.available ? "opacity-60" : ""}`}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Category badge */}
                <span
                  className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${CAT_COLORS[item.category]}`}
                >
                  {item.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-serif text-base text-stone-800 dark:text-stone-100 leading-tight">
                    {item.name}
                  </h4>
                  <span className="font-serif text-base text-[#01696f] dark:text-teal-400 shrink-0 tabular-nums">
                    ৳{item.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed line-clamp-2 mb-4">
                  {item.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
                  {/* Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={item.available}
                        onChange={() => toggleAvailable(item.id)}
                        className="sr-only peer"
                      />
                      <div
                        className="w-8 h-4 bg-stone-200 dark:bg-stone-700 rounded-full
                                      peer-checked:bg-[#01696f] transition-colors"
                      />
                      <div
                        className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full
                                      transition-transform peer-checked:translate-x-4"
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-stone-400">
                      {item.available ? "Available" : "Unavailable"}
                    </span>
                  </label>

                  {/* Actions */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg text-stone-300 dark:text-stone-600
                                 hover:text-[#01696f] dark:hover:text-teal-400
                                 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => confirmDelete(item.id)}
                      className="p-1.5 rounded-lg text-stone-300 dark:text-stone-600
                                 hover:text-red-400
                                 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
      )}

      {/* ── Add / Edit slide panel ── */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-stone-900/30 dark:bg-stone-900/60 backdrop-blur-sm"
            onClick={closePanel}
          />
          <div
            className="w-full max-w-md bg-white dark:bg-stone-900 h-full flex flex-col
                          border-l border-stone-200 dark:border-stone-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-serif text-xl text-stone-800 dark:text-stone-100">
                {editingId ? "Edit Dish" : "Curate New Dish"}
              </h3>
              <button
                onClick={closePanel}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-700
                           hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Image preview */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                {form.image ? (
                  <Image
                    src={form.image}
                    alt="Preview"
                    fill
                    sizes="400px"
                    className="object-cover"
                    onError={() => setForm((f) => ({ ...f, image: "" }))}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-stone-300">
                    <ImageIcon size={28} />
                    <span className="text-[11px]">
                      Paste an Unsplash URL below
                    </span>
                  </div>
                )}
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400">
                  Image URL (Unsplash)
                </label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, image: e.target.value }))
                  }
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-stone-100 dark:bg-stone-800 rounded-lg px-4 py-2.5
                             text-sm text-stone-700 dark:text-stone-200
                             placeholder:text-stone-300 border border-transparent
                             focus:outline-none focus:ring-2 focus:ring-[#01696f]/20 transition-all"
                />
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400">
                  Dish Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Lavender Infused Seabass"
                  className="w-full bg-stone-100 dark:bg-stone-800 rounded-lg px-4 py-2.5
                             text-sm text-stone-700 dark:text-stone-200
                             placeholder:text-stone-300 border border-transparent
                             focus:outline-none focus:ring-2 focus:ring-[#01696f]/20 transition-all"
                />
              </div>

              {/* Category + Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        category: e.target.value as Category,
                      }))
                    }
                    className="w-full bg-stone-100 dark:bg-stone-800 rounded-lg px-4 py-2.5
                               text-sm text-stone-700 dark:text-stone-200 border border-transparent
                               focus:outline-none focus:ring-2 focus:ring-[#01696f]/20 transition-all appearance-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400">
                    Price (৳) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                    placeholder="0"
                    min="0"
                    className="w-full bg-stone-100 dark:bg-stone-800 rounded-lg px-4 py-2.5
                               text-sm text-stone-700 dark:text-stone-200
                               placeholder:text-stone-300 border border-transparent
                               focus:outline-none focus:ring-2 focus:ring-[#01696f]/20 transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Describe the flavor profile, sourcing, and preparation..."
                  rows={3}
                  className="w-full bg-stone-100 dark:bg-stone-800 rounded-lg px-4 py-2.5
                             text-sm text-stone-700 dark:text-stone-200
                             placeholder:text-stone-300 border border-transparent resize-none
                             focus:outline-none focus:ring-2 focus:ring-[#01696f]/20 transition-all"
                />
              </div>

              {/* Availability toggle */}
              <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-stone-700 dark:text-stone-200">
                    Immediate Availability
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Visible on the live menu front-end.
                  </p>
                </div>
                <label className="cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={form.available}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, available: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div
                      className="w-10 h-5 bg-stone-200 dark:bg-stone-700 rounded-full
                                    peer-checked:bg-[#01696f] transition-colors"
                    />
                    <div
                      className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full
                                    transition-transform peer-checked:translate-x-5"
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-stone-100 dark:border-stone-800 flex gap-3">
              <button
                onClick={closePanel}
                className="flex-1 py-3 text-xs font-bold uppercase tracking-widest
                           text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim() || !form.price}
                className="flex-[2] py-3 bg-[#01696f] text-white rounded-full
                           text-xs font-bold uppercase tracking-widest
                           hover:bg-[#014d52] active:scale-95 transition-all
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {editingId ? "Save Changes" : "Publish to Menu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm modal ── */}
      {deleteId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4
                        bg-stone-900/30 dark:bg-stone-900/60 backdrop-blur-sm"
        >
          <div
            className="bg-white dark:bg-stone-900 rounded-2xl p-6 max-w-sm w-full
                          border border-stone-200 dark:border-stone-800"
          >
            <h3 className="font-serif text-lg text-stone-800 dark:text-stone-100 mb-2">
              Remove this dish?
            </h3>
            <p className="text-sm text-stone-400 mb-6">
              This will permanently remove{" "}
              <span className="font-semibold text-stone-600 dark:text-stone-300">
                {items.find((i) => i.id === deleteId)?.name}
              </span>{" "}
              from the menu. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 text-xs font-bold uppercase tracking-widest
                           text-stone-400 border border-stone-200 dark:border-stone-700
                           rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-full
                           text-xs font-bold uppercase tracking-widest
                           hover:bg-red-600 active:scale-95 transition-all"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
