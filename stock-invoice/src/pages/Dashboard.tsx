import {
  TrendingUp,
  ShoppingCart,
  Package,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Plus,
  Store,
  Warehouse,
  Eye,
  BarChart3,
  Truck,
  Users,
  ClipboardCheck,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: "Ventes totales (mois)",
    value: "245,800 DT",
    change: "+18.5%",
    isPositive: true,
    icon: <TrendingUp size={24} />,
    color: "success",
  },
  {
    title: "Achats du mois",
    value: "156,200 DT",
    change: "+10.2%",
    isPositive: true,
    icon: <ShoppingCart size={24} />,
    color: "warning",
  },
  {
    title: "Articles en stock",
    value: "8,456",
    change: "-2.8%",
    isPositive: false,
    icon: <Package size={24} />,
    color: "info",
  },
  {
    title: "Alertes stock",
    value: "47",
    change: "Action requise",
    isPositive: false,
    icon: <AlertTriangle size={24} />,
    color: "danger",
  },
];

const latestSales = [
  { id: "FAC-00124", client: "Société ABC", store: "Magasin Centre", date: "15/05/2024", total: "1,250.000", status: "Payée" },
  { id: "FAC-00123", client: "Ahmed Ben Ali", store: "Magasin Nord", date: "15/05/2024", total: "450.500", status: "En attente" },
  { id: "FAC-00122", client: "Entreprise XYZ", store: "Magasin Centre", date: "14/05/2024", total: "2,800.000", status: "Payée" },
  { id: "FAC-00121", client: "Mme. Sarah", store: "Magasin Sud", date: "14/05/2024", total: "120.000", status: "Annulée" },
];

const latestPurchases = [
  { id: "CDA-00089", supplier: "Fournisseur Alpha", destination: "Dépôt Principal", date: "15/05/2024", total: "5,400.000", status: "Reçu" },
  { id: "CDA-00088", supplier: "Global Tech", destination: "Magasin Nord", date: "13/05/2024", total: "1,150.000", status: "En cours" },
  { id: "CDA-00087", supplier: "Bureautique Pro", destination: "Dépôt Principal", date: "12/05/2024", total: "890.000", status: "Reçu" },
];

