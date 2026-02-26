import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import SocieteConfig from "./pages/config/SocieteConfig";
import UtilisateursConfig from "./pages/config/UtilisateursConfig";
import RolesConfig from "./pages/config/RolesConfig";
import ArticlesConfig from "./pages/config/ArticlesConfig";
import ClientsConfig from "./pages/config/ClientsConfig";
import FournisseursConfig from "./pages/config/FournisseursConfig";
import DevisPage from "./pages/vente/DevisPage";
import BonLivraisonPage from "./pages/vente/BonLivraisonPage";
import FacturesVentePage from "./pages/vente/FacturesVentePage";
import CommandeAchatPage from "./pages/achat/CommandeAchatPage";
import BonReceptionPage from "./pages/achat/BonReceptionPage";
import FacturesFournisseurPage from "./pages/achat/FacturesFournisseurPage";
import Storefront from "./pages/vitrine/Storefront";
import AuthPage from "./pages/vitrine/AuthPage";
import CartPage from "./pages/vitrine/CartPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Vitrine (Public) */}
            <Route path="/vitrine" element={<Storefront />} />
            <Route path="/vitrine/auth" element={<AuthPage />} />
            <Route path="/vitrine/panier" element={<CartPage />} />
            
            {/* Admin (Private) */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Achat */}
              <Route path="/achat/commandes" element={<CommandeAchatPage />} />
              <Route path="/achat/receptions" element={<BonReceptionPage />} />
              <Route path="/achat/factures" element={<FacturesFournisseurPage />} />
              {/* Vente */}
              <Route path="/vente/devis" element={<DevisPage />} />
              <Route path="/vente/livraisons" element={<BonLivraisonPage />} />
              <Route path="/vente/factures" element={<FacturesVentePage />} />
              {/* Gestion */}
              <Route path="/articles" element={<ArticlesConfig />} />
              <Route path="/clients" element={<ClientsConfig />} />
              <Route path="/fournisseurs" element={<FournisseursConfig />} />
              {/* Configuration */}
              <Route path="/config/societe" element={<SocieteConfig />} />
              <Route path="/config/points-vente" element={<Dashboard />} />
              <Route path="/config/utilisateurs" element={<UtilisateursConfig />} />
              <Route path="/config/roles" element={<RolesConfig />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;