

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageCircle, X } from "lucide-react"; 

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([
    { type: "bot", text: "👋 Welcome! I can help you with roadmaps, upskilling advice, and career guidance. Ask me anything!" },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setChat((prev) => [...prev, { type: "user", text: question }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat/ask", {
        question,
      });

      setChat((prev) => [
        ...prev,
        { type: "bot", text: res.data.answer },
      ]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        {
          type: "error",
          text:
            "⚠️ " +
            (error.response?.data?.message || "Something went wrong, please try again."),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition transform duration-300"
      >
        {open ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* Chatbot Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white font-semibold flex justify-between items-center">
            <span>Upskill Chatbot 🤖</span>
            <button onClick={() => setOpen(false)} className="hover:text-gray-200">
              <X size={20} />
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chat.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.type === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg ${
                    msg.type === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none"
                      : msg.type === "error"
                      ? "bg-red-600 text-white rounded-bl-none"
                      : "bg-gray-800 text-gray-100 rounded-bl-none border-l-4 border-blue-500"
                  }`}
                >
                  {msg.text.split("\n").map((line, i) => (
                    <p key={i} className="whitespace-pre-wrap mb-1">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-300 px-3 py-2 rounded-lg italic">
                  Typing...
                </div>
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-700 flex gap-2">
            <textarea
              className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              rows={1}
              placeholder="Type your queries..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), handleAsk())
              }
              disabled={loading}
            />
            <button
              onClick={handleAsk}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-semibold shadow-md transition duration-300 ${
                loading
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 transform"
              }`}
            >
              {loading ? "..." : "Ask"}
            </button>
          </div>
        </div>
      )}

      {/* Animation */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ChatBot;
