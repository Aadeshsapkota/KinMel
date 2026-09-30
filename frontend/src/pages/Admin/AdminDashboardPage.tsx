import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import { getDashboardStats, getUsers, getOrders } from "../../services/adminService";
import type { DashboardStats, AdminUser, AdminOrder } from "../../types/admin";

const STATUS_LABELS: Record<string, string> = {
  OutForDelivery: "Out for Delivery",
  ReturnRequested: "Return Requested",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, usersData, ordersData] = await Promise.all([
          getDashboardStats(),
          getUsers(),
          getOrders(),
        ]);
        setStats(statsData);
        setUsers(usersData);
        setOrders(ordersData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-smoke">
            <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
            <span className="font-graphik text-[12px] uppercase tracking-widest animate-pulse">Loading Dashboard</span>
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
            Overview & Analytics
          </span>
          <h1 className="text-[32px] font-nantes text-ink-black tracking-normal">
            Dashboard
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="rounded-[4px] border border-ash bg-pure-white p-6 shadow-sm relative overflow-hidden group hover:border-ink-black transition-all">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="material-symbols-outlined text-ink-black text-[24px]">group</span>
              <span className="font-graphik text-[12px] uppercase tracking-widest text-smoke">Total Users</span>
            </div>
            <h2 className="font-nantes text-[36px] text-ink-black relative z-10">{stats?.totalUsers.toLocaleString()}</h2>
          </div>

          <div className="rounded-[4px] border border-ash bg-pure-white p-6 shadow-sm relative overflow-hidden group hover:border-ink-black transition-all">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="material-symbols-outlined text-ink-black text-[24px]">inventory_2</span>
              <span className="font-graphik text-[12px] uppercase tracking-widest text-smoke">Total Products</span>
            </div>
            <h2 className="font-nantes text-[36px] text-ink-black relative z-10">{stats?.totalProducts.toLocaleString()}</h2>
          </div>

          <div className="rounded-[4px] border border-ash bg-pure-white p-6 shadow-sm relative overflow-hidden group hover:border-ink-black transition-all">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="material-symbols-outlined text-ink-black text-[24px]">shopping_bag</span>
              <span className="font-graphik text-[12px] uppercase tracking-widest text-smoke">Total Orders</span>
            </div>
            <h2 className="font-nantes text-[36px] text-ink-black relative z-10">{stats?.totalOrders.toLocaleString()}</h2>
          </div>

          <div className="rounded-[4px] border border-ink-black bg-ink-black text-pure-white p-6 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="material-symbols-outlined text-butter-highlight text-[24px]">payments</span>
              <span className="font-graphik text-[12px] uppercase tracking-widest text-pure-white/70">Total Revenue</span>
            </div>
            <h2 className="font-nantes text-[32px] text-pure-white relative z-10">रु {stats?.totalRevenue.toLocaleString()}</h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Users Table */}
          <div className="rounded-[4px] border border-ash bg-pure-white shadow-sm flex flex-col">
            <div className="p-6 border-b border-ash flex items-center justify-between">
              <h2 className="font-nantes text-[20px] text-ink-black">Recent Users</h2>
              <span className="font-graphik text-[12px] font-bold uppercase tracking-widest text-smoke">View All</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-ash/30 font-graphik text-[12px] uppercase tracking-widest text-smoke border-b border-ash">
                  <tr>
                    <th className="px-6 py-4 font-bold">ID</th>
                    <th className="px-6 py-4 font-bold">User</th>
                    <th className="px-6 py-4 font-bold">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ash">
                  {users.slice(0, 5).map((user) => (
                    <tr key={user.id} className="hover:bg-cream-paper transition-colors">
                      <td className="px-6 py-4 font-graphik text-[12px] text-smoke">#{user.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-graphik font-bold text-[14px] text-ink-black">{user.name}</div>
                        <div className="font-graphik text-[12px] text-smoke">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-[2px] text-[10px] font-graphik font-bold uppercase tracking-widest ${user.role === 'Admin' ? 'bg-ink-black text-pure-white' : 'bg-ash/50 text-ink-black'}`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="rounded-[4px] border border-ash bg-pure-white shadow-sm flex flex-col">
            <div className="p-6 border-b border-ash flex items-center justify-between">
              <h2 className="font-nantes text-[20px] text-ink-black">Recent Orders</h2>
              <span className="font-graphik text-[12px] font-bold uppercase tracking-widest text-smoke">View All</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-ash/30 font-graphik text-[12px] uppercase tracking-widest text-smoke border-b border-ash">
                  <tr>
                    <th className="px-6 py-4 font-bold">ID</th>
                    <th className="px-6 py-4 font-bold">Value</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ash">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-cream-paper transition-colors">
                      <td className="px-6 py-4 font-graphik text-[12px] text-smoke">#{order.id}</td>
                      <td className="px-6 py-4 font-graphik font-bold text-[14px] text-ink-black">रु{order.totalAmount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-graphik font-bold uppercase tracking-widest border border-ash bg-ash/30 text-ink-black`}>
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
