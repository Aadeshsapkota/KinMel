using System.Collections.Generic;

namespace ECommerce.API.DTOs.Requests
{
    public class AIChatRequest
    {
        public string Message { get; set; } = string.Empty;
        public List<ChatMessageHistory>? History { get; set; }
    }

    public class ChatMessageHistory
    {
        public string Role { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }
}
