import { useState } from "react";
import { MessageSquare, X, Send, User } from "lucide-react";
import { Button } from "./ui/button";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const users = [
    { name: "Mohamed", initial: "M", online: true },
    { name: "Sarah", initial: "S", online: true },
    { name: "Karim", initial: "K", online: false },
    { name: "Leila", initial: "L", online: true },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[2000]">
      {/* Chat Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-background rounded-2xl shadow-neu-outset flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-secondary to-indigo-700 text-white flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <MessageSquare size={18} /> Chat Équipe
            </h3>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
              <X size={20} />
            </button>
          </div>

          {/* Users List */}
          <div className="p-3 bg-white/10 flex gap-3 overflow-x-auto border-b border-muted/20">
            {users.map((u) => (
              <div key={u.name} className="shrink-0 text-center cursor-pointer hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold relative mx-auto">
                  {u.initial}
                  {u.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full"></div>}
                </div>
                <p className="text-[9px] mt-1 font-bold text-muted-foreground">{u.name}</p>
              </div>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-background/50">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground ml-2">Mohamed • Magasin Centre</p>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-neu-outset-sm text-xs max-w-[85%]">
                Bonjour, le stock de claviers est presque épuisé.
              </div>
            </div>
            <div className="space-y-1 flex flex-col items-end">
              <p className="text-[10px] font-bold text-muted-foreground mr-2">Vous</p>
              <div className="bg-gradient-to-r from-secondary to-indigo-700 text-white p-3 rounded-2xl rounded-tr-none shadow-neu-outset-sm text-xs max-w-[85%]">
                OK, je lance une commande maintenant.
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-muted/30 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className="neu-input py-2 text-xs"
              onKeyPress={(e) => e.key === 'Enter' && setMessage("")}
            />
            <button className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-neu-outset-sm hover:scale-110 transition-transform">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-indigo-700 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform relative"
      >
        <MessageSquare size={28} />
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-danger text-white text-xs rounded-full flex items-center justify-center font-bold border-2 border-background">
          3
        </span>
      </button>
    </div>
  );
};

export default ChatWidget;