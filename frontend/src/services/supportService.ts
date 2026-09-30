import { api } from "../api/axios";

export async function getMyTickets() {
  const response =
    await api.get(
      "/support/tickets"
    );

  return response.data;
}

export async function getTicket(
  id: number
) {
  const response =
    await api.get(
      `/support/tickets/${id}`
    );

  return response.data;
}

export async function createTicket(
  subject: string,
  message: string
) {
  const response =
    await api.post(
      "/support/tickets",
      {
        subject,
        message,
      }
    );

  return response.data;
}

export async function addReply(
  ticketId: number,
  message: string
) {
  const response =
    await api.post(
      `/support/tickets/${ticketId}/messages`,
      {
        message,
      }
    );

  return response.data;
}

export async function getAllTickets() {
  const response =
    await api.get(
      "/support/admin/tickets"
    );

  return response.data;
}

export async function closeTicket(
  ticketId: number
) {
  const response =
    await api.post(
      `/support/admin/tickets/${ticketId}/close`
    );

  return response.data;
}