import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Package, 
  Barcode,
  Tag,
  DollarSign,
  Boxes,
  Star,
  Printer,
  Info
} from "lucide-react";
import { printList } from "@/utils/printList";

interface Categorie {
  id: number;
  nom: string;
}

interface StockPDV {
  pdvId: number;
  pdvNom: string;
  quantite: number;
}

interface Article {
  id: number;
  ref: string;
  numSerie: string;
  refVendeur: string;
  codeBarre: string;
  service: boolean;
  libelle: string;
  description: string;
  marque: string;
  model: string;
  prixAchatHT: number;
  tauxTva: number;
  tauxtpe: number;
  tauxfodec: number;
  prixAchatTTC: number;
  marge: number;
  prixVenteHT: number;
  prixVenteTTC: number;
  uniteAchat: string;
  uniteVente: string;
  unitEmbalage: string;
  stockAlerte: number;
  pointFidelite: number;
  categorie: Categorie | null;
  stockTotal: number;
  stocks: StockPDV[];
}

const categoriesMock: Categorie[] = [
  { id: 1, nom: "Électronique" },
  { id: 2, nom: "Informatique" },
  { id: 3, nom: "Bureautique" },
  { id: 4, nom: "Consommables" },
];

const initialArticles: Article[] = [
  {
    id: 1,
    ref: "ART-001",
    numSerie: "SN-2024-001",
    refVendeur: "VND-001",
    codeBarre: "6191234567890",
    service: false,
    libelle: "Ordinateur Portable HP",
    description: "HP ProBook 450 G8, Intel Core i5, 8GB RAM, 256GB SSD",
    marque: "HP",
    model: "ProBook 450 G8",
    prixAchatHT: 2500,
    tauxTva: 19,
    tauxtpe: 1,
    tauxfodec: 0,
    prixAchatTTC: 3000,
    marge: 20,
    prixVenteHT: 3000,
    prixVenteTTC: 3570,
    uniteAchat: "Unité",
    uniteVente: "Unité",
    unitEmbalage: "Carton",
    stockAlerte: 5,
    pointFidelite: 100,
    categorie: { id: 2, nom: "Informatique" },
    stockTotal: 12,
    stocks: [
      { pdvId: 1, pdvNom: "Point de vente Principal", quantite: 8 },
      { pdvId: 2, pdvNom: "Succursale Sousse", quantite: 4 }
    ]
  },
  {
    id: 2,
    ref: "ART-002",
    numSerie: "",
    refVendeur: "VND-002",
    codeBarre: "6191234567891",
    service: true,
    libelle: "Maintenance Informatique",
    description: "Service de maintenance et réparation informatique",
    marque: "",
    model: "",
    prixAchatHT: 0,
    tauxTva: 19,
    tauxtpe: 0,
    tauxfodec: 0,
    prixAchatTTC: 0,
    marge: 100,
    prixVenteHT: 150,
    prixVenteTTC: 178.5,
    uniteAchat: "Heure",
    uniteVente: "Heure",
    unitEmbalage: "",
    stockAlerte: 0,
    pointFidelite: 10,
    categorie: { id: 2, nom: "Informatique" },
    stockTotal: 0,
    stocks: []
  },
  {
    id: 3,
    ref: "ART-003",
    numSerie: "SN-2024-003",
    refVendeur: "VND-003",
    codeBarre: "6191234567892",
    service: false,
    libelle: "Imprimante Canon G3411",
    description: "Imprimante à réservoirs d'encre rechargeables",
    marque: "Canon",
    model: "Pixma G3411",
    prixAchatHT: 450,
    tauxTva: 19,
    tauxtpe: 1,
    tauxfodec: 0,
    prixAchatTTC: 540,
    marge: 15,
    prixVenteHT: 517.5,
    prixVenteTTC: 615.825,
    uniteAchat: "Unité",
    uniteVente: "Unité",
    unitEmbalage: "Carton",
    stockAlerte: 3,
    pointFidelite: 50,
    categorie: { id: 3, nom: "Bureautique" },
    stockTotal: 5,
    stocks: [
      { pdvId: 1, pdvNom: "Point de vente Principal", quantite: 5 }
    ]
  },
  {
    id: 4,
    ref: "ART-004",
    numSerie: "",
    refVendeur: "VND-004",
    codeBarre: "6191234567893",
    service: false,
    libelle: "Papier A4 80g (Rame)",
    description: "Rame de 500 feuilles, blanc",
    marque: "Double A",
    model: "Premium",
    prixAchatHT: 12.500,
    tauxTva: 19,
    tauxtpe: 1,
    tauxfodec: 0,
    prixAchatTTC: 15,
    marge: 25,
    prixVenteHT: 15.625,
    prixVenteTTC: 18.594,
    uniteAchat: "Rame",
    uniteVente: "Rame",
    unitEmbalage: "Carton de 5",
    stockAlerte: 20,
    pointFidelite: 5,
    categorie: { id: 4, nom: "Consommables" },
    stockTotal: 150,
    stocks: [
      { pdvId: 1, pdvNom: "Point de vente Principal", quantite: 100 },
      { pdvId: 2, pdvNom: "Succursale Sousse", quantite: 50 }
    ]
  }
];

