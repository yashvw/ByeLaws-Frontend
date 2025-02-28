import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export default function ChatInterface() {
  const BACKEND_URL = import.meta.env.REACT_APP_BACKEND_URL
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm the ByeLaws Assistant for Godrej 24. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false); // Loading state for API call

  const formatMessage = (text: string) => {
    return text
      .split("\n")
      .map((line, index) =>
        line.startsWith("*") ? <li key={index}>{line.replace("*", "").trim()}</li> : <p key={index}>{line}</p>
      );
  };
  

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.answer || "Sorry, I couldn't fetch an answer.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 2).toString(), content: "Error fetching response. Try again.", sender: "assistant", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };  

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4 w-full">
      <div className="container mx-auto flex justify-center">
      <div className="flex h-[700px] w-[90vw] max-w-[900px] min-w-[320px] flex-col rounded-3xl border shadow-sm overflow-hidden">
          {/* Header */}
          <header className="border-b px-6 py-4 text-center">
            <h1 className="text-2xl font-bold text-primary">Godrej 24</h1>
            <p className="text-lg p-1 text-muted-foreground">ByeLaws Assistant</p>
          </header>

          {/* Chat area */}
          <ScrollArea className="flex-1 p-4 min-h-[500px]">
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex max-w-[80%] gap-3 items-center">
                    {message.sender === "assistant" && (
                      <Avatar className="h-10 w-10 border-2 border-white rounded-full">
                        <AvatarFallback className="bg-primary text-primary-foreground">G24</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 border-2 border-white ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.content.includes("*") ? (
                        <ul className="list-disc pl-4">{formatMessage(message.content)}</ul>
                      ) : (
                        formatMessage(message.content)
                      )}
                      <p className="mt-1 text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {message.sender === "user" && (
                      <Avatar className="h-10 w-10 border-2 border-white rounded-full">
                        <AvatarFallback className="bg-secondary">U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex max-w-[80%] gap-3 items-center">
                    <Avatar className="h-10 w-10 border-2 border-white rounded-full">
                      <AvatarFallback className="bg-primary text-primary-foreground">G24</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 border-2 border-white bg-muted">Typing...</div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
                disabled={loading}
              />
              <Button onClick={handleSendMessage} size="icon" disabled={loading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}