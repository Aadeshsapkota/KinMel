import { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";
import type { Category } from "../../types/category";
import { uploadImage } from "../../services/uploadService";
import { Input } from "../inputs/Input";
import { Button } from "../buttons/Button";

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;

  compareAtPrice?: number;
  installmentPlan?: string;
  images?: string[];
  brand?: string;
  isActive?: boolean;
  sku?: string;
  trackQuantity?: boolean;
  continueSellingWhenOutOfStock?: boolean;
  urlHandle?: string;
  metaDescription?: string;
  productType?: string;
  vendor?: string;
  tags?: string[];
  variants?: string;
  specifications?: string;
  features?: string[];
}

interface Props {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  submitText: string;
}

function parseVariantsToJSON(text: string): string {
  if (!text.trim()) return "";
  try {
    JSON.parse(text);
    return text;
  } catch {
    const lines = text.split('\n');
    const obj: Record<string, string[]> = {};
    for (const line of lines) {
      if (!line.includes(':')) continue;
      const [key, val] = line.split(':');
      if (key && val) {
        obj[key.trim()] = val.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    return JSON.stringify(obj);
  }
}

function parseVariantsFromJSON(json: string): string {
  if (!json) return "";
  try {
    const obj = JSON.parse(json);
    return Object.entries(obj).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n');
  } catch {
    return json;
  }
}

function parseSpecsToJSON(text: string): string {
  if (!text.trim()) return "";
  try {
    JSON.parse(text);
    return text;
  } catch {
    const lines = text.split('\n');
    const obj: Record<string, string> = {};
    for (const line of lines) {
      if (!line.includes(':')) continue;
      const [key, ...valParts] = line.split(':');
      if (key) {
        obj[key.trim()] = valParts.join(':').trim();
      }
    }
    return JSON.stringify(obj);
  }
}

function parseSpecsFromJSON(json: string): string {
  if (!json) return "";
  try {
    const obj = JSON.parse(json);
    return Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join('\n');
  } catch {
    return json;
  }
}

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  submitText,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<ProductFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    imageUrl: initialData?.imageUrl || "",
    categoryId: initialData?.categoryId || 1,
    compareAtPrice: initialData?.compareAtPrice || undefined,
    brand: initialData?.brand || "",
    isActive: initialData?.isActive ?? true,
    sku: initialData?.sku || "",
    trackQuantity: initialData?.trackQuantity ?? true,
    continueSellingWhenOutOfStock: initialData?.continueSellingWhenOutOfStock ?? false,
    urlHandle: initialData?.urlHandle || "",
    metaDescription: initialData?.metaDescription || "",
    productType: initialData?.productType || "",
    vendor: initialData?.vendor || "",
    tags: initialData?.tags || [],
    variants: parseVariantsFromJSON(initialData?.variants || ""),
    specifications: parseSpecsFromJSON(initialData?.specifications || ""),
    images: initialData?.images || [],
  });

  useEffect(() => {
    async function load() {
      const data = await getCategories();
      setCategories(data);
    }
    load();
  }, []);

  function updateField<K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleImageUpload(file: File) {
    try {
      setUploading(true);
      const imageUrl = await uploadImage(file);
      updateField("imageUrl", imageUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      className="text-ink-black space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          ...form,
          variants: parseVariantsToJSON(form.variants || ""),
          specifications: parseSpecsToJSON(form.specifications || "")
        });
      }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-ash">
        <div>
          <h2 className="text-[24px] font-nantes text-ink-black">
            {initialData ? "Edit Product" : "Create New Listing"}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Discard
          </Button>
          <Button type="submit">
            {submitText}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Basic Information */}
          <div className="bg-pure-white border border-ash rounded-[4px] p-8">
            <h3 className="text-[18px] font-nantes mb-6 flex items-center gap-2 text-ink-black">
              <span className="material-symbols-outlined text-[20px]">info</span> Basic Information
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest mb-2 text-ink-black">Product Name</label>
                <Input
                  placeholder="e.g. Minimalist Ceramic Vase"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest mb-2 text-ink-black">Description</label>
                <textarea
                  className="w-full min-h-[120px] rounded-[4px] border border-ash bg-pure-white px-4 py-3 text-[16px] font-graphik text-ink-black focus:border-ink-black focus:ring-1 focus:ring-ink-black outline-none transition-all placeholder:text-smoke resize-none"
                  placeholder="Write a detailed product description..."
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest mb-2 text-ink-black">Category</label>
                  <select
                    className="w-full h-[52px] rounded-[4px] border border-ash bg-pure-white px-4 text-[16px] font-graphik text-ink-black focus:border-ink-black focus:ring-1 focus:ring-ink-black outline-none transition-all"
                    value={form.categoryId}
                    onChange={(e) => updateField("categoryId", Number(e.target.value))}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest mb-2 text-ink-black">Brand</label>
                  <Input
                    placeholder="e.g. Faire"
                    value={form.brand}
                    onChange={(e) => updateField("brand", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Media Gallery */}
          <div className="bg-pure-white border border-ash rounded-[4px] p-8">
            <h3 className="text-[18px] font-nantes mb-6 flex items-center gap-2 text-ink-black">
              <span className="material-symbols-outlined text-[20px]">image</span> Media Gallery
            </h3>
            <div className="relative group mb-6">
              <div className={`absolute inset-0 border border-dashed rounded-[4px] transition-colors pointer-events-none ${uploading ? 'border-ink-black bg-ash/10' : 'border-ash group-hover:border-ink-black bg-cream-paper'}`}></div>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
              <div className="p-8 flex flex-col items-center justify-center text-center h-48 rounded-[4px]">
                {uploading ? (
                  <>
                    <span className="material-symbols-outlined text-4xl animate-spin text-smoke mb-4">refresh</span>
                    <p className="font-graphik text-[12px] font-bold uppercase tracking-widest text-ink-black">Uploading Image...</p>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[32px] text-smoke mb-4 group-hover:text-ink-black transition-colors">upload</span>
                    <p className="font-graphik text-[14px] font-bold text-ink-black">Drag and drop product image here</p>
                    <p className="font-graphik text-[12px] text-smoke mt-2">Supports: JPG, PNG, WEBP (Max 5MB)</p>
                  </>
                )}
              </div>
            </div>
            {form.imageUrl && (
              <div className="flex gap-4 mb-6">
                <div className="h-24 w-24 rounded-[4px] border border-ash bg-cream-paper overflow-hidden relative">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover mix-blend-multiply" />
                </div>
              </div>
            )}
            <div>
              <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest mb-2 text-ink-black">Direct Image URL (Fallback)</label>
              <Input
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) => updateField("imageUrl", e.target.value)}
              />
            </div>
          </div>

          {/* Variants */}
          <div className="bg-pure-white border border-ash rounded-[4px] p-8">
            <h3 className="text-[18px] font-nantes mb-6 flex items-center gap-2 text-ink-black">
              <span className="material-symbols-outlined text-[20px]">layers</span> Variants
            </h3>
            <textarea
              className="w-full min-h-[120px] rounded-[4px] border border-ash bg-pure-white px-4 py-3 text-[14px] font-graphik text-ink-black focus:border-ink-black focus:ring-1 focus:ring-ink-black outline-none transition-all placeholder:text-smoke resize-none"
              placeholder="Color: Cream, Charcoal&#10;Size: Small, Medium, Large"
              value={form.variants}
              onChange={(e) => updateField("variants", e.target.value)}
            />
            <p className="font-graphik text-[12px] text-smoke mt-2">Format: OptionName: val1, val2</p>
          </div>

          {/* Technical Specifications */}
          <div className="bg-pure-white border border-ash rounded-[4px] p-8">
            <h3 className="text-[18px] font-nantes mb-6 flex items-center gap-2 text-ink-black">
              <span className="material-symbols-outlined text-[20px]">memory</span> Specifications
            </h3>
            <textarea
              className="w-full min-h-[120px] rounded-[4px] border border-ash bg-pure-white px-4 py-3 text-[14px] font-graphik text-ink-black focus:border-ink-black focus:ring-1 focus:ring-ink-black outline-none transition-all placeholder:text-smoke resize-none"
              placeholder="Material: Ceramic&#10;Dimensions: 10x10x20 cm"
              value={form.specifications}
              onChange={(e) => updateField("specifications", e.target.value)}
            />
            <p className="font-graphik text-[12px] text-smoke mt-2">Format: SpecName: SpecValue</p>
          </div>

          {/* Features */}
          <div className="bg-pure-white border border-ash rounded-[4px] p-8">
            <h3 className="text-[18px] font-nantes mb-6 flex items-center gap-2 text-ink-black">
              <span className="material-symbols-outlined text-[20px]">check_circle</span> Key Features
            </h3>
            <textarea
              className="w-full min-h-[120px] rounded-[4px] border border-ash bg-pure-white px-4 py-3 text-[14px] font-graphik text-ink-black focus:border-ink-black focus:ring-1 focus:ring-ink-black outline-none transition-all placeholder:text-smoke resize-none"
              placeholder="Handmade in Italy&#10;Dishwasher safe"
              value={form.features?.join('\n') || ""}
              onChange={(e) => updateField("features", e.target.value.split('\n').filter(Boolean))}
            />
            <p className="font-graphik text-[12px] text-smoke mt-2">One feature per line</p>
          </div>

          {/* Extra Images Gallery */}
          <div className="bg-pure-white border border-ash rounded-[4px] p-8">
            <h3 className="text-[18px] font-nantes mb-6 flex items-center gap-2 text-ink-black">
              <span className="material-symbols-outlined text-[20px]">collections</span> Extra Gallery Images
            </h3>
            <textarea
              className="w-full min-h-[120px] rounded-[4px] border border-ash bg-pure-white px-4 py-3 text-[14px] font-graphik text-ink-black focus:border-ink-black focus:ring-1 focus:ring-ink-black outline-none transition-all placeholder:text-smoke resize-none"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              value={form.images?.join('\n') || ""}
              onChange={(e) => updateField("images", e.target.value.split('\n').filter(Boolean))}
            />
            <p className="font-graphik text-[12px] text-smoke mt-2">Paste image URLs, one per line.</p>
          </div>

        </div>

        {/* Right Column (Side Info) */}
        <div className="space-y-8">
          
          {/* Status */}
          <div className="bg-pure-white border border-ash rounded-[4px] p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-nantes flex items-center gap-2 text-ink-black">
                <span className="material-symbols-outlined text-[18px]">visibility</span> Status
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={form.isActive}
                  onChange={(e) => updateField("isActive", e.target.checked)}
                />
                <div className="w-11 h-6 bg-ash peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-pure-white after:border-ash after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ink-black"></div>
                <span className="ml-3 font-graphik text-[14px] font-bold text-ink-black">{form.isActive ? 'Active' : 'Draft'}</span>
              </label>
            </div>
            <p className="font-graphik text-[12px] text-smoke leading-relaxed">
              When active, this product will be visible in your online store and marketplace channels.
            </p>
          </div>

          {/* Pricing */}
          <div className="bg-pure-white border border-ash rounded-[4px] p-8 space-y-6">
            <h3 className="text-[16px] font-nantes flex items-center gap-2 text-ink-black">
              <span className="material-symbols-outlined text-[18px]">payments</span> Pricing
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest mb-2 text-ink-black">Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-graphik text-[16px] text-smoke">रु </span>
                  <input
                    type="number"
                    className="w-full h-[52px] rounded-[4px] border border-ash bg-pure-white pl-10 pr-4 text-[16px] font-graphik text-ink-black focus:border-ink-black focus:ring-1 focus:ring-ink-black outline-none transition-all placeholder:text-smoke"
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) => updateField("price", Number(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest mb-2 text-ink-black">Compare at price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-graphik text-[16px] text-smoke">रु </span>
                  <input
                    type="number"
                    className="w-full h-[52px] rounded-[4px] border border-ash bg-pure-white pl-10 pr-4 text-[16px] font-graphik text-ink-black focus:border-ink-black focus:ring-1 focus:ring-ink-black outline-none transition-all placeholder:text-smoke"
                    placeholder="0.00"
                    value={form.compareAtPrice || ""}
                    onChange={(e) => updateField("compareAtPrice", e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-pure-white border border-ash rounded-[4px] p-8 space-y-6">
            <h3 className="text-[16px] font-nantes flex items-center gap-2 text-ink-black">
              <span className="material-symbols-outlined text-[18px]">inventory_2</span> Inventory
            </h3>
            <div>
              <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest mb-2 text-ink-black">Stock Quantity</label>
              <Input
                type="number"
                placeholder="0"
                value={form.stock}
                onChange={(e) => updateField("stock", Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-4 pt-2 border-t border-ash">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-ink-black border-ash rounded-[2px] focus:ring-ink-black bg-pure-white"
                  checked={form.trackQuantity}
                  onChange={(e) => updateField("trackQuantity", e.target.checked)}
                />
                <span className="font-graphik text-[14px] text-ink-black">Track quantity</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-ink-black border-ash rounded-[2px] focus:ring-ink-black bg-pure-white"
                  checked={form.continueSellingWhenOutOfStock}
                  onChange={(e) => updateField("continueSellingWhenOutOfStock", e.target.checked)}
                />
                <span className="font-graphik text-[14px] text-ink-black">Continue selling when out of stock</span>
              </label>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
