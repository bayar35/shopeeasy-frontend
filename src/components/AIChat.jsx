import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageToAI, clearChat } from "../features/ai/aiSlice";
import { Send, Delete, Close } from "@mui/icons-material";
import "./AIChat.css";

function AIChat() {
  const { messages, loading } = useSelector((state) => state.ai);
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Мессеж нэмэгдэхэд доош гүйлгэх
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || loading) return;

    // Хэрэглэгчийн мессежийг нэмэх
    const userMessage = { role: "user", content: input };

    // AI руу илгээх
    dispatch(
      sendMessageToAI({
        message: input,
        history: messages.slice(-10), // сүүлийн 10 мессеж
      })
    );

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Toggle chat
  if (!isOpen) {
    return (
      <button
        className="ai-chat-toggle"
        onClick={() => setIsOpen(true)}
        title="AI туслах"
      >
        <span className="ai-icon">🤖</span>
      </button>
    );
  }

  return (
    <div className="ai-chat-container">
      {/* Header */}
      <div className="ai-chat-header">
        <div className="ai-chat-title">
          <span className="ai-status-dot"></span>
          <span>ShopEasy AI</span>
        </div>
        <div className="ai-chat-actions">
          <button onClick={() => dispatch(clearChat())} title="Цэвэрлэх">
            <Delete fontSize="small" />
          </button>
          <button onClick={() => setIsOpen(false)} title="Хаах">
            <Close fontSize="small" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="ai-chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`ai-message ai-message-${msg.role}`}
          >
            <div className="ai-message-content">{msg.content}</div>
          </div>
        ))}

        {loading && (
          <div className="ai-message ai-message-assistant">
            <div className="ai-message-content">
              <div className="ai-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="ai-chat-input">
        <input
          type="text"
          placeholder="Мессеж бичих..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          title="Илгээх"
        >
          <Send fontSize="small" />
        </button>
      </div>
    </div>
  );
}

export default AIChat;