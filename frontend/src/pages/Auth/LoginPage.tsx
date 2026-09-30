import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { login, googleLogin } from "../../services/authService";
import { GoogleLogin } from "@react-oauth/google";
import { Turnstile } from "react-turnstile";
import { Button } from "../../components/buttons/Button";
import { Input } from "../../components/inputs/Input";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA verification");
      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email,
        password,
        captchaToken,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("name", response.data.name);

      toast.success("Login successful");
      navigate("/");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Invalid credentials";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen flex flex-col bg-cream-paper">
      <header className="px-8 py-6 flex items-center justify-between bg-pure-white border-b border-ash">
        <Link
          to="/"
          className="text-[20px] font-nantes text-ink-black tracking-tight"
        >
          KinMel
        </Link>
        <div className="flex items-center gap-4 text-smoke">
          <span className="material-symbols-outlined text-[20px] cursor-pointer hover:text-ink-black transition-colors">language</span>
          <span className="material-symbols-outlined text-[20px] cursor-pointer hover:text-ink-black transition-colors">help_outline</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 relative">
        <div className="w-full max-w-[440px] bg-pure-white rounded-[4px] border border-ash p-8 md:p-10 relative z-10 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-[32px] font-nantes text-ink-black">Welcome Back</h1>
            <p className="font-graphik text-[14px] text-smoke mt-2">
              Access your personalized catalog
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-graphik text-[12px] font-bold text-ink-black uppercase tracking-widest mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<span className="material-symbols-outlined text-smoke text-[20px]">mail</span>}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-graphik text-[12px] font-bold text-ink-black uppercase tracking-widest">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="font-graphik text-[12px] text-smoke hover:text-ink-black hover:underline underline-offset-4 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<span className="material-symbols-outlined text-smoke text-[20px]">lock</span>}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-smoke hover:text-ink-black transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-[4px] border border-ash text-ink-black focus:ring-ink-black bg-pure-white"
              />
              <label htmlFor="remember" className="font-graphik text-[14px] text-smoke">
                Remember this device
              </label>
            </div>

            <div className="flex justify-center pt-2">
              <Turnstile
                sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                onVerify={(token) => {
                  console.log("CAPTCHA TOKEN RECEIVED:", token);
                  setCaptchaToken(token);
                }}
                onError={(error) => {
                  console.error("TURNSTILE ERROR:", error);
                }}
                onExpire={() => {
                  console.warn("CAPTCHA TOKEN EXPIRED");
                  setCaptchaToken("");
                }}
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !captchaToken}
              className="w-full justify-center py-4"
              size="lg"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </Button>

            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-ash"></div>
              <span className="px-4 font-graphik text-[12px] uppercase tracking-widest text-smoke">OR</span>
              <div className="flex-1 border-t border-ash"></div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const response = await googleLogin(
                      credentialResponse.credential!,
                    );

                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("role", response.data.role);
                    localStorage.setItem("email", response.data.email);
                    localStorage.setItem("name", response.data.name);

                    toast.success("Google login successful");
                    navigate("/");
                  } catch {
                    toast.error("Google login failed");
                  }
                }}
                onError={() => toast.error("Google login failed")}
              />
            </div>
          </form>

          <div className="mt-8 text-center font-graphik text-[14px] text-smoke">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-ink-black font-bold hover:underline underline-offset-4"
            >
              Create an account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
