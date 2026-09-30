import { useEffect, useState } from "react";
import SellerLayout from "../../components/layouts/SellerLayout";
import { getSellerDashboard } from "../../services/sellerService";
import type { SellerDashboard } from "../../types/seller";

export default function SellerDashboardPage() {
  const [dashboard, setDashboard] = useState<SellerDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSellerDashboard();
        setDashboard(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <SellerLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-smoke">
            <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
            <span className="font-graphik text-[12px] uppercase tracking-widest animate-pulse">
              Loading Dashboard
            </span>
          </div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="py-8">
        <div className="mb-12 border-b border-ash pb-6">
           <span className="inline-block text-[12px] font-graphik font-bold uppercase tracking-[0.1em] text-ink-black mb-2">
             Store Overview
           </span>
           <h1 className="text-[32px] font-nantes text-ink-black tracking-normal">
             Seller Dashboard
           </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <div className="rounded-[4px] border border-ash bg-pure-white p-6 shadow-sm relative overflow-hidden group hover:border-ink-black transition-all">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="material-symbols-outlined text-ink-black text-[24px]">inventory_2</span>
              <span className="font-graphik text-[12px] uppercase tracking-widest text-smoke">
                Total Products
              </span>
            </div>
            <h2 className="font-nantes text-[36px] text-ink-black relative z-10">
              {dashboard?.totalProducts.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-[4px] border border-ash bg-pure-white p-6 shadow-sm relative overflow-hidden group hover:border-ink-black transition-all">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="material-symbols-outlined text-ink-black text-[24px]">shopping_bag</span>
              <span className="font-graphik text-[12px] uppercase tracking-widest text-smoke">
                Total Orders
              </span>
            </div>
            <h2 className="font-nantes text-[36px] text-ink-black relative z-10">
              {dashboard?.totalOrders.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-[4px] border border-ink-black bg-ink-black text-pure-white p-6 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="material-symbols-outlined text-butter-highlight text-[24px]">payments</span>
              <span className="font-graphik text-[12px] uppercase tracking-widest text-pure-white/70">
                Total Revenue
              </span>
            </div>
            <h2 className="font-nantes text-[32px] text-pure-white relative z-10">
              रु {dashboard?.totalRevenue.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-[4px] border border-ash bg-pure-white shadow-sm flex flex-col">
          <div className="p-6 border-b border-ash flex items-center justify-between">
            <h2 className="font-nantes text-[20px] text-ink-black">Recent Orders</h2>
            <span className="font-graphik text-[12px] font-bold uppercase tracking-widest text-smoke">View All</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-ash/30 font-graphik text-[12px] uppercase tracking-widest text-smoke border-b border-ash">
                <tr>
                  <th className="px-6 py-4 font-bold">
                    Order ID
                  </th>
                  <th className="px-6 py-4 font-bold">
                    Customer
                  </th>
                  <th className="px-6 py-4 font-bold">
                    Revenue
                  </th>
                  <th className="px-6 py-4 font-bold">
                    Status
                  </th>
                  <th className="px-6 py-4 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ash">
                {dashboard?.recentOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="hover:bg-cream-paper transition-colors"
                  >
                    <td className="px-6 py-4 font-graphik text-[12px] text-smoke">
                      #{order.orderId}
                    </td>
                    <td className="px-6 py-4 font-graphik font-bold text-[14px] text-ink-black">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 font-graphik font-bold text-[14px] text-ink-black">
                      रु {order.sellerTotal.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-graphik font-bold uppercase tracking-widest border border-ash bg-ash/30 text-ink-black`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-graphik text-[12px] text-smoke">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(!dashboard?.recentOrders ||
                  dashboard.recentOrders.length === 0) && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center font-graphik text-[14px] text-smoke"
                    >
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
