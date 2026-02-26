import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Search, FileText, Truck, Eye, Printer, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ArticleSearchInput from "@/components/ArticleSearchInput";
import { printDocument } from "@/utils/printDocument";
import { printList } from "@/utils/printList";

interface DetailsDoc {
  id: number;
  articleRef: string;
  articleLibelle: string;
  quantite: number;
  prixUnitaire: number;
  remise: number;
  montantHT: number;
  tauxTva: number;
  montantTTC: number;
}

interface Devis {
  id: number;
  num: number;
  clientId: number;
  clientNom: string;
  dateDoc: string;
  exercice: string;
  vehicule: string;
  livreur: string;
  pointDeVente: string;
  details: DetailsDoc[];
  statut: "brouillon" | "valide" | "transforme";
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
}

const mockClients = [
  { id: 1, raisonSociale: "Société ABC" },
  { id: 2, raisonSociale: "Entreprise XYZ" },
  { id: 3, raisonSociale: "Commerce 123" },
];

const mockArticles = [
  { ref: "ART001", libelle: "Article A", prixVenteTTC: 100, tauxTva: 19 },
  { ref: "ART002", libelle: "Article B", prixVenteTTC: 250, tauxTva: 19 },
  { ref: "ART003", libelle: "Article C", prixVenteTTC: 75, tauxTva: 7 },
];

const mockPointsDeVente = [
  { id: 1, nom: "Point de Vente Principal" },
  { id: 2, nom: "Succursale Nord" },
  { id: 3, nom: "Succursale Sud" },
];

