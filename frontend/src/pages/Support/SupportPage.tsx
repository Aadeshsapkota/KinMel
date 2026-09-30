import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../../components/layouts/MainLayout";

import { getMyTickets, createTicket } from "../../services/supportService";

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);

  const [subject, setSubject] = useState("");

  const [message, setMessage] = useState("");

  async function load() {
    try {
      const data = await getMyTickets();

      setTickets(data);
    } catch {
      toast.error("Failed to load tickets");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate() {
    if (!subject || !message) {
      toast.error("Fill all fields");

      return;
    }

    try {
      await createTicket(subject, message);

      toast.success("Ticket created");

      setSubject("");
      setMessage("");

      load();
    } catch {
      toast.error("Failed to create ticket");
    }
  }

  return (
    <MainLayout>
      <div
        className="
          max-w-6xl
          mx-auto
          p-8
        "
      >
        <h1
          className="
            text-4xl
            font-bold
            mb-8
          "
        >
          Support Center
        </h1>

        <div
          className="
            border
            rounded-2xl
            p-6
            mb-8
            bg-white
          "
        >
          <h2
            className="
              text-xl
              font-semibold
              mb-4
            "
          >
            Create Ticket
          </h2>

          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="
              w-full
              border
              rounded-lg
              p-3
              mb-4
            "
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="Describe your issue..."
            className="
              w-full
              border
              rounded-lg
              p-3
              mb-4
            "
          />

          <button
            onClick={handleCreate}
            className="
              bg-blue-600
              text-white
              px-5
              py-3
              rounded-lg
            "
          >
            Submit Ticket
          </button>
        </div>

        <div>
          <h2
            className="
              text-2xl
              font-semibold
              mb-4
            "
          >
            My Tickets
          </h2>

          <div className="space-y-4">
            {tickets.map((ticket: any) => (
              <div
                key={ticket.id}
                onClick={() => (window.location.href = `/support/${ticket.id}`)}
                className="
                  border
                  rounded-xl
                  p-5
                  bg-white
                  cursor-pointer
                  hover:border-blue-500
                  transition-all
                "
              >
                <div
                  className="
                    flex
                    justify-between
                  "
                >
                  <h3
                    className="
                      font-bold
                    "
                  >
                    {ticket.subject}
                  </h3>

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-medium
                      ${
                        ticket.status === "Open"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-700"
                      }
                    `}
                  >
                    {ticket.status}
                  </span>
                </div>

                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-2
                  "
                >
                  Ticket #{ticket.id}
                </p>
              </div>
            ))}

            {tickets.length === 0 && (
              <div
                className="
                  border
                  rounded-xl
                  p-6
                  text-slate-500
                "
              >
                No support tickets yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
