import { Bell, Search, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const contexte = user?.contexteDefaut;

  return (
    <header className="fixed top-0 left-0 right-0 h-[70px] bg-background shadow-neu-outset z-[1001] flex items-center justify-between px-6">
      {/* Logo & Recherche */}
      <div className="flex items-center gap-8 flex-1">
        <div className="flex items-center gap-1 shrink-0">
          <img 
            src="/ashil_logo.png" 
            alt="Ashil Logo" 
            className="h-[50px] w-auto object-contain"
          />
          <div className="hidden sm:block">
            <h1 className="text-2xl font-black text-primary leading-none tracking-tighter">
              shil
            </h1>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-0.5">ERP Solutions</p>
          </div>
        </div>

        <div className="hidden md:relative md:block w-full max-w-md ml-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Rechercher articles, clients, factures..."
            className="neu-input pl-12 py-2.5 text-sm"
          />
        </div>
      </div>

      {/* Actions & Profil Utilisateur */}
      <div className="flex items-center gap-4">
        <button className="neu-btn p-2.5 rounded-full relative text-muted-foreground hover:text-secondary transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-background">
            5
          </span>
        </button>

        <button className="neu-btn p-2.5 rounded-full text-muted-foreground hover:text-secondary transition-colors hidden sm:flex">
          <Settings size={20} />
        </button>

        <div className="neu-card-sm py-1.5 pl-4 pr-1.5 flex items-center gap-3 cursor-pointer hover:shadow-neu-inset transition-all group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">
              {user?.identiteNom || user?.username || "Utilisateur"}
            </p>
            <p className="text-[10px] text-muted-foreground font-semibold">
              {contexte?.role?.replace('_', ' ') || "Accès standard"}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold relative shadow-neu-outset-sm">
            {(user?.identiteNom || user?.username || "A").charAt(0).toUpperCase()}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full"></div>
          </div>
        </div>

        <button 
          onClick={logout}
          className="neu-btn p-2.5 rounded-full text-muted-foreground hover:text-danger transition-colors"
          title="Déconnexion"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;