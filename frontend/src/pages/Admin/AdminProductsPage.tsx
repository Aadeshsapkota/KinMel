import { useEffect, useState, useMemo } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import ProductForm from "../../components/common/ProductForm";
import {
  getProducts,
  createProduct,
  updateProduct,
} from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import toast from "react-hot-toast";
import type { Product } from "../../types/product";
import { Input } from "../../components/inputs/Input";
import { Button } from "../../components/buttons/Button";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku?.toLowerCase().includes(search.toLowerCase()),
  );

  const lowStockCount = useMemo(
    () => products.filter((p) => p.stock > 0 && p.stock <= 10).length,
    [products],
  );
  const revenueForecast = useMemo(
    () => products.reduce((sum, p) => sum + p.price * p.stock, 0),
    [products],
  );

  const [categories, setCategories] = useState<Record<number, string>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts({ page: 1, pageSize: 100 }),
          getCategories()
        ]);
        setProducts(productsData);
        
        const categoryMap: Record<number, string> = {};
        categoriesData.forEach(c => {
          categoryMap[c.id] = c.name;
        });
        setCategories(categoryMap);
      } catch {
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleCreate(data: any) {
    try {
      await createProduct(data);
      const updated = await getProducts({ page: 1, pageSize: 100 });
      setProducts(updated);
      setShowCreateForm(false);
      toast.success("Product created");
    } catch {
      toast.error("Failed to create product");
    }
  }

  async function handleUpdate(data: any) {
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct.id, data);
      const updated = await getProducts({ page: 1, pageSize: 100 });
      setProducts(updated);
      setEditingProduct(null);
      toast.success("Product updated");
    } catch {
      toast.error("Failed to update product");
    }
  }

  return (
    <AdminLayout>
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="w-96">
          <Input
            type="text"
            placeholder="Search products, SKUs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<span className="material-symbols-outlined text-smoke text-[20px]">search</span>}
          />
        </div>
      </div>

      {showCreateForm || editingProduct ? (
        <div className="mb-10 rounded-[4px] border border-ash bg-pure-white p-8 relative z-20 shadow-sm">
          <div className="relative z-10">
            {editingProduct ? (
              <ProductForm
                initialData={editingProduct}
                submitText="Save Product"
                onSubmit={handleUpdate}
                onCancel={() => setEditingProduct(null)}
              />
            ) : (
              <ProductForm
                submitText="Save Product"
                onSubmit={handleCreate}
                onCancel={() => setShowCreateForm(false)}
              />
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Header & Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-ash pb-6">
            <div>
              <span className="inline-block text-[12px] font-graphik font-bold uppercase tracking-[0.1em] text-ink-black mb-2">
                Inventory
              </span>
              <h1 className="text-[32px] font-nantes text-ink-black tracking-normal">
                Product Catalog
              </h1>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">filter_list</span> Filters
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">download</span> Export
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-pure-white border border-ash rounded-[4px] p-6 shadow-sm hover:border-ink-black transition-colors">
              <p className="font-graphik text-[12px] font-bold uppercase tracking-widest text-smoke mb-2">
                Total Products
              </p>
              <h2 className="font-nantes text-[36px] text-ink-black">
                {products.length.toLocaleString()}
              </h2>
            </div>
            <div className="bg-pure-white border border-ash rounded-[4px] p-6 shadow-sm hover:border-ink-black transition-colors">
              <p className="font-graphik text-[12px] font-bold uppercase tracking-widest text-smoke mb-2">
                Low Stock Alert
              </p>
              <h2 className="font-nantes text-[36px] text-ink-black">{lowStockCount}</h2>
            </div>
            <div className="bg-pure-white border border-ash rounded-[4px] p-6 shadow-sm hover:border-ink-black transition-colors">
              <p className="font-graphik text-[12px] font-bold uppercase tracking-widest text-smoke mb-2">
                Revenue Forecast
              </p>
              <h2 className="font-nantes text-[36px] text-ink-black">
                रु 
                {revenueForecast.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center border border-ash rounded-[4px] bg-pure-white">
              <div className="flex flex-col items-center gap-4 text-smoke">
                <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
                <span className="font-graphik text-[12px] uppercase tracking-widest animate-pulse">
                  Loading Catalog
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-[4px] border border-ash bg-pure-white shadow-sm overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-ash/30 font-graphik text-[12px] uppercase tracking-widest text-smoke border-b border-ash">
                    <tr>
                      <th className="px-6 py-4 font-bold">Product</th>
                      <th className="px-6 py-4 font-bold">Category</th>
                      <th className="px-6 py-4 font-bold">Price</th>
                      <th className="px-6 py-4 font-bold">Stock Status</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ash">
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-cream-paper transition-colors cursor-pointer"
                        onClick={() => {
                          setEditingProduct(product);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-[2px] bg-cream-paper border border-ash overflow-hidden shrink-0">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover mix-blend-multiply"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-graphik font-bold text-[14px] text-ink-black">
                                {product.name}
                              </p>
                              <p className="text-[12px] font-graphik text-smoke mt-0.5">
                                SKU: {product.sku || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex border border-ash bg-ash/30 px-2 py-1 rounded-[2px] font-graphik text-[10px] font-bold uppercase tracking-widest text-ink-black">
                            {categories[product.categoryId] || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-graphik font-bold text-[14px] text-ink-black">
                          रु 
                          {product.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                product.stock > 10
                                  ? "bg-ink-black"
                                  : product.stock > 0
                                    ? "bg-smoke"
                                    : "bg-charcoal"
                              }`}
                            ></span>
                            <span className="font-graphik text-[14px] text-ink-black">
                              {product.stock > 10
                                ? `In Stock (${product.stock})`
                                : product.stock > 0
                                  ? `Low Stock (${product.stock})`
                                  : "Out of Stock"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-smoke hover:text-ink-black transition-colors p-2">
                            <span className="material-symbols-outlined">more_horiz</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <div className="border-t border-ash bg-pure-white px-6 py-4 flex items-center justify-between">
                <p className="font-graphik text-[14px] text-smoke">
                  Showing 1 to {Math.min(filteredProducts.length, 10)} of{" "}
                  {filteredProducts.length.toLocaleString()} products
                </p>
                <div className="flex gap-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-ash bg-pure-white text-ink-black hover:bg-ash/30 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-[4px] bg-ink-black text-pure-white font-graphik font-bold transition-colors">
                    1
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-transparent hover:bg-ash/30 text-ink-black font-graphik transition-colors">
                    2
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-transparent hover:bg-ash/30 text-ink-black font-graphik transition-colors">
                    3
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-[4px] border border-ash bg-pure-white text-ink-black hover:bg-ash/30 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Expose method to trigger form externally from sidebar */}
      <button
        id="trigger-create-product"
        className="hidden"
        onClick={() => {
          setShowCreateForm(true);
          setEditingProduct(null);
        }}
      />
    </AdminLayout>
  );
}
