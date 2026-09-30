import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import {
  getAllSellers,
  createSeller,
  updateSeller,
  deleteSeller,
} from "../../services/adminSellerService";
import { getUsers } from "../../services/adminService";
import toast from "react-hot-toast";
import type { Seller } from "../../types/seller";
import type { AdminUser } from "../../types/admin";
import { Input } from "../../components/inputs/Input";
import { Button } from "../../components/buttons/Button";

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Create form state
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newLogoUrl, setNewLogoUrl] = useState("");
  const [newUserId, setNewUserId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [sellersData, usersData] = await Promise.all([
        getAllSellers(),
        getUsers(),
      ]);
      setSellers(sellersData);
      setUsers(usersData);
    } finally {
      setLoading(false);
    }
  }

  const availableUsers = users.filter(
    (u) =>
      !sellers.some((s) => s.userId === u.id) &&
      (u.role === "User" || u.role === "Seller"),
  );

  const filteredSellers = sellers.filter(
    (s) =>
      s.companyName.toLowerCase().includes(search.toLowerCase()) ||
      s.userEmail.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleCreate() {
    if (!newCompanyName.trim() || !newUserId) {
      toast.error("Company name and user are required");
      return;
    }
    try {
      await createSeller({
        companyName: newCompanyName,
        description: newDescription,
        logoUrl: newLogoUrl || undefined,
        userId: Number(newUserId),
      });
      toast.success("Seller created");
      setShowCreateForm(false);
      setNewCompanyName("");
      setNewDescription("");
      setNewLogoUrl("");
      setNewUserId("");
      await loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create seller");
    }
  }

  async function handleToggleSuspend(seller: Seller) {
    try {
      await updateSeller(seller.id, {
        companyName: seller.companyName,
        description: seller.description,
        logoUrl: seller.logoUrl,
        isApproved: seller.isApproved,
        isSuspended: !seller.isSuspended,
      });
      toast.success(
        seller.isSuspended ? "Seller reactivated" : "Seller suspended",
      );
      await loadData();
    } catch {
      toast.error("Failed to update seller");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this seller? Their products will become unowned."))
      return;
    try {
      await deleteSeller(id);
      toast.success("Seller deleted");
      await loadData();
    } catch {
      toast.error("Failed to delete seller");
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-smoke">
            <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
            <span className="font-graphik text-[12px] uppercase tracking-widest animate-pulse">
              Loading Sellers
            </span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-ash pb-6">
          <div>
            <span className="inline-block text-[12px] font-graphik font-bold uppercase tracking-[0.1em] text-ink-black mb-2">
              Partners
            </span>
            <h1 className="text-[32px] font-nantes text-ink-black tracking-normal">
              Sellers
            </h1>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? "Cancel" : "Add Seller"}
          </Button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="rounded-[4px] border border-ash bg-pure-white p-8 mb-8 shadow-sm">
            <h3 className="text-[20px] font-nantes text-ink-black mb-6">Create New Seller</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest text-ink-black mb-2">
                  Company Name *
                </label>
                <Input
                  type="text"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="e.g. Apple Store"
                />
              </div>
              <div>
                <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest text-ink-black mb-2">
                  Assign User *
                </label>
                <select
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                  className="w-full h-[52px] rounded-[4px] border border-ash bg-pure-white px-4 text-[16px] font-graphik text-ink-black focus:border-ink-black focus:ring-1 focus:ring-ink-black outline-none transition-all"
                >
                  <option value="">Select a user</option>
                  {availableUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest text-ink-black mb-2">
                Description
              </label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full min-h-[120px] rounded-[4px] border border-ash bg-pure-white px-4 py-3 text-[14px] font-graphik text-ink-black focus:border-ink-black focus:ring-1 focus:ring-ink-black outline-none transition-all placeholder:text-smoke resize-none"
                placeholder="Brief company description..."
              />
            </div>
            <div className="mb-8">
              <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest text-ink-black mb-2">
                Logo URL
              </label>
              <Input
                type="text"
                value={newLogoUrl}
                onChange={(e) => setNewLogoUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <Button onClick={handleCreate}>
              Create Seller
            </Button>
          </div>
        )}

        {/* Search */}
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search sellers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<span className="material-symbols-outlined text-smoke text-[20px]">search</span>}
          />
        </div>

        {/* Sellers Table */}
        <div className="rounded-[4px] border border-ash bg-pure-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-ash/30 font-graphik text-[12px] uppercase tracking-widest text-smoke border-b border-ash">
                <tr>
                  <th className="px-6 py-4 font-bold">Seller</th>
                  <th className="px-6 py-4 font-bold">Owner</th>
                  <th className="px-6 py-4 font-bold">Products</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Created</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ash">
                {filteredSellers.map((seller) => (
                  <tr
                    key={seller.id}
                    className="hover:bg-cream-paper transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-[2px] bg-ash/30 flex items-center justify-center overflow-hidden">
                          {seller.logoUrl ? (
                            <img
                              src={seller.logoUrl}
                              alt={seller.companyName}
                              className="h-full w-full object-cover mix-blend-multiply"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-[20px] text-ink-black">store</span>
                          )}
                        </div>
                        <div>
                          <p className="font-graphik font-bold text-[14px] text-ink-black">
                            {seller.companyName}
                          </p>
                          <p className="font-graphik text-[12px] text-smoke mt-0.5">
                            {seller.totalProducts} products
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-graphik font-bold text-[14px] text-ink-black">
                          {seller.userName}
                        </p>
                        <p className="font-graphik text-[12px] text-smoke mt-0.5">
                          {seller.userEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-graphik font-bold text-[14px] text-ink-black">
                      {seller.totalProducts}
                    </td>
                    <td className="px-6 py-4">
                      {seller.isSuspended ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-graphik font-bold uppercase tracking-widest border border-ash bg-ash/30 text-ink-black">
                          <span className="material-symbols-outlined text-[14px]">pause_circle</span> Suspended
                        </span>
                      ) : seller.isApproved ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-graphik font-bold uppercase tracking-widest border border-ink-black bg-ink-black text-pure-white">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-graphik font-bold uppercase tracking-widest border border-ash bg-ash/10 text-smoke">
                          <span className="material-symbols-outlined text-[14px]">cancel</span> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-graphik text-[12px] text-smoke">
                      {new Date(seller.createdDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleSuspend(seller)}
                          className={`px-3 py-1.5 rounded-[4px] border text-[12px] font-graphik font-bold transition-all ${
                            seller.isSuspended
                              ? "border-ink-black bg-ink-black text-pure-white hover:bg-charcoal"
                              : "border-ash bg-pure-white text-ink-black hover:bg-ash/30"
                          }`}
                        >
                          {seller.isSuspended ? "Reactivate" : "Suspend"}
                        </button>
                        <button
                          onClick={() => handleDelete(seller.id)}
                          className="p-1.5 rounded-[4px] text-smoke hover:text-charcoal hover:bg-ash/30 transition-all"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredSellers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center font-graphik text-[14px] text-smoke"
                    >
                      No sellers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
