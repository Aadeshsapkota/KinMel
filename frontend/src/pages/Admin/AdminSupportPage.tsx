import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/layouts/AdminLayout";
import { getAllTickets } from "../../services/supportService";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await getAllTickets();
      setTickets(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <div className="py-8">
        <div className="mb-12 border-b border-ash pb-6">
          <span className="inline-block text-[12px] font-graphik font-bold uppercase tracking-[0.1em] text-ink-black mb-2">
            Service
          </span>
          <h1 className="text-[32px] font-nantes text-ink-black tracking-normal">
            Support Tickets
          </h1>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center border border-ash rounded-[4px] bg-pure-white shadow-sm">
            <div className="flex flex-col items-center gap-4 text-smoke">
              <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
              <span className="font-graphik text-[12px] uppercase tracking-widest animate-pulse">
                Loading Tickets
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-[4px] border border-ash bg-pure-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-ash/30 font-graphik text-[12px] uppercase tracking-widest text-smoke border-b border-ash">
                  <tr>
                    <th className="px-6 py-4 font-bold">Ticket</th>
                    <th className="px-6 py-4 font-bold">Customer</th>
                    <th className="px-6 py-4 font-bold">Subject</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold">Created</th>
                    <th className="px-6 py-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ash">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-cream-paper transition-colors">
                      <td className="px-6 py-4 font-graphik text-[12px] text-smoke">
                        #{ticket.id}
                      </td>
                      <td className="px-6 py-4 font-graphik font-bold text-[14px] text-ink-black">
                        {ticket.customerName}
                      </td>
                      <td className="px-6 py-4 font-graphik font-bold text-[14px] text-ink-black">
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-graphik font-bold uppercase tracking-widest border ${
                            ticket.status === "Open"
                              ? "bg-ink-black text-pure-white border-ink-black"
                              : "bg-ash/30 text-smoke border-ash"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-graphik text-[12px] text-smoke">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/support/${ticket.id}`}
                          className="inline-flex items-center gap-2 rounded-[4px] border border-ash bg-pure-white px-3 py-1.5 text-[12px] font-graphik font-bold text-ink-black transition hover:bg-ash/30"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {tickets.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center font-graphik text-[14px] text-smoke"
                      >
                        No support tickets found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
