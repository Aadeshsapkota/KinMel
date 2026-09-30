import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import {
  getDeliveryAgents,
  assignDeliveryAgent,
  getAllDeliveries,
} from "../../services/adminDeliveryService";
import toast from "react-hot-toast";
import { Button } from "../../components/buttons/Button";

const STATUS_LABELS: Record<string, string> = {
  OutForDelivery: "Out for Delivery",
  ReturnRequested: "Return Requested",
};

const ALL_STATUSES = ["All", "Pending", "Assigned", "OutForDelivery", "Delivered", "ReturnRequested", "Returned", "Cancelled"];

export default function DeliveryManagementPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [orderId, setOrderId] = useState("");
  const [agentId, setAgentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  async function load() {
    try {
      const [agentsData, ordersData] = await Promise.all([
        getDeliveryAgents(),
        getAllDeliveries(),
      ]);
      setAgents(agentsData);
      setOrders(ordersData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAssign() {
    if (!orderId || !agentId) {
      toast.error("Please select both an order and a delivery agent");
      return;
    }
    try {
      await assignDeliveryAgent(Number(orderId), Number(agentId));
      toast.success("Delivery agent assigned");
      load();
    } catch {
      toast.error("Failed to assign delivery agent");
    }
  }

  const filteredOrders = activeFilter === "All"
    ? orders
    : orders.filter((o: any) => o.status === activeFilter);

  const statusCounts = ALL_STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = s === "All" ? orders.length : orders.filter((o: any) => o.status === s).length;
    return acc;
  }, {});

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-smoke">
            <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
            <span className="font-graphik text-[12px] uppercase tracking-widest animate-pulse">Loading Deliveries...</span>
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
            Logistics
          </span>
          <h1 className="text-[32px] font-nantes text-ink-black tracking-normal">
            Delivery Management
          </h1>
        </div>

        {/* Assignment Panel */}
        <div className="rounded-[4px] border border-ash bg-pure-white p-8 shadow-sm mb-8">
          <h2 className="text-[16px] font-nantes text-ink-black mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">local_shipping</span> Assign Delivery Agent
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest text-ink-black mb-2">Order</label>
              <select
                className="w-full h-[52px] rounded-[4px] border border-ash bg-pure-white px-4 text-[16px] font-graphik text-ink-black focus:border-ink-black focus:ring-1 focus:ring-ink-black outline-none transition-all"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              >
                <option value="">Select Order</option>
                {orders.map((o: any) => (
                  <option key={o.orderId} value={o.orderId}>
                    #{o.orderId} — {o.customerName} ({STATUS_LABELS[o.status] ?? o.status})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest text-ink-black mb-2">Delivery Agent</label>
              <select
                className="w-full h-[52px] rounded-[4px] border border-ash bg-pure-white px-4 text-[16px] font-graphik text-ink-black focus:border-ink-black focus:ring-1 focus:ring-ink-black outline-none transition-all"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
              >
                <option value="">Select Agent</option>
                {agents.map((a: any) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAssign} className="w-full flex items-center justify-center gap-2 h-[52px]">
                <span className="material-symbols-outlined text-[16px]">sync</span> Assign / Reassign
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total", count: orders.length, icon: "inventory_2" },
            { label: "Assigned", count: statusCounts["Assigned"] ?? 0, icon: "person" },
            { label: "Out for Delivery", count: statusCounts["OutForDelivery"] ?? 0, icon: "local_shipping" },
            { label: "Delivered", count: statusCounts["Delivered"] ?? 0, icon: "check_circle" },
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

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {ALL_STATUSES.map((s) => {
            const count = statusCounts[s] ?? 0;
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
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Deliveries Table */}
        <div className="rounded-[4px] border border-ash bg-pure-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-ash/30 font-graphik text-[12px] uppercase tracking-widest text-smoke border-b border-ash">
                <tr>
                  <th className="px-6 py-4 font-bold">Order</th>
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Agent</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ash">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-smoke">
                        <span className="material-symbols-outlined text-[32px]">local_shipping</span>
                        <p className="font-graphik text-[12px] uppercase tracking-widest">No deliveries found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o: any) => {
                    return (
                      <tr key={o.orderId} className="hover:bg-cream-paper transition-colors">
                        <td className="px-6 py-4 font-graphik text-[12px] text-smoke">#{o.orderId}</td>
                        <td className="px-6 py-4 font-graphik font-bold text-[14px] text-ink-black">{o.customerName}</td>
                        <td className="px-6 py-4 font-graphik font-bold text-[14px] text-ink-black">रु {o.totalAmount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          {o.deliveryAgentName === "Not Assigned" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-graphik font-bold uppercase tracking-widest bg-ash/10 text-smoke border border-ash">
                              <span className="material-symbols-outlined text-[14px]">hourglass_empty</span> Unassigned
                            </span>
                          ) : (
                            <span className="font-graphik font-bold text-[14px] text-ink-black">{o.deliveryAgentName}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-graphik font-bold uppercase tracking-widest border border-ash bg-ash/30 text-ink-black`}>
                            {STATUS_LABELS[o.status] ?? o.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
