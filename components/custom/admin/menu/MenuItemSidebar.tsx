"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCommonMutationApi } from "@/api-hooks/use-api-mutation";

type CategoryItem = {
  _id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
};

type MenuItem = {
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

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type UploadResponse = {
  success: boolean;
  message?: string;
  data: {
    fileName: string;
    imageUrl: string;
  };
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem | null;
  categories: CategoryItem[];
};

type FormState = {
  name: string;
  subtitle: string;
  description: string;
  category: string;
  price: string;
  image: string;
  available: boolean;
};

export function MenuItemSidebar({
  open,
  onOpenChange,
  item,
  categories,
}: Props) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const defaultCategory = useMemo(
    () => categories[0]?.name ?? "",
    [categories],
  );

  const [form, setForm] = useState<FormState>({
    name: "",
    subtitle: "",
    description: "",
    category: "",
    price: "",
    image: "",
    available: true,
  });

  const [newCategory, setNewCategory] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (item) {
      setForm({
        name: item.name ?? "",
        subtitle: item.subtitle ?? "",
        description: item.description ?? "",
        category: item.category ?? defaultCategory,
        price: String(item.price ?? ""),
        image: item.image ?? "",
        available: item.available ?? true,
      });
    } else {
      setForm({
        name: "",
        subtitle: "",
        description: "",
        category: defaultCategory,
        price: "",
        image: "",
        available: true,
      });
    }
  }, [item, open, defaultCategory]);

  const createMenuMutation = useCommonMutationApi<
    ApiResponse<MenuItem>,
    {
      name: string;
      subtitle: string;
      description: string;
      category: string;
      price: number;
      image: string;
      available: boolean;
    }
  >({
    url: "/menu-item",
    method: "POST",
    mutationKey: ["create-menu-item"],
    successMessage: "Menu item created",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      onOpenChange(false);
    },
  });

  const updateMenuMutation = useCommonMutationApi<
    ApiResponse<MenuItem>,
    Partial<{
      name: string;
      subtitle: string;
      description: string;
      category: string;
      price: number;
      image: string;
      available: boolean;
    }>
  >({
    url: item?._id ? `/menu-item?id=${item._id}` : "/menu-items",
    method: "PATCH",
    mutationKey: ["update-menu-item", item?._id ?? "new"],
    successMessage: "Menu item updated",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      onOpenChange(false);
    },
  });
  const uploadImageMutation = useCommonMutationApi<UploadResponse, FormData>({
    url: "/upload/image",
    method: "POST",
    mutationKey: ["upload-image"],
    // no need for JSON headers; body is FormData
  });
  const createCategoryMutation = useCommonMutationApi<
    ApiResponse<CategoryItem>,
    {
      name: string;
      slug: string;
      sortOrder: number;
      isActive: boolean;
    }
  >({
    url: "/category",
    method: "POST",
    mutationKey: ["create-category"],
    successMessage: "Category created",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setNewCategory("");
    },
  });

  const deleteCategoryMutation = useCommonMutationApi<
    ApiResponse<null>,
    string
  >({
    url: "/category",
    method: "DELETE",
    mutationKey: ["delete-category"],
    successMessage: "Category deleted",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });

  const handleSave = () => {
    if (
      !form.name.trim() ||
      !form.category ||
      !form.price ||
      !form.image.trim()
    )
      return;

    const payload = {
      name: form.name.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      category: form.category,
      price: Number(form.price),
      image: form.image.trim(),
      available: form.available,
    };

    if (item?._id) {
      updateMenuMutation.mutate(payload);
      return;
    }

    createMenuMutation.mutate(payload);
  };

  const handleCreateCategory = () => {
    const name = newCategory.trim();
    if (!name) return;

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    createCategoryMutation.mutate({
      name,
      slug,
      sortOrder: categories.length,
      isActive: true,
    });
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    uploadImageMutation.mutate(formData, {
      onSuccess: (data) => {
        console.log("upload-image-data", data);
        setForm((prev) => ({
          ...prev,
          image: data?.data?.data?.imageUrl!,
        }));
        setUploading(false);
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[460px] p-0 overflow-hidden"
      >
        <div className="h-full flex flex-col">
          <SheetHeader className="px-6 py-5 border-b">
            <SheetTitle className="text-left font-serif text-2xl">
              {item ? "Edit Dish" : "Create Dish"}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Image
              </label>

              <div className="relative w-full aspect-video rounded-xl overflow-hidden border bg-stone-100 dark:bg-stone-900">
                {form.image ? (
                  <Image
                    src={form.image}
                    alt="Preview"
                    fill
                    sizes="400px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-stone-400 text-sm">
                    No image selected
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ImagePlus className="mr-2 h-4 w-4" />
                  )}
                  Upload image
                </Button>

                {form.image ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                ) : null}
              </div>

              <Input
                value={form.image}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, image: e.target.value }))
                }
                placeholder="/uploads/your-image.webp"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Name
              </label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Roasted Heritage Duck"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Subtitle
              </label>
              <Input
                value={form.subtitle}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, subtitle: e.target.value }))
                }
                placeholder="Berry reduction, roasted root vegetables..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Description
              </label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={4}
                placeholder="Longer dish description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Category
                </label>
                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Price
                </label>
                <Input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="1800"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="text-sm font-medium">Available</p>
                <p className="text-xs text-stone-500">
                  Show this item on the live menu
                </p>
              </div>
              <Switch
                checked={form.available}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, available: checked }))
                }
              />
            </div>

            <div className="space-y-3 rounded-2xl border p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Manage categories</h4>
                <Plus className="h-4 w-4 text-stone-400" />
              </div>

              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCreateCategory}
                  disabled={!newCategory.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category._id}
                    variant="secondary"
                    className="flex items-center gap-2 px-3 py-1.5"
                  >
                    {category.name}
                    <button
                      type="button"
                      onClick={() =>
                        deleteCategoryMutation.mutate(category._id)
                      }
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t px-6 py-4 flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              className="flex-1 bg-[#01696f] hover:bg-[#014d52]"
              onClick={handleSave}
              disabled={
                !form.name.trim() ||
                !form.category ||
                !form.price ||
                !form.image.trim() ||
                createMenuMutation.isPending ||
                updateMenuMutation.isPending
              }
            >
              {item ? "Save changes" : "Create item"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
