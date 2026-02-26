import { useState } from "react";
import { Search, ShoppingCart, Filter, LogIn, UserPlus, Package, Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const categories = ["Tous", "Informatique", "Bureautique", "Consommables", "Électronique"];

const mockProducts = [
  { id: 1, ref: "ART-001", libelle: "Ordinateur Portable HP", prixVenteTTC: 3570, categorie: "Informatique", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop" },
  { id: 3, ref: "ART-003", libelle: "Imprimante Canon G3411", prixVenteTTC: 615.825, categorie: "Bureautique", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop" },
  { id: 4, ref: "ART-004", libelle: "Papier A4 80g (Rame)", prixVenteTTC: 18.594, categorie: "Consommables", image: "https://images.unsplash.com/photo-1589987607627-616cbd5bb245?w=400&h=300&fit=crop" },
  { id: 5, ref: "ART-005", libelle: "Écran Dell 24\"", prixVenteTTC: 850, categorie: "Informatique", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop" },
];

const Storefront = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("Tous");
  const { cart, addToCart, totalTTC } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const filtered = mockProducts.filter(p => 
    (selectedCat === "Tous" || p.categorie === selectedCat) &&
    (p.libelle.toLowerCase().includes(searchTerm.toLowerCase()) || p.ref.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddToCart = (p: any) => {
    addToCart(p);
    toast({ title: "Ajouté au panier", description: `${p.libelle} a été ajouté.` });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message envoyé", description: "Nous vous répondrons dans les plus brefs délais." });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Navigation Bar */}
      <nav className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-muted/30 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate("/vitrine")}>
            <img src="/ashil_logo.png" alt="Ashil" className="h-10 w-auto" />
            <h1 className="text-xl font-black text-primary tracking-tighter">shil</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/vitrine/auth")} variant="ghost" className="text-sm font-bold">Connexion</Button>
            <Button onClick={() => navigate("/vitrine/auth?mode=register")} className="neu-btn-primary text-sm">S'enregistrer</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white py-16 px-6 mb-12 rounded-b-[3rem] shadow-neu-outset">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
              <img src="/ashil_logo.png" alt="A" className="h-5 w-auto brightness-0 invert" />
              <span className="text-xs font-bold uppercase tracking-widest">Bienvenue chez Ashil</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tighter">
              Votre matériel <br /> <span className="text-blue-300">au meilleur prix.</span>
            </h1>
            <p className="text-lg opacity-80 max-w-lg">
              Découvrez notre sélection de produits informatiques et bureautiques de haute qualité pour booster votre productivité.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Button onClick={() => document.getElementById('products')?.scrollIntoView({behavior: 'smooth'})} className="bg-white text-primary hover:bg-blue-50 h-14 px-8 text-lg font-bold rounded-2xl shadow-xl">
                Voir le catalogue
              </Button>
              <Button variant="outline" className="bg-transparent border-white/30 hover:bg-white/10 h-14 px-8 text-lg font-bold rounded-2xl">
                Nous contacter
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="w-80 h-80 bg-white/10 rounded-[3rem] rotate-12 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl">
              <img src="/ashil_logo.png" alt="Ashil Logo" className="w-48 h-auto brightness-0 invert -rotate-12" />
            </div>
          </div>
        </div>
      </div>

      <div id="products" className="max-w-6xl mx-auto px-6 space-y-16">
        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un produit..." 
              className="neu-input pl-12 h-14 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCat === cat ? "default" : "outline"}
                className={`rounded-full px-6 ${selectedCat === cat ? "neu-btn-primary" : "neu-btn"}`}
                onClick={() => setSelectedCat(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map(product => (
            <div key={product.id} className="neu-card p-0 overflow-hidden group flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <img src={product.image} alt={product.libelle} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <Badge className="absolute top-3 right-3 bg-white/90 text-primary">{product.categorie}</Badge>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground font-mono mb-1">{product.ref}</p>
                  <h3 className="font-bold text-lg leading-tight">{product.libelle}</h3>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-secondary">{product.prixVenteTTC.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} <span className="text-xs">TND</span></p>
                  <Button size="icon" onClick={() => handleAddToCart(product)} className="neu-btn-primary rounded-full w-10 h-10">
                    <ShoppingCart size={18} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Package size={64} className="mx-auto text-muted-foreground opacity-20 mb-4" />
            <p className="text-xl text-muted-foreground">Aucun produit ne correspond à votre recherche.</p>
          </div>
        )}

        {/* Contact Section */}
        <section id="contact" className="pt-16 border-t border-muted">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Contactez-nous</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Une question ? Un besoin spécifique ? Notre équipe est à votre écoute pour vous accompagner.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="neu-card flex items-start gap-6 p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Mail className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Email</h3>
                  <p className="text-muted-foreground">contact@ashil.tn</p>
                  <p className="text-muted-foreground">support@ashil.tn</p>
                </div>
              </div>

              <div className="neu-card flex items-start gap-6 p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Phone className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Téléphone</h3>
                  <p className="text-muted-foreground">+216 71 123 456</p>
                  <p className="text-muted-foreground">Lun - Ven, 8h00 - 18h00</p>
                </div>
              </div>

              <div className="neu-card flex items-start gap-6 p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Adresse</h3>
                  <p className="text-muted-foreground">123 Avenue Habib Bourguiba</p>
                  <p className="text-muted-foreground">Tunis, 1000, Tunisie</p>
                </div>
              </div>
            </div>

            <div className="neu-card p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1">Nom complet</label>
                    <Input placeholder="Votre nom" className="neu-input" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1">Email</label>
                    <Input type="email" placeholder="votre@email.com" className="neu-input" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Sujet</label>
                  <Input placeholder="Comment pouvons-nous vous aider ?" className="neu-input" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Message</label>
                  <Textarea placeholder="Votre message ici..." className="neu-input min-h-[150px]" required />
                </div>
                <Button type="submit" className="w-full neu-btn-primary h-14 text-lg gap-2">
                  <Send size={20} /> Envoyer le message
                </Button>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button 
            onClick={() => navigate("/vitrine/panier")}
            className="neu-btn-primary h-16 px-8 rounded-full shadow-2xl flex gap-4 items-center"
          >
            <div className="relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-danger text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase opacity-80">Mon Panier</p>
              <p className="font-bold">{totalTTC.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} TND</p>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Storefront;