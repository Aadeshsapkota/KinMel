import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { sendChatMessage } from "../../services/aiService";
import type { ChatMessageHistory } from "../../types/ai";

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessageHistory[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clear history on mount and just show welcome message
  useEffect(() => {
    setMessages([
      { role: "assistant", content: "Hi! I'm your KinMel AI Shopping Assistant. How can I help you find the perfect product today?" }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    const newMessages: ChatMessageHistory[] = [
      ...messages,
      { role: "user", content: userMessage }
    ];
    
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await sendChatMessage({
        message: userMessage,
        history: newMessages.slice(-10)
      });

      setMessages([
        ...newMessages,
        { role: "assistant", content: response.reply }
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "I'm sorry, I encountered an error connecting to my servers. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ink-black text-pure-white shadow-md hover:scale-105 active:scale-95 transition-all duration-300 group border border-ash"
      >
        <span className="material-symbols-outlined text-[24px] group-hover:animate-pulse">chat_bubble</span>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col bg-pure-white border border-ash rounded-[4px] shadow-lg transition-all duration-300 overflow-hidden ${
        isMinimized ? "w-80 h-14" : "w-[90vw] md:w-[400px] h-[80vh] md:h-[600px] max-h-[800px]"
      }`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between bg-ink-black px-4 py-3 text-pure-white cursor-pointer select-none"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2">
           <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
           <span className="font-graphik font-bold text-[14px] uppercase tracking-widest">AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            className="p-1 text-smoke hover:text-pure-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isMinimized ? "expand_less" : "expand_more"}
            </span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="p-1 text-smoke hover:text-pure-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>

      {/* Chat Body */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 bg-cream-paper scroll-smooth">
            <div className="flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-[4px] px-4 py-3 border ${
                      msg.role === "user"
                        ? "bg-ink-black text-pure-white border-ink-black rounded-br-[1px]"
                        : "bg-pure-white text-ink-black border-ash rounded-bl-[1px]"
                    }`}
                  >
                    {msg.role === "assistant" || msg.role === "model" ? (
                      <div className="font-graphik text-[14px] leading-relaxed prose prose-sm prose-p:my-1 prose-a:text-ink-black prose-a:underline prose-strong:font-bold">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="font-graphik text-[14px] break-words whitespace-pre-wrap">{msg.content}</div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-pure-white border border-ash rounded-[4px] rounded-bl-[1px] px-4 py-3 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-ink-black/50 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-ink-black/70 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 rounded-full bg-ink-black animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-pure-white border-t border-ash">
            <div className="flex items-center gap-2 bg-cream-paper border border-ash rounded-[4px] pr-1 pl-4 py-1 focus-within:border-ink-black transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent outline-none font-graphik text-[14px] text-ink-black placeholder:text-smoke py-2"
                style={{ border: 'none', boxShadow: 'none' }}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex h-8 w-8 items-center justify-center rounded-[2px] bg-ink-black text-pure-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-charcoal transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </div>
            <div className="text-center mt-2">
              <span className="font-graphik text-[10px] uppercase tracking-widest text-smoke">AI can make mistakes. Verify important info.</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
