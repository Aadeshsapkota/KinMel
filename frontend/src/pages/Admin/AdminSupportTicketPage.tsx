import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import * as signalR from "@microsoft/signalr";
import {
  connectToTicket,
  disconnectFromTicket,
} from "../../services/supportHub";
import AdminLayout from "../../components/layouts/AdminLayout";
import { Button } from "../../components/buttons/Button";
import {
  getTicket,
  addReply,
  closeTicket,
} from "../../services/supportService";

export default function AdminSupportTicketPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [message, setMessage] = useState("");

  async function load() {
    if (!id) return;
    const data = await getTicket(Number(id));
    setTicket(data);
  }

  useEffect(() => {
    load();

    if (!id) return;

    let connection: signalR.HubConnection | null = null;
    let isMounted = true;

    const setupSignalR = async () => {
      const newConnection = await connectToTicket(
        Number(id),
        (newMessage) => {
          setTicket((prev: any) => {
            if (!prev) return prev;

            const exists = prev.messages?.some(
              (m: any) => m.id === newMessage.id
            );

            if (exists) {
              return prev;
            }

            return {
              ...prev,
              messages: [...prev.messages, newMessage],
            };
          });
        }
      );

      if (isMounted) {
        connection = newConnection;
      } else {
        disconnectFromTicket(newConnection, Number(id));
      }
    };

    setupSignalR();

    return () => {
      isMounted = false;
      if (connection) {
        disconnectFromTicket(connection, Number(id));
      }
    };
  }, [id]);

  async function handleReply() {
    if (!message.trim()) {
      return;
    }
    try {
      await addReply(Number(id), message);
      setMessage("");
      toast.success("Reply sent");
    } catch {
      toast.error("Failed to send reply");
    }
  }

  async function handleClose() {
    if (!window.confirm("Close this ticket?")) {
      return;
    }
    try {
      await closeTicket(Number(id));
      await load();
      toast.success("Ticket closed");
    } catch {
      toast.error("Failed to close ticket");
    }
  }

  if (!ticket) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-smoke">
            <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
            <span className="font-graphik text-[12px] uppercase tracking-widest animate-pulse">
              Loading Ticket
            </span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-8 max-w-4xl mx-auto">
        <Link to="/admin/support" className="inline-flex items-center gap-2 text-smoke hover:text-ink-black transition-colors font-graphik text-[12px] font-bold uppercase tracking-widest mb-12">
           <span className="material-symbols-outlined text-[16px]">arrow_back</span> Return to Tickets
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12 border-b border-ash pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-graphik font-bold uppercase tracking-widest border border-ash bg-ash/30 text-ink-black mb-4">
              Ticket #{ticket.id}
            </span>
            <h1 className="text-[32px] font-nantes text-ink-black tracking-normal mb-2">
              {ticket.subject}
            </h1>
            <p className="font-graphik text-[14px] text-smoke">
              Customer: <span className="font-bold text-ink-black">{ticket.customerName}</span>
            </p>
          </div>

          {ticket.status === "Open" && (
            <Button
              variant="outline"
              onClick={handleClose}
            >
              Close Ticket
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[4px] border border-ash bg-pure-white shadow-sm divide-y divide-ash">
            {ticket.messages?.map((msg: any) => {
              const isAdmin = msg.senderName === "Admin";
              return (
                <div
                  key={msg.id}
                  className={`p-6 ${isAdmin ? "bg-cream-paper/50" : ""}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[2px] bg-ash/30 flex items-center justify-center text-ink-black">
                        <span className="material-symbols-outlined text-[16px]">
                          {isAdmin ? "support_agent" : "person"}
                        </span>
                      </div>
                      <span className="font-graphik font-bold text-[14px] text-ink-black">
                        {msg.senderName}
                      </span>
                    </div>
                    <span className="font-graphik text-[12px] text-smoke">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="font-graphik text-[14px] text-ink-black leading-relaxed pl-11 whitespace-pre-wrap">
                    {msg.message}
                  </div>
                </div>
              );
            })}
          </div>

          {ticket.status === "Open" ? (
            <div className="rounded-[4px] border border-ash bg-pure-white p-6 shadow-sm">
              <h3 className="font-graphik font-bold text-[12px] uppercase tracking-widest text-ink-black mb-4">
                Reply to Customer
              </h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Type your message here..."
                className="w-full rounded-[4px] border border-ash bg-pure-white px-4 py-3 text-[14px] font-graphik text-ink-black focus:border-ink-black focus:ring-1 focus:ring-ink-black outline-none transition-all placeholder:text-smoke resize-y mb-4"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleReply}
                  disabled={!message.trim()}
                  className="flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span> Send Reply
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-[4px] border border-ash bg-cream-paper p-6 text-center">
              <span className="material-symbols-outlined text-[32px] text-smoke mb-2">lock</span>
              <p className="font-graphik font-bold text-[12px] uppercase tracking-widest text-smoke">
                This ticket has been closed
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
