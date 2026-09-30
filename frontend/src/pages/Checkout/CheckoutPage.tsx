import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  createOrder,
  createCheckoutSession,
  getCart,
  type CheckoutRequest,
} from "../../services/cartService";

import { getAddresses } from "../../services/profileService";
import type { CartItem } from "../../types/cartItem";
import { Button } from "../../components/buttons/Button";
import { Input } from "../../components/inputs/Input";
import { redirectToEsewa } from "../../helper/EsewaFormHelper";

const InputField = ({ name, label, placeholder, value, onChange, required = false, type = "text" }: { name: string, label: string, placeholder: string, value: string | number, onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>, required?: boolean, type?: string }) => (
  <div className="mb-4">
    <label className="block font-graphik text-[12px] font-bold text-ink-black uppercase tracking-widest mb-2">{label}</label>
    <Input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<CheckoutRequest>({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    paymentMethod: "eSewa",
  });

  const [addresses, setAddresses] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("Standard");

  useEffect(() => {
    async function load() {
      try {
        const addrs = await getAddresses();
        setAddresses(addrs);
      } catch (err) {
        // user might not be logged in or other error
      }

      try {
        const items = await getCart();
        setCartItems(items);
        if (items.length === 0) {
          navigate("/cart");
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [navigate]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      if (form.paymentMethod === "COD") {
        await createOrder(form);
        toast.success("Order Placed Successfully!");
        navigate("/orders");
        return;
      }

      const session = await createCheckoutSession(form);
      redirectToEsewa(session.paymentUrl, session.formData);
    } catch {
      toast.error("Checkout Failed");
      setLoading(false);
    }
  }

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = shippingMethod === "Standard" ? 0 : 24.99;
  const tax = subtotal * 0.08; // 8% tax
  const grandTotal = subtotal + shippingFee + tax;

  return (
    <div className="min-h-screen bg-cream-paper text-ink-black flex flex-col font-sans relative pb-20">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-ash bg-pure-white sticky top-0 z-50 shadow-sm">
        <Link to="/" className="text-[20px] font-nantes text-ink-black tracking-tight">KinMel</Link>
        <div className="flex items-center gap-4">
          <Link to="/cart" className="font-graphik text-[12px] uppercase tracking-widest text-smoke hover:text-ink-black transition-colors">Return to Cart</Link>
        </div>
      </header>

      <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 md:px-8 pt-8 md:pt-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">

          {/* Left Column - Form */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-12">
            <div>
              <span className="inline-block text-[12px] font-graphik font-bold uppercase tracking-[0.1em] text-ink-black mb-4">
                Final Step
              </span>
              <h1 className="text-3xl md:text-[40px] font-nantes text-ink-black mb-4 tracking-normal leading-[1.23]">Checkout</h1>
              <div className="h-[3px] w-12 bg-butter-highlight mb-4"></div>
              <p className="text-smoke text-[14px] font-graphik max-w-lg leading-relaxed">Complete your purchase by providing your shipping and payment information.</p>
            </div>

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-12">

              {/* Shipping Address */}
              <div className="bg-pure-white border border-ash rounded-[4px] p-6 md:p-8">
                <div className="flex items-center gap-3 mb-8 border-b border-ash pb-4">
                  <span className="material-symbols-outlined text-[20px] text-ink-black">local_shipping</span>
                  <h2 className="text-[20px] font-nantes text-ink-black">Shipping Address</h2>
                </div>

                {addresses.length > 0 && (
                  <div className="mb-8 p-5 bg-ash/30 border border-ash rounded-[4px]">
                    <h4 className="font-graphik text-[12px] font-bold uppercase tracking-widest text-ink-black mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">bookmark</span> Saved Addresses
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => setForm({
                            ...form,
                            addressLine1: addr.addressLine1,
                            addressLine2: addr.addressLine2,
                            city: addr.city,
                            state: addr.state,
                            postalCode: addr.postalCode,
                            country: addr.country,
                          })}
                          className="border border-ash bg-pure-white p-4 rounded-[4px] cursor-pointer hover:border-ink-black transition-all group relative overflow-hidden"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-graphik font-bold text-[14px] text-ink-black flex items-center gap-2">
                              {addr.isPrimary ? 'Primary Address' : 'Saved Address'}
                            </span>
                          </div>
                          <p className="text-[14px] font-graphik text-smoke">{addr.addressLine1}</p>
                          <p className="text-[14px] font-graphik text-smoke mt-1">{addr.city}, {addr.state} {addr.postalCode}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid gap-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField name="fullName" label="Full Name" placeholder="Johnathan Doe" value={form.fullName} onChange={handleChange} required />
                    <InputField name="phoneNumber" label="Phone Number" placeholder="+1 (555) 000-0000" value={form.phoneNumber} onChange={handleChange} required />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField name="addressLine1" label="Address Line 1" placeholder="123 Commerce Way" value={form.addressLine1} onChange={handleChange} required />
                    <InputField name="addressLine2" label="Address Line 2 (Optional)" placeholder="Suite 404" value={form.addressLine2} onChange={handleChange} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField name="city" label="City" placeholder="New York" value={form.city} onChange={handleChange} required />
                    <InputField name="state" label="State / Province" placeholder="NY" value={form.state} onChange={handleChange} required />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField name="postalCode" label="Postal / Zip Code" placeholder="10001" value={form.postalCode} onChange={handleChange} required />
                    <InputField name="country" label="Country" placeholder="United States" value={form.country} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-pure-white border border-ash rounded-[4px] p-6 md:p-8">
                <div className="flex items-center gap-3 mb-8 border-b border-ash pb-4">
                  <span className="material-symbols-outlined text-ink-black text-[20px]">inventory_2</span>
                  <h2 className="text-[20px] font-nantes text-ink-black">Shipping Method</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className={`cursor-pointer border-[2px] rounded-[4px] p-5 flex items-start gap-4 transition-all ${shippingMethod === 'Standard' ? 'border-ink-black bg-ash/30' : 'border-ash bg-pure-white hover:border-smoke'}`}>
                    <div className="flex items-center h-5 mt-0.5">
                      <input type="radio" name="shipping" value="Standard" checked={shippingMethod === 'Standard'} onChange={() => setShippingMethod('Standard')} className="w-4 h-4 text-ink-black focus:ring-ink-black" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-graphik font-bold text-[14px] text-ink-black">Standard Delivery</span>
                      </div>
                      <p className="text-[12px] font-graphik text-smoke mt-1">4-7 business days</p>
                      <p className="font-graphik font-bold text-[14px] text-ink-black mt-3">Complimentary</p>
                    </div>
                  </label>

                  <label className={`cursor-pointer border-[2px] rounded-[4px] p-5 flex items-start gap-4 transition-all ${shippingMethod === 'Express' ? 'border-ink-black bg-ash/30' : 'border-ash bg-pure-white hover:border-smoke'}`}>
                    <div className="flex items-center h-5 mt-0.5">
                      <input type="radio" name="shipping" value="Express" checked={shippingMethod === 'Express'} onChange={() => setShippingMethod('Express')} className="w-4 h-4 text-ink-black focus:ring-ink-black" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-graphik font-bold text-[14px] text-ink-black">Express Priority</span>
                      </div>
                      <p className="text-[12px] font-graphik text-smoke mt-1">1-2 business days</p>
                      <p className="font-graphik font-bold text-[14px] text-ink-black mt-3">रु 24.99</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-pure-white border border-ash rounded-[4px] p-6 md:p-8">
                <div className="flex items-center justify-between mb-8 border-b border-ash pb-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-ink-black text-[20px]">payments</span>
                    <h2 className="text-[20px] font-nantes text-ink-black">Payment Method</h2>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className={`cursor-pointer border-[2px] rounded-[4px] p-6 flex flex-col items-center justify-center gap-3 transition-all ${form.paymentMethod === 'Stripe' ? 'border-ink-black bg-ash/30 text-ink-black' : 'border-ash bg-pure-white text-smoke hover:border-ink-black hover:text-ink-black'}`}>
                    <input type="radio" name="paymentMethod" value="Stripe" checked={form.paymentMethod === 'Stripe'} onChange={handleChange} className="hidden" />
                    <span className="material-symbols-outlined text-[28px]">credit_card</span>
                    <span className="font-graphik font-bold text-[14px]">Credit / Debit Card</span>
                  </label>

                  <label className={`cursor-pointer border-[2px] rounded-[4px] p-6 flex flex-col items-center justify-center gap-3 transition-all ${form.paymentMethod === 'COD' ? 'border-ink-black bg-ash/30 text-ink-black' : 'border-ash bg-pure-white text-smoke hover:border-ink-black hover:text-ink-black'}`}>
                    <input type="radio" name="paymentMethod" value="COD" checked={form.paymentMethod === 'COD'} onChange={handleChange} className="hidden" />
                    <span className="material-symbols-outlined text-[28px]">account_balance_wallet</span>
                    <span className="font-graphik font-bold text-[14px]">Cash on Delivery</span>
                  </label>
                </div>
              </div>

            </form>
          </div>

          {/* Right Column - Order Summary Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-28 space-y-6">

              {/* Order Summary Card */}
              <div className="bg-pure-white border border-ash rounded-[4px] p-6 md:p-8 shadow-sm">
                <h2 className="text-[24px] font-nantes text-ink-black mb-6 border-b border-ash pb-4">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map(item => {
                    return (
                      <div key={item.id} className="flex gap-4 p-4 border-b border-ash last:border-0 pb-4">
                        <div className="w-16 h-16 bg-cream-paper border border-ash flex items-center justify-center p-1 shrink-0">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-contain mix-blend-multiply" />
                          ) : (
                            <div className="font-graphik text-[10px] text-smoke text-center leading-tight">IMG<br />N/A</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className="font-nantes text-[16px] text-ink-black truncate">{item.productName}</h4>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-graphik font-bold text-[14px] text-ink-black">रु {item.price.toFixed(2)}</span>
                            <span className="font-graphik text-[12px] uppercase tracking-widest text-smoke">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4 pt-6 border-t border-ash font-graphik text-[14px]">
                  <div className="flex justify-between text-smoke">
                    <span>Subtotal</span>
                    <span className="font-bold text-ink-black">रु {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-smoke">
                    <span>Shipping Fee</span>
                    <span className="font-bold text-ink-black">{shippingFee === 0 ? 'Complimentary' : `रु ${shippingFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-smoke">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-bold text-ink-black">रु {tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 mt-6 border-t border-ash">
                  <span className="font-graphik font-bold text-[14px] uppercase tracking-widest text-ink-black">Grand Total</span>
                  <span className="text-[28px] font-nantes text-ink-black">रु {grandTotal.toFixed(2)}</span>
                </div>

                <Button
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className="w-full mt-8 justify-center py-4"
                  size="lg"
                >
                  {loading ? "Processing..." : "Place Secured Order"}
                </Button>

                <div className="mt-6 p-4 border border-ash bg-cream-paper rounded-[4px] flex gap-3">
                  <span className="material-symbols-outlined text-ink-black shrink-0">shield</span>
                  <div>
                    <h5 className="font-graphik font-bold text-[12px] uppercase tracking-widest text-ink-black mb-1">Secure Transaction</h5>
                    <p className="font-graphik text-[12px] text-smoke leading-relaxed">
                      Your connection is secured. Payment details are processed directly and never stored on our servers.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

