import { useEffect, useState } from "react";
import {
  getAssignedOrders,
  sendDeliveryOtp,
  verifyDeliveryOtp,
  startDelivery,
} from "../../services/deliveryService";

import toast from "react-hot-toast";
import { Input } from "../../components/inputs/Input";
import { Button } from "../../components/buttons/Button";

const STATUS_LABELS: Record<string, string> = {
  OutForDelivery: "Out for Delivery",
  ReturnRequested: "Return Requested",
};

interface DeliveryOrder {
  orderId: number;
  customerName: string;
  phoneNumber: string;
  address: string;
  totalAmount: number;
  status: string;
}

export default function DeliveryPage() {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [processingId, setProcessingId] = useState<number | null>(null);

  async function loadOrders() {
    try {
      const data = await getAssignedOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filterTabs = ["All", "Assigned", "OutForDelivery", "Delivered", "Cancelled"] as const;

  const filteredOrders = activeFilter === "All"
    ? orders
    : orders.filter((o) => o.status === activeFilter);

  const statusCounts = filterTabs.reduce<Record<string, number>>((acc, s) => {
    acc[s] = s === "All" ? orders.length : orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-paper flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-smoke">
          <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
          <span className="font-graphik text-[12px] uppercase tracking-widest animate-pulse">Loading Deliveries...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-paper">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 border-b border-ash pb-6">
          <span className="inline-block text-[12px] font-graphik font-bold uppercase tracking-[0.1em] text-ink-black mb-2">
            Field Operations
          </span>
          <h1 className="text-[32px] font-nantes text-ink-black tracking-normal">
            Delivery Dashboard
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total", count: orders.length, icon: "inventory_2" },
            { label: "To Start", count: statusCounts["Assigned"] ?? 0, icon: "play_circle" },
            { label: "In Transit", count: statusCounts["OutForDelivery"] ?? 0, icon: "local_shipping" },
            { label: "Completed", count: statusCounts["Delivered"] ?? 0, icon: "check_circle" },
          ].map((card) => (
            <div key={card.label} className="rounded-[4px] border border-ash bg-pure-white p-6 shadow-sm hover:border-ink-black transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-ink-black text-[24px]">{card.icon}</span>
                <span className="font-nantes text-[32px] text-ink-black">{card.count}</span>
              </div>
              <p className="font-graphik text-[12px] font-bold uppercase tracking-widest text-smoke">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab;
            const label = tab === "All" ? "All" : (STATUS_LABELS[tab] ?? tab);
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-[2px] font-graphik text-[12px] font-bold uppercase tracking-widest transition-all ${
                  isActive
                    ? "bg-ink-black text-pure-white"
                    : "bg-pure-white border border-ash text-smoke hover:border-ink-black hover:text-ink-black"
                }`}
              >
                {label}
                <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-[2px] font-graphik text-[10px] font-bold ${
                  isActive ? "bg-pure-white/20 text-pure-white" : "bg-ash/50 text-ink-black"
                }`}>
                  {statusCounts[tab] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-[4px] border border-dashed border-ash p-16 flex flex-col items-center gap-4 text-smoke bg-pure-white/50">
            <span className="material-symbols-outlined text-[40px]">local_shipping</span>
            <p className="font-graphik text-[12px] uppercase tracking-widest font-bold">No deliveries found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredOrders.map((order) => {
              const isProcessing = processingId === order.orderId;
              return (
                <div
                  key={order.orderId}
                  className="rounded-[4px] border border-ash bg-pure-white shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-ash flex items-start justify-between bg-ash/10">
                    <div>
                      <h2 className="text-[20px] font-nantes text-ink-black mb-1">Order #{order.orderId}</h2>
                      <p className="text-[14px] font-graphik font-bold text-ink-black">रु {order.totalAmount.toLocaleString()}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-graphik font-bold uppercase tracking-widest border border-ash bg-pure-white text-ink-black">
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-6 flex-1">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-cream-paper rounded-[2px] border border-ash flex items-center justify-center text-smoke shrink-0">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-smoke font-graphik font-bold uppercase tracking-widest mb-1">Customer</p>
                        <p className="font-bold text-ink-black font-graphik text-[14px]">{order.customerName}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-cream-paper rounded-[2px] border border-ash flex items-center justify-center text-smoke shrink-0">
                        <span className="material-symbols-outlined text-[20px]">call</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-smoke font-graphik font-bold uppercase tracking-widest mb-1">Phone</p>
                        <p className="font-bold text-ink-black font-graphik text-[14px]">{order.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-cream-paper rounded-[2px] border border-ash flex items-center justify-center text-smoke shrink-0">
                        <span className="material-symbols-outlined text-[20px]">location_on</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-smoke font-graphik font-bold uppercase tracking-widest mb-1">Address</p>
                        <p className="font-bold text-ink-black font-graphik text-[14px] leading-relaxed">{order.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-6 border-t border-ash bg-cream-paper/50">
                    {order.status === "Assigned" ? (
                      <Button
                        disabled={isProcessing}
                        onClick={async () => {
                          setProcessingId(order.orderId);
                          try {
                            await startDelivery(order.orderId);
                            toast.success("Delivery started");
                            await loadOrders();
                          } catch {
                            toast.error("Failed to start delivery");
                          } finally {
                            setProcessingId(null);
                          }
                        }}
                        className="w-full flex justify-center items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[16px]">play_arrow</span> {isProcessing ? "Starting..." : "Start Delivery"}
                      </Button>
                    ) : order.status === "OutForDelivery" ? (
                      <div className="space-y-4">
                        {selectedOrderId === order.orderId ? (
                          <div className="flex flex-col gap-3">
                            <Input
                              type="text"
                              placeholder="Enter OTP"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              className="text-center tracking-[0.2em]"
                            />
                            <div className="flex gap-2">
                               <Button variant="outline" onClick={() => { setSelectedOrderId(null); setOtp(""); }} className="flex-1">
                                  Cancel
                               </Button>
                               <Button
                                  disabled={isProcessing}
                                  onClick={async () => {
                                    setProcessingId(order.orderId);
                                    try {
                                      await verifyDeliveryOtp(order.orderId, otp);
                                      toast.success("Delivery confirmed!");
                                      setOtp("");
                                      setSelectedOrderId(null);
                                      await loadOrders();
                                    } catch {
                                      toast.error("Invalid OTP");
                                    } finally {
                                      setProcessingId(null);
                                    }
                                  }}
                                  className="flex-1"
                               >
                                  {isProcessing ? "..." : "Verify OTP"}
                               </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            disabled={isProcessing}
                            onClick={async () => {
                              setProcessingId(order.orderId);
                              try {
                                await sendDeliveryOtp(order.orderId);
                                setSelectedOrderId(order.orderId);
                                toast.success("OTP sent to customer");
                              } catch {
                                toast.error("Failed to send OTP");
                              } finally {
                                setProcessingId(null);
                              }
                            }}
                            className="w-full flex justify-center items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[16px]">lock</span> {isProcessing ? "Sending..." : "Request OTP & Confirm"}
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 py-3 text-ink-black font-graphik font-bold text-[14px]">
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        <span>Delivery Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
