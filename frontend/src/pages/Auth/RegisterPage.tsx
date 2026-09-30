import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../../services/authService";
import { Button } from "../../components/buttons/Button";
import { Input } from "../../components/inputs/Input";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!agreed) {
      toast.error("You must agree to the Terms of Service");
      return;
    }

    try {
      setLoading(true);
      await register({ name, email, password });
      toast.success("Account created successfully");
      navigate("/login");
    } catch {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-paper">
      {/* Header - Only visible on mobile/tablet */}
      <header className="lg:hidden px-8 py-6 flex items-center justify-between bg-pure-white border-b border-ash">
        <Link to="/" className="text-[20px] font-nantes text-ink-black tracking-tight">KinMel</Link>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side - Editorial Look */}
        <div className="hidden lg:flex flex-col justify-between w-[45%] bg-charcoal text-pure-white p-12 xl:p-20 relative overflow-hidden">
          
          <div className="relative z-10">
            <Link to="/" className="text-[24px] font-nantes text-pure-white hover:text-cream-paper transition-colors">KinMel</Link>
          </div>
          
          <div className="space-y-6 relative z-10 mt-12">
            <span className="inline-block text-[12px] font-graphik font-bold uppercase tracking-[0.1em] text-cream-paper mb-4 opacity-70">
              Membership
            </span>
            <h1 className="text-[48px] font-nantes leading-[1.2]">Curate Your <br />Lifestyle.</h1>
            <div className="h-[3px] w-12 bg-butter-highlight mt-6 mb-6"></div>
            <p className="font-graphik text-[16px] text-cream-paper/80 max-w-md leading-[1.6]">
              Join our community for access to exclusive collections, priority support, and a seamless retail experience.
            </p>
            
            <div className="flex flex-col xl:flex-row items-center gap-6 pt-12">
              <div className="border border-pure-white/20 p-6 rounded-[4px] w-full bg-pure-white/5">
                <span className="material-symbols-outlined text-[24px] mb-3 text-butter-highlight">verified_user</span>
                <div className="font-graphik font-bold text-[14px]">Secure Account</div>
              </div>
              <div className="border border-pure-white/20 p-6 rounded-[4px] w-full bg-pure-white/5">
                <span className="material-symbols-outlined text-[24px] mb-3 text-butter-highlight">local_shipping</span>
                <div className="font-graphik font-bold text-[14px]">Priority Fulfillment</div>
              </div>
            </div>
          </div>
          
          <div className="font-graphik text-[12px] uppercase tracking-widest text-pure-white/50 relative z-10 mt-20">
            © {new Date().getFullYear()} KinMel Retail.
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex flex-col bg-cream-paper">
          {/* Desktop Header Links */}
          <div className="hidden lg:flex justify-end items-center gap-8 p-8 font-graphik text-[12px] font-bold uppercase tracking-widest text-smoke">
            <Link to="/products" className="hover:text-ink-black transition-colors">Catalog</Link>
            <Link to="/products" className="hover:text-ink-black transition-colors">Collections</Link>
            <span className="material-symbols-outlined text-[20px] cursor-pointer hover:text-ink-black transition-colors">language</span>
            <span className="material-symbols-outlined text-[20px] cursor-pointer hover:text-ink-black transition-colors">help_outline</span>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-[460px]">
              <div className="mb-10">
                <h2 className="text-[32px] font-nantes text-ink-black">Create Account</h2>
                <p className="font-graphik text-[14px] text-smoke mt-2">Set up your profile to continue.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-graphik text-[12px] font-bold text-ink-black uppercase tracking-widest mb-2">Full Name</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<span className="material-symbols-outlined text-[20px] text-smoke">person</span>}
                    required
                  />
                </div>

                <div>
                  <label className="block font-graphik text-[12px] font-bold text-ink-black uppercase tracking-widest mb-2">Email Address</label>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<span className="material-symbols-outlined text-[20px] text-smoke">mail</span>}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-graphik text-[12px] font-bold text-ink-black uppercase tracking-widest mb-2">Password</label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={<span className="material-symbols-outlined text-[20px] text-smoke">lock</span>}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-graphik text-[12px] font-bold text-ink-black uppercase tracking-widest mb-2">Confirm Password</label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      icon={<span className="material-symbols-outlined text-[20px] text-smoke">lock_reset</span>}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end">
                   <button 
                     type="button" 
                     onClick={() => setShowPassword(!showPassword)}
                     className="font-graphik text-[12px] text-smoke hover:text-ink-black flex items-center gap-1 transition-colors"
                   >
                     <span className="material-symbols-outlined text-[16px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                     {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                   </button>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="terms"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded-[4px] border-ash text-ink-black focus:ring-ink-black bg-pure-white" 
                  />
                  <label htmlFor="terms" className="font-graphik text-[14px] text-smoke cursor-pointer leading-relaxed">
                    I agree to the <a href="#" className="text-ink-black font-bold hover:underline underline-offset-4">Terms of Service</a> and <a href="#" className="text-ink-black font-bold hover:underline underline-offset-4">Privacy Policy</a>.
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full justify-center mt-8 py-4"
                  size="lg"
                >
                  {loading ? "Registering..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-10 text-center font-graphik text-[14px] text-smoke border-t border-ash pt-8">
                Already have an account? <Link to="/login" className="text-ink-black font-bold hover:underline underline-offset-4">Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Only visible on mobile/tablet */}
      <footer className="lg:hidden px-8 py-6 border-t border-ash bg-pure-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-graphik text-[12px] text-smoke text-center md:text-left uppercase tracking-widest">
          <span className="font-bold text-ink-black mr-2">KinMel</span>
          © {new Date().getFullYear()} Retail.
        </div>
      </footer>
    </div>
  );
}