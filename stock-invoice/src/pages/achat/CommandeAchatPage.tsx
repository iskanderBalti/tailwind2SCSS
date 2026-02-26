import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Search, FileText, Eye, Printer, AlertTriangle, PackageX, Calendar } from "lucide-react";
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

interface CommandeAchat {
  id: number;
  num: number;
  fournisseurId: number;
  fournisseurNom: string;
  dateDoc: string;
  exercice: string;
  details: DetailsDoc[];
  statut: "brouillon" | "validee" | "receptionnee";
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  notes: string;
}

const mockFournisseurs = [
  { id: 1, raisonSociale: "Fournisseur Alpha", articles: ["ART001", "ART003", "ART005"] },
  { id: 2, raisonSociale: "Fournisseur Beta", articles: ["ART002", "ART004", "ART006"] },
  { id: 3, raisonSociale: "Fournisseur Gamma", articles: ["ART001", "ART002", "ART007"] },
];

const mockArticles = [
  { ref: "ART001", libelle: "Ciment Portland 50kg", prixAchatHT: 18.500, prixVenteTTC: 25.000, tauxTva: 19, stockActuel: 2, seuilAlerte: 50, consommationMensuelle: 120 },
  { ref: "ART002", libelle: "Fer à béton 10mm", prixAchatHT: 12.000, prixVenteTTC: 16.500, tauxTva: 19, stockActuel: 0, seuilAlerte: 30, consommationMensuelle: 80 },
  { ref: "ART003", libelle: "Sable fin m³", prixAchatHT: 45.000, prixVenteTTC: 60.000, tauxTva: 19, stockActuel: 5, seuilAlerte: 20, consommationMensuelle: 35 },
  { ref: "ART004", libelle: "Brique rouge 12 trous", prixAchatHT: 0.350, prixVenteTTC: 0.500, tauxTva: 7, stockActuel: 100, seuilAlerte: 500, consommationMensuelle: 1500 },
  { ref: "ART005", libelle: "Tube PVC 100mm", prixAchatHT: 8.200, prixVenteTTC: 11.000, tauxTva: 19, stockActuel: 0, seuilAlerte: 40, consommationMensuelle: 60 },
  { ref: "ART006", libelle: "Fil électrique 2.5mm", prixAchatHT: 1.200, prixVenteTTC: 1.800, tauxTva: 19, stockActuel: 15, seuilAlerte: 100, consommationMensuelle: 200 },
  { ref: "ART007", libelle: "Peinture acrylique 25L", prixAchatHT: 85.000, prixVenteTTC: 110.000, tauxTva: 19, stockActuel: 3, seuilAlerte: 10, consommationMensuelle: 15 },
];

