import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AdminLayout from "../../components/layouts/AdminLayout";
import { getOrderById, updateOrderStatus } from "../../services/adminService";
import type { AdminOrderDetails } from "../../types/admin";
import toast from "react-hot-toast";
import { Button } from "../../components/buttons/Button";

const ORDER_STATUSES = [
  { value: "Pending",          label: "Pending" },
  { value: "Assigned",         label: "Assigned" },
  { value: "OutForDelivery",   label: "Out for Delivery" },
  { value: "Delivered",        label: "Delivered" },
  { value: "ReturnRequested",  label: "Return Requested" },
  { value: "Returned",         label: "Returned" },
  { value: "Cancelled",        label: "Cancelled" },
];

export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<AdminOrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await getOrderById(Number(id));
        setOrder(data);
        setStatus(data.status);
      } catch {
        toast.error("Failed to load order data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleStatusUpdate() {
    if (!order) return;
    try {
      await updateOrderStatus(order.id, status);
      setOrder({ ...order, status });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  }

  if (loading) {
    return (
       <AdminLayout>
         <div className="flex h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-smoke">
               <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
               <span className="font-graphik text-[12px] uppercase tracking-widest animate-pulse">Loading Order Data...</span>
            </div>
         </div>
       </AdminLayout>
    );
  }

  if (!order) {
    return (
       <AdminLayout>
         <div className="flex flex-col items-center justify-center h-[60vh] text-smoke border border-dashed border-ash rounded-[4px] bg-cream-paper p-12">
            <span className="material-symbols-outlined text-[48px] mb-4">error</span>
            <p className="font-graphik text-[12px] uppercase tracking-widest">Order not found</p>
         </div>
       </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-8">
        <Link to="/admin/orders" className="inline-flex items-center gap-2 text-smoke hover:text-ink-black transition-colors font-graphik text-[12px] font-bold uppercase tracking-widest mb-12">
           <span className="material-symbols-outlined text-[16px]">arrow_back</span> Return to Orders
        </Link>
        
        <div className="mb-12 border-b border-ash pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
              <span className="inline-block text-[12px] font-graphik font-bold uppercase tracking-[0.1em] text-ink-black mb-2">
                Order Details
              </span>
              <h1 className="text-[32px] font-nantes text-ink-black tracking-normal">
                Order #{order.id}
              </h1>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           {/* Status Panel */}
           <div className="lg:col-span-1 space-y-8">
              <div className="rounded-[4px] border border-ash bg-pure-white p-8 shadow-sm">
                 <h2 className="text-[16px] font-nantes border-b border-ash pb-4 mb-6 flex items-center gap-2 text-ink-black">
                   <span className="material-symbols-outlined text-[20px]">receipt_long</span> Current Status
                 </h2>
                 <div className="space-y-6">
                    <div className="relative">
                       <select
                         value={status}
                         onChange={(e) => setStatus(e.target.value)}
                         className="w-full h-[52px] rounded-[4px] border border-ash bg-pure-white px-4 text-[16px] font-graphik text-ink-black focus:border-ink-black focus:ring-1 focus:ring-ink-black outline-none transition-all cursor-pointer appearance-none"
                       >
                         {ORDER_STATUSES.map((s) => (
                           <option key={s.value} value={s.value}>{s.label}</option>
                         ))}
                       </select>
                       <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-smoke text-[20px] pointer-events-none">expand_more</span>
                    </div>
                    <Button
                      onClick={handleStatusUpdate}
                      disabled={status === order.status}
                      className="w-full"
                    >
                      Update Status
                    </Button>
                 </div>
              </div>

              <div className="rounded-[4px] border border-ash bg-pure-white p-8 shadow-sm">
                 <h2 className="text-[16px] font-nantes border-b border-ash pb-4 mb-6 flex items-center gap-2 text-ink-black">
                   <span className="material-symbols-outlined text-[20px]">person</span> Customer Info
                 </h2>
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-cream-paper rounded-[2px] border border-ash flex items-center justify-center text-smoke">
                         <span className="material-symbols-outlined text-[20px]">person</span>
                       </div>
                       <div>
                          <p className="font-graphik text-[10px] font-bold uppercase tracking-widest text-smoke mb-1">Name</p>
                          <p className="font-graphik font-bold text-[14px] text-ink-black">{order.customerName}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-cream-paper rounded-[2px] border border-ash flex items-center justify-center text-smoke">
                         <span className="material-symbols-outlined text-[20px]">mail</span>
                       </div>
                       <div>
                          <p className="font-graphik text-[10px] font-bold uppercase tracking-widest text-smoke mb-1">Email</p>
                          <p className="font-graphik text-[14px] text-ink-black break-all">{order.customerEmail}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Order Items */}
           <div className="lg:col-span-2">
              <div className="rounded-[4px] border border-ash bg-pure-white shadow-sm overflow-hidden h-full flex flex-col">
                 <div className="p-8 border-b border-ash flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-[16px] font-nantes flex items-center gap-2 text-ink-black">
                      <span className="material-symbols-outlined text-[20px]">inventory_2</span> Order Items
                    </h2>
                    <div className="sm:text-right">
                       <p className="font-graphik text-[10px] font-bold uppercase tracking-widest text-smoke mb-1">Total Value</p>
                       <p className="text-[24px] font-nantes text-ink-black">रु {order.totalAmount.toLocaleString()}</p>
                    </div>
                 </div>
                 
                 <div className="flex-1 overflow-x-auto p-8">
                    <table className="w-full text-left">
                      <thead className="bg-ash/30 font-graphik text-[12px] uppercase tracking-widest text-smoke border-b border-ash">
                        <tr>
                          <th className="px-6 py-4 font-bold">Product</th>
                          <th className="px-6 py-4 font-bold text-center">Units</th>
                          <th className="px-6 py-4 font-bold text-right">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ash">
                        {order.items.map((item, index) => (
                          <tr key={index} className="hover:bg-cream-paper transition-colors">
                            <td className="px-6 py-4">
                               <div className="font-graphik font-bold text-[14px] text-ink-black">{item.productName}</div>
                            </td>
                            <td className="px-6 py-4 text-center">
                               <span className="inline-block px-3 py-1 rounded-[2px] bg-pure-white border border-ash font-graphik text-[12px] font-bold text-ink-black">
                                 ×{item.quantity}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-right font-graphik font-bold text-[14px] text-ink-black">
                               रु {item.price.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
