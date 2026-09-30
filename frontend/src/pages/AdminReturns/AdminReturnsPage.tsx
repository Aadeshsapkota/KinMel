import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../components/layouts/AdminLayout";

import {
  getReturnRequests,
  approveReturn,
  rejectReturn,
} from "../../services/returnService";

interface ReturnRequest {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  reason: string;
  status: string;
  requestedAt: string;
  processedAt: string | null;
  customerName: string;
}

const STATUS_TABS = ["All", "Pending", "Approved", "Rejected"] as const;

export default function AdminReturnsPage() {
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [processingId, setProcessingId] = useState<number | null>(null);

  async function load() {
    try {
      const data = await getReturnRequests();
      setRequests(data);
    } catch {
      toast.error("Failed to load return requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredRequests = activeTab === "All"
    ? requests
    : requests.filter((r) => r.status === activeTab);

  const counts = {
    All: requests.length,
    Pending: requests.filter((r) => r.status === "Pending").length,
    Approved: requests.filter((r) => r.status === "Approved").length,
    Rejected: requests.filter((r) => r.status === "Rejected").length,
  };

  async function handleApprove(id: number) {
    if (!window.confirm("Are you sure you want to approve this return? Stock will be restored.")) return;
    setProcessingId(id);
    try {
      await approveReturn(id);
      toast.success("Return approved");
      load();
    } catch {
      toast.error("Failed to approve return");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(id: number) {
    if (!window.confirm("Are you sure you want to reject this return request?")) return;
    setProcessingId(id);
    try {
      await rejectReturn(id);
      toast.success("Return rejected");
      load();
    } catch {
      toast.error("Failed to reject return");
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-smoke">
            <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
            <span className="font-graphik text-[12px] uppercase tracking-widest animate-pulse">Loading Returns...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-8">
        {/* Header */}
        <div className="mb-12 border-b border-ash pb-6">
          <span className="inline-block text-[12px] font-graphik font-bold uppercase tracking-[0.1em] text-ink-black mb-2">
            Operations
          </span>
          <h1 className="text-[32px] font-nantes text-ink-black tracking-normal">
            Return Requests
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total", count: counts.All, icon: "sync" },
            { label: "Pending", count: counts.Pending, icon: "hourglass_empty" },
            { label: "Approved", count: counts.Approved, icon: "check_circle" },
            { label: "Rejected", count: counts.Rejected, icon: "cancel" },
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
          {STATUS_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-[2px] font-graphik text-[12px] font-bold uppercase tracking-widest transition-all ${
                  isActive
                    ? "bg-ink-black text-pure-white"
                    : "bg-pure-white border border-ash text-smoke hover:border-ink-black hover:text-ink-black"
                }`}
              >
                {tab}
                <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-[2px] font-graphik text-[10px] font-bold ${
                  isActive ? "bg-pure-white/20 text-pure-white" : "bg-ash/50 text-ink-black"
                }`}>
                  {counts[tab as keyof typeof counts]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="rounded-[4px] border border-ash bg-pure-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-ash/30 font-graphik text-[12px] uppercase tracking-widest text-smoke border-b border-ash">
                <tr>
                  <th className="px-6 py-4 font-bold">ID</th>
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Order</th>
                  <th className="px-6 py-4 font-bold">Product</th>
                  <th className="px-6 py-4 font-bold">Reason</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ash">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-smoke">
                        <span className="material-symbols-outlined text-[32px]">sync</span>
                        <p className="font-graphik text-[12px] uppercase tracking-widest">No return requests found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => {
                    const isProcessing = processingId === request.id;
                    return (
                      <tr key={request.id} className="hover:bg-cream-paper transition-colors">
                        <td className="px-6 py-4 font-graphik text-[12px] text-smoke">#{request.id}</td>
                        <td className="px-6 py-4 font-graphik font-bold text-[14px] text-ink-black">{request.customerName}</td>
                        <td className="px-6 py-4 font-graphik text-[12px] text-smoke">#{request.orderId}</td>
                        <td className="px-6 py-4">
                          <div className="max-w-[180px] truncate font-graphik font-bold text-[14px] text-ink-black" title={request.productName}>{request.productName}</div>
                        </td>
                        <td className="px-6 py-4 font-graphik text-[14px] text-smoke">
                          <div className="max-w-[200px] truncate" title={request.reason}>{request.reason}</div>
                        </td>
                        <td className="px-6 py-4">
                          {request.status === "Pending" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-graphik font-bold uppercase tracking-widest bg-ash/10 text-smoke border border-ash">
                              <span className="material-symbols-outlined text-[14px]">hourglass_empty</span> Pending
                            </span>
                          )}
                          {request.status === "Approved" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-graphik font-bold uppercase tracking-widest bg-ink-black text-pure-white border border-ink-black">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span> Approved
                            </span>
                          )}
                          {request.status === "Rejected" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-graphik font-bold uppercase tracking-widest bg-ash/30 text-ink-black border border-ash">
                              <span className="material-symbols-outlined text-[14px]">cancel</span> Rejected
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-graphik text-[12px] text-smoke">
                          <div>{new Date(request.requestedAt).toLocaleDateString()}</div>
                          {request.processedAt && (
                            <div className="text-smoke/70 mt-0.5">
                              Processed: {new Date(request.processedAt).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {request.status === "Pending" ? (
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleApprove(request.id)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1.5 rounded-[4px] border border-ink-black bg-ink-black text-pure-white px-3 py-1.5 text-[12px] font-graphik font-bold transition hover:bg-charcoal disabled:opacity-50"
                              >
                                {isProcessing ? "..." : "Approve"}
                              </button>
                              <button
                                onClick={() => handleReject(request.id)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1.5 rounded-[4px] border border-ash bg-pure-white text-ink-black px-3 py-1.5 text-[12px] font-graphik font-bold transition hover:bg-ash/30 disabled:opacity-50"
                              >
                                {isProcessing ? "..." : "Reject"}
                              </button>
                            </div>
                          ) : (
                            <span className="font-graphik text-[10px] font-bold uppercase tracking-widest text-smoke">
                              {request.status === "Approved" ? "Completed" : "Closed"}
                            </span>
                          )}
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