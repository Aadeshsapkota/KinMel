import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-cream-paper mt-20 pt-16 pb-8 border-t border-ash">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="space-y-6">
          <Link to="/" className="font-graphik text-[22px] tracking-[0.24em] uppercase text-ink-black shrink-0 block">
            KinMel
          </Link>
          <p className="text-smoke text-[14px] font-graphik leading-relaxed">
            Leading tech e-commerce platform delivering high-performance gadgets and electronics worldwide. Your trusted partner in innovation.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-8 h-8 rounded-full border border-ash flex items-center justify-center hover:border-ink-black transition-colors text-ink-black">
              <span className="material-symbols-outlined text-[16px]">share</span>
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-ash flex items-center justify-center hover:border-ink-black transition-colors text-ink-black">
              <span className="material-symbols-outlined text-[16px]">alternate_email</span>
            </a>
          </div>
        </div>

        {/* Useful Links */}
        <div className="space-y-6">
          <h4 className="font-nantes text-[22px] text-ink-black">Company</h4>
          <ul className="space-y-3 font-graphik text-[14px] text-smoke">
            <li><Link to="#" className="hover:text-ink-black transition-colors hover:underline underline-offset-4 decoration-1">About Us</Link></li>
            <li><Link to="#" className="hover:text-ink-black transition-colors hover:underline underline-offset-4 decoration-1">Terms & Conditions</Link></li>
            <li><Link to="#" className="hover:text-ink-black transition-colors hover:underline underline-offset-4 decoration-1">Privacy Policy</Link></li>
            <li><Link to="#" className="hover:text-ink-black transition-colors hover:underline underline-offset-4 decoration-1">Help Center</Link></li>
            <li><Link to="#" className="hover:text-ink-black transition-colors hover:underline underline-offset-4 decoration-1">Shipping Guide</Link></li>
          </ul>
        </div>

        {/* Shop Categories */}
        <div className="space-y-6">
          <h4 className="font-nantes text-[22px] text-ink-black">Department</h4>
          <ul className="space-y-3 font-graphik text-[14px] text-smoke">
            <li><Link to="/products" className="hover:text-ink-black transition-colors hover:underline underline-offset-4 decoration-1">Computer & Laptop</Link></li>
            <li><Link to="/products" className="hover:text-ink-black transition-colors hover:underline underline-offset-4 decoration-1">Cell Phone & Tablets</Link></li>
            <li><Link to="/products" className="hover:text-ink-black transition-colors hover:underline underline-offset-4 decoration-1">Video Game & VR</Link></li>
            <li><Link to="/products" className="hover:text-ink-black transition-colors hover:underline underline-offset-4 decoration-1">Smart Watches</Link></li>
            <li><Link to="/products" className="hover:text-ink-black transition-colors hover:underline underline-offset-4 decoration-1">Networking Devices</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-6">
          <h4 className="font-nantes text-[22px] text-ink-black">Newsletter</h4>
          <p className="text-smoke text-[14px] font-graphik">Subscribe to get latest news and promotional offers.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email..." 
              className="bg-pure-white border border-ash rounded-[4px] px-4 py-2 w-full focus:outline-none focus:border-ink-black text-ink-black font-graphikfix text-[14px]"
            />
            <button className="bg-ink-black text-pure-white px-4 py-2 rounded-[4px] font-graphik text-[14px] hover:bg-charcoal transition-all">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 mt-16 pt-8 border-t border-ash flex flex-col md:flex-row justify-between items-center gap-4 text-[14px] font-graphik text-smoke">
        <p>© 2026 KinMel.Shop eCommerce. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXnZ-hg5hfAoDB1cZmxTNk6kmPNWf5FY3Id1hKXGodtAJwdjpXfrCUax0BRTDXL1e5a9RpdQpjOy3Zca_uBLF_zYAx3wxgHY02wlSj1ec2Iq7qC65wYOEbTIzYvaz6OLlFNBL2x3FZ94jf41FwKusD6TXm0Lp_tyVIgmVyO4sMuLYu0tpPjHtlCA5iSRyxVNIs60_oEhQFIdMwN3tBu4TC6hf08v1TFWUQovx-cyMLzoMoUcKVxTtyGXo2UQhIFk5RhHPxNoOaUtM" alt="Visa" className="h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlQZAv0wkfHKmJWQe6-wP9_mV2hMIzKAuR_cO5EOpYEfM9GfZqnwOVvlD4eEbPDLYNQJvbskSSp0QxRIaNq1-fr1DHE50heekrUEskxfJpioRJHcIXMrKyfuGjhvyKNtYW37BV-intvdPiRY2KP_rrx8xR0VsLmcGjKIUw6qW6ZeVkCDBtyOj7dmXNa4EZtrkOcM6uaIXV2ahGy2FN49aRMOGZb2zCEWxWKq8gnFFFG0mER-wgy-cRfVTlj4gVtqSWPTSjUz52ZuY" alt="Mastercard" className="h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuChAs7VYq4dcGwpZGca8H-aqJh-3GmK8Jbr1RkeRkH9otgUwIiZy316H-xKMHM52DBb-Szm-BoWzF2qWMeGCsSabONuHeMqPOLKeAiashWlBodfvkno_QWPY4ZL7HTqHVQgtXjarqZrbeOK9QwlI_nCXUintsylSrAHbz2RT-74xiZlXj4acRsU-K9cjpDAX5CfquW1ceMIyZGhBcc81xeEDJmYeRVghcF9G4ex68IGziMXhNoaxEkTd79-yWMVVnmA9MSQUolUdHA" alt="Paypal" className="h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0qNEbIyvVL3OisDQBLMUQPEr37tpvPovzoqk-BuCwwopB02UJUl9c0zrwaBSLWTLvNJkaNd3WZ-jgzfQvp5sdu20xH2tVcBZb7W58N3SuE1F8l1LlEvzvitHm_ig_xNbzlJM6XSAFXv1-k6Tth0Qdrkrj_aQ9EBNpp5I2d5nl2Iq_gR_J2LdbX251kvL2a5Ug83C4tym5Sn_fry_adxYf4x0QSpyzD8YKaGfwH4Z5CoQq8Us19rMERqhB6FB5BQw9hKD4TqJxCQA" alt="Apple Pay" className="h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}
