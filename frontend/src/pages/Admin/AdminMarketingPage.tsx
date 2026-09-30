import { useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layouts/AdminLayout";
import { sendCampaign } from "../../services/marketingService";
import { Input } from "../../components/inputs/Input";
import { Button } from "../../components/buttons/Button";

export default function AdminMarketingPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!subject || !message || !bannerImageUrl) {
      toast.error("Fill all fields");
      return;
    }

    try {
      setLoading(true);
      await sendCampaign(subject, message, bannerImageUrl);
      toast.success("Campaign sent");
      setSubject("");
      setMessage("");
      setBannerImageUrl("");
    } catch {
      toast.error("Failed to send campaign");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="py-8 max-w-5xl">
        <div className="mb-12 border-b border-ash pb-6">
          <span className="inline-block text-[12px] font-graphik font-bold uppercase tracking-[0.1em] text-ink-black mb-2">
            Growth
          </span>
          <h1 className="text-[32px] font-nantes text-ink-black tracking-normal">
            Marketing Center
          </h1>
        </div>

        <div className="rounded-[4px] border border-ash bg-pure-white p-8 shadow-sm space-y-8">
          <div>
            <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest text-ink-black mb-2">
              Subject
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Summer Sale 2026"
            />
          </div>

          <div>
            <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest text-ink-black mb-2">
              Banner Image URL
            </label>
            <Input
              value={bannerImageUrl}
              onChange={(e) => setBannerImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block font-graphik text-[12px] font-bold uppercase tracking-widest text-ink-black mb-2">
              Message
            </label>
            <textarea
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full min-h-[160px] rounded-[4px] border border-ash bg-pure-white px-4 py-3 text-[16px] font-graphik text-ink-black focus:border-ink-black focus:ring-1 focus:ring-ink-black outline-none transition-all placeholder:text-smoke resize-y"
              placeholder="Write campaign content..."
            />
          </div>

          {bannerImageUrl && (
            <div>
              <p className="block font-graphik text-[12px] font-bold uppercase tracking-widest text-ink-black mb-4">
                Preview
              </p>
              <div className="rounded-[4px] border border-ash bg-cream-paper overflow-hidden inline-block">
                <img
                  src={bannerImageUrl}
                  alt="Preview"
                  className="max-h-80 object-cover mix-blend-multiply"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-ash flex justify-end">
            <Button
              onClick={handleSend}
              disabled={loading}
              className="w-full md:w-auto flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="material-symbols-outlined text-[16px] animate-spin">refresh</span> Sending...</>
              ) : (
                <><span className="material-symbols-outlined text-[16px]">send</span> Send Campaign</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}