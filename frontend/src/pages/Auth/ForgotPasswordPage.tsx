import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../../services/authService";
import { Button } from "../../components/buttons/Button";
import { Input } from "../../components/inputs/Input";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOtp() {
    try {
      setLoading(true);
      await forgotPassword(email);
      toast.success("OTP sent successfully");
      setStep(2);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    try {
      setLoading(true);
      await verifyOtp(email, otp);
      toast.success("OTP verified");
      setStep(3);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    try {
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      setLoading(true);
      await resetPassword(email, otp, newPassword);
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Failed to reset password"
      );
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
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-pure-white rounded-[4px] border border-ash p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-[28px] font-nantes text-ink-black">
              Reset Password
            </h1>
            <p className="text-[14px] font-graphik text-smoke mt-2">
              {step === 1 && "Enter your email to receive an OTP"}
              {step === 2 && "Enter the OTP sent to your email"}
              {step === 3 && "Create a new password"}
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-6">
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
                />
              </div>

              <Button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full justify-center py-4"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block font-graphik text-[12px] font-bold text-ink-black uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  disabled
                  icon={<span className="material-symbols-outlined text-smoke text-[20px]">mail</span>}
                />
              </div>

              <div>
                <label className="block font-graphik text-[12px] font-bold text-ink-black uppercase tracking-widest mb-2">
                  One-Time Password
                </label>
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  icon={<span className="material-symbols-outlined text-smoke text-[20px]">key</span>}
                />
              </div>

              <Button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full justify-center py-4"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block font-graphik text-[12px] font-bold text-ink-black uppercase tracking-widest mb-2">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  icon={<span className="material-symbols-outlined text-smoke text-[20px]">lock</span>}
                />
              </div>

              <div>
                <label className="block font-graphik text-[12px] font-bold text-ink-black uppercase tracking-widest mb-2">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<span className="material-symbols-outlined text-smoke text-[20px]">lock_reset</span>}
                />
              </div>

              <Button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full justify-center py-4"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          )}

          <div className="mt-8 text-center pt-6 border-t border-ash">
            <Link
              to="/login"
              className="font-graphik text-[14px] text-ink-black font-bold hover:underline underline-offset-4"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}