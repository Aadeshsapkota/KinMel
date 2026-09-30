import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../../components/layouts/MainLayout";
import { getProductById, getProducts } from "../../services/productService";
import { addToCart } from "../../services/cartService";
import { getReviews, createReview } from "../../services/reviewService";
import { useWishlist } from "../../contexts/WishlistContext";

import type { Product } from "../../types/product";
import type { Review } from "../../types/review";
import ProductCard from "../../components/cards/ProductCard";
import { Button } from "../../components/buttons/Button";

const COLOR_MAP: Record<string, string> = {
  "Space Gray": "bg-[#4B4C4F]",
  "Silver": "bg-[#E3E4E5]",
  "Starlight": "bg-[#F3EFE9]",
  "Midnight": "bg-[#2E3642]",
  "Black": "bg-ink-black",
  "White": "bg-pure-white border-ash",
  "Red": "bg-red-500",
  "Blue": "bg-blue-600",
  "Green": "bg-emerald-500",
  "Yellow": "bg-yellow-400",
  "Pink": "bg-pink-400",
  "Purple": "bg-purple-600",
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  
  // UI States
  const [activeTab, setActiveTab] = useState("description");
  const [mainImage, setMainImage] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isWishlisted = product ? isInWishlist(product.id) : false;

  async function handleToggleWishlist() {
    if (!product) return;
    if (isWishlisted) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  }

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getProductById(Number(id));
        setProduct(data);
        setMainImage(data.imageUrl);

        // Pre-select first options
        try {
           if (data.variants) {
              const vars = JSON.parse(data.variants);
              const initialSelected: Record<string, string> = {};
              Object.entries(vars).forEach(([k, v]) => {
                 if (Array.isArray(v) && v.length > 0) initialSelected[k] = v[0];
              });
              setSelectedVariants(initialSelected);
           }
        } catch {}

        Promise.all([
          getReviews(Number(id)).catch(() => []),
          getProducts().catch(() => [])
        ]).then(([reviewData, allProducts]) => {
          setReviews(reviewData);
          setRelatedProducts(allProducts.filter(p => p.id !== Number(id)).slice(0, 4));
        });

      } catch {
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  const parsedVariants = useMemo(() => {
     if (!product?.variants) return {};
     try { return JSON.parse(product.variants) as Record<string, string[]>; } 
     catch { return {}; }
  }, [product?.variants]);

  const parsedSpecs = useMemo(() => {
     if (!product?.specifications) return {};
     try { return JSON.parse(product.specifications) as Record<string, string>; } 
     catch { return {}; }
  }, [product?.specifications]);

  async function handleAddToCart() {
    if (!product) return;
    try {
      await addToCart(product.id, 1);
      toast.success("Added to cart");
    } catch {
      toast.error("Authentication required");
    }
  }

  async function handleBuyNow() {
    if (!product) return;
    try {
      await addToCart(product.id, 1);
      navigate("/checkout");
    } catch {
      toast.error("Authentication required");
    }
  }

  async function handleReviewSubmit() {
    if (!product) return;
    try {
      await createReview(product.id, rating, comment);
      toast.success("Review logged successfully");
      const reviewData = await getReviews(product.id);
      setReviews(reviewData);
      setComment("");
      setRating(5);
    } catch {
      toast.error("Failed to submit review");
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-[60vh] items-center justify-center bg-cream-paper">
          <div className="flex flex-col items-center gap-4 text-smoke">
             <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
             <span className="font-graphik text-[12px] uppercase tracking-widest animate-pulse">
                Loading Product Details
             </span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="flex h-[60vh] items-center justify-center flex-col gap-4 bg-cream-paper">
          <span className="material-symbols-outlined text-4xl text-smoke">error_outline</span>
          <div className="font-graphik text-[14px] uppercase tracking-widest text-smoke">Product Not Found</div>
        </div>
      </MainLayout>
    );
  }

  const galleryImages = [product.imageUrl, ...(product.images || [])].filter(Boolean);
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <MainLayout>
      <div className="bg-cream-paper min-h-screen pb-20">
        <div className="max-w-[1280px] mx-auto px-6 py-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[12px] font-graphik text-smoke mb-8 uppercase tracking-widest">
            <Link to="/" className="hover:text-ink-black hover:underline underline-offset-4 transition-all">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to="/products" className="hover:text-ink-black hover:underline underline-offset-4 transition-all">Catalog</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-ink-black font-bold">{product.name}</span>
          </nav>

          {/* Main Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Column - Gallery */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="aspect-square w-full rounded-[4px] border border-ash bg-pure-white flex items-center justify-center p-8 overflow-hidden">
                <img src={mainImage} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              
              {galleryImages.length > 1 && (
                 <div className="grid grid-cols-5 gap-2 md:gap-4">
                   {galleryImages.map((img, idx) => (
                     <button 
                       key={idx}
                       onClick={() => setMainImage(img)}
                       className={`aspect-square rounded-[4px] border flex items-center justify-center p-2 bg-pure-white transition-all ${mainImage === img ? 'border-ink-black' : 'border-ash hover:border-smoke'}`}
                     >
                       <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
                     </button>
                   ))}
                 </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-6 flex flex-col pt-4">
              <div className="mb-6">
                {product.brand && (
                   <span className="inline-block bg-ash text-ink-black px-3 py-1 rounded-[4px] text-[10px] font-graphik font-bold uppercase tracking-widest mb-4 mr-2">{product.brand}</span>
                )}
                {product.tags && product.tags.slice(0, 2).map(tag => (
                   <span key={tag} className="inline-block bg-pure-white border border-ash text-ink-black px-3 py-1 rounded-[4px] text-[10px] font-graphik font-bold uppercase tracking-widest mb-4 mr-2">{tag}</span>
                ))}
                
                <h1 className="text-3xl md:text-[48px] font-nantes text-ink-black mb-4 leading-tight">{product.name}</h1>
                
                {product.sellerName && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[14px] font-graphik text-smoke">Sold by</span>
                    <span className="inline-flex items-center gap-1.5 border border-ash bg-pure-white text-ink-black px-3 py-1 rounded-[4px] text-[12px] font-graphik font-bold">
                      <span className="material-symbols-outlined text-[14px]">storefront</span>
                      {product.sellerName}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-[14px] font-graphik">
                  <div className="flex items-center text-ink-black">
                    <span className="material-symbols-outlined text-[16px] [font-variation-settings:'FILL'1]">star</span>
                    <span className="ml-1 font-bold">{averageRating}</span>
                  </div>
                  <span className="text-smoke underline underline-offset-4 cursor-pointer hover:text-ink-black transition-colors" onClick={() => setActiveTab("reviews")}>
                    {reviews.length > 0 ? reviews.length : '128'} Reviews
                  </span>
                  <span className="text-ash">|</span>
                  {product.stock > 0 ? (
                    <span className="text-success font-bold">In Stock</span>
                  ) : (
                    <span className="text-danger font-bold">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Price Box */}
              <div className="bg-pure-white rounded-[4px] p-6 mb-8 border border-ash">
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-[32px] font-nantes text-ink-black">रु {product.price.toLocaleString()}</span>
                  {product.compareAtPrice && (
                    <span className="text-[16px] font-graphik text-smoke line-through mb-1.5">रु {product.compareAtPrice.toLocaleString()}</span>
                  )}
                </div>
              </div>

              {/* Options */}
              {Object.keys(parsedVariants).length > 0 && (
                 <div className="space-y-6 mb-8">
                   {Object.entries(parsedVariants).map(([variantName, options]) => {
                      const isColorVariant = variantName.toLowerCase().includes('color') || variantName.toLowerCase().includes('finish');
                      
                      if (options.length === 1 && !isColorVariant) {
                         return (
                           <div key={variantName} className="flex items-center gap-2 font-graphik text-[14px]">
                             <h3 className="font-bold text-ink-black">{variantName}:</h3>
                             <span className="text-smoke">{options[0]}</span>
                           </div>
                         );
                      }

                      return (
                         <div key={variantName}>
                           <h3 className="font-graphik text-[14px] font-bold mb-3 text-ink-black uppercase tracking-widest">{variantName}: <span className="text-smoke font-normal capitalize">{selectedVariants[variantName] || ''}</span></h3>
                           
                           <div className={`flex flex-wrap gap-3 ${isColorVariant ? 'items-center' : ''}`}>
                             {options.map((option) => {
                               const isSelected = selectedVariants[variantName] === option;
                               
                               if (isColorVariant) {
                                 const bgColor = COLOR_MAP[option] || 'bg-smoke';
                                 return (
                                   <button
                                     key={option}
                                     onClick={() => setSelectedVariants(curr => ({...curr, [variantName]: option}))}
                                     className={`w-10 h-10 rounded-[4px] flex items-center justify-center transition-all ${isSelected ? 'ring-1 ring-ink-black ring-offset-2 ring-offset-cream-paper' : 'hover:opacity-80'}`}
                                     title={option}
                                   >
                                     <span className={`w-full h-full rounded-[4px] border border-ash shadow-inner ${bgColor}`}></span>
                                   </button>
                                 );
                               } else {
                                 return (
                                   <button
                                     key={option}
                                     onClick={() => setSelectedVariants(curr => ({...curr, [variantName]: option}))}
                                     className={`px-6 py-2.5 rounded-[4px] border font-graphik text-[14px] transition-all ${isSelected ? 'border-ink-black bg-ink-black text-pure-white' : 'border-ash text-smoke hover:border-ink-black hover:text-ink-black bg-pure-white'}`}
                                   >
                                     {option}
                                   </button>
                                 );
                               }
                             })}
                           </div>
                         </div>
                      );
                   })}
                 </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full justify-center"
                >
                  Add to Cart
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="w-full justify-center"
                >
                  Buy Now
                </Button>
              </div>
              <button
                onClick={handleToggleWishlist}
                className={`w-full flex items-center justify-center gap-2 font-graphik font-bold text-[14px] py-4 rounded-[4px] mb-8 transition-all border ${isWishlisted ? 'border-ink-black text-ink-black bg-ash/30' : 'border-ash text-smoke hover:border-ink-black hover:text-ink-black bg-pure-white'}`}
              >
                <span className={`material-symbols-outlined ${isWishlisted ? '[font-variation-settings:"FILL"1]' : ''}`}>favorite</span>
                {isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
              </button>

              {/* Features list */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-ash">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[20px] text-ink-black">local_shipping</span>
                  <div>
                    <div className="font-graphik font-bold text-[14px] text-ink-black">Complimentary Shipping</div>
                    <div className="font-graphik text-[12px] text-smoke mt-1">Dispatches within 24 hours</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[20px] text-ink-black">verified_user</span>
                  <div>
                    <div className="font-graphik font-bold text-[14px] text-ink-black">Extended Warranty</div>
                    <div className="font-graphik text-[12px] text-smoke mt-1">12-month manufacturer guarantee</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-20">
            <div className="flex items-center gap-8 border-b border-ash overflow-x-auto hide-scrollbar">
              {[
                { id: "description", label: "Editorial Details" },
                { id: "specs", label: "Specifications" },
                { id: "reviews", label: `Reviews (${reviews.length > 0 ? reviews.length : '128'})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 font-graphik text-[14px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-ink-black border-b-[3px] border-butter-highlight' : 'text-smoke hover:text-ink-black'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="py-12">
              {activeTab === "description" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div className="space-y-6">
                    <p className="font-graphik text-[16px] text-charcoal leading-[1.6]">
                      {product.description}
                    </p>
                    
                    {product.features && product.features.length > 0 && (
                       <ul className="space-y-4 pt-8 border-t border-ash">
                         {product.features.map((feature, idx) => (
                           <li key={idx} className="flex items-start gap-4">
                             <span className="h-[2px] w-4 bg-butter-highlight mt-2.5 shrink-0"></span>
                             <span className="font-graphik text-[14px] text-smoke">{feature}</span>
                           </li>
                         ))}
                       </ul>
                    )}
                  </div>
                  
                  {Object.keys(parsedSpecs).length > 0 && (
                    <div className="bg-pure-white rounded-[4px] border border-ash h-max">
                      {Object.entries(parsedSpecs).map(([key, value], index) => (
                        <div key={key} className={`grid grid-cols-3 p-5 ${index !== 0 ? 'border-t border-ash' : ''}`}>
                          <div className="font-graphik font-bold text-[12px] uppercase tracking-widest text-ink-black col-span-1">{key}</div>
                          <div className="font-graphik text-[14px] text-smoke col-span-2">{value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "specs" && (
                <div className="bg-pure-white rounded-[4px] border border-ash max-w-3xl">
                  {Object.keys(parsedSpecs).length === 0 ? (
                    <div className="p-8 text-center font-graphik text-[14px] text-smoke">Technical specifications are currently unavailable.</div>
                  ) : (
                    Object.entries(parsedSpecs).map(([key, value], index) => (
                      <div key={key} className={`grid grid-cols-3 p-5 ${index !== 0 ? 'border-t border-ash' : ''}`}>
                        <div className="font-graphik font-bold text-[12px] uppercase tracking-widest text-ink-black col-span-1">{key}</div>
                        <div className="font-graphik text-[14px] text-smoke col-span-2">{value}</div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                  <div className="lg:col-span-1 bg-pure-white p-8 rounded-[4px] border border-ash h-max">
                    <h3 className="font-nantes text-[24px] text-ink-black mb-6">Leave a Review</h3>
                    <div className="space-y-5">
                      <div>
                        <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest text-ink-black mb-2">Rating</label>
                        <select
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="w-full rounded-[4px] border border-ash bg-pure-white p-3 font-graphik text-[14px] text-ink-black focus:border-ink-black outline-none"
                        >
                          <option value={5}>5 Stars - Exceptional</option>
                          <option value={4}>4 Stars - Very Good</option>
                          <option value={3}>3 Stars - Average</option>
                          <option value={2}>2 Stars - Below Average</option>
                          <option value={1}>1 Star - Poor</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest text-ink-black mb-2">Review</label>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Your experience with this item..."
                          rows={4}
                          className="w-full rounded-[4px] border border-ash bg-pure-white p-3 font-graphik text-[14px] text-ink-black focus:border-ink-black outline-none resize-none"
                        />
                      </div>
                      <Button
                        className="w-full justify-center"
                        onClick={handleReviewSubmit}
                      >
                        Submit Review
                      </Button>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    {reviews.length === 0 ? (
                      <div className="text-center py-16 bg-pure-white border border-ash rounded-[4px]">
                        <span className="material-symbols-outlined text-4xl mb-4 text-smoke">format_quote</span>
                        <p className="font-graphik text-[14px] text-smoke">No customer reviews yet. Share your experience.</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-b border-ash pb-8 last:border-0">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[4px] bg-ash text-ink-black flex items-center justify-center font-nantes text-[18px]">
                                  {review.userName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-graphik font-bold text-[14px] text-ink-black">{review.userName}</div>
                                  <div className="font-graphik text-[12px] text-smoke uppercase tracking-wider mt-0.5">{new Date(review.createdDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                </div>
                              </div>
                              <div className="flex text-ink-black">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`material-symbols-outlined text-[16px] ${i < review.rating ? '[font-variation-settings:"FILL"1]' : ''}`}>
                                    star
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="font-graphik text-[14px] text-charcoal leading-[1.6]">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* You might also like */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 pt-16 border-t border-ash">
              <div className="flex items-end justify-between mb-10">
                <div>
                   <h2 className="font-nantes text-[32px] text-ink-black">Curated for You</h2>
                   <div className="h-[3px] w-12 bg-butter-highlight mt-4"></div>
                </div>
                <Link to="/products" className="font-graphik text-[12px] font-bold uppercase tracking-widest text-ink-black hover:underline underline-offset-4">View Collection</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
}
