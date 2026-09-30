import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import { getOrders } from "../../services/adminService";
import type { AdminOrder } from "../../types/admin";
import { Link } from "react-router-dom";

const STATUS_LABELS: Record<string, string> = {
  OutForDelivery: "Out for Delivery",
  ReturnRequested: "Return Requested",
};

const ALL_STATUSES = ["All", "Pending", "Assigned", "OutForDelivery", "Delivered", "ReturnRequested", "Returned", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    async function load() {
      try {
        const data = await getOrders();
        setOrders(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredOrders = activeFilter === "All"
    ? orders
    : orders.filter((o) => o.status === activeFilter);

  const statusCounts = ALL_STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = s === "All" ? orders.length : orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  if (loading) {
    return (
       <AdminLayout>
         <div className="flex h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-smoke">
               <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
               <span className="font-graphik text-[12px] uppercase tracking-widest animate-pulse">Loading Orders</span>
            </div>
         </div>
       </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-8">
        <div className="mb-12 border-b border-ash pb-6">
           <span className="inline-block text-[12px] font-graphik font-bold uppercase tracking-[0.1em] text-ink-black mb-2">
             Fulfillment
           </span>
           <h1 className="text-[32px] font-nantes text-ink-black tracking-normal">
             Orders
           </h1>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {ALL_STATUSES.map((s) => {
            const label = s === "All" ? "All" : (STATUS_LABELS[s] ?? s);
            const isActive = activeFilter === s;
            return (
              <button
                key={s}
                onClick={() => setActiveFilter(s)}
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
                  {statusCounts[s] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <div className="rounded-[4px] border border-ash bg-pure-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-ash/30 font-graphik text-[12px] uppercase tracking-widest text-smoke border-b border-ash">
                <tr>
                  <th className="px-6 py-4 font-bold">Order ID</th>
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Value</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ash">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-smoke">
                        <span className="material-symbols-outlined text-[32px]">box</span>
                        <p className="font-graphik text-[12px] uppercase tracking-widest">No orders found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-cream-paper transition-colors">
                      <td className="px-6 py-4 font-graphik text-[12px] text-smoke">#{order.id}</td>
                      <td className="px-6 py-4 font-graphik font-bold text-[14px] text-ink-black">{order.customerName}</td>
                      <td className="px-6 py-4 font-graphik font-bold text-[14px] text-ink-black">रु {order.totalAmount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-graphik font-bold uppercase tracking-widest border border-ash bg-ash/30 text-ink-black`}>
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-graphik text-[12px] text-smoke">
                        {new Date(order.createdDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-2 rounded-[4px] border border-ash bg-pure-white px-3 py-1.5 text-[12px] font-graphik font-bold text-ink-black transition hover:bg-ash/30"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span> View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
