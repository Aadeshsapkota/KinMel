import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../components/layouts/MainLayout";
import { getProducts } from "../../services/productService";
import type { Product } from "../../types/product";
import { getCategories } from "../../services/categoryService";
import { Button } from "../../components/buttons/Button";
import ProductCard from "../../components/cards/ProductCard";

const DUMMY_PRODUCTS = [
  {
    id: "dummy-1",
    name: "A4tech Bloody Gaming Headphone",
    description: "Feature-Packed Wireless Headset Engineered For Professional Gamers and Audiophiles.",
    price: 3200,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4Q59owZeaveUtV2Gb4kCZ4I0SUF9OyoMk5tf7HWfOaln16Dw6UVdHxRzfyqgJYrzUCUGnkkzCewUqqsmQSf392pjBVUgVNqfKgDFQ_s6XGtIR5Q50Zw6Tvw0u-JNI2yrKBkr82vAHWgwY1de1Ukx-2H3gocukLWdqAE6L0wWhPGrJThTCMgBdzBK7Ec5fkPcYlbQcw5EbRaepo9uHdqzBgthi-25TnHeO_7uJb5_7LXYUKQb52W3WKRLTjKy7MkJSMtbwEiojoss",
    tag: "New Arrivals",
  },
  {
    id: "dummy-2",
    name: "NPT 200W Pure Sine Wave UPS",
    description: "Reliable power backup.",
    price: 4500,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_BLKwWhIHvZ5RW54B9vSdHfpRQ9xV2gp03YK0h5aWvEPVtyj66yU3Bcz7XhG2VTELCiosIxjoBamFi5v7WsMuEyh34EUP8Jrhve1L_rEE7uax-I4X5Q1LvDIdO1n4irPJgji87b32xcLhhWhmJNFrOt7J_cakSfMeFF_NtiY1f8itvL1Zac9ylRMasH-eEfkIUfw22y30SJvznH7uTFcLo58gxYkN7n98C239oY_0nqN2_in6VvCVkPxh2tG-dO_SXzyWpIDPVfo",
    tag: "-40% OFF",
  },
  {
    id: "dummy-3",
    name: "TP-Link Archer AX53 WiFi 6 Router",
    description: "Next gen wifi speed.",
    price: 3100,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuALveJzTet6556aUV1sVVEmFcbuIkpjPzOnpBWNZC8EQes2yA7FauDQOFnx6xnnbZ27Qj9Smb1eMMhO6Ph9cY5RCGglZWmtHPpArcN3q1NOtPRKQKaNtrzM_Pw3Et2c-9a4fg6vk7XEokKoajBrCRZxYWf_r-YAjAuaIvxA0fkdkD6TLXS-vgj-YVaiwyb0ReYg12c1pz1Veq40yJmEwV1dVhOF-4WmAzscZwXgFX25zjVhsckI9WDh4cPDeR_f8CKWeJzFKxKA4po",
    tag: "Gigabit Series",
  },
  {
    id: "dummy-4",
    name: "Gigabyte AI TOP 100 Z890 Core Ultra",
    description: "",
    price: 108000,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYUeouXNqH3uTGw1Umu2TBX8bWO7kwy5wO_0amxvWoWVyE1q9JN33_p9_a4nD_EVR1pIGjPL8OUHHo28cYKvybj5hUgXOUuZWirnhkN9rBWHbdv2R6ftdK3DWZ5kvxY3upl1RI_YlYIsfXTryBjRNlS8qFGbfdMQUT9CW5s2GoZA9a2ilBXkE9bU-C_DZoie1q20YvPU14ylRIZ57Xq5jGulG3DLa_3t4A9EAIw_-KwN4nLBkE_8YFuxNG9bkY-f2BEcAYCmmIclU",
    rating: 5,
    tag: "Best Selling",
  },
  {
    id: "dummy-5",
    name: "MacBook Air M4 Chip 13-inch",
    description: "",
    price: 120500,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkKzOHpzA_dC0yzGibE4fyq1iDeAPf6px10kRAwhiHxENkdWdKnnSe1sRJVkXAi09t3apFecQQAAEMVM5V3XvMuGCpNypkQGkZ3FR6I31Gh34afy1QhvfIr0CjV-p9o_na5W_uNuYfXrW3n3GfI5w7P15uLLBja5CxF4G40k8cyDVh6rWD8Z0a-yj-2uNiUati2P8LtBhkwLqZ4sxw2gUDf07OCaVytIeM73EqYRmhTiMBf8mL4FpkT_k7JyF9U2_bf_deqUx9VI0",
    rating: 4.5,
    tag: "Top Rated",
  },
  {
    id: "dummy-6",
    name: 'BenQ GW2486TC 23.8" Monitor',
    description: "",
    price: 66000,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDm0xffHHpytxJu-_---GxU8j_AxPjZbS4vkOgpSg37sT7I6m1OlYTJS9tQ_u9C4bjUHDajIBCK10kddmbVELXvvW2NldNnQkTW10p6-FBnJM0B1jq7xVlS4XfGEyx33zL6LAvRS4eo2mbLBXkorUNzFsxm4Um0xhvvTp9AggAkdWcVqfAirRIipmUgOY2MOHioGUZ6Dj7yo0PmqQ9IiazoMMphTvcn3hxKTmWQpjso3iAuAMQvfLhC6KHCJpFD-2mDSUOyqWHBdgw",
    rating: 4,
    tag: "New Release",
  },
  {
    id: "dummy-7",
    name: "Sony ZV-1 Digital Camera",
    description: "",
    price: 91000,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCpm1-9Bw4DojkkOAUCsWQI6O90oMAK2zGhlku5tBc2rFODvXcN6O1zY40Qopz292aNego9dfxjx88zmgBHfVvhUZA-OuGH5JEK8Q_aEi8iOLTM0eIdSz3tXvi0dRBgE8Xr8dyd_b-fw5PGo_8O00zVXXer3mC9R_WjYPOBrO-nuGVlcrW4lcEGzSE6PLkMVUx-QHS05RL2aWzLST_d5d9BYutxNEg_X4Na1WtdYZDeJlqu5LTfBCw-EAl-M3DCt8z563U07mTPlU",
    rating: 5,
    tag: "Best Seller",
  },
  {
    id: "dummy-8",
    name: "GIGABYTE AORUS Gaming Chair",
    description: "",
    price: 49800,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuADbWF7jZ9HJgK1Oyr-W4CHKjrwgJy7A5eLZZQa4Dgi15r1UXGbLMIeoxTJoFqO52R5f6K-kNPH6rRDLrL5oEgYKlCE6tzA5YwTpmsaQQSmnxaPhrU3Qv3DOBmILNw8w9oEPXFFwQtffzOg924M0bUgkbTGQuvE0H6cc2gYCY5rMTeBiiTLXIfz2ozLl5ECcMyvNNaIMVENZbxbb1lP_zcjaxva4lcjXM_KUgQ022JW4KE-tHWXDHgWDPTf1in2w3U-EqX-1Gr4bzA",
    rating: 4.5,
    tag: "Hot Items",
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
    getCategories().catch(console.error);
  }, []);

  // Merge real products with dummy placeholders
  const merged = Array.from({ length: 8 }).map((_, i) => {
    if (products[i]) {
      return {
        ...DUMMY_PRODUCTS[i],
        id: products[i].id.toString(),
        name: products[i].name,
        description: products[i].description || DUMMY_PRODUCTS[i].description,
        price: products[i].price,
        imageUrl: products[i].imageUrl,
        stock: products[i].stock,
        isReal: true,
        originalId: products[i].id,
      };
    }
    return { ...DUMMY_PRODUCTS[i], stock: 10, isReal: false };
  });

  return (
    <MainLayout>
      {/* Full Bleed Hero Section */}
      <section className="relative w-full h-[600px] bg-cream-paper flex items-center overflow-hidden">
        {/* Placeholder image that looks like a lifestyle catalog photo */}
        <div className="absolute inset-0 bg-ash/30">
           <img 
             src="https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?q=80&w=2070&auto=format&fit=crop" 
             alt="Lifestyle workspace" 
             className="w-full h-full object-cover opacity-80 mix-blend-multiply dark:mix-blend-overlay dark:opacity-40"
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-cream-paper via-cream-paper/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-[1280px] mx-auto px-12 w-full">
          <div className="max-w-[600px]">
            <h1 className="font-nantes text-display text-ink-black tracking-normal leading-[1.23] mb-4">
              Curated tech essentials for modern living.
            </h1>
            <div className="h-[3px] w-16 bg-butter-highlight mb-6"></div>
            <p className="font-graphik text-subheading text-charcoal mb-8 tracking-[0.09px]">
              Discover our latest collection of premium electronics, workspace gear, and everyday tech designed for seamless integration into your life.
            </p>
            <Button variant="ghost" size="lg" className="border border-ink-black text-ink-black hover:bg-ink-black hover:text-pure-white transition-colors" onClick={() => window.location.href = '/products'}>
              Shop the collection
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="bg-cream-paper py-20">
        <div className="max-w-[1280px] mx-auto px-12">
          <div className="flex items-end justify-between mb-12 border-b border-ash pb-4">
            <div>
              <h2 className="font-nantes text-heading-lg text-ink-black leading-[1.27]">Featured Additions</h2>
              <div className="h-[3px] w-12 bg-butter-highlight mt-2"></div>
            </div>
            <Link to="/products" className="font-graphik text-caption text-ink-black hover:underline decoration-1 underline-offset-4">View All</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {merged.slice(0, 4).map((item: any) => (
               <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Inverted Dark Value-Prop Section */}
      <section className="w-full bg-success text-pure-white py-24 my-12">
        <div className="max-w-[1280px] mx-auto px-12 text-center">
          <h2 className="font-nantes text-heading-lg text-pure-white mb-6 leading-[1.27]">
            Get your products in front of millions of buyers
          </h2>
          <p className="font-graphik text-body text-pure-white/80 max-w-2xl mx-auto mb-8">
            Join our platform as a verified seller and connect with customers searching for premium technology and lifestyle goods.
          </p>
          <Button variant="ghost" size="lg" className="border border-pure-white text-pure-white hover:bg-pure-white hover:text-ink-black transition-colors" onClick={() => window.location.href = '/seller'}>
            Apply to sell
          </Button>
        </div>
      </section>

      {/* Popular Products */}
      <section className="bg-cream-paper py-20">
        <div className="max-w-[1280px] mx-auto px-12">
          <div className="flex items-end justify-between mb-12 border-b border-ash pb-4">
            <div>
              <h2 className="font-nantes text-heading-lg text-ink-black leading-[1.27]">Trending Now</h2>
              <div className="h-[3px] w-12 bg-butter-highlight mt-2"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {merged.slice(4, 8).map((item: any) => (
               <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
