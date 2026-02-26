import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalTTC, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOrdered, setIsOrdered] = useState(false);

  const handleCheckout = () => {
    setIsOrdered(true);
    toast({
      title: "Commande validée !",
      description: "Merci pour votre achat. Un email de confirmation vous a été envoyé.",
    });
    setTimeout(() => {
      clearCart();
      navigate("/vitrine");
    }, 3000);
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="neu-card text-center space-y-6 max-w-md p-12">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="text-success" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-primary">Merci !</h1>
          <p className="text-muted-foreground">Votre commande a été enregistrée avec succès. Vous allez être redirigé vers la boutique.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Button variant="ghost" onClick={() => navigate("/vitrine")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la boutique
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="text-secondary" size={32} />
          <h1 className="text-3xl font-bold text-primary">Mon Panier</h1>
        </div>

        {cart.length === 0 ? (
          <div className="neu-card p-20 text-center space-y-4">
            <ShoppingBag size={64} className="mx-auto text-muted-foreground opacity-20" />
            <p className="text-xl text-muted-foreground">Votre panier est vide.</p>
            <Button onClick={() => navigate("/vitrine")} className="neu-btn-primary">
              Commencer mes achats
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="neu-card flex items-center gap-4 p-4">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground font-mono">{item.ref}</p>
                    <h3 className="font-bold text-lg">{item.libelle}</h3>
                    <p className="text-secondary font-bold">
                      {item.prixVenteTTC.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} TND
                    </p>
                  </div>
                  <div className="flex items-center gap-3 neu-inset p-2 rounded-xl">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantite - 1)}
                      className="p-1 hover:text-secondary transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="font-bold w-8 text-center">{item.quantite}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantite + 1)}
                      className="p-1 hover:text-secondary transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeFromCart(item.id)}
                    className="text-danger hover:bg-danger/10"
                  >
                    <Trash2 size={20} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="neu-card p-6 space-y-4">
                <h2 className="text-xl font-bold border-b pb-4">Résumé</h2>
                <div className="flex justify-between text-muted-foreground">
                  <span>Sous-total</span>
                  <span>{totalTTC.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} TND</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Livraison</span>
                  <span className="text-success font-medium">Gratuite</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-4 border-t">
                  <span>Total TTC</span>
                  <span className="text-secondary">{totalTTC.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} TND</span>
                </div>
                <Button onClick={handleCheckout} className="w-full neu-btn-primary h-14 text-lg mt-4">
                  Valider la commande
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Paiement sécurisé à la livraison ou par carte bancaire.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;