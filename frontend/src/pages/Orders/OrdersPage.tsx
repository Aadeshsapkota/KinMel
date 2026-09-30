import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";

import { getOrders } from "../../services/orderService";

import type { Order } from "../../types/order";
import { BsBox } from "react-icons/bs";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  Pending:         { label: "Pending",          bg: "bg-amber-100",   text: "text-amber-700" },
  Assigned:        { label: "Assigned",         bg: "bg-blue-100",    text: "text-blue-700" },
  OutForDelivery:  { label: "Out for Delivery", bg: "bg-violet-100",  text: "text-violet-700" },
  Delivered:       { label: "Delivered",        bg: "bg-emerald-100", text: "text-emerald-700" },
  ReturnRequested: { label: "Return Requested", bg: "bg-orange-100",  text: "text-orange-700" },
  Returned:        { label: "Returned",         bg: "bg-rose-100",    text: "text-rose-700" },
  Cancelled:       { label: "Cancelled",        bg: "bg-red-100",     text: "text-red-700" },
};

const ALL_STATUSES = ["All", "Pending", "Assigned", "OutForDelivery", "Delivered", "ReturnRequested", "Returned", "Cancelled"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders();
        setOrders(data);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredOrders = activeFilter === "All"
    ? orders
    : orders.filter((o) => o.status === activeFilter);

  const statusCounts = ALL_STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = s === "All" ? orders.length : orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <MainLayout>
      <Container>
        <div className="py-20">
          <div className="mb-10">
            <h1 className="text-5xl font-bold">My Orders</h1>
            <p className="mt-3 text-slate-500">
              Track and manage your orders.
            </p>
          </div>

          {/* Status Filter Tabs */}
          {!loading && orders.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {ALL_STATUSES.map((s) => {
                const count = statusCounts[s] ?? 0;
                if (s !== "All" && count === 0) return null;
                const config = STATUS_CONFIG[s];
                const label = s === "All" ? "All Orders" : (config?.label ?? s);
                const isActive = activeFilter === s;
                return (
                  <button
                    key={s}
                    onClick={() => setActiveFilter(s)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {label}
                    <span className={`inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-xs font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-white text-slate-500"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin"></div>
                <span className="text-sm text-slate-500">Loading orders...</span>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-3xl border p-16 flex flex-col items-center gap-4 text-slate-400">
              <BsBox size={40} />
              <p className="text-lg font-medium">
                {activeFilter === "All" ? "No orders found" : `No ${STATUS_CONFIG[activeFilter]?.label ?? activeFilter} orders`}
              </p>
              {activeFilter !== "All" && (
                <button
                  onClick={() => setActiveFilter("All")}
                  className="text-sm text-emerald-600 hover:underline"
                >
                  View all orders
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {filteredOrders.map((order) => {
                const config = STATUS_CONFIG[order.status];
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-6 rounded-3xl border p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-5">
                      <img
                        src={order.productImage}
                        alt={order.productName}
                        className="h-24 w-24 rounded-2xl object-cover border"
                      />

                      <div>
                        <h3 className="text-xl font-semibold">
                          {order.productName}
                        </h3>

                        {order.itemCount > 1 && (
                          <p className="text-slate-500">
                            +{order.itemCount - 1} more item(s)
                          </p>
                        )}

                        <p className="mt-2 text-sm text-slate-500">
                          {new Date(order.createdDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          रु {order.totalAmount.toLocaleString()}
                        </div>

                        <div
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                            config ? `${config.bg} ${config.text}` : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {config?.label ?? order.status}
                        </div>
                      </div>

                      <Link
                        to={`/orders/${order.id}`}
                        className="rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </MainLayout>
  );
}
