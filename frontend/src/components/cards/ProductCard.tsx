import type { Product } from "../../types/product";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addToCart } from "../../services/cartService";
import { useWishlist } from "../../contexts/WishlistContext";
import { Button } from "../buttons/Button";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  async function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  }

  async function handleAddToCart(
    e: React.MouseEvent
  ) {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart(
        product.id,
        1
      );

      toast.success(
        "Added to cart"
      );
    } catch {
      toast.error(
        "Please login first"
      );
    }
  }

  return (
    <div
      onClick={() =>
        navigate(
          `/products/${product.id}`
        )
      }
      className="group block relative cursor-pointer"
    >
      {/* Card Frame (4px padding, 4px radius, 1px solid #dadada) */}
      <div className="rounded-[4px] border border-ash p-1 bg-pure-white transition-colors hover:border-ink-black">
        {/* Image Container (Square aspect ratio) */}
        <div className="relative aspect-square w-full bg-cream-paper overflow-hidden">
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-pure-white/90 border border-ash hover:border-ink-black transition-all group/btn"
          >
            <span className={`material-symbols-outlined text-[18px] ${isWishlisted ? 'text-danger [font-variation-settings:"FILL"1]' : 'text-smoke group-hover/btn:text-danger'}`}>
              favorite
            </span>
          </button>

          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
      </div>

      {/* Content Below Card */}
      <div className="mt-3 flex flex-col gap-1 px-1">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-body font-graphik text-ink-black truncate group-hover:underline decoration-1 underline-offset-4">
            {product.name}
          </h3>
          <span className="text-body font-graphik text-ink-black whitespace-nowrap">
            रु {product.price.toLocaleString()}
          </span>
        </div>
        
        <p className="text-caption text-smoke font-graphik line-clamp-1">
          {/* @ts-ignore */}
          {product.category || "General"}
        </p>

        <div className="flex items-center justify-between mt-2">
          {product.stock > 0 ? (
            <span className="text-caption text-smoke font-graphik">
              In Stock ({product.stock})
            </span>
          ) : (
            <span className="text-caption text-danger font-graphik">
              Sold Out
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddToCart}
            className="px-2 py-1 min-h-0 text-caption underline decoration-1 underline-offset-4"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}