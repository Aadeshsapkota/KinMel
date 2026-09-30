import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from "../services/wishlistService";
import type { WishlistResponse } from "../types/wishlist";
import toast from "react-hot-toast";

interface WishlistContextType {
  wishlist: WishlistResponse[];
  wishlistCount: number;
  isLoading: boolean;
  refreshWishlist: () => Promise<void>;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");

  const refreshWishlist = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const data = await getWishlist();
      setWishlist(data);
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [token]);

  const addToWishlist = async (productId: number) => {
    if (!token) {
      toast.error("Please login to add to wishlist");
      return;
    }
    try {
      await apiAddToWishlist(productId);
      toast.success("Added to wishlist");
      await refreshWishlist();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add to wishlist");
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!token) return;
    try {
      await apiRemoveFromWishlist(productId);
      toast.success("Removed from wishlist");
      await refreshWishlist();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to remove from wishlist");
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.productId === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isLoading,
        refreshWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
