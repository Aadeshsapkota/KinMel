import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import MainLayout from "../../components/layouts/MainLayout";
import {
  getProfile,
  updateProfile,
  changePassword,
  getAddresses,
  addAddress,
  deleteAddress,
} from "../../services/profileService";
import type { Profile } from "../../types/profile";
import { Button } from "../../components/buttons/Button";
import { Input } from "../../components/inputs/Input";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    isPrimary: false,
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getProfile();
        setProfile(data);
        setName(data.name);
        setPhoneNumber(data.phoneNumber || "");

        const addrs = await getAddresses();
        setAddresses(addrs);
      } catch {
        toast.error("Please login again");
        navigate("/login");
      }
    }
    load();
  }, [navigate]);

  async function handleSaveProfile() {
    try {
      setIsSaving(true);
      await updateProfile(name, phoneNumber);
      localStorage.setItem("name", name);
      setProfile((prev) => (prev ? { ...prev, name, phoneNumber } : null));
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdatePassword() {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      setIsChangingPassword(true);
      await changePassword(oldPassword, newPassword, confirmPassword);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully");
    } catch {
      toast.error("Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    try {
      await addAddress(newAddress);
      toast.success("Address added successfully");
      setIsAddingAddress(false);
      setNewAddress({
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        isPrimary: false,
      });
      const addrs = await getAddresses();
      setAddresses(addrs);
    } catch {
      toast.error("Failed to add address");
    }
  }

  async function handleDeleteAddress(id: number) {
    try {
      await deleteAddress(id);
      toast.success("Address deleted");
      const addrs = await getAddresses();
      setAddresses(addrs);
    } catch {
      toast.error("Failed to delete address");
    }
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="flex h-[60vh] items-center justify-center bg-cream-paper">
          <span className="material-symbols-outlined text-4xl animate-spin text-smoke">refresh</span>
        </div>
      </MainLayout>
    );
  }

  const memberSince = new Date(profile.createdDate).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" },
  );

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col md:flex-row w-full bg-cream-paper min-h-screen">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-pure-white border-r border-ash flex flex-col min-h-[calc(100vh-73px)]">
          <div className="p-8 border-b border-ash">
            <h2 className="font-nantes text-[24px] text-ink-black">
              Account
            </h2>
            <p className="font-graphik text-[12px] text-smoke mt-1 uppercase tracking-widest">Settings</p>
          </div>
          <nav className="flex-1 py-4 space-y-1">
            <a
              href="#personal-info"
              className="flex items-center gap-3 px-8 py-4 bg-ash/30 text-ink-black font-graphik text-[14px] font-bold border-r-[3px] border-ink-black"
            >
              <span className="material-symbols-outlined text-[20px]">
                person
              </span>
              Personal Info
            </a>
            <a
              href="#security"
              className="flex items-center gap-3 px-8 py-4 text-smoke hover:text-ink-black font-graphik text-[14px] font-bold transition-colors border-r-[3px] border-transparent hover:border-smoke"
            >
              <span className="material-symbols-outlined text-[20px]">
                security
              </span>
              Security
            </a>
            <a
              href="#addresses"
              className="flex items-center gap-3 px-8 py-4 text-smoke hover:text-ink-black font-graphik text-[14px] font-bold transition-colors border-r-[3px] border-transparent hover:border-smoke"
            >
              <span className="material-symbols-outlined text-[20px]">
                location_on
              </span>
              Addresses
            </a>

            <Link
              to="/support"
              className="flex items-center gap-3 px-8 py-4 text-smoke hover:text-ink-black font-graphik text-[14px] font-bold transition-colors border-r-[3px] border-transparent hover:border-smoke"
            >
              <span className="material-symbols-outlined text-[20px]">
                support_agent
              </span>
              Support
            </Link>
          </nav>
          <div className="p-8 mt-auto border-t border-ash bg-pure-white">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-center"
            >
              <span className="material-symbols-outlined text-[18px]">
                logout
              </span>
              Log Out
            </Button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto">
          <div className="max-w-4xl space-y-16">
            {/* Header */}
            <div>
              <span className="inline-block text-[12px] font-graphik font-bold uppercase tracking-[0.1em] text-ink-black mb-4">
                Profile Dashboard
              </span>
              <h1 className="text-[40px] font-nantes text-ink-black mb-4">My Account</h1>
              <div className="h-[3px] w-12 bg-butter-highlight mb-4"></div>
              <p className="font-graphik text-[14px] text-smoke">
                Update your personal details and security preferences below.
              </p>
            </div>

            {/* Personal Information */}
            <section id="personal-info" className="space-y-8">
              <div className="flex items-center gap-3 border-b border-ash pb-4">
                <span className="material-symbols-outlined text-ink-black text-[24px]">
                  assignment_ind
                </span>
                <h2 className="text-[24px] font-nantes text-ink-black">
                  Personal Information
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-pure-white p-8 rounded-[4px] border border-ash">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-[4px] bg-charcoal text-pure-white flex items-center justify-center font-nantes text-[32px]">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[20px] font-nantes text-ink-black">
                      {profile.name}
                    </h3>
                    <p className="text-[12px] font-graphik uppercase tracking-widest text-smoke mb-3 mt-1">
                      Member since {memberSince}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="bg-ash text-ink-black text-[10px] font-graphik font-bold uppercase tracking-widest px-2.5 py-1 rounded-[4px]">
                        Account Active
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="font-graphik text-[14px] text-smoke hover:text-ink-black transition-colors"
                      >
                        Cancel
                      </button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 px-2">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-graphik text-[12px] font-bold text-ink-black uppercase tracking-widest">
                      Full Name
                    </label>
                  </div>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  ) : (
                    <div className="font-graphik text-[16px] text-ink-black pt-2 pb-3 border-b border-transparent">
                      {profile.name}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-graphik text-[12px] font-bold text-ink-black uppercase tracking-widest">
                      Email Address
                    </label>
                  </div>
                  <div className="font-graphik text-[16px] text-ink-black pt-2 pb-3 border-b border-transparent">
                    {profile.email}
                  </div>
                  {isEditing && (
                    <p className="text-[12px] font-graphik text-smoke mt-1">
                      Email cannot be changed.
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-graphik text-[12px] font-bold text-ink-black uppercase tracking-widest">
                      Phone Number
                    </label>
                  </div>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 012-3456"
                    />
                  ) : (
                    <div className="font-graphik text-[16px] text-ink-black pt-2 pb-3 border-b border-transparent">
                      {profile.phoneNumber || "Not provided"}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Security Section */}
            <section id="security" className="space-y-8">
              <div className="flex items-center gap-3 border-b border-ash pb-4">
                <span className="material-symbols-outlined text-ink-black text-[24px]">
                  security
                </span>
                <h2 className="text-[24px] font-nantes text-ink-black">Security</h2>
              </div>

              <div>
                <h3 className="text-[18px] font-nantes text-ink-black mb-1">
                  Change Password
                </h3>
                <p className="text-[14px] font-graphik text-smoke mb-8">
                  Update your account password to maintain security.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block font-graphik text-[12px] font-bold text-ink-black uppercase tracking-widest mb-2">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block font-graphik text-[12px] font-bold text-ink-black uppercase tracking-widest mb-2">
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block font-graphik text-[12px] font-bold text-ink-black uppercase tracking-widest mb-2">
                      Confirm Password
                    </label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <Button
                    onClick={handleUpdatePassword}
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-pure-white border border-ash rounded-[4px]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cream-paper border border-ash text-ink-black rounded-[4px] flex items-center justify-center">
                    <span className="material-symbols-outlined">
                      phonelink_setup
                    </span>
                  </div>
                  <div>
                    <h4 className="font-graphik font-bold text-[14px] text-ink-black">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-[12px] font-graphik text-smoke mt-1">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-ash peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-pure-white after:border-ash after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ink-black"></div>
                </label>
              </div>
            </section>

            {/* Address Book */}
            <section id="addresses" className="space-y-8">
              <div className="flex items-center justify-between border-b border-ash pb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-ink-black text-[24px]">
                    location_on
                  </span>
                  <h2 className="text-[24px] font-nantes text-ink-black">
                    Address Book
                  </h2>
                </div>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="text-ink-black font-graphik font-bold text-[14px] flex items-center gap-1 hover:underline underline-offset-4"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      add
                    </span>{" "}
                    Add New
                  </button>
                )}
              </div>

              {isAddingAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="bg-pure-white border border-ash p-8 rounded-[4px] space-y-6"
                >
                  <h3 className="font-nantes text-[20px] text-ink-black mb-4">
                    New Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      required
                      placeholder="Address Line 1"
                      value={newAddress.addressLine1}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          addressLine1: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Address Line 2 (Optional)"
                      value={newAddress.addressLine2}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          addressLine2: e.target.value,
                        })
                      }
                    />
                    <Input
                      required
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                    />
                    <Input
                      required
                      placeholder="State / Province"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                    />
                    <Input
                      required
                      placeholder="Postal Code"
                      value={newAddress.postalCode}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          postalCode: e.target.value,
                        })
                      }
                    />
                    <Input
                      required
                      placeholder="Country"
                      value={newAddress.country}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          country: e.target.value,
                        })
                      }
                    />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer mt-4">
                    <input
                      type="checkbox"
                      checked={newAddress.isPrimary}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          isPrimary: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-ink-black border-ash rounded-[4px] focus:ring-ink-black bg-pure-white"
                    />
                    <span className="text-[14px] font-graphik text-smoke">
                      Set as primary address
                    </span>
                  </label>
                  <div className="flex items-center justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="font-graphik text-[14px] text-smoke hover:text-ink-black transition-colors"
                    >
                      Cancel
                    </button>
                    <Button type="submit">
                      Save Address
                    </Button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border rounded-[4px] p-6 relative ${address.isPrimary ? "border-ink-black bg-ash/10" : "border-ash bg-pure-white"}`}
                  >
                    {address.isPrimary && (
                      <div className="absolute top-0 right-0 bg-ink-black text-pure-white text-[10px] font-graphik font-bold uppercase tracking-widest px-3 py-1">
                        Primary
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-6">
                      <span
                        className={`material-symbols-outlined ${address.isPrimary ? "text-ink-black" : "text-smoke"}`}
                      >
                        {address.isPrimary ? "home" : "location_on"}
                      </span>
                      <h4 className="font-graphik font-bold text-[14px] uppercase tracking-widest text-ink-black">
                        {address.isPrimary ? "Home" : "Address"}
                      </h4>
                    </div>
                    <div className="space-y-1 text-[14px] font-graphik text-smoke mb-8 min-h-[100px]">
                      <p className="text-ink-black">{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p>{address.country}</p>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-ash">
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="font-graphik text-[14px] text-smoke hover:text-red-700 transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          delete
                        </span>{" "}
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {!isAddingAddress && (
                  <div
                    onClick={() => setIsAddingAddress(true)}
                    className="border border-dashed border-ash rounded-[4px] p-6 flex flex-col items-center justify-center text-smoke hover:bg-pure-white hover:border-ink-black hover:text-ink-black transition-colors cursor-pointer min-h-[260px]"
                  >
                    <div className="w-12 h-12 rounded-[4px] bg-pure-white border border-ash flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined">add</span>
                    </div>
                    <span className="font-graphik font-bold text-[14px] uppercase tracking-widest">
                      Add New Address
                    </span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
