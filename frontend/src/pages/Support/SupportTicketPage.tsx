import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import * as signalR from "@microsoft/signalr";
import {
  connectToTicket,
  disconnectFromTicket,
} from "../../services/supportHub";
import MainLayout from "../../components/layouts/MainLayout";

import { getTicket, addReply } from "../../services/supportService";

export default function SupportTicketPage() {
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
        // If the component unmounted while we were connecting, disconnect immediately
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

  if (!ticket) {
    return (
      <MainLayout>
        <div className="p-8">Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div
        className="
          max-w-5xl
          mx-auto
          p-8
        "
      >
        <h1
          className="
            text-3xl
            font-bold
          "
        >
          {ticket.subject}
        </h1>

        <p className="mt-2">
          Status: <strong>{ticket.status}</strong>
        </p>

        <div
          className="
            mt-8
            border
            rounded-xl
            p-6
            space-y-4
            bg-white
          "
        >
          {ticket.messages?.map((msg: any) => (
            <div
              key={msg.id}
              className="
                  border-b
                  pb-4
                "
            >
              <div
                className="
                    font-semibold
                  "
              >
                {msg.senderName}
              </div>

              <div className="mt-1">{msg.message}</div>

              <div
                className="
                    text-xs
                    text-slate-500
                    mt-1
                  "
              >
                {new Date(msg.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {ticket.status !== "Closed" && (
          <div className="mt-6">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Write a reply..."
              className="
                w-full
                border
                rounded-xl
                p-4
              "
            />

            <button
              onClick={handleReply}
              className="
                mt-4
                bg-blue-600
                text-white
                px-5
                py-3
                rounded-lg
              "
            >
              Send Reply
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
