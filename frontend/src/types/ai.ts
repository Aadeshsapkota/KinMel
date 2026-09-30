export interface ChatMessageHistory {
  role: "user" | "assistant" | "model";
  content: string;
}

export interface AIChatRequest {
  message: string;
  history?: ChatMessageHistory[];
}

export interface AIChatResponse {
  reply: string;
}
