import { useEffect, useRef, useState } from "react";
import { askChatbot } from "../api/chatbot";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "greet",
      role: "bot",
      text:
        "Hi! I’m TechNova Assistant 🤖\n• Ask me to find a product (e.g., “find gaming laptop”).\n• Check order status (e.g., “order OD-002”).\n• Track delivery (e.g., “delivery OD-002”)."
    }
  ]);

  const listRef = useRef(null);
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const send = async (q) => {
    const query = (q ?? input).trim();
    if (!query) return;
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text: query }]);
    setInput("");
    setBusy(true);
    try {
      const res = await askChatbot(query);
      const answer = res.data?.answer || "Sorry, I don’t have an answer.";
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "bot", text: answer }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "bot", text: "⚠️ Oops, something went wrong. Try again." }
      ]);
    } finally {
      setBusy(false);
    }
  };

  const Quick = ({ label, q }) => (
    <button
      onClick={() => send(q)}
      className="text-xs px-2 py-1 rounded-lg border border-fuchsia-500/40 text-fuchsia-300 hover:bg-fuchsia-600/20 transition shadow-[0_0_8px_rgba(217,70,239,0.5)]"
    >
      {label}
    </button>
  );

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-600 to-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.7)] text-white text-xl grid place-items-center hover:scale-110 transition"
        aria-label="Open chat"
        title="Chat with TechNova"
      >
        💬
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[92vw] rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(168,85,247,0.7)] border border-fuchsia-500/40 bg-slate-950/95 text-slate-100 backdrop-blur-xl">
          {/* Header */}
          <div className="h-12 px-4 flex items-center justify-between bg-gradient-to-r from-fuchsia-700/50 to-cyan-700/50 border-b border-fuchsia-400/40">
            <div className="flex items-center gap-2">
              <span className="inline-flex w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 items-center justify-center shadow-[0_0_8px_rgba(236,72,153,0.7)]">🤖</span>
              <div className="text-sm font-semibold text-cyan-200">Lena — TechNova Assistant</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-fuchsia-300 hover:text-white text-xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="h-80 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-slate-950 to-slate-900">
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] rounded-2xl px-3 py-2 bg-cyan-600/90 text-white shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                      : "max-w-[80%] rounded-2xl px-3 py-2 bg-fuchsia-600/20 border border-fuchsia-500/40 text-fuchsia-100 whitespace-pre-wrap shadow-[0_0_8px_rgba(217,70,239,0.5)]"
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex gap-2 items-center text-fuchsia-400 text-sm">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:120ms]" />
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:240ms]" />
                <span className="ml-1">Thinking…</span>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="px-3 py-2 flex flex-wrap gap-2 bg-slate-950/90 border-t border-cyan-400/40">
            <Quick label="Find a laptop" q="find gaming laptop" />
            <Quick label="Order status" q="order OD-001" />
            <Quick label="Delivery status" q="delivery OD-001" />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="p-3 flex items-center gap-2 bg-slate-950"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 bg-slate-900/70 border border-cyan-500/40 rounded-xl px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-fuchsia-500/60"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="px-3 py-2 rounded-xl bg-gradient-to-br from-fuchsia-600 to-cyan-500 text-white hover:opacity-90 disabled:opacity-40 shadow-[0_0_10px_rgba(236,72,153,0.7)]"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
