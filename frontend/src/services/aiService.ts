import { api } from "../api/axios";
import type { AIChatRequest, AIChatResponse } from "../types/ai";

export async function sendChatMessage(request: AIChatRequest): Promise<AIChatResponse> {
  const response = await api.post<AIChatResponse>("/ai/chat", request);
  return response.data;
}
