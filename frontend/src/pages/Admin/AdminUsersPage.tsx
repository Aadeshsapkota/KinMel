import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import { getUsers, updateUserRole } from "../../services/adminService";
import toast from "react-hot-toast";
import type { AdminUser } from "../../types/admin";
import { Input } from "../../components/inputs/Input";
import { Button } from "../../components/buttons/Button";

const ROLE_OPTIONS = ["User", "DeliveryAgent", "Seller", "Admin"] as const;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [confirmAction, setConfirmAction] = useState<{
    userId: number;
    userName: string;
    currentRole: string;
    newRole: string;
  } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getUsers();
        setUsers(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleRoleChange(userId: number, newRole: string) {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    setConfirmAction({
      userId,
      userName: user.name,
      currentRole: user.role,
      newRole,
    });
  }

  async function confirmRoleChange() {
    if (!confirmAction) return;

    try {
      await updateUserRole(confirmAction.userId, confirmAction.newRole);
      setUsers(
        users.map((user) =>
          user.id === confirmAction.userId
            ? { ...user, role: confirmAction.newRole }
            : user,
        ),
      );
      toast.success(`Role updated to ${confirmAction.newRole}`);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Role update failed";
      toast.error(typeof message === "string" ? message : "Role update failed");
    } finally {
      setConfirmAction(null);
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleCounts = users.reduce(
    (acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-smoke">
            <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
            <span className="font-graphik text-[12px] uppercase tracking-widest animate-pulse">
              Loading Users
            </span>
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
            Accounts
          </span>
          <h1 className="text-[32px] font-nantes text-ink-black tracking-normal">
            Users
          </h1>
        </div>

        {/* Role Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          <button
            onClick={() => setRoleFilter("All")}
            className={`rounded-[4px] border p-6 text-left transition-all ${
              roleFilter === "All"
                ? "border-ink-black bg-cream-paper shadow-sm"
                : "border-ash bg-pure-white hover:border-ink-black"
            }`}
          >
            <p className="font-graphik text-[12px] font-bold uppercase tracking-widest text-smoke">
              All Users
            </p>
            <p className="font-nantes text-[32px] text-ink-black mt-2">{users.length}</p>
          </button>
          {ROLE_OPTIONS.map((role) => (
            <button
              key={role}
              onClick={() =>
                setRoleFilter(roleFilter === role ? "All" : role)
              }
              className={`rounded-[4px] border p-6 text-left transition-all ${
                roleFilter === role
                  ? "border-ink-black bg-cream-paper shadow-sm"
                  : "border-ash bg-pure-white hover:border-ink-black"
              }`}
            >
              <p className="font-graphik text-[12px] font-bold uppercase tracking-widest text-smoke">
                {role === "DeliveryAgent" ? "Agents" : role + "s"}
              </p>
              <p className="font-nantes text-[32px] text-ink-black mt-2">
                {roleCounts[role] || 0}
              </p>
            </button>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex gap-6 mb-8">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<span className="material-symbols-outlined text-smoke text-[20px]">search</span>}
            />
          </div>
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-smoke text-[20px] pointer-events-none">filter_alt</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full h-[52px] rounded-[4px] border border-ash bg-pure-white pl-12 pr-10 text-[16px] font-graphik text-ink-black focus:border-ink-black focus:ring-1 focus:ring-ink-black outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="All">All Roles</option>
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-smoke text-[20px] pointer-events-none">expand_more</span>
          </div>
        </div>

        <div className="rounded-[4px] border border-ash bg-pure-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-ash/30 font-graphik text-[12px] uppercase tracking-widest text-smoke border-b border-ash">
                <tr>
                  <th className="px-6 py-4 font-bold w-16">ID</th>
                  <th className="px-6 py-4 font-bold">User</th>
                  <th className="px-6 py-4 font-bold">Email</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 font-bold">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ash">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-cream-paper transition-colors"
                  >
                    <td className="px-6 py-4 font-graphik text-[12px] text-smoke">
                      #{user.id}
                    </td>
                    <td className="px-6 py-4 font-graphik font-bold text-[14px] text-ink-black flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-ash/30 flex items-center justify-center text-ink-black">
                        <span className="material-symbols-outlined text-[16px]">
                          {user.role === 'Admin' ? 'admin_panel_settings' : user.role === 'Seller' ? 'store' : user.role === 'DeliveryAgent' ? 'local_shipping' : 'person'}
                        </span>
                      </div>
                      {user.name}
                    </td>
                    <td className="px-6 py-4 font-graphik text-[14px] text-smoke">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          className="pl-3 pr-8 py-1.5 rounded-[2px] border border-ash bg-pure-white font-graphik text-[10px] font-bold uppercase tracking-widest text-ink-black outline-none cursor-pointer transition-all hover:border-ink-black appearance-none"
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-smoke text-[14px] pointer-events-none">expand_more</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-graphik text-[12px] text-smoke">
                      {new Date(user.createdDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-black/20 backdrop-blur-sm">
          <div className="bg-pure-white border border-ash rounded-[4px] p-8 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-[20px] font-nantes text-ink-black mb-4">
              Confirm Role Change
            </h3>
            <p className="font-graphik text-[14px] text-smoke leading-relaxed mb-8">
              Change <span className="font-bold text-ink-black">{confirmAction.userName}</span>'s role from{" "}
              <span className="inline-flex px-2 py-0.5 rounded-[2px] border border-ash bg-ash/30 text-[10px] font-bold font-graphik uppercase tracking-widest text-ink-black mx-1">
                {confirmAction.currentRole}
              </span>{" "}
              to{" "}
              <span className="inline-flex px-2 py-0.5 rounded-[2px] border border-ash bg-ash/30 text-[10px] font-bold font-graphik uppercase tracking-widest text-ink-black mx-1">
                {confirmAction.newRole}
              </span>
              ?
            </p>
            <div className="flex gap-4 justify-end">
              <Button
                variant="outline"
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmRoleChange}
              >
                Confirm Change
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