const CommandeAchatPage = () => {
  const { toast } = useToast();
  const [commandesList, setCommandesList] = useState<CommandeAchat[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRuptureOpen, setIsRuptureOpen] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState<CommandeAchat | null>(null);
  const [currentTab, setCurrentTab] = useState("general");

  const [formData, setFormData] = useState<Partial<CommandeAchat>>({
    fournisseurId: 0, fournisseurNom: "", dateDoc: new Date().toISOString().split("T")[0],
    exercice: new Date().getFullYear().toString(), details: [], statut: "brouillon",
    totalHT: 0, totalTVA: 0, totalTTC: 0, notes: "",
  });

  const [lineItem, setLineItem] = useState<Partial<DetailsDoc>>({
    articleRef: "", articleLibelle: "", quantite: 1, prixUnitaire: 0, remise: 0, tauxTva: 19,
  });

  const filteredCommandes = commandesList.filter((c) => {
    const matchesSearch =
      c.num.toString().includes(searchTerm) ||
      c.fournisseurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.fournisseurId.toString().includes(searchTerm);

    const matchesStartDate = !startDate || c.dateDoc >= startDate;
    const matchesEndDate = !endDate || c.dateDoc <= endDate;

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  const handlePrintList = () => {
    const columns = ["N°", "Date", "Fournisseur", "Total TTC", "Statut"];
    const data = filteredCommandes.map(c => [
      `CDA-${c.num.toString().padStart(4, "0")}`,
      new Date(c.dateDoc).toLocaleDateString("fr-TN"),
      c.fournisseurNom,
      `${c.totalTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND`,
      c.statut === "receptionnee" ? "Réceptionnée" : c.statut === "validee" ? "Validée" : "Brouillon"
    ]);
    printList("Liste des Commandes d'Achat", columns, data);
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
      id: Date.now(), articleRef: lineItem.articleRef!, articleLibelle: lineItem.articleLibelle!,
      quantite: lineItem.quantite!, prixUnitaire: lineItem.prixUnitaire!, remise: lineItem.remise || 0,
      montantHT, tauxTva: lineItem.tauxTva!, montantTTC,
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
        ...lineItem, articleRef: article.ref, articleLibelle: article.libelle,
        prixUnitaire: article.prixAchatHT, tauxTva: article.tauxTva,
      });
    }
  };

  const handleFournisseurSelect = (id: string) => {
    const fournisseur = mockFournisseurs.find((f) => f.id === parseInt(id));
    if (fournisseur) {
      setFormData({ ...formData, fournisseurId: fournisseur.id, fournisseurNom: fournisseur.raisonSociale });
    }
  };

  const getArticlesEnRupture = () => {
    if (!formData.fournisseurId) return [];
    const fournisseur = mockFournisseurs.find((f) => f.id === formData.fournisseurId);
    if (!fournisseur) return [];
    return mockArticles.filter(a => fournisseur.articles.includes(a.ref) && a.stockActuel <= a.seuilAlerte);
  };

  const handleAjouterRupture = () => {
    const articlesRupture = getArticlesEnRupture();
    if (articlesRupture.length === 0) {
      toast({ title: "Info", description: "Aucun article en rupture de stock pour ce fournisseur" });
      setIsRuptureOpen(false);
      return;
    }
    const existingRefs = (formData.details || []).map((d) => d.articleRef);
    const newLines: DetailsDoc[] = articlesRupture
      .filter((a) => !existingRefs.includes(a.ref))
      .map((a) => {
        const qteCommande = Math.max(a.consommationMensuelle - a.stockActuel, 0);
        const montantHT = qteCommande * a.prixAchatHT;
        const montantTVA = montantHT * (a.tauxTva / 100);
        const montantTTC = montantHT + montantTVA;
        return {
          id: Date.now() + Math.random(), articleRef: a.ref, articleLibelle: a.libelle,
          quantite: qteCommande, prixUnitaire: a.prixAchatHT, remise: 0, montantHT,
          tauxTva: a.tauxTva, montantTTC,
        };
      })
      .filter((l) => l.quantite > 0);

    if (newLines.length === 0) {
      toast({ title: "Info", description: "Tous les articles en rupture sont déjà dans la commande" });
      setIsRuptureOpen(false);
      return;
    }
    const newDetails = [...(formData.details || []), ...newLines];
    const totals = calculateDocumentTotals(newDetails);
    setFormData({ ...formData, details: newDetails, ...totals });
    toast({ title: "Articles ajoutés", description: `${newLines.length} article(s) en rupture ajouté(s)`, className: "bg-success text-success-foreground" });
    setIsRuptureOpen(false);
  };

  const handleCreate = () => {
    setSelectedCommande(null);
    setFormData({
      fournisseurId: 0, fournisseurNom: "", dateDoc: new Date().toISOString().split("T")[0],
      exercice: new Date().getFullYear().toString(), details: [], statut: "brouillon",
      totalHT: 0, totalTVA: 0, totalTTC: 0, notes: "",
    });
    setCurrentTab("general");
    setIsFormOpen(true);
  };

  const handleEdit = (cmd: CommandeAchat) => {
    if (cmd.statut === "receptionnee") {
      toast({ title: "Action non autorisée", description: "Cette commande a déjà été réceptionnée", variant: "destructive" });
      return;
    }
    setSelectedCommande(cmd);
    setFormData({ ...cmd });
    setCurrentTab("general");
    setIsFormOpen(true);
  };

  const handleView = (cmd: CommandeAchat) => {
    setSelectedCommande(cmd);
    setIsViewOpen(true);
  };

  const handlePrint = (cmd: CommandeAchat) => {
    printDocument({
      type: "Commande d'Achat", numero: `CDA-${cmd.num.toString().padStart(4, "0")}`,
      date: new Date(cmd.dateDoc).toLocaleDateString("fr-TN"), client: cmd.fournisseurNom,
      lines: cmd.details, totalHT: cmd.totalHT, totalTVA: cmd.totalTVA, totalTTC: cmd.totalTTC,
    });
  };

  const handleDelete = (cmd: CommandeAchat) => {
    if (cmd.statut === "receptionnee") {
      toast({ title: "Action non autorisée", description: "Cette commande a déjà été réceptionnée", variant: "destructive" });
      return;
    }
    setSelectedCommande(cmd);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCommande) {
      setCommandesList(commandesList.filter((c) => c.id !== selectedCommande.id));
      toast({ title: "Commande supprimée", description: `La commande N°${selectedCommande.num} a été supprimée` });
    }
    setIsDeleteOpen(false);
    setSelectedCommande(null);
  };

  const handleSave = () => {
    if (!formData.fournisseurId) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un fournisseur", variant: "destructive" });
      return;
    }
    if (!formData.details || formData.details.length === 0) {
      toast({ title: "Erreur", description: "Veuillez ajouter au moins une ligne", variant: "destructive" });
      return;
    }
    if (selectedCommande) {
      setCommandesList(commandesList.map((c) => c.id === selectedCommande.id ? { ...c, ...formData, statut: formData.statut as CommandeAchat["statut"] } : c));
      toast({ title: "Commande modifiée", description: `La commande N°${selectedCommande.num} a été modifiée` });
    } else {
      const newNum = Math.max(...commandesList.map((c) => c.num), 0) + 1;
      const newCmd: CommandeAchat = {
        id: Date.now(), num: newNum, fournisseurId: formData.fournisseurId!, fournisseurNom: formData.fournisseurNom!,
        dateDoc: formData.dateDoc!, exercice: formData.exercice!, details: formData.details!, statut: "brouillon",
        totalHT: formData.totalHT || 0, totalTVA: formData.totalTVA || 0, totalTTC: formData.totalTTC || 0, notes: formData.notes || "",
      };
      setCommandesList([...commandesList, newCmd]);
      toast({ title: "Commande créée", description: `La commande N°${newNum} a été créée` });
    }
    setIsFormOpen(false);
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "brouillon": return <span className="neu-badge-warning">Brouillon</span>;
      case "validee": return <span className="neu-badge-success">Validée</span>;
      case "receptionnee": return <span className="neu-badge-info">Réceptionnée</span>;
      default: return null;
    }
  };

  const articlesRupture = getArticlesEnRupture();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Commandes d'Achat</h1>
          <p className="text-muted-foreground">Gérez vos commandes fournisseurs</p>
        </div>
        <Button onClick={handleCreate} className="neu-btn-primary">
          <Plus className="w-4 h-4 mr-2" /> Nouvelle Commande
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="neu-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="N° ou Fournisseur (Nom/ID)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neu-input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap text-xs text-muted-foreground">Du:</Label>
            <div className="relative w-full">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3" />
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="neu-input pl-8 text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap text-xs text-muted-foreground">Au:</Label>
            <div className="relative w-full">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3" />
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="neu-input pl-8 text-sm" />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handlePrintList} variant="outline" className="neu-btn gap-2 text-sm">
            <Printer className="w-4 h-4" /> Imprimer la liste
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
              <TableHead>Fournisseur</TableHead>
              <TableHead className="text-right">Total TTC</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCommandes.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Aucune commande trouvée</TableCell></TableRow>
            ) : (
              filteredCommandes.map((cmd) => (
                <TableRow key={cmd.id}>
                  <TableCell className="font-medium">CDA-{cmd.num.toString().padStart(4, "0")}</TableCell>
                  <TableCell>{new Date(cmd.dateDoc).toLocaleDateString("fr-TN")}</TableCell>
                  <TableCell>{cmd.fournisseurNom} <span className="text-xs text-muted-foreground">({cmd.fournisseurId})</span></TableCell>
                  <TableCell className="text-right font-semibold">{cmd.totalTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</TableCell>
                  <TableCell>{getStatutBadge(cmd.statut)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(cmd)} className="hover:bg-info/20 hover:text-info"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handlePrint(cmd)} className="hover:bg-accent" title="Imprimer"><Printer className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(cmd)} disabled={cmd.statut === "receptionnee"} className="hover:bg-secondary/20 hover:text-secondary"><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(cmd)} disabled={cmd.statut === "receptionnee"} className="hover:bg-danger/20 hover:text-danger"><Trash2 className="w-4 h-4" /></Button>
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
          <DialogHeader><DialogTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-secondary" />{selectedCommande ? `Modifier Commande N°${selectedCommande.num}` : "Nouvelle Commande d'Achat"}</DialogTitle></DialogHeader>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4"><TabsTrigger value="general">Général</TabsTrigger><TabsTrigger value="lignes">Lignes</TabsTrigger><TabsTrigger value="notes">Notes</TabsTrigger></TabsList>
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Date du Document *</Label><Input type="date" value={formData.dateDoc} onChange={(e) => setFormData({ ...formData, dateDoc: e.target.value })} className="neu-input" /></div>
                <div className="space-y-2"><Label>Exercice *</Label><Input value={formData.exercice} onChange={(e) => setFormData({ ...formData, exercice: e.target.value })} className="neu-input" /></div>
              </div>
              <div className="space-y-2"><Label>Fournisseur *</Label><Select value={formData.fournisseurId?.toString()} onValueChange={handleFournisseurSelect}><SelectTrigger className="neu-input"><SelectValue placeholder="Sélectionner un fournisseur" /></SelectTrigger><SelectContent>{mockFournisseurs.map((f) => (<SelectItem key={f.id} value={f.id.toString()}>{f.raisonSociale}</SelectItem>))}</SelectContent></Select></div>
              {formData.fournisseurId !== 0 && (<div className="space-y-2"><Label>Statut</Label><Select value={formData.statut} onValueChange={(v) => setFormData({ ...formData, statut: v as CommandeAchat["statut"] })}><SelectTrigger className="neu-input"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="brouillon">Brouillon</SelectItem><SelectItem value="validee">Validée</SelectItem></SelectContent></Select></div>)}
            </TabsContent>
            <TabsContent value="lignes" className="space-y-4">
              {formData.fournisseurId !== 0 && (<div className="flex justify-end"><Button onClick={() => setIsRuptureOpen(true)} className="neu-btn-warning gap-2" type="button"><PackageX className="w-4 h-4" />Ajouter articles en rupture ({articlesRupture.length})</Button></div>)}
              <div className="neu-card-sm space-y-4"><h4 className="font-semibold text-foreground">Ajouter une ligne</h4><div className="grid grid-cols-1 md:grid-cols-4 gap-4"><div className="space-y-2"><Label>Article</Label><ArticleSearchInput articles={mockArticles.map(a => ({ ...a, prixVenteTTC: a.prixAchatHT * 1.19 }))} value={lineItem.articleRef || ""} onSelect={handleArticleSelect} /></div><div className="space-y-2"><Label>Quantité</Label><Input type="number" min="1" value={lineItem.quantite} onChange={(e) => setLineItem({ ...lineItem, quantite: parseFloat(e.target.value) || 0 })} className="neu-input" /></div><div className="space-y-2"><Label>Prix Unitaire HT</Label><Input type="number" step="0.001" value={lineItem.prixUnitaire} onChange={(e) => setLineItem({ ...lineItem, prixUnitaire: parseFloat(e.target.value) || 0 })} className="neu-input" /></div><div className="space-y-2"><Label>Remise %</Label><Input type="number" min="0" max="100" value={lineItem.remise} onChange={(e) => setLineItem({ ...lineItem, remise: parseFloat(e.target.value) || 0 })} className="neu-input" /></div></div><Button onClick={handleAddLine} className="neu-btn-primary"><Plus className="w-4 h-4 mr-2" />Ajouter</Button></div>
              <div className="border border-muted rounded-lg overflow-hidden"><Table><TableHeader><TableRow><TableHead>Article</TableHead><TableHead className="text-right">Qté</TableHead><TableHead className="text-right">Prix Unit. HT</TableHead><TableHead className="text-right">Remise</TableHead><TableHead className="text-right">TVA</TableHead><TableHead className="text-right">Montant TTC</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{formData.details?.length === 0 ? (<TableRow><TableCell colSpan={7} className="text-center py-4 text-muted-foreground">Aucune ligne ajoutée</TableCell></TableRow>) : (formData.details?.map((line) => (<TableRow key={line.id}><TableCell><div><div className="font-medium">{line.articleRef}</div><div className="text-sm text-muted-foreground">{line.articleLibelle}</div></div></TableCell><TableCell className="text-right">{line.quantite}</TableCell><TableCell className="text-right">{line.prixUnitaire.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell><TableCell className="text-right">{line.remise}%</TableCell><TableCell className="text-right">{line.tauxTva}%</TableCell><TableCell className="text-right font-semibold">{line.montantTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell><TableCell><Button variant="ghost" size="icon" onClick={() => handleRemoveLine(line.id)} className="hover:bg-danger/20 hover:text-danger"><Trash2 className="w-4 h-4" /></Button></TableCell></TableRow>)))}</TableBody></Table></div>
              <div className="flex justify-end"><div className="neu-card-sm w-64 space-y-2"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Total HT:</span><span>{(formData.totalHT || 0).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div><div className="flex justify-between text-sm"><span className="text-muted-foreground">Total TVA:</span><span>{(formData.totalTVA || 0).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div><div className="flex justify-between font-semibold border-t border-muted pt-2"><span>Total TTC:</span><span className="text-secondary">{(formData.totalTTC || 0).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div></div></div>
            </TabsContent>
            <TabsContent value="notes" className="space-y-4"><div className="space-y-2"><Label>Notes / Observations</Label><textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Ajouter des notes..." className="neu-input min-h-[150px] resize-y" rows={6} /></div></TabsContent>
          </Tabs>
          <DialogFooter className="gap-2"><Button variant="outline" onClick={() => setIsFormOpen(false)}>Annuler</Button><Button onClick={handleSave} className="neu-btn-primary">{selectedCommande ? "Modifier" : "Créer"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl bg-background">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-info" />Commande N° CDA-{selectedCommande?.num.toString().padStart(4, "0")}</DialogTitle></DialogHeader>
          {selectedCommande && (<div className="space-y-6"><div className="grid grid-cols-2 gap-4"><div className="space-y-1"><p className="text-sm text-muted-foreground">Fournisseur</p><p className="font-medium">{selectedCommande.fournisseurNom}</p></div><div className="space-y-1"><p className="text-sm text-muted-foreground">Date</p><p className="font-medium">{new Date(selectedCommande.dateDoc).toLocaleDateString("fr-TN")}</p></div><div className="space-y-1"><p className="text-sm text-muted-foreground">Statut</p>{getStatutBadge(selectedCommande.statut)}</div><div className="space-y-1"><p className="text-sm text-muted-foreground">Exercice</p><p className="font-medium">{selectedCommande.exercice}</p></div></div><div className="border border-muted rounded-lg overflow-hidden"><Table><TableHeader><TableRow><TableHead>Article</TableHead><TableHead className="text-right">Qté</TableHead><TableHead className="text-right">P.U. HT</TableHead><TableHead className="text-right">Montant TTC</TableHead></TableRow></TableHeader><TableBody>{selectedCommande.details.map((line) => (<TableRow key={line.id}><TableCell>{line.articleRef} - {line.articleLibelle}</TableCell><TableCell className="text-right">{line.quantite}</TableCell><TableCell className="text-right">{line.prixUnitaire.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell><TableCell className="text-right">{line.montantTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell></TableRow>))}</TableBody></Table></div><div className="flex justify-end"><div className="neu-card-sm w-64 space-y-2"><div className="flex justify-between font-semibold text-lg"><span>Total TTC:</span><span className="text-secondary">{selectedCommande.totalTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div></div></div><div className="flex justify-end mt-4"><Button onClick={() => handlePrint(selectedCommande)} className="neu-btn-primary gap-2"><Printer className="w-4 h-4" />Imprimer</Button></div></div>)}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Confirmer la suppression</AlertDialogTitle><AlertDialogDescription>Êtes-vous sûr de vouloir supprimer la commande N°{selectedCommande?.num} ?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className="neu-btn-danger">Supprimer</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>

      {/* Rupture Dialog */}
      <Dialog open={isRuptureOpen} onOpenChange={setIsRuptureOpen}>
        <DialogContent className="max-w-2xl bg-background">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-warning" />Articles en rupture</DialogTitle></DialogHeader>
          {articlesRupture.length === 0 ? (<div className="text-center py-8 text-muted-foreground"><PackageX className="w-12 h-12 mx-auto mb-2 opacity-50" /><p>Aucun article en rupture</p></div>) : (
            <div className="border border-muted rounded-lg overflow-hidden"><Table><TableHeader><TableRow><TableHead>Article</TableHead><TableHead className="text-right">Stock</TableHead><TableHead className="text-right">Qté à commander</TableHead></TableRow></TableHeader><TableBody>{articlesRupture.map((a) => (<TableRow key={a.ref}><TableCell><div><div className="font-medium">{a.ref}</div><div className="text-sm text-muted-foreground">{a.libelle}</div></div></TableCell><TableCell className="text-right"><span className={a.stockActuel === 0 ? "text-danger font-semibold" : "text-warning font-semibold"}>{a.stockActuel}</span></TableCell><TableCell className="text-right font-semibold text-secondary">{Math.max(a.consommationMensuelle - a.stockActuel, 0)}</TableCell></TableRow>))}</TableBody></Table></div>
          )}
          <DialogFooter className="gap-2"><Button variant="outline" onClick={() => setIsRuptureOpen(false)}>Annuler</Button>{articlesRupture.length > 0 && (<Button onClick={handleAjouterRupture} className="neu-btn-success gap-2"><Plus className="w-4 h-4" />Ajouter {articlesRupture.length} article(s)</Button>)}</DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommandeAchatPage;