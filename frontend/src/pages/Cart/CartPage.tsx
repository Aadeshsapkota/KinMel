import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";

import { getCart } from "../../services/cartService";
import type { CartItem } from "../../types/cartItem";
import { Button } from "../../components/buttons/Button";

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCart() {
      try {
        const data = await getCart();
        setItems(data);
      } finally {
        setLoading(false);
      }
    }
    loadCart();
  }, []);

  function handleCheckout() {
    navigate("/checkout");
  }

  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <MainLayout>
      <div className="bg-cream-paper min-h-screen">
        <Container className="max-w-[1280px]">
          <div className="py-12 md:py-20">
            <div className="mb-12 border-b border-ash pb-8">
              <span className="inline-block text-[12px] font-graphik font-bold uppercase tracking-[0.1em] text-ink-black mb-4">
                Your Selection
              </span>
              <h1 className="font-nantes text-display text-ink-black tracking-normal leading-[1.23] mb-4">
                Shopping Cart
              </h1>
              <div className="h-[3px] w-12 bg-butter-highlight mb-4"></div>
              <p className="max-w-2xl text-body text-smoke font-graphik">
                Review your items before proceeding to checkout.
              </p>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center">
                 <div className="flex flex-col items-center gap-4 text-smoke">
                    <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
                    <span className="font-graphik text-[12px] uppercase tracking-widest animate-pulse">Loading Selection</span>
                 </div>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-80 text-smoke border border-dashed border-ash rounded-[4px] bg-pure-white/50">
                 <span className="material-symbols-outlined text-4xl mb-6">shopping_bag</span>
                 <h2 className="text-[24px] font-nantes text-ink-black mb-2">Your cart is empty</h2>
                 <p className="font-graphik text-[14px] uppercase tracking-widest text-smoke">Add products to start shopping.</p>
                 <Button 
                   variant="outline"
                   onClick={() => navigate('/products')}
                   className="mt-8"
                 >
                    Browse Catalog
                 </Button>
              </div>
            ) : (
              <div className="grid gap-12 lg:grid-cols-12 items-start">
                {/* Cart Items */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-ash text-[12px] font-graphik font-bold uppercase tracking-widest text-smoke">
                     <span>Product</span>
                     <span>Total</span>
                  </div>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="group flex flex-col sm:flex-row items-center gap-6 rounded-[4px] bg-pure-white p-6 border border-ash transition-all hover:border-ink-black"
                    >
                      <div className="h-24 w-24 bg-pure-white flex items-center justify-center p-2">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-contain mix-blend-multiply" />
                        ) : (
                          <div className="font-graphik text-[12px] text-smoke">IMG_N/A</div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                        <div>
                          <h3 className="text-[18px] font-nantes text-ink-black mb-2 group-hover:text-smoke transition-colors">
                            {item.productName}
                          </h3>
                          <div className="inline-flex items-center gap-2 text-[12px] font-graphik uppercase tracking-widest text-smoke">
                            Qty: {item.quantity}
                          </div>
                        </div>

                        <div className="text-[20px] font-graphik font-bold text-ink-black">
                          रु {item.totalPrice.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4 sticky top-28">
                  <div className="rounded-[4px] bg-pure-white border border-ash p-8 relative overflow-hidden">
                    <h2 className="text-[24px] font-nantes text-ink-black mb-6 pb-6 border-b border-ash">
                      Order Summary
                    </h2>

                    <div className="space-y-4 mb-8">
                       <div className="flex justify-between text-smoke text-[14px] font-graphik">
                          <span>Subtotal</span>
                          <span className="font-bold text-ink-black">रु {total.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between text-smoke text-[14px] font-graphik">
                          <span>Shipping</span>
                          <span className="font-bold text-ink-black">Calculated at checkout</span>
                       </div>
                       <div className="flex justify-between items-center text-ink-black mt-4 pt-4 border-t border-ash">
                          <span className="font-graphik font-bold">Total</span>
                          <span className="text-[28px] font-nantes">रु {total.toLocaleString()}</span>
                       </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      className="w-full justify-center mb-6 py-4"
                      size="lg"
                    >
                      Proceed to Checkout
                    </Button>
                    
                    <div className="flex items-center justify-center gap-2 text-[12px] text-smoke font-graphik uppercase tracking-widest">
                       <span className="material-symbols-outlined text-[16px]">lock</span> Secure Encryption
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