const emptyArticle: Omit<Article, "id"> = {
  ref: "",
  numSerie: "",
  refVendeur: "",
  codeBarre: "",
  service: false,
  libelle: "",
  description: "",
  marque: "",
  model: "",
  prixAchatHT: 0,
  tauxTva: 19,
  tauxtpe: 1,
  tauxfodec: 0,
  prixAchatTTC: 0,
  marge: 0,
  prixVenteHT: 0,
  prixVenteTTC: 0,
  uniteAchat: "Unité",
  uniteVente: "Unité",
  unitEmbalage: "",
  stockAlerte: 0,
  pointFidelite: 0,
  categorie: null,
  stockTotal: 0,
  stocks: []
};

const ArticlesConfig = () => {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState<Omit<Article, "id">>(emptyArticle);

  const filteredArticles = articles.filter(
    (article) =>
      article.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.codeBarre.includes(searchTerm)
  );

  const handleOpenDialog = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      const { id, ...rest } = article;
      setFormData(rest);
    } else {
      setEditingArticle(null);
      setFormData(emptyArticle);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingArticle(null);
    setFormData(emptyArticle);
  };

  const calculatePrices = (data: Omit<Article, "id">) => {
    const prixAchatTTC = data.prixAchatHT * (1 + data.tauxTva / 100 + data.tauxtpe / 100 + data.tauxfodec / 100);
    const prixVenteHT = data.prixAchatHT * (1 + data.marge / 100);
    const prixVenteTTC = prixVenteHT * (1 + data.tauxTva / 100);
    return { prixAchatTTC, prixVenteHT, prixVenteTTC };
  };

  const handleInputChange = (field: keyof Omit<Article, "id">, value: any) => {
    const newData = { ...formData, [field]: value };
    
    if (["prixAchatHT", "tauxTva", "tauxtpe", "tauxfodec", "marge"].includes(field)) {
      const calculatedPrices = calculatePrices(newData);
      setFormData({ ...newData, ...calculatedPrices });
    } else {
      setFormData(newData);
    }
  };

  const handleSave = () => {
    if (editingArticle) {
      setArticles(
        articles.map((a) =>
          a.id === editingArticle.id ? { ...formData, id: editingArticle.id } : a
        )
      );
    } else {
      const newId = Math.max(...articles.map((a) => a.id), 0) + 1;
      setArticles([...articles, { ...formData, id: newId }]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    setArticles(articles.filter((a) => a.id !== id));
  };

  const handlePrintStock = () => {
    const formatNum = (n: number) =>
      n.toLocaleString("fr-TN", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

    const itemsToPrint = filteredArticles.filter(a => !a.service);
    
    const totalValeurHT = itemsToPrint.reduce((sum, a) => sum + (a.stockTotal * a.prixAchatHT), 0);
    const totalValeurTTC = itemsToPrint.reduce((sum, a) => sum + (a.stockTotal * a.prixAchatTTC), 0);
    
    const title = searchTerm 
      ? `État des Stocks (Filtre: "${searchTerm}")` 
      : "État des Stocks Valorisé";

    const rowsHtml = itemsToPrint.map(a => `
      <tr>
        <td>${a.ref}</td>
        <td>${a.libelle}</td>
        <td class="text-right">${a.stockTotal}</td>
        <td class="text-right">${formatNum(a.prixAchatHT)}</td>
        <td class="text-right">${a.tauxTva}%</td>
        <td class="text-right">${formatNum(a.prixAchatTTC)}</td>
        <td class="text-right" style="font-weight:bold">${formatNum(a.stockTotal * a.prixAchatHT)}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Nunito Sans', sans-serif; padding: 20px; color: #333; }
          h1 { text-align: center; color: #31344b; margin-bottom: 20px; font-size: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 11px; }
          th { background-color: #f8f9fa; color: #66799e; font-weight: bold; }
          tr:nth-child(even) { background-color: #fcfcfc; }
          .text-right { text-align: right; }
          .totals-container { margin-top: 30px; float: right; width: 350px; }
          .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .total-final { font-size: 16px; font-weight: bold; color: #31344b; border-top: 2px solid #31344b; margin-top: 10px; padding-top: 10px; }
          .footer { margin-top: 50px; clear: both; text-align: right; font-size: 9px; color: #999; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <table>
          <thead>
            <tr>
              <th>Référence</th>
              <th>Libellé</th>
              <th class="text-right">Stock</th>
              <th class="text-right">P.U. HT</th>
              <th class="text-right">TVA</th>
              <th class="text-right">P.U. TTC</th>
              <th class="text-right">Valeur HT</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="7" style="text-align:center">Aucun article physique trouvé</td></tr>'}
          </tbody>
        </table>
        
        <div class="totals-container">
          <div class="total-row">
            <span>Valeur Totale HT:</span>
            <span>${formatNum(totalValeurHT)} TND</span>
          </div>
          <div class="total-row">
            <span>Total TVA:</span>
            <span>${formatNum(totalValeurTTC - totalValeurHT)} TND</span>
          </div>
          <div class="total-row total-final">
            <span>Valeur Totale TTC:</span>
            <span>${formatNum(totalValeurTTC)} TND</span>
          </div>
        </div>

        <div class="footer">Imprimé le ${new Date().toLocaleString('fr-TN')}</div>
      </body>
      </html>
    `;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.onload = () => win.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des Articles</h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue d'articles et services
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handlePrintStock} variant="outline" className="neu-btn gap-2">
            <Printer className="h-4 w-4" />
            Imprimer Stock
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => handleOpenDialog()}
                className="neu-btn-primary gap-2"
              >
                <Plus className="h-4 w-4" />
                Nouvel Article
              </Button>
            </DialogTrigger>
            <DialogContent className="neu-card max-w-4xl max-h-[90vh] overflow-y-auto bg-background">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {editingArticle ? "Modifier l'article" : "Nouvel article"}
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="general" className="mt-4">
                <TabsList className="neu-inset w-full grid grid-cols-4 mb-6">
                  <TabsTrigger value="general" className="gap-2">
                    <Package className="h-4 w-4" />
                    <span className="hidden sm:inline">Général</span>
                  </TabsTrigger>
                  <TabsTrigger value="identification" className="gap-2">
                    <Barcode className="h-4 w-4" />
                    <span className="hidden sm:inline">Identification</span>
                  </TabsTrigger>
                  <TabsTrigger value="prix" className="gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="hidden sm:inline">Prix & Taxes</span>
                  </TabsTrigger>
                  <TabsTrigger value="stock" className="gap-2">
                    <Boxes className="h-4 w-4" />
                    <span className="hidden sm:inline">Stock</span>
                  </TabsTrigger>
                </TabsList>

                {/* Tab Général */}
                <TabsContent value="general" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="libelle">Libellé *</Label>
                      <Input
                        id="libelle"
                        value={formData.libelle}
                        onChange={(e) => handleInputChange("libelle", e.target.value)}
                        className="neu-input"
                        placeholder="Nom de l'article"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categorie">Catégorie</Label>
                      <Select
                        value={formData.categorie?.id.toString() || ""}
                        onValueChange={(value) => {
                          const cat = categoriesMock.find((c) => c.id.toString() === value);
                          handleInputChange("categorie", cat || null);
                        }}
                      >
                        <SelectTrigger className="neu-input">
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesMock.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="neu-input min-h-[100px]"
                      placeholder="Description détaillée de l'article"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="marque">Marque</Label>
                      <Input
                        id="marque"
                        value={formData.marque}
                        onChange={(e) => handleInputChange("marque", e.target.value)}
                        className="neu-input"
                        placeholder="Marque"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Modèle</Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => handleInputChange("model", e.target.value)}
                        className="neu-input"
                        placeholder="Modèle"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 neu-inset rounded-lg">
                    <Switch
                      id="service"
                      checked={formData.service}
                      onCheckedChange={(checked) => handleInputChange("service", checked)}
                    />
                    <Label htmlFor="service" className="cursor-pointer">
                      Cet article est un service (non stockable)
                    </Label>
                  </div>
                </TabsContent>

                {/* Tab Identification */}
                <TabsContent value="identification" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ref">Référence *</Label>
                      <Input
                        id="ref"
                        value={formData.ref}
                        onChange={(e) => handleInputChange("ref", e.target.value)}
                        className="neu-input"
                        placeholder="REF-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="codeBarre">Code-barres *</Label>
                      <Input
                        id="codeBarre"
                        value={formData.codeBarre}
                        onChange={(e) => handleInputChange("codeBarre", e.target.value)}
                        className="neu-input"
                        placeholder="6191234567890"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="numSerie">Numéro de série</Label>
                      <Input
                        id="numSerie"
                        value={formData.numSerie}
                        onChange={(e) => handleInputChange("numSerie", e.target.value)}
                        className="neu-input"
                        placeholder="SN-2024-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="refVendeur">Référence vendeur</Label>
                      <Input
                        id="refVendeur"
                        value={formData.refVendeur}
                        onChange={(e) => handleInputChange("refVendeur", e.target.value)}
                        className="neu-input"
                        placeholder="VND-001"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Tab Prix & Taxes */}
                <TabsContent value="prix" className="space-y-6">
                  <Card className="neu-inset">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Prix d'achat
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="prixAchatHT">Prix d'achat HT (TND)</Label>
                        <Input
                          id="prixAchatHT"
                          type="number"
                          step="0.001"
                          value={formData.prixAchatHT}
                          onChange={(e) => handleInputChange("prixAchatHT", parseFloat(e.target.value) || 0)}
                          className="neu-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prixAchatTTC">Prix d'achat TTC (TND)</Label>
                        <Input
                          id="prixAchatTTC"
                          type="number"
                          step="0.001"
                          value={formData.prixAchatTTC.toFixed(3)}
                          readOnly
                          className="neu-input bg-muted"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="neu-inset">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Taxes tunisiennes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="tauxTva">TVA (%)</Label>
                        <Select
                          value={formData.tauxTva.toString()}
                          onValueChange={(value) => handleInputChange("tauxTva", parseFloat(value))}
                        >
                          <SelectTrigger className="neu-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0%</SelectItem>
                            <SelectItem value="7">7%</SelectItem>
                            <SelectItem value="13">13%</SelectItem>
                            <SelectItem value="19">19%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tauxtpe">TPE (%)</Label>
                        <Input
                          id="tauxtpe"
                          type="number"
                          step="0.1"
                          value={formData.tauxtpe}
                          onChange={(e) => handleInputChange("tauxtpe", parseFloat(e.target.value) || 0)}
                          className="neu-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tauxfodec">FODEC (%)</Label>
                        <Input
                          id="tauxfodec"
                          type="number"
                          step="0.1"
                          value={formData.tauxfodec}
                          onChange={(e) => handleInputChange("tauxfodec", parseFloat(e.target.value) || 0)}
                          className="neu-input"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="neu-inset">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Prix de vente
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="marge">Marge (%)</Label>
                        <Input
                          id="marge"
                          type="number"
                          step="0.1"
                          value={formData.marge}
                          onChange={(e) => handleInputChange("marge", parseFloat(e.target.value) || 0)}
                          className="neu-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prixVenteHT">Prix de vente HT (TND)</Label>
                        <Input
                          id="prixVenteHT"
                          type="number"
                          step="0.001"
                          value={formData.prixVenteHT.toFixed(3)}
                          readOnly
                          className="neu-input bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prixVenteTTC">Prix de vente TTC (TND)</Label>
                        <Input
                          id="prixVenteTTC"
                          type="number"
                          step="0.001"
                          value={formData.prixVenteTTC.toFixed(3)}
                          readOnly
                          className="neu-input bg-muted"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab Stock */}
                <TabsContent value="stock" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="uniteAchat">Unité d'achat</Label>
                      <Select
                        value={formData.uniteAchat}
                        onValueChange={(value) => handleInputChange("uniteAchat", value)}
                      >
                        <SelectTrigger className="neu-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Unité">Unité</SelectItem>
                          <SelectItem value="Carton">Carton</SelectItem>
                          <SelectItem value="Palette">Palette</SelectItem>
                          <SelectItem value="Kg">Kg</SelectItem>
                          <SelectItem value="Litre">Litre</SelectItem>
                          <SelectItem value="Mètre">Mètre</SelectItem>
                          <SelectItem value="Heure">Heure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="uniteVente">Unité de vente</Label>
                      <Select
                        value={formData.uniteVente}
                        onValueChange={(value) => handleInputChange("uniteVente", value)}
                      >
                        <SelectTrigger className="neu-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Unité">Unité</SelectItem>
                          <SelectItem value="Carton">Carton</SelectItem>
                          <SelectItem value="Palette">Palette</SelectItem>
                          <SelectItem value="Kg">Kg</SelectItem>
                          <SelectItem value="Litre">Litre</SelectItem>
                          <SelectItem value="Mètre">Mètre</SelectItem>
                          <SelectItem value="Heure">Heure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unitEmbalage">Unité d'emballage</Label>
                      <Input
                        id="unitEmbalage"
                        value={formData.unitEmbalage}
                        onChange={(e) => handleInputChange("unitEmbalage", e.target.value)}
                        className="neu-input"
                        placeholder="Carton de 12"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="stockAlerte">Seuil d'alerte stock</Label>
                      <Input
                        id="stockAlerte"
                        type="number"
                        value={formData.stockAlerte}
                        onChange={(e) => handleInputChange("stockAlerte", parseFloat(e.target.value) || 0)}
                        className="neu-input"
                        placeholder="5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pointFidelite" className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Points de fidélité
                      </Label>
                      <Input
                        id="pointFidelite"
                        type="number"
                        value={formData.pointFidelite}
                        onChange={(e) => handleInputChange("pointFidelite", parseInt(e.target.value) || 0)}
                        className="neu-input"
                        placeholder="10"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleCloseDialog}
                  className="neu-btn"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!formData.ref || !formData.libelle || !formData.codeBarre}
                  className="neu-btn-primary"
                >
                  {editingArticle ? "Enregistrer" : "Créer"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <Card className="neu-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par libellé, référence ou code-barres..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neu-input pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="neu-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <TooltipProvider>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Référence</TableHead>
                    <TableHead>Libellé</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead className="text-center">Stock</TableHead>
                    <TableHead className="text-right">Prix HT</TableHead>
                    <TableHead className="text-right">Prix TTC</TableHead>
                    <TableHead className="text-center">Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArticles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Aucun article trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredArticles.map((article) => (
                      <TableRow key={article.id} className="hover:bg-muted/20">
                        <TableCell className="font-mono text-sm">{article.ref}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{article.libelle}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {article.codeBarre}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {article.categorie && (
                            <Badge variant="outline" className="neu-badge">
                              {article.categorie.nom}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {article.service ? (
                            <span className="text-muted-foreground">—</span>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="inline-flex items-center gap-1 cursor-help">
                                  <span className={`font-bold ${article.stockTotal <= article.stockAlerte ? "text-danger" : "text-success"}`}>
                                    {article.stockTotal}
                                  </span>
                                  <Info size={12} className="text-muted-foreground" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="neu-card p-3 border-none shadow-neu-outset">
                                <div className="space-y-2">
                                  <p className="text-xs font-bold border-b pb-1">Répartition par Point de Vente</p>
                                  {article.stocks.length > 0 ? (
                                    article.stocks.map((s) => (
                                      <div key={s.pdvId} className="flex justify-between gap-4 text-xs">
                                        <span>{s.pdvNom}:</span>
                                        <span className="font-bold">{s.quantite}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-xs text-muted-foreground italic">Aucun stock enregistré</p>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {article.prixVenteHT.toFixed(3)} TND
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold">
                          {article.prixVenteTTC.toFixed(3)} TND
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={article.service ? "secondary" : "default"}
                            className={article.service ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}
                          >
                            {article.service ? "Service" : "Produit"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(article)}
                              className="neu-btn h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(article.id)}
                              className="neu-btn h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="neu-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{articles.filter(a => !a.service).length}</p>
              <p className="text-sm text-muted-foreground">Produits</p>
            </div>
          </CardContent>
        </Card>
        <Card className="neu-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-500/10">
              <Tag className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{articles.filter(a => a.service).length}</p>
              <p className="text-sm text-muted-foreground">Services</p>
            </div>
          </CardContent>
        </Card>
        <Card className="neu-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-500/10">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {articles.reduce((sum, a) => sum + (a.stockTotal * a.prixAchatHT), 0).toLocaleString("fr-TN", { minimumFractionDigits: 3 })}
              </p>
              <p className="text-sm text-muted-foreground">Valeur Stock HT (TND)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArticlesConfig;