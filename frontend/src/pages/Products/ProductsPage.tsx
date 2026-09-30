import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";
import ProductCard from "../../components/cards/ProductCard";

import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import type { Category } from "../../types/category";
import type { Product } from "../../types/product";
import { Button } from "../../components/buttons/Button";
import { Input } from "../../components/inputs/Input";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.getAll("category")
  );
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    setSelectedCategories(searchParams.getAll("category"));
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        let currentCategories = categories;
        
        // Load categories if we haven't yet
        if (currentCategories.length === 0) {
          currentCategories = await getCategories();
          setCategories(currentCategories);
        }

        // Map selected category names to their IDs
        const categoryIds = selectedCategories
          .map(name => currentCategories.find(c => c.name.toLowerCase() === name.toLowerCase())?.id)
          .filter(id => id !== undefined) as number[];

        const data = await getProducts({
          search: search.trim(),
          categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
          minPrice: minPrice !== "" ? Number(minPrice) : undefined,
          maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
          page,
          pageSize: 12,
        });
        setProducts(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [search, minPrice, maxPrice, page, selectedCategories]);

  const filteredProducts = products;

  function toggleCategory(categoryName: string) {
    const newParams = new URLSearchParams(searchParams);
    const currentCats = newParams.getAll("category");
    
    newParams.delete("category");
    
    let next: string[];
    if (currentCats.includes(categoryName)) {
      next = currentCats.filter((name) => name !== categoryName);
    } else {
      next = [...currentCats, categoryName];
    }
    
    next.forEach((name) => newParams.append("category", name));
    setSearchParams(newParams);
    setPage(1);
  }

  return (
    <MainLayout>
      <div className="bg-cream-paper min-h-screen">
        <Container className="max-w-[1280px]">
          <div className="py-12 md:py-20">
            {/* Header */}
            <div className="mb-12">
              <span className="inline-block text-[12px] font-graphik font-bold uppercase tracking-[0.1em] text-ink-black mb-4">
                Catalog
              </span>
              <h1 className="font-nantes text-display text-ink-black tracking-normal leading-[1.23] mb-4">
                The Collection
              </h1>
              <div className="h-[3px] w-12 bg-butter-highlight mb-4"></div>
              <p className="max-w-2xl text-body text-smoke font-graphik">
                Browse our complete selection of curated technology and lifestyle goods.
              </p>
            </div>

            {/* Filter Top Bar */}
            <div className="mb-12 rounded-[4px] bg-pure-white border border-ash p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 font-graphik font-bold uppercase tracking-widest text-[12px] text-ink-black border-b border-ash pb-4">
                <span className="material-symbols-outlined text-[18px]">tune</span> 
                Search & Filters
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  type="text"
                  placeholder="Search catalog..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  icon={<span className="material-symbols-outlined text-smoke">search</span>}
                />
                <Input
                  type="number"
                  placeholder="Minimum price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  icon={<span className="font-graphik text-smoke">रु </span>}
                />
                <Input
                  type="number"
                  placeholder="Maximum price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  icon={<span className="font-graphik text-smoke">रु </span>}
                />
              </div>
              
              {/* Mobile Filter Toggle */}
              <div className="mt-6 lg:hidden">
                <Button 
                  variant="outline"
                  className="w-full justify-center gap-2"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                  Show Categories
                </Button>
              </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-[240px_1fr] lg:items-start">
              {/* Sidebar */}
              <div className="hidden lg:block">
                <div className="sticky top-28 bg-pure-white border border-ash rounded-[4px] p-6">
                  <div className="mb-6 flex items-center justify-between border-b border-ash pb-4">
                    <h3 className="font-nantes text-heading-sm text-ink-black">
                      Categories
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedCategories([]);
                        const newParams = new URLSearchParams(searchParams);
                        newParams.delete("category");
                        setSearchParams(newParams);
                      }}
                      className="text-[12px] font-graphik text-smoke hover:text-ink-black hover:underline underline-offset-4"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className="flex cursor-pointer items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.name)}
                            onChange={() => toggleCategory(category.name)}
                            className="h-4 w-4 rounded-sm border-ash text-ink-black focus:ring-ink-black focus:ring-offset-cream-paper bg-pure-white transition-colors"
                          />
                          <span className="text-[14px] font-graphik text-ink-black group-hover:text-smoke transition-colors">
                            {category.name}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                {loading ? (
                  <div className="flex h-64 items-center justify-center">
                    <div className="flex flex-col items-center gap-4 text-smoke">
                      <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
                      <span className="font-graphik text-[12px] uppercase tracking-widest animate-pulse">
                        Loading Catalog
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    {filteredProducts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-smoke border border-dashed border-ash rounded-[4px] bg-pure-white/50">
                        <span className="material-symbols-outlined text-4xl mb-4">search_off</span>
                        <p className="font-graphik text-[14px] uppercase tracking-widest">
                          No items found.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-8 flex items-center justify-between border-b border-ash pb-4">
                          <div>
                            <p className="font-graphik text-[14px] text-smoke">
                              Showing {filteredProducts.length} items
                            </p>
                          </div>
                          {selectedCategories.length > 0 && (
                            <button
                              onClick={() => setSelectedCategories([])}
                              className="font-graphik text-[14px] text-smoke hover:text-ink-black hover:underline underline-offset-4"
                            >
                              Clear Filters
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
                
                {/* Pagination */}
                <div className="mt-16 flex items-center justify-center gap-6 border-t border-ash pt-8">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="font-graphik text-[14px] text-smoke uppercase tracking-widest">
                    Page {page}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={products.length < 12}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile Filters Drawer Overlay */}
      {mobileFiltersOpen && (
        <div 
          className="fixed inset-0 bg-ink-black/20 backdrop-blur-sm z-[80] lg:hidden transition-opacity" 
          onClick={() => setMobileFiltersOpen(false)}
        />
      )}

      {/* Mobile Filters Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-[280px] bg-pure-white z-[90] shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-ash">
          <span className="font-nantes text-[22px] text-ink-black">Categories</span>
          <button 
            className="text-smoke hover:text-ink-black transition-colors"
            onClick={() => setMobileFiltersOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-graphik text-[14px] font-bold text-ink-black uppercase tracking-widest">
              Filters
            </h3>
            <button
              onClick={() => {
                setSelectedCategories([]);
                const newParams = new URLSearchParams(searchParams);
                newParams.delete("category");
                setSearchParams(newParams);
              }}
              className="text-[12px] font-graphik text-smoke hover:text-ink-black underline-offset-4 hover:underline"
            >
              Clear
            </button>
          </div>
          
          <div className="space-y-4">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex cursor-pointer items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => toggleCategory(category.name)}
                    className="h-4 w-4 rounded-sm border-ash text-ink-black focus:ring-ink-black bg-pure-white"
                  />
                  <span className="text-[14px] font-graphik text-ink-black">
                    {category.name}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-ash bg-pure-white">
          <Button 
            className="w-full justify-center"
            onClick={() => setMobileFiltersOpen(false)}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
