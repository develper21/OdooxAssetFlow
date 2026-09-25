import { useEffect, useState } from "react";
import {
  Tag,
  Laptop,
  Tv,
  Armchair,
  Car,
  Monitor,
  Wrench,
  Smartphone,
  Headphones,
  Server,
  HardDrive,
  Plus,
} from "lucide-react";
import { NeuCard, PageHeader } from "@/components/layout/ui";
import { toast } from "sonner";
import { categoriesApi } from "@/lib/api";
import type { AssetCategory, FormRecord } from "@/types";

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

function getCategoryIcon(name: string = "") {
  const lower = name.toLowerCase();
  if (lower.includes("laptop") || lower.includes("notebook") || lower.includes("macbook"))
    return Laptop;
  if (
    lower.includes("projector") ||
    lower.includes("display") ||
    lower.includes("screen") ||
    lower.includes("tv")
  )
    return Tv;
  if (
    lower.includes("furniture") ||
    lower.includes("chair") ||
    lower.includes("desk") ||
    lower.includes("table")
  )
    return Armchair;
  if (
    lower.includes("vehicle") ||
    lower.includes("car") ||
    lower.includes("truck") ||
    lower.includes("auto")
  )
    return Car;
  if (lower.includes("monitor") || lower.includes("desktop")) return Monitor;
  if (lower.includes("tool") || lower.includes("equipment") || lower.includes("repair"))
    return Wrench;
  if (lower.includes("mobile") || lower.includes("phone") || lower.includes("smartphone"))
    return Smartphone;
  if (lower.includes("audio") || lower.includes("headphone") || lower.includes("speaker"))
    return Headphones;
  if (lower.includes("server") || lower.includes("network") || lower.includes("router"))
    return Server;
  if (lower.includes("storage") || lower.includes("drive") || lower.includes("disk"))
    return HardDrive;
  return Tag;
}

function CategoriesPage() {
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await categoriesApi.getAll();
        setCategories(data.categories || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const data: FormRecord = Object.fromEntries(formData.entries());

      await categoriesApi.create(data);
      toast.success("Category created successfully");
      setShowForm(false);
      // Refresh categories
      const categoriesData = await categoriesApi.getAll();
      setCategories(categoriesData.categories || []);
    } catch (error: unknown) {
      console.error("Failed to create category:", error);
      toast.error(toErrorMessage(error) || "Failed to create category");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Categories"
        subtitle="Classify assets to enable filtering, reporting, and lifecycle rules."
        actions={
          <button
            onClick={() => setShowForm((v) => !v)}
            className="neu-accent inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" /> New category
          </button>
        }
      />

      {showForm && (
        <NeuCard>
          <h3 className="mb-4 text-lg font-semibold">Create new category</h3>
          <form onSubmit={handleCreateCategory} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { l: "Category name", p: "Laptops", n: "name" },
              { l: "Category code", p: "LAP", n: "code" },
              { l: "Description", p: "Category description", n: "description" },
            ].map((f) => (
              <label key={f.n} className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                  {f.l}
                </span>
                <input
                  name={f.n}
                  type="text"
                  placeholder={f.p}
                  className="neu-inset w-full rounded-xl bg-transparent px-3 py-2.5 text-sm outline-none"
                />
              </label>
            ))}
            <div className="md:col-span-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="neu-sm rounded-xl px-4 py-2.5 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="neu-accent rounded-xl px-4 py-2.5 text-sm font-semibold"
              >
                Create category
              </button>
            </div>
          </form>
        </NeuCard>
      )}

      {loading ? (
        <div className="text-center text-muted-foreground py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => {
            const CategoryIcon = getCategoryIcon(c.name);
            return (
              <NeuCard key={c._id} className="text-center">
                <div className="neu-inset mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl text-primary">
                  <CategoryIcon className="h-5 w-5" />
                </div>
                <div className="font-semibold">{c.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {c.assetCount || c.count || 0} items
                </div>
              </NeuCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;
