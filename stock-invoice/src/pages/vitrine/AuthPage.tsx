import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isRegister = searchParams.get("mode") === "register";
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: isRegister ? "Compte créé !" : "Connexion réussie",
      description: `Bienvenue ${formData.fullName || formData.email}`,
    });
    navigate("/vitrine");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <Button variant="ghost" onClick={() => navigate("/vitrine")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la boutique
        </Button>

        <Card className="neu-card border-none">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {isRegister ? <UserPlus className="text-secondary" size={32} /> : <LogIn className="text-secondary" size={32} />}
            </div>
            <CardTitle className="text-2xl font-bold">
              {isRegister ? "Créer un compte" : "Se connecter"}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {isRegister ? "Rejoignez-nous pour passer commande" : "Accédez à votre espace client"}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-2">
                  <Label>Nom complet</Label>
                  <Input 
                    className="neu-input" 
                    placeholder="Jean Dupont" 
                    required 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email" 
                  className="neu-input" 
                  placeholder="client@example.com" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Mot de passe</Label>
                <Input 
                  type="password" 
                  className="neu-input" 
                  placeholder="••••••••" 
                  required 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full neu-btn-primary h-12 text-lg mt-6">
                {isRegister ? "S'enregistrer" : "Se connecter"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => navigate(`/vitrine/auth?mode=${isRegister ? 'login' : 'register'}`)}
                className="text-secondary hover:underline text-sm font-semibold"
              >
                {isRegister ? "Déjà un compte ? Se connecter" : "Pas encore de compte ? S'enregistrer"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;