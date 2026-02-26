import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  Settings,
  Building2,
  FileText,
  ClipboardCheck,
  ChevronRight,
  Store,
  Receipt,
  Calculator,
  Banknote,
  Landmark,
  Scale,
  CalendarCheck,
  Palmtree,
  GraduationCap,
  BarChart3,
  History,
  UserCheck,
  ShieldCheck,
  MapPin,
  User as UserIcon,
  Fingerprint
} from "lucide-react";

interface MenuSection {
  title: string;
  items: {
    title: string;
    path: string;
    icon: React.ReactNode;
  }[];
}

const menuSections: MenuSection[] = [
  {
    title: "Principal",
    items: [
      { title: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
      { title: "Articles", path: "/articles", icon: <Package size={18} /> },
      { title: "Points de vente", path: "/config/points-vente", icon: <Store size={18} /> },
    ],
  },
  {
    title: "Ventes",
    items: [
      { title: "Factures vente", path: "/vente/factures", icon: <FileText size={18} /> },
      { title: "Bons de livraison", path: "/vente/livraisons", icon: <Truck size={18} /> },
      { title: "Clients", path: "/clients", icon: <Users size={18} /> },
    ],
  },
  {
    title: "Achats",
    items: [
      { title: "Factures achat", path: "/achat/factures", icon: <Receipt size={18} /> },
      { title: "Bons de réception", path: "/achat/receptions", icon: <ClipboardCheck size={18} /> },
      { title: "Fournisseurs", path: "/fournisseurs", icon: <Truck size={18} /> },
    ],
  },
  {
    title: "Comptabilité",
    items: [
      { title: "Tableau de bord", path: "/compta/dashboard", icon: <Calculator size={18} /> },
      { title: "Journaux", path: "/compta/journaux", icon: <Banknote size={18} /> },
      { title: "Comptes", path: "/compta/comptes", icon: <Banknote size={18} /> },
      { title: "Caisse", path: "/compta/caisse", icon: <Banknote size={18} /> },
      { title: "Banque", path: "/compta/banque", icon: <Landmark size={18} /> },
      { title: "Dépenses", path: "/compta/depenses", icon: <Receipt size={18} /> },
      { title: "Bilan comptable", path: "/compta/bilan", icon: <Scale size={18} /> },
    ],
  },
  {
    title: "Ressources Humaines",
    items: [
      { title: "Employés", path: "/rh/employes", icon: <Users size={18} /> },
      { title: "Présences", path: "/rh/presences", icon: <CalendarCheck size={18} /> },
      { title: "Paie", path: "/rh/paie", icon: <Banknote size={18} /> },
      { title: "Congés", path: "/rh/conges", icon: <Palmtree size={18} /> },
      { title: "Formations", path: "/rh/formations", icon: <GraduationCap size={18} /> },
    ],
  },
  {
    title: "Autres",
    items: [
      { title: "Rapports", path: "/rapports", icon: <BarChart3 size={18} /> },
      { title: "Paramètres", path: "/config/societe", icon: <Settings size={18} /> },
    ],
  },
];

const Sidebar = () => {
  const { user } = useAuth();
  const contexte = user?.contexteDefaut;

  return (
    <aside className="fixed left-0 top-[70px] w-[280px] h-[calc(100vh-70px)] bg-background p-4 overflow-y-auto z-[1000] hidden lg:flex flex-col border-r border-muted/30">
      {/* Logo Société */}
      <div className="neu-card p-5 mb-6 text-center shrink-0">
        <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center">
          <img 
            src="/ashil_logo.png" 
            alt="Ashil" 
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-lg font-black text-primary tracking-tighter">
          {contexte?.societe?.raisonSociale || "Ashil ERP"}
        </h2>
        <p className="text-[10px] text-muted-foreground font-semibold uppercase mt-1">Gestion Intelligente</p>
      </div>

      {/* Carte Session Utilisateur */}
      <div className="neu-card-sm p-4 mb-6 shrink-0 border border-primary/10">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Session Active</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground flex items-center gap-1">
              <UserIcon size={12} /> Nom
            </span>
            <span className="font-bold text-primary truncate max-w-[140px] text-right">
              {user?.identiteNom || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground flex items-center gap-1">
              <Fingerprint size={12} /> Type
            </span>
            <span className="font-bold text-muted-foreground">
              {user?.identiteType || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground flex items-center gap-1">
              <ShieldCheck size={12} /> Rôle
            </span>
            <span className="font-bold text-secondary">
              {contexte?.role?.replace('_', ' ') || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground flex items-center gap-1">
              <Building2 size={12} /> Société
            </span>
            <span className="font-bold text-primary truncate max-w-[120px] text-right">
              {contexte?.societe?.raisonSociale || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground flex items-center gap-1">
              <MapPin size={12} /> Point de Vente
            </span>
            <span className="font-bold text-secondary truncate max-w-[120px] text-right">
              {contexte?.pointDeVente?.name || "Tous"}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px] pt-1 border-t border-muted/30">
            <span className="text-muted-foreground">Statut</span>
            <span className="font-bold text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Connecté
            </span>
          </div>
        </div>
      </div>

      {/* Menu de Navigation */}
      <nav className="space-y-6 flex-1">
        {menuSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4 mb-2">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold ${
                      isActive
                        ? "shadow-neu-inset text-secondary"
                        : "text-muted-foreground hover:text-primary hover:bg-muted/20"
                    }`
                  }
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="flex-1">{item.title}</span>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* État du système */}
      <div className="neu-card-sm p-4 mt-6 shrink-0">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">État du système</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground">Magasins actifs</span>
            <span className="font-bold text-secondary">5/6</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground">Employés en ligne</span>
            <span className="font-bold text-secondary flex items-center gap-1">
              <UserCheck size={12} /> 12
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-muted-foreground">Serveur</span>
            <span className="font-bold text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> En ligne
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;