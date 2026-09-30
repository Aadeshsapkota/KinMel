import { useEffect, useState } from "react";
import SellerLayout from "../../components/layouts/SellerLayout";
import { getSellerOrders } from "../../services/sellerService";
import type { SellerOrder } from "../../types/seller";

const STATUS_LABELS: Record<string, string> = {
  OutForDelivery: "Out for Delivery",
  ReturnRequested: "Return Requested",
};

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSellerOrders();
        setOrders(data);
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
              Loading Orders
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
            Fulfillment
          </span>
          <h1 className="text-[32px] font-nantes text-ink-black tracking-normal">
            Orders
          </h1>
        </div>

        <div className="rounded-[4px] border border-ash bg-pure-white shadow-sm overflow-hidden">
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
                    Your Revenue
                  </th>
                  <th className="px-6 py-4 font-bold">
                    Status
                  </th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold text-right">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ash">
                {orders.map((order) => (
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
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-graphik text-[12px] text-smoke">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        className="inline-flex items-center gap-2 rounded-[4px] border border-ash bg-pure-white px-3 py-1.5 text-[12px] font-graphik font-bold text-ink-black transition hover:bg-ash/30"
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order.orderId
                              ? null
                              : order.orderId,
                          )
                        }
                      >
                        {expandedOrder === order.orderId
                          ? "Hide Items"
                          : "View Items"}
                      </button>
                    </td>
                  </tr>
                ))}
                
                {orders.map((order) => expandedOrder === order.orderId && (
                  <tr key={`${order.orderId}-details`} className="bg-cream-paper">
                    <td colSpan={6} className="px-6 py-6 border-t border-ash">
                      <div className="space-y-4 max-w-3xl">
                        <h4 className="font-graphik font-bold text-[12px] uppercase tracking-widest text-smoke mb-4">Order Items</h4>
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 p-4 bg-pure-white border border-ash rounded-[4px]"
                          >
                            <div className="h-12 w-12 rounded-[2px] bg-cream-paper border border-ash overflow-hidden shrink-0">
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="h-full w-full object-cover mix-blend-multiply"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <span className="font-graphik font-bold text-[14px] text-ink-black block">
                                {item.productName}
                              </span>
                              <span className="text-[12px] font-graphik text-smoke">
                                Qty: {item.quantity}
                              </span>
                            </div>
                            <span className="font-graphik font-bold text-[14px] text-ink-black">
                              रु {item.total.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
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
