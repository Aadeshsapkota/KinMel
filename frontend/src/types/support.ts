export interface SupportMessage {
  id: number;
  senderId: number;
  senderName: string;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: number;
  subject: string;
  status: string;
  customerName: string;
  createdAt: string;
  messages: SupportMessage[];
}