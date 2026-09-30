
import { Link } from "react-router-dom";
import MainLayout from "../../components/layouts/MainLayout";
import { useWishlist } from "../../contexts/WishlistContext";
import ProductCard from "../../components/cards/ProductCard";

export default function WishlistPage() {
  const { wishlist, isLoading } = useWishlist();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex-1 flex flex-col items-center justify-center bg-background min-h-[60vh]">
          <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-[1280px] mx-auto px-6 py-12 w-full flex-1">
        <div className="mb-8 flex items-center justify-between border-b border-outline-variant pb-6">
          <div>
            <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2">My Wishlist</h1>
            <p className="text-on-surface-variant">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} in your wishlist
            </p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-surface-container-low rounded-3xl border border-outline-variant shadow-sm">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-5xl">favorite</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-3 tracking-tight">Your wishlist is empty</h2>
            <p className="text-on-surface-variant max-w-md mx-auto mb-8">
              Explore our collections and discover something you'll love. Click the heart icon on any product to save it here.
            </p>
            <Link
              to="/products"
              className="bg-primary text-on-primary px-8 py-3 rounded-full font-label-lg hover:bg-primary/90 transition-all shadow-md active:scale-95 hover:shadow-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <ProductCard
                key={item.productId}
                product={{
                  id: item.productId,
                  name: item.productName,
                  imageUrl: item.imageUrl,
                  price: item.price,
                  compareAtPrice: item.compareAtPrice ?? undefined,
                  brand: item.brand,
                  stock: item.stock,
                  categoryId: 0,
                  description: "Wishlist item"
                }}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
