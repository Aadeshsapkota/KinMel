import { useEffect, useState } from "react";
import SellerLayout from "../../components/layouts/SellerLayout";
import ProductForm from "../../components/common/ProductForm";
import {
  getSellerProducts,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
} from "../../services/sellerService";
import toast from "react-hot-toast";
import type { Product } from "../../types/product";
import { Input } from "../../components/inputs/Input";
import { Button } from "../../components/buttons/Button";

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await getSellerProducts();
      setProducts(data);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(data: any) {
    try {
      await createSellerProduct(data);
      await loadProducts();
      setShowCreateForm(false);
      toast.success("Product created");
    } catch {
      toast.error("Failed to create product");
    }
  }

  async function handleUpdate(data: any) {
    if (!editingProduct) return;
    try {
      await updateSellerProduct(editingProduct.id, data);
      await loadProducts();
      setEditingProduct(null);
      toast.success("Product updated");
    } catch {
      toast.error("Failed to update product");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteSellerProduct(id);
      await loadProducts();
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  }

  return (
    <SellerLayout>
      {showCreateForm || editingProduct ? (
        <div className="py-8">
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
                  submitText="Create Product"
                  onSubmit={handleCreate}
                  onCancel={() => setShowCreateForm(false)}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-ash pb-6">
            <div>
              <span className="inline-block text-[12px] font-graphik font-bold uppercase tracking-[0.1em] text-ink-black mb-2">
                Inventory
              </span>
              <h1 className="text-[32px] font-nantes text-ink-black tracking-normal">
                Your Products
              </h1>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
            >
              Add Product
            </Button>
          </div>

          <div className="mb-8">
            <Input
              type="text"
              placeholder="Search your products..."
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
                  Loading Products
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-[4px] border border-ash bg-pure-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-ash/30 font-graphik text-[12px] uppercase tracking-widest text-smoke border-b border-ash">
                    <tr>
                      <th className="px-6 py-4 font-bold">
                        Product
                      </th>
                      <th className="px-6 py-4 font-bold">
                        Price
                      </th>
                      <th className="px-6 py-4 font-bold">
                        Stock
                      </th>
                      <th className="px-6 py-4 font-bold text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ash">
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-cream-paper transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-[2px] bg-cream-paper border border-ash overflow-hidden shrink-0">
                              <img
                                src={product.imageUrl || "https://placehold.co/150x150?text=No+Image"}
                                alt={product.name}
                                className="h-full w-full object-cover mix-blend-multiply"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "https://placehold.co/150x150?text=Error";
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-graphik font-bold text-[14px] text-ink-black">
                                {product.name}
                              </p>
                              <p className="font-graphik text-[12px] text-smoke mt-0.5">
                                SKU: {product.sku || "N/A"}
                              </p>
                            </div>
                          </div>
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
                            <span className="font-graphik text-[14px] text-ink-black">{product.stock}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                window.scrollTo({
                                  top: 0,
                                  behavior: "smooth",
                                });
                              }}
                              className="px-3 py-1.5 rounded-[4px] border border-ash bg-pure-white text-[12px] font-graphik font-bold hover:bg-ash/30 transition-all text-ink-black"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-1.5 rounded-[4px] text-smoke hover:text-charcoal hover:bg-ash/30 transition-all"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-12 text-center font-graphik text-[14px] text-smoke"
                        >
                          No products yet. Create your first listing!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </SellerLayout>
  );
}