const stores = [
  { name: "Magasin Centre-Ville", location: "Avenue Habib Bourguiba, Tunis", articles: 1245, value: "89,450 DT", status: "Actif", color: "from-pink-500 to-yellow-400" },
  { name: "Magasin Nord", location: "La Marsa, Tunis", articles: 892, value: "62,300 DT", status: "Actif", color: "from-blue-400 to-cyan-400" },
  { name: "Magasin Sud", location: "Sfax Centre", articles: 678, value: "48,750 DT", status: "Actif", color: "from-green-400 to-teal-400" },
  { name: "Dépôt Principal", location: "Ben Arous", articles: 3185, value: "245,000 DT", status: "Actif", color: "from-orange-300 to-red-400" },
];

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">Dashboard Multi-Magasins</h2>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            Vue d'ensemble de vos points de vente - Mise à jour en temps réel
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="neu-btn-primary gap-2 flex-1 sm:flex-none">
            <Plus size={18} /> <span className="whitespace-nowrap">Nouvelle vente</span>
          </Button>
          <Button className="neu-btn gap-2 flex-1 sm:flex-none">
            <BarChart3 size={18} /> Rapports
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="neu-card flex flex-row items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 shadow-neu-inset text-${stat.color}`}>
              {stat.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 truncate">{stat.title}</p>
              <p className="text-xl sm:text-2xl font-extrabold text-primary truncate">{stat.value}</p>
              <div className={`flex items-center gap-1 mt-1 text-[10px] sm:text-xs font-bold ${stat.isPositive ? "text-green-600" : "text-danger"}`}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span className="truncate">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">⚡</span>
          Raccourcis des opérations
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { icon: <FileText size={24} />, label: "Facture vente" },
            { icon: <ShoppingCart size={24} />, label: "Facture achat" },
            { icon: <Truck size={24} />, label: "Bon livraison" },
            { icon: <ClipboardCheck size={24} />, label: "Bon réception" },
            { icon: <Package size={24} />, label: "Ajouter article" },
            { icon: <Users size={24} />, label: "Nouveau client" },
          ].map((action, index) => (
            <button
              key={index}
              className="neu-card flex flex-col items-center gap-3 p-4 sm:p-5 text-muted-foreground hover:text-secondary hover:shadow-neu-inset transition-all group"
            >
              <div className="text-secondary group-hover:scale-110 transition-transform">{action.icon}</div>
              <span className="text-[11px] sm:text-xs font-bold text-center leading-tight">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Sales */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <FileText size={20} className="text-secondary" /> Dernières Ventes
            </h2>
            <Button variant="ghost" className="text-xs text-secondary font-bold hover:bg-secondary/10">
              Voir tout <ArrowRight size={14} className="ml-1" />
            </Button>
          </div>
          <div className="neu-card p-0 overflow-hidden">
            <table className="neu-table w-full">
              <thead>
                <tr>
                  <th>Réf</th>
                  <th>Client</th>
                  <th>Magasin</th>
                  <th className="text-right">Total</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {latestSales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="font-bold text-xs">{sale.id}</td>
                    <td className="text-xs">{sale.client}</td>
                    <td className="text-[10px] font-semibold text-muted-foreground">{sale.store}</td>
                    <td className="text-right font-bold text-xs">{sale.total} DT</td>
                    <td>
                      <Badge variant="outline" className={`text-[10px] ${
                        sale.status === "Payée" ? "bg-green-500/10 text-green-600 border-green-500/20" : 
                        sale.status === "Annulée" ? "bg-danger/10 text-danger border-danger/20" : 
                        "bg-warning/10 text-warning border-warning/20"
                      }`}>
                        {sale.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Purchases */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <ShoppingCart size={20} className="text-secondary" /> Derniers Achats
            </h2>
            <Button variant="ghost" className="text-xs text-secondary font-bold hover:bg-secondary/10">
              Voir tout <ArrowRight size={14} className="ml-1" />
            </Button>
          </div>
          <div className="neu-card p-0 overflow-hidden">
            <table className="neu-table w-full">
              <thead>
                <tr>
                  <th>Réf</th>
                  <th>Fournisseur</th>
                  <th>Destination</th>
                  <th className="text-right">Total</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {latestPurchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td className="font-bold text-xs">{purchase.id}</td>
                    <td className="text-xs">{purchase.supplier}</td>
                    <td className="text-[10px] font-semibold text-muted-foreground">{purchase.destination}</td>
                    <td className="text-right font-bold text-xs">{purchase.total} DT</td>
                    <td>
                      <Badge variant="outline" className={`text-[10px] ${
                        purchase.status === "Reçu" ? "bg-green-500/10 text-green-600 border-green-500/20" : 
                        "bg-info/10 text-info border-info/20"
                      }`}>
                        {purchase.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stores Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">🏪</span>
            Points de vente
          </h2>
          <Button variant="outline" className="neu-btn text-[10px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4">
            <Plus size={14} className="mr-1" /> Ajouter magasin
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {stores.map((store, index) => (
            <div key={index} className="neu-card space-y-5 hover:shadow-neu-outset transition-all flex flex-col">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${store.color} flex items-center justify-center text-white shadow-neu-outset-sm shrink-0`}>
                    {store.name.includes("Dépôt") ? <Warehouse size={20} /> : <Store size={20} />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-primary truncate">{store.name}</h3>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground truncate">📍 {store.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-[8px] sm:text-[9px] font-bold shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> {store.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="neu-card-sm p-2 sm:p-3 text-center">
                  <p className="text-base sm:text-lg font-bold text-primary">{store.articles}</p>
                  <p className="text-[8px] sm:text-[9px] text-muted-foreground font-bold uppercase">Articles</p>
                </div>
                <div className="neu-card-sm p-2 sm:p-3 text-center min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-primary truncate">{store.value}</p>
                  <p className="text-[8px] sm:text-[9px] text-muted-foreground font-bold uppercase">Valeur</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                <Button className="flex-1 neu-btn-primary py-2 text-xs h-9 gap-1">
                  <Eye size={14} /> Détails
                </Button>
                <Button variant="outline" className="flex-1 neu-btn py-2 text-xs h-9 gap-1">
                  <BarChart3 size={14} /> Stats
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;