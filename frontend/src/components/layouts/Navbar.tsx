import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCart } from "../../services/cartService";
import { getCategories } from "../../services/categoryService";
import { useWishlist } from "../../contexts/WishlistContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../buttons/Button";
import type { Category } from "../../types/category";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [cartCount, setCartCount] = useState(0);
  const { wishlistCount } = useWishlist();
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    async function loadCart() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const items = await getCart();
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      } catch {
        //
      }
    }
    
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        // Silently fail if categories cannot load
      }
    }

    loadCart();
    loadCategories();
  }, []);

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && search.trim() !== "") {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setMobileMenuOpen(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("name");

    navigate("/login");
    window.location.reload();
  }

  return (
    <div className="flex flex-col w-full">
      {/* Slim Promo Banner */}
      <div className="w-full bg-cream-paper text-ink-black py-2 text-center text-[14px] font-graphik font-normal">
        Shop wholesale online from over 100,000 brands. <Link to="/register" className="underline decoration-1 underline-offset-2 hover:text-charcoal transition-colors">Sign up</Link>
      </div>

      {/* Main Header */}
      <header className="bg-pure-white border-b border-ash relative z-50">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between gap-4 md:gap-8">
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-ink-black"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          {/* Logo Wordmark */}
          <Link to="/" className="font-graphik text-[22px] tracking-[0.24em] text-ink-black uppercase shrink-0">
            KinMel
          </Link>

          {/* Hero Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-auto">
            <div className="flex items-center w-full bg-pure-white rounded-[40px] px-4 py-2 border border-ash focus-within:border-ink-black transition-colors">
              <span className="material-symbols-outlined text-smoke mr-2 text-[20px]">search</span>
              <input
                type="text"
                placeholder="Search products, brands, and categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                style={{ border: 'none', boxShadow: 'none' }}
                className="w-full bg-transparent outline-none font-graphik text-[16px] text-ink-black placeholder:text-smoke py-1"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            {/* Contextual Links based on role */}
            <div className="hidden lg:flex items-center gap-4">
              {role === "Admin" && (
                <Link to="/admin" className="text-[14px] font-graphik text-ink-black hover:underline decoration-1 underline-offset-4">Admin</Link>
              )}
              {role === "Seller" && (
                <Link to="/seller" className="text-[14px] font-graphik text-ink-black hover:underline decoration-1 underline-offset-4">Seller Portal</Link>
              )}
              {(role === "Admin" || role === "DeliveryAgent") && (
                <Link to="/delivery" className="text-[14px] font-graphik text-ink-black hover:underline decoration-1 underline-offset-4">Deliveries</Link>
              )}
              {(!role || role === "Customer") && (
                <Link to="/seller" className="text-[14px] font-graphik text-ink-black hover:underline decoration-1 underline-offset-4">Sign up to sell</Link>
              )}
            </div>

            <Link to="/wishlist" className="relative text-ink-black hover:text-charcoal transition-colors p-1">
              <span className="material-symbols-outlined text-[24px]">favorite</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-danger text-pure-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative text-ink-black hover:text-charcoal transition-colors p-1 mr-2 md:mr-0">
              <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-ink-black text-pure-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="relative p-1 text-ink-black hover:text-charcoal transition-colors flex items-center justify-center mr-2 md:mr-0"
              aria-label="Toggle Theme"
            >
              {resolvedTheme === "dark" ? (
                <span className="material-symbols-outlined text-[24px]">light_mode</span>
              ) : (
                <span className="material-symbols-outlined text-[24px]">dark_mode</span>
              )}
            </button>

            {/* Auth section */}
            {token ? (
              <div className="relative group hidden md:block">
                <button className="flex items-center gap-2 text-ink-black hover:text-charcoal transition-colors">
                   <span className="text-[14px] font-graphik hidden xl:block max-w-[100px] truncate">{name}</span>
                   <span className="material-symbols-outlined text-[24px]">person</span>
                </button>
                <div className="absolute right-0 top-full pt-2 w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-pure-white border border-ash rounded-[4px] py-2 shadow-sm flex flex-col">
                    <Link to="/profile" className="px-4 py-2 text-[14px] font-graphik text-ink-black hover:bg-cream-paper transition-colors">Profile</Link>
                    <Link to="/orders" className="px-4 py-2 text-[14px] font-graphik text-ink-black hover:bg-cream-paper transition-colors">Orders</Link>
                    <button onClick={handleLogout} className="px-4 py-2 text-[14px] font-graphik text-left text-danger hover:bg-cream-paper transition-colors whitespace-nowrap">Sign Out</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign in</Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/register')}>Sign up to buy</Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Top Category Nav Bar */}
      <nav className="bg-cream-paper border-b border-ash hidden lg:block relative z-40">
        <div className="max-w-[1280px] mx-auto px-12 flex justify-center items-center flex-wrap py-3 gap-x-6 gap-y-2">
           <Link to="/products" className="text-[14px] font-graphik text-ink-black font-medium hover:underline decoration-1 underline-offset-4">All Products</Link>
           {categories.slice(0, 10).map((cat) => (
             <Link key={cat.id} to={`/products?category=${encodeURIComponent(cat.name)}`} className="text-[14px] font-graphik text-ink-black hover:underline decoration-1 underline-offset-4">
               {cat.name}
             </Link>
           ))}
        </div>
      </nav>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-ink-black/20 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-[280px] bg-pure-white z-[70] transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col border-r border-ash ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-ash flex justify-between items-center">
          <span className="font-graphik tracking-[0.24em] uppercase text-ink-black text-[18px]">Menu</span>
          <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-smoke hover:text-ink-black">
             <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-4 border-b border-ash">
          <div className="flex items-center w-full bg-pure-white rounded-[40px] px-4 py-2 border border-ash focus-within:border-ink-black">
             <input
               type="text"
               placeholder="Search..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               onKeyDown={handleSearch}
               style={{ border: 'none', boxShadow: 'none' }}
               className="w-full bg-transparent outline-none font-graphik text-[14px] text-ink-black placeholder:text-smoke py-1"
             />
             <span className="material-symbols-outlined text-smoke text-[20px]" onClick={() => handleSearch({ key: 'Enter' } as React.KeyboardEvent<HTMLInputElement>)}>search</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-[16px] font-graphik text-ink-black">Home</Link>
          <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="text-[16px] font-graphik text-ink-black">Products</Link>
          <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="text-[16px] font-graphik text-ink-black">Cart</Link>
          <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-[16px] font-graphik text-ink-black">Wishlist</Link>
          <div className="h-[1px] bg-ash my-2"></div>
          {role === "Admin" && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-[16px] font-graphik text-ink-black">Admin Dashboard</Link>
          )}
          {role === "Seller" && (
            <Link to="/seller" onClick={() => setMobileMenuOpen(false)} className="text-[16px] font-graphik text-ink-black">Seller Dashboard</Link>
          )}
          {(role === "Admin" || role === "DeliveryAgent") && (
            <Link to="/delivery" onClick={() => setMobileMenuOpen(false)} className="text-[16px] font-graphik text-ink-black">Deliveries</Link>
          )}
        </div>

        <div className="p-4 border-t border-ash bg-cream-paper">
          {token ? (
            <div className="flex flex-col gap-3">
              <span className="text-[14px] font-graphik text-smoke">Logged in as {name}</span>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-[16px] font-graphik text-ink-black hover:underline">Profile</Link>
              <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="text-[16px] font-graphik text-ink-black hover:underline">Orders</Link>
              <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="text-left text-[16px] font-graphik text-danger hover:underline">Sign Out</button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Button variant="ghost" className="w-full justify-start border border-ash" onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}>Sign in</Button>
              <Button variant="primary" className="w-full" onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}>Sign up to buy</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
