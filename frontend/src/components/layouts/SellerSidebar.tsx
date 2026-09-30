import { Link, useLocation } from "react-router-dom";
import {
  BsGrid,
  BsBoxSeam,
  BsReceipt,
  BsShop,
} from "react-icons/bs";

interface SellerSidebarProps {
  isOpen?: boolean;
  setIsOpen?: (val: boolean) => void;
}

export default function SellerSidebar({ isOpen = true, setIsOpen }: SellerSidebarProps) {
  const location = useLocation();

  const mainLinks = [
    { path: "/seller", label: "Dashboard", icon: BsGrid },
    { path: "/seller/products", label: "Products", icon: BsBoxSeam },
    { path: "/seller/orders", label: "Orders", icon: BsReceipt },
  ];

  return (
    <aside 
      className={`fixed md:sticky top-0 left-0 h-screen w-64 border-r border-ash bg-pure-white flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="p-8 pb-8 flex items-center justify-between border-b border-ash">
        <div>
          <h1 className="text-[24px] font-nantes text-ink-black tracking-tight">
            KinMel
          </h1>
          <p className="text-[12px] text-smoke font-graphik uppercase tracking-widest mt-1">
            Seller Portal
          </p>
        </div>
        
        {/* Mobile Close Button */}
        {setIsOpen && (
          <button 
            className="md:hidden p-2 hover:bg-ash/30 rounded-[4px]"
            onClick={() => setIsOpen(false)}
          >
            <span className="material-symbols-outlined text-ink-black">close</span>
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-2">
        {mainLinks.map((link) => {
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen && setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-[14px] font-graphik font-bold transition-all border-r-[3px] ${
                isActive
                  ? "bg-ash/30 text-ink-black border-ink-black"
                  : "text-smoke border-transparent hover:text-ink-black hover:bg-ash/10 hover:border-smoke"
              }`}
            >
              <link.icon
                size={18}
                className={isActive ? "text-ink-black" : "text-smoke"}
              />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 space-y-1 border-t border-ash">
        <Link
          to="/"
          className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-graphik font-bold text-smoke hover:text-ink-black hover:bg-ash/10 transition-all border-r-[3px] border-transparent"
        >
          <BsShop size={18} className="text-smoke" />
          Back to Store
        </Link>
      </div>
    </aside>
  );
}