const DevisPage = () => {
  const { toast } = useToast();
  const [devisList, setDevisList] = useState<Devis[]>([
    {
      id: 1,
      num: 1,
      clientId: 1,
      clientNom: "Société ABC",
      dateDoc: "2024-01-15",
      exercice: "2024",
      vehicule: "TU-1234",
      livreur: "Ahmed Ben Ali",
      pointDeVente: "Point de Vente Principal",
      details: [
        {
          id: 1,
          articleRef: "ART001",
          articleLibelle: "Article A",
          quantite: 5,
          prixUnitaire: 100,
          remise: 0,
          montantHT: 420.17,
          tauxTva: 19,
          montantTTC: 500,
        },
      ],
      statut: "valide",
      totalHT: 420.17,
      totalTVA: 79.83,
      totalTTC: 500,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isTransformOpen, setIsTransformOpen] = useState(false);
  const [selectedDevis, setSelectedDevis] = useState<Devis | null>(null);
  const [currentTab, setCurrentTab] = useState("general");

  const [formData, setFormData] = useState<Partial<Devis>>({
    clientId: 0,
    clientNom: "",
    dateDoc: new Date().toISOString().split("T")[0],
    exercice: new Date().getFullYear().toString(),
    vehicule: "",
    livreur: "",
    pointDeVente: "",
    details: [],
    statut: "brouillon",
  });

  const [lineItem, setLineItem] = useState<Partial<DetailsDoc>>({
    articleRef: "",
    articleLibelle: "",
    quantite: 1,
    prixUnitaire: 0,
    remise: 0,
    tauxTva: 19,
  });

  const filteredDevis = devisList.filter((d) => {
    const matchesSearch =
      d.num.toString().includes(searchTerm) ||
      d.clientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.clientId.toString().includes(searchTerm);

    const matchesStartDate = !startDate || d.dateDoc >= startDate;
    const matchesEndDate = !endDate || d.dateDoc <= endDate;

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  const handlePrintList = () => {
    const columns = ["N°", "Date", "Client", "Point de Vente", "Total TTC", "Statut"];
    const data = filteredDevis.map(d => [
      `DEV-${d.num.toString().padStart(4, "0")}`,
      new Date(d.dateDoc).toLocaleDateString("fr-TN"),
      d.clientNom,
      d.pointDeVente || "-",
      `${d.totalTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND`,
      d.statut === "transforme" ? "Transformé" : d.statut === "valide" ? "Validé" : "Brouillon"
    ]);
    printList("Liste des Devis", columns, data);
  };

  const calculateLineTotals = (item: Partial<DetailsDoc>) => {
    const qty = item.quantite || 0;
    const prix = item.prixUnitaire || 0;
    const remise = item.remise || 0;
    const tva = item.tauxTva || 0;
    const montantBrut = qty * prix;
    const montantRemise = montantBrut * (remise / 100);
    const montantHT = montantBrut - montantRemise;
    const montantTVA = montantHT * (tva / 100);
    const montantTTC = montantHT + montantTVA;
    return { montantHT, montantTTC };
  };

  const calculateDocumentTotals = (details: DetailsDoc[]) => {
    const totalHT = details.reduce((sum, d) => sum + d.montantHT, 0);
    const totalTTC = details.reduce((sum, d) => sum + d.montantTTC, 0);
    const totalTVA = totalTTC - totalHT;
    return { totalHT, totalTVA, totalTTC };
  };

  const handleAddLine = () => {
    if (!lineItem.articleRef) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un article", variant: "destructive" });
      return;
    }
    const { montantHT, montantTTC } = calculateLineTotals(lineItem);
    const newLine: DetailsDoc = {
      id: Date.now(),
      articleRef: lineItem.articleRef!,
      articleLibelle: lineItem.articleLibelle!,
      quantite: lineItem.quantite!,
      prixUnitaire: lineItem.prixUnitaire!,
      remise: lineItem.remise || 0,
      montantHT,
      tauxTva: lineItem.tauxTva!,
      montantTTC,
    };
    const newDetails = [...(formData.details || []), newLine];
    const totals = calculateDocumentTotals(newDetails);
    setFormData({ ...formData, details: newDetails, ...totals });
    setLineItem({ articleRef: "", articleLibelle: "", quantite: 1, prixUnitaire: 0, remise: 0, tauxTva: 19 });
  };

  const handleRemoveLine = (lineId: number) => {
    const newDetails = (formData.details || []).filter((d) => d.id !== lineId);
    const totals = calculateDocumentTotals(newDetails);
    setFormData({ ...formData, details: newDetails, ...totals });
  };

  const handleArticleSelect = (ref: string) => {
    const article = mockArticles.find((a) => a.ref === ref);
    if (article) {
      setLineItem({
        ...lineItem,
        articleRef: article.ref,
        articleLibelle: article.libelle,
        prixUnitaire: article.prixVenteTTC / (1 + article.tauxTva / 100),
        tauxTva: article.tauxTva,
      });
    }
  };

  const handleClientSelect = (id: string) => {
    const client = mockClients.find((c) => c.id === parseInt(id));
    if (client) {
      setFormData({ ...formData, clientId: client.id, clientNom: client.raisonSociale });
    }
  };

  const handleCreate = () => {
    setSelectedDevis(null);
    setFormData({
      clientId: 0, clientNom: "", dateDoc: new Date().toISOString().split("T")[0],
      exercice: new Date().getFullYear().toString(), vehicule: "", livreur: "",
      pointDeVente: "", details: [], statut: "brouillon", totalHT: 0, totalTVA: 0, totalTTC: 0,
    });
    setCurrentTab("general");
    setIsFormOpen(true);
  };

  const handleEdit = (devis: Devis) => {
    if (devis.statut === "transforme") {
      toast({ title: "Action non autorisée", description: "Ce devis a déjà été transformé", variant: "destructive" });
      return;
    }
    setSelectedDevis(devis);
    setFormData({ ...devis });
    setCurrentTab("general");
    setIsFormOpen(true);
  };

  const handleView = (devis: Devis) => {
    setSelectedDevis(devis);
    setIsViewOpen(true);
  };

  const handlePrint = (devis: Devis) => {
    printDocument({
      type: "Devis", numero: `DEV-${devis.num.toString().padStart(4, "0")}`,
      date: new Date(devis.dateDoc).toLocaleDateString("fr-TN"), client: devis.clientNom,
      pointDeVente: devis.pointDeVente, vehicule: devis.vehicule, livreur: devis.livreur,
      lines: devis.details, totalHT: devis.totalHT, totalTVA: devis.totalTVA, totalTTC: devis.totalTTC,
    });
  };

  const handleDelete = (devis: Devis) => {
    if (devis.statut === "transforme") {
      toast({ title: "Action non autorisée", description: "Ce devis a déjà été transformé", variant: "destructive" });
      return;
    }
    setSelectedDevis(devis);
    setIsDeleteOpen(true);
  };

  const handleTransform = (devis: Devis) => {
    if (devis.statut === "transforme") {
      toast({ title: "Action non autorisée", description: "Ce devis a déjà été transformé", variant: "destructive" });
      return;
    }
    setSelectedDevis(devis);
    setIsTransformOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDevis) {
      setDevisList(devisList.filter((d) => d.id !== selectedDevis.id));
      toast({ title: "Devis supprimé", description: `Le devis N°${selectedDevis.num} a été supprimé` });
    }
    setIsDeleteOpen(false);
    setSelectedDevis(null);
  };

  const confirmTransform = () => {
    if (selectedDevis) {
      setDevisList(devisList.map((d) => d.id === selectedDevis.id ? { ...d, statut: "transforme" as const } : d));
      toast({ title: "Transformation réussie", description: `Le devis N°${selectedDevis.num} a été transformé en BL`, className: "bg-success text-success-foreground" });
    }
    setIsTransformOpen(false);
    setSelectedDevis(null);
  };

  const handleSave = () => {
    if (!formData.clientId) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un client", variant: "destructive" });
      return;
    }
    if (!formData.details || formData.details.length === 0) {
      toast({ title: "Erreur", description: "Veuillez ajouter au moins une ligne", variant: "destructive" });
      return;
    }
    if (selectedDevis) {
      setDevisList(devisList.map((d) => d.id === selectedDevis.id ? { ...d, ...formData, statut: "valide" as const } : d));
      toast({ title: "Devis modifié", description: `Le devis N°${selectedDevis.num} a été modifié` });
    } else {
      const newNum = Math.max(...devisList.map((d) => d.num), 0) + 1;
      const newDevis: Devis = {
        id: Date.now(), num: newNum, clientId: formData.clientId!, clientNom: formData.clientNom!,
        dateDoc: formData.dateDoc!, exercice: formData.exercice!, vehicule: formData.vehicule || "",
        livreur: formData.livreur || "", pointDeVente: formData.pointDeVente || "",
        details: formData.details!, statut: "valide", totalHT: formData.totalHT || 0,
        totalTVA: formData.totalTVA || 0, totalTTC: formData.totalTTC || 0,
      };
      setDevisList([...devisList, newDevis]);
      toast({ title: "Devis créé", description: `Le devis N°${newNum} a été créé` });
    }
    setIsFormOpen(false);
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "brouillon": return <span className="neu-badge-warning">Brouillon</span>;
      case "valide": return <span className="neu-badge-success">Validé</span>;
      case "transforme": return <span className="neu-badge-info">Transformé</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des Devis</h1>
          <p className="text-muted-foreground">Créez et gérez vos devis clients</p>
        </div>
        <Button onClick={handleCreate} className="neu-btn-primary">
          <Plus className="w-4 h-4 mr-2" /> Nouveau Devis
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="neu-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="N° ou Client (Nom/ID)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neu-input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap text-xs text-muted-foreground">Du:</Label>
            <div className="relative w-full">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="neu-input pl-8 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap text-xs text-muted-foreground">Au:</Label>
            <div className="relative w-full">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3" />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="neu-input pl-8 text-sm"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handlePrintList} variant="outline" className="neu-btn gap-2 text-sm">
            <Printer className="w-4 h-4" />
            Imprimer la liste
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="neu-card overflow-hidden">
        <Table className="neu-table">
          <TableHeader>
            <TableRow>
              <TableHead>N°</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Point de Vente</TableHead>
              <TableHead className="text-right">Total TTC</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDevis.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Aucun devis trouvé</TableCell>
              </TableRow>
            ) : (
              filteredDevis.map((devis) => (
                <TableRow key={devis.id}>
                  <TableCell className="font-medium">DEV-{devis.num.toString().padStart(4, "0")}</TableCell>
                  <TableCell>{new Date(devis.dateDoc).toLocaleDateString("fr-TN")}</TableCell>
                  <TableCell>{devis.clientNom} <span className="text-xs text-muted-foreground">({devis.clientId})</span></TableCell>
                  <TableCell>{devis.pointDeVente || "-"}</TableCell>
                  <TableCell className="text-right font-semibold">{devis.totalTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</TableCell>
                  <TableCell>{getStatutBadge(devis.statut)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(devis)} className="hover:bg-info/20 hover:text-info"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handlePrint(devis)} className="hover:bg-accent" title="Imprimer"><Printer className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(devis)} disabled={devis.statut === "transforme"} className="hover:bg-secondary/20 hover:text-secondary"><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleTransform(devis)} disabled={devis.statut === "transforme"} className="hover:bg-success/20 hover:text-success" title="Transformer en BL"><Truck className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(devis)} disabled={devis.statut === "transforme"} className="hover:bg-danger/20 hover:text-danger"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-secondary" />{selectedDevis ? `Modifier Devis N°${selectedDevis.num}` : "Nouveau Devis"}</DialogTitle></DialogHeader>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4"><TabsTrigger value="general">Général</TabsTrigger><TabsTrigger value="livraison">Livraison</TabsTrigger><TabsTrigger value="lignes">Lignes</TabsTrigger></TabsList>
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Date du Document *</Label><Input type="date" value={formData.dateDoc} onChange={(e) => setFormData({ ...formData, dateDoc: e.target.value })} className="neu-input" /></div>
                <div className="space-y-2"><Label>Exercice *</Label><Input value={formData.exercice} onChange={(e) => setFormData({ ...formData, exercice: e.target.value })} className="neu-input" /></div>
              </div>
              <div className="space-y-2"><Label>Client *</Label><Select value={formData.clientId?.toString()} onValueChange={handleClientSelect}><SelectTrigger className="neu-input"><SelectValue placeholder="Sélectionner un client" /></SelectTrigger><SelectContent>{mockClients.map((client) => (<SelectItem key={client.id} value={client.id.toString()}>{client.raisonSociale}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Point de Vente</Label><Select value={formData.pointDeVente} onValueChange={(value) => setFormData({ ...formData, pointDeVente: value })}><SelectTrigger className="neu-input"><SelectValue placeholder="Sélectionner un point de vente" /></SelectTrigger><SelectContent>{mockPointsDeVente.map((pdv) => (<SelectItem key={pdv.id} value={pdv.nom}>{pdv.nom}</SelectItem>))}</SelectContent></Select></div>
            </TabsContent>
            <TabsContent value="livraison" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Véhicule</Label><Input value={formData.vehicule} onChange={(e) => setFormData({ ...formData, vehicule: e.target.value })} placeholder="Ex: TU-1234" className="neu-input" /></div>
                <div className="space-y-2"><Label>Livreur</Label><Input value={formData.livreur} onChange={(e) => setFormData({ ...formData, livreur: e.target.value })} placeholder="Nom du livreur" className="neu-input" /></div>
              </div>
            </TabsContent>
            <TabsContent value="lignes" className="space-y-4">
              <div className="neu-card-sm space-y-4"><h4 className="font-semibold text-foreground">Ajouter une ligne</h4><div className="grid grid-cols-1 md:grid-cols-4 gap-4"><div className="space-y-2"><Label>Article</Label><ArticleSearchInput articles={mockArticles} value={lineItem.articleRef || ""} onSelect={handleArticleSelect} /></div><div className="space-y-2"><Label>Quantité</Label><Input type="number" min="1" value={lineItem.quantite} onChange={(e) => setLineItem({ ...lineItem, quantite: parseFloat(e.target.value) || 0 })} className="neu-input" /></div><div className="space-y-2"><Label>Prix Unitaire HT</Label><Input type="number" step="0.001" value={lineItem.prixUnitaire} onChange={(e) => setLineItem({ ...lineItem, prixUnitaire: parseFloat(e.target.value) || 0 })} className="neu-input" /></div><div className="space-y-2"><Label>Remise %</Label><Input type="number" min="0" max="100" value={lineItem.remise} onChange={(e) => setLineItem({ ...lineItem, remise: parseFloat(e.target.value) || 0 })} className="neu-input" /></div></div><Button onClick={handleAddLine} className="neu-btn-primary"><Plus className="w-4 h-4 mr-2" />Ajouter</Button></div>
              <div className="border border-muted rounded-lg overflow-hidden"><Table><TableHeader><TableRow><TableHead>Article</TableHead><TableHead className="text-right">Qté</TableHead><TableHead className="text-right">Prix Unit. HT</TableHead><TableHead className="text-right">Remise</TableHead><TableHead className="text-right">TVA</TableHead><TableHead className="text-right">Montant TTC</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{formData.details?.length === 0 ? (<TableRow><TableCell colSpan={7} className="text-center py-4 text-muted-foreground">Aucune ligne ajoutée</TableCell></TableRow>) : (formData.details?.map((line) => (<TableRow key={line.id}><TableCell><div><div className="font-medium">{line.articleRef}</div><div className="text-sm text-muted-foreground">{line.articleLibelle}</div></div></TableCell><TableCell className="text-right">{line.quantite}</TableCell><TableCell className="text-right">{line.prixUnitaire.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell><TableCell className="text-right">{line.remise}%</TableCell><TableCell className="text-right">{line.tauxTva}%</TableCell><TableCell className="text-right font-semibold">{line.montantTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell><TableCell><Button variant="ghost" size="icon" onClick={() => handleRemoveLine(line.id)} className="hover:bg-danger/20 hover:text-danger"><Trash2 className="w-4 h-4" /></Button></TableCell></TableRow>)))}</TableBody></Table></div>
              <div className="flex justify-end"><div className="neu-card-sm w-64 space-y-2"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Total HT:</span><span>{(formData.totalHT || 0).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div><div className="flex justify-between text-sm"><span className="text-muted-foreground">Total TVA:</span><span>{(formData.totalTVA || 0).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div><div className="flex justify-between font-semibold border-t border-muted pt-2"><span>Total TTC:</span><span className="text-secondary">{(formData.totalTTC || 0).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div></div></div>
            </TabsContent>
          </Tabs>
          <DialogFooter className="gap-2"><Button variant="outline" onClick={() => setIsFormOpen(false)}>Annuler</Button><Button onClick={handleSave} className="neu-btn-primary">{selectedDevis ? "Modifier" : "Créer"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl bg-background">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-info" />Devis N° DEV-{selectedDevis?.num.toString().padStart(4, "0")}</DialogTitle></DialogHeader>
          {selectedDevis && (<div className="space-y-6"><div className="grid grid-cols-2 gap-4"><div className="space-y-1"><p className="text-sm text-muted-foreground">Client</p><p className="font-medium">{selectedDevis.clientNom}</p></div><div className="space-y-1"><p className="text-sm text-muted-foreground">Date</p><p className="font-medium">{new Date(selectedDevis.dateDoc).toLocaleDateString("fr-TN")}</p></div><div className="space-y-1"><p className="text-sm text-muted-foreground">Point de Vente</p><p className="font-medium">{selectedDevis.pointDeVente || "-"}</p></div><div className="space-y-1"><p className="text-sm text-muted-foreground">Statut</p>{getStatutBadge(selectedDevis.statut)}</div></div><div className="border border-muted rounded-lg overflow-hidden"><Table><TableHeader><TableRow><TableHead>Article</TableHead><TableHead className="text-right">Qté</TableHead><TableHead className="text-right">P.U. HT</TableHead><TableHead className="text-right">Montant TTC</TableHead></TableRow></TableHeader><TableBody>{selectedDevis.details.map((line) => (<TableRow key={line.id}><TableCell>{line.articleRef} - {line.articleLibelle}</TableCell><TableCell className="text-right">{line.quantite}</TableCell><TableCell className="text-right">{line.prixUnitaire.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell><TableCell className="text-right">{line.montantTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell></TableRow>))}</TableBody></Table></div><div className="flex justify-end"><div className="neu-card-sm w-64 space-y-2"><div className="flex justify-between font-semibold text-lg"><span>Total TTC:</span><span className="text-secondary">{selectedDevis.totalTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div></div></div><div className="flex justify-end mt-4"><Button onClick={() => handlePrint(selectedDevis)} className="neu-btn-primary gap-2"><Printer className="w-4 h-4" />Imprimer</Button></div></div>)}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Confirmer la suppression</AlertDialogTitle><AlertDialogDescription>Êtes-vous sûr de vouloir supprimer le devis N° <strong>DEV-{selectedDevis?.num.toString().padStart(4, "0")}</strong> ? Cette action est irréversible.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className="bg-danger hover:bg-danger/90">Supprimer</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>

      {/* Transform Confirmation */}
      <AlertDialog open={isTransformOpen} onOpenChange={setIsTransformOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle className="flex items-center gap-2"><Truck className="w-5 h-5 text-success" />Transformer en Bon de Livraison</AlertDialogTitle><AlertDialogDescription>Voulez-vous transformer le devis N° <strong>DEV-{selectedDevis?.num.toString().padStart(4, "0")}</strong> en bon de livraison ? Cette action créera un nouveau bon de livraison avec les mêmes informations.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={confirmTransform} className="bg-success hover:bg-success/90">Transformer</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
};

export default DevisPage;