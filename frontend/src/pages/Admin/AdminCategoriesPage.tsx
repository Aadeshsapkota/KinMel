import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import type { Category } from "../../types/category";
import toast from "react-hot-toast";
import { Input } from "../../components/inputs/Input";
import { Button } from "../../components/buttons/Button";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [iconName, setIconName] = useState("category");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    try {
      await createCategory({
        name,
        imageUrl,
        iconName,
      });
      setName("");
      setImageUrl("");
      await loadCategories();
      toast.success("Category created");
    } catch {
      toast.error("Failed to create category");
    }
  }

  async function handleUpdate() {
    if (!editingCategory) return;
    try {
      await updateCategory(editingCategory.id, {
        name,
        imageUrl,
        iconName,
      });
      setEditingCategory(null);
      setName("");
      setImageUrl("");
      setIconName("category");
      await loadCategories();
      toast.success("Category updated");
    } catch {
      toast.error("Failed to update category");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      await loadCategories();
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    }
  }

  function startEdit(category: Category) {
    setEditingCategory(category);
    setName(category.name);
    setImageUrl(category.imageUrl);
    setIconName(category.iconName || "category");
  }

  function cancelEdit() {
    setEditingCategory(null);
    setName("");
    setImageUrl("");
    setIconName("category");
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="py-8">
        <div className="mb-12 border-b border-ash pb-6">
          <span className="inline-block text-[12px] font-graphik font-bold uppercase tracking-[0.1em] text-ink-black mb-2">
            Catalog
          </span>
          <h1 className="text-[32px] font-nantes text-ink-black tracking-normal">
            Categories
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="rounded-[4px] border border-ash bg-pure-white p-8 shadow-sm sticky top-28">
              <h2 className="mb-6 text-[20px] font-nantes text-ink-black border-b border-ash pb-4">
                {editingCategory ? "Edit Category" : "Create Category"}
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest text-ink-black mb-2">
                    Category Name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Laptops"
                  />
                </div>

                <div>
                  <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest text-ink-black mb-2">
                    Image URL
                  </label>
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest text-ink-black mb-2">
                    Material Icon Name
                  </label>
                  <Input
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    placeholder="laptop"
                  />
                  <p className="mt-2 font-graphik text-[12px] text-smoke">
                    Examples: laptop, desktop_windows, monitor, memory, developer_board, keyboard
                  </p>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button
                    onClick={editingCategory ? handleUpdate : handleCreate}
                    className="flex-1 flex justify-center items-center gap-2"
                  >
                    {editingCategory ? (
                      <><span className="material-symbols-outlined text-[16px]">edit</span> Save Changes</>
                    ) : (
                      <><span className="material-symbols-outlined text-[16px]">add</span> Create Category</>
                    )}
                  </Button>

                  {editingCategory && (
                    <Button variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-8 space-y-6">
            <div className="mb-8">
              <Input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<span className="material-symbols-outlined text-smoke text-[20px]">search</span>}
              />
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center border border-ash rounded-[4px] bg-pure-white">
                <div className="flex flex-col items-center gap-4 text-smoke">
                  <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
                  <span className="font-graphik text-[12px] uppercase tracking-widest animate-pulse">
                    Loading Categories...
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-[4px] border border-ash bg-pure-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-ash/30 font-graphik text-[12px] uppercase tracking-widest text-smoke border-b border-ash">
                      <tr>
                        <th className="px-6 py-4 font-bold w-16">ID</th>
                        <th className="px-6 py-4 font-bold">Icon</th>
                        <th className="px-6 py-4 font-bold">Category</th>
                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ash">
                      {filteredCategories.map((category) => (
                        <tr
                          key={category.id}
                          className="hover:bg-cream-paper transition-colors"
                        >
                          <td className="px-6 py-4 font-graphik text-[12px] text-smoke">
                            #{category.id}
                          </td>
                          <td className="px-6 py-4">
                            <span className="material-symbols-outlined text-ink-black">
                              {category.iconName}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-graphik font-bold text-[14px] text-ink-black">
                            {category.name}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => startEdit(category)}
                                className="p-1.5 rounded-[4px] text-smoke hover:text-ink-black hover:bg-ash/30 transition-all"
                                title="Edit"
                              >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(category.id)}
                                className="p-1.5 rounded-[4px] text-smoke hover:text-charcoal hover:bg-ash/30 transition-all"
                                title="Delete"
                              >
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredCategories.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-12 text-center font-graphik text-[14px] text-smoke"
                          >
                            No categories found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
