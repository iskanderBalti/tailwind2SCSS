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
import { Plus, Pencil, Trash2, Search, Eye, Printer, PackageCheck, FileText, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ArticleSearchInput from "@/components/ArticleSearchInput";
import { printDocument } from "@/utils/printDocument";
import { printList } from "@/utils/printList";

interface LigneReception {
  id: number;
  articleRef: string;
  articleLibelle: string;
  quantiteCommandee: number;
  quantiteRecue: number;
  prixUnitaire: number;
  remise: number;
  montantHT: number;
  tauxTva: number;
  montantTTC: number;
}

interface BonReception {
  id: number;
  num: number;
  commandeOrigine?: number;
  fournisseurId: number;
  fournisseurNom: string;
  dateDoc: string;
  exercice: string;
  pointDeVenteId: number;
  pointDeVenteNom: string;
  details: LigneReception[];
  statut: "brouillon" | "validee";
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  notes: string;
}

const mockFournisseurs = [
  { id: 1, raisonSociale: "Fournisseur Alpha" },
  { id: 2, raisonSociale: "Fournisseur Beta" },
  { id: 3, raisonSociale: "Fournisseur Gamma" },
];

const mockArticles = [
  { ref: "ART001", libelle: "Ciment Portland 50kg", prixAchatHT: 18.500, prixVenteTTC: 25.000, tauxTva: 19 },
  { ref: "ART002", libelle: "Fer à béton 10mm", prixAchatHT: 12.000, prixVenteTTC: 16.500, tauxTva: 19 },
  { ref: "ART003", libelle: "Sable fin m³", prixAchatHT: 45.000, prixVenteTTC: 60.000, tauxTva: 19 },
];

const mockPointsDeVente = [
  { id: 1, nom: "Point de Vente Principal" },
  { id: 2, nom: "Succursale Nord" },
];

const mockCommandes = [
  { id: 1, num: 1, fournisseurId: 1, fournisseurNom: "Fournisseur Alpha", totalTTC: 2618.750 },
];

const BonReceptionPage = () => {
  const { toast } = useToast();
  const [receptionsList, setReceptionsList] = useState<BonReception[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReception, setSelectedReception] = useState<BonReception | null>(null);
  const [currentTab, setCurrentTab] = useState("general");

  const [formData, setFormData] = useState<Partial<BonReception>>({
    fournisseurId: 0, fournisseurNom: "", commandeOrigine: undefined,
    dateDoc: new Date().toISOString().split("T")[0], exercice: new Date().getFullYear().toString(),
    pointDeVenteId: 0, pointDeVenteNom: "", details: [], statut: "brouillon",
    totalHT: 0, totalTVA: 0, totalTTC: 0, notes: "",
  });

  const [lineItem, setLineItem] = useState<Partial<LigneReception>>({
    articleRef: "", articleLibelle: "", quantiteCommandee: 0, quantiteRecue: 1, prixUnitaire: 0, remise: 0, tauxTva: 19,
  });

  const filteredReceptions = receptionsList.filter((r) => {
    const matchesSearch =
      r.num.toString().includes(searchTerm) ||
      r.fournisseurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.fournisseurId.toString().includes(searchTerm);

    const matchesStartDate = !startDate || r.dateDoc >= startDate;
    const matchesEndDate = !endDate || r.dateDoc <= endDate;

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  const handlePrintList = () => {
    const columns = ["N°", "Date", "Fournisseur", "Point de Vente", "Total TTC", "Statut"];
    const data = filteredReceptions.map(r => [
      `BR-${r.num.toString().padStart(4, "0")}`,
      new Date(r.dateDoc).toLocaleDateString("fr-TN"),
      r.fournisseurNom,
      r.pointDeVenteNom,
      `${r.totalTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND`,
      r.statut === "validee" ? "Validé" : "Brouillon"
    ]);
    printList("Liste des Bons de Réception", columns, data);
  };

  const calculateLineTotals = (item: Partial<LigneReception>) => {
    const qty = item.quantiteRecue || 0;
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

  const calculateDocumentTotals = (details: LigneReception[]) => {
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
    const newLine: LigneReception = {
      id: Date.now(), articleRef: lineItem.articleRef!, articleLibelle: lineItem.articleLibelle!,
      quantiteCommandee: lineItem.quantiteCommandee || 0, quantiteRecue: lineItem.quantiteRecue!,
      prixUnitaire: lineItem.prixUnitaire!, remise: lineItem.remise || 0, montantHT,
      tauxTva: lineItem.tauxTva!, montantTTC,
    };
    const newDetails = [...(formData.details || []), newLine];
    const totals = calculateDocumentTotals(newDetails);
    setFormData({ ...formData, details: newDetails, ...totals });
    setLineItem({ articleRef: "", articleLibelle: "", quantiteCommandee: 0, quantiteRecue: 1, prixUnitaire: 0, remise: 0, tauxTva: 19 });
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

  const handlePointDeVenteSelect = (id: string) => {
    const pdv = mockPointsDeVente.find((p) => p.id === parseInt(id));
    if (pdv) {
      setFormData({ ...formData, pointDeVenteId: pdv.id, pointDeVenteNom: pdv.nom });
    }
  };

  const handleCommandeSelect = (id: string) => {
    if (id === "none") {
      setFormData({ ...formData, commandeOrigine: undefined });
      return;
    }
    const cmd = mockCommandes.find((c) => c.id === parseInt(id));
    if (cmd) {
      setFormData({ ...formData, commandeOrigine: cmd.num, fournisseurId: cmd.fournisseurId, fournisseurNom: cmd.fournisseurNom });
    }
  };

  const handleCreate = () => {
    setSelectedReception(null);
    setFormData({
      fournisseurId: 0, fournisseurNom: "", commandeOrigine: undefined,
      dateDoc: new Date().toISOString().split("T")[0], exercice: new Date().getFullYear().toString(),
      pointDeVenteId: 0, pointDeVenteNom: "", details: [], statut: "brouillon",
      totalHT: 0, totalTVA: 0, totalTTC: 0, notes: "",
    });
    setCurrentTab("general");
    setIsFormOpen(true);
  };

  const handleEdit = (rec: BonReception) => {
    if (rec.statut === "validee") {
      toast({ title: "Action non autorisée", description: "Ce bon de réception est déjà validé", variant: "destructive" });
      return;
    }
    setSelectedReception(rec);
    setFormData({ ...rec });
    setCurrentTab("general");
    setIsFormOpen(true);
  };

  const handleView = (rec: BonReception) => {
    setSelectedReception(rec);
    setIsViewOpen(true);
  };

  const handlePrint = (rec: BonReception) => {
    printDocument({
      type: "Bon de Réception", numero: `BR-${rec.num.toString().padStart(4, "0")}`,
      date: new Date(rec.dateDoc).toLocaleDateString("fr-TN"), client: rec.fournisseurNom,
      pointDeVente: rec.pointDeVenteNom, devisOrigine: rec.commandeOrigine ? `CDA-${rec.commandeOrigine.toString().padStart(4, "0")}` : undefined,
      lines: rec.details.map(d => ({ ...d, quantite: d.quantiteRecue })), totalHT: rec.totalHT, totalTVA: rec.totalTVA, totalTTC: rec.totalTTC,
    });
  };

  const handleDelete = (rec: BonReception) => {
    if (rec.statut === "validee") {
      toast({ title: "Action non autorisée", description: "Ce bon de réception est déjà validé", variant: "destructive" });
      return;
    }
    setSelectedReception(rec);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedReception) {
      setReceptionsList(receptionsList.filter((r) => r.id !== selectedReception.id));
      toast({ title: "Bon de réception supprimé", description: `Le BR N°${selectedReception.num} a été supprimé` });
    }
    setIsDeleteOpen(false);
    setSelectedReception(null);
  };

  const handleSave = (validate = false) => {
    if (!formData.fournisseurId || !formData.pointDeVenteId || !formData.details?.length) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs obligatoires", variant: "destructive" });
      return;
    }
    const statut = validate ? "validee" : "brouillon";
    if (selectedReception) {
      setReceptionsList(receptionsList.map((r) => r.id === selectedReception.id ? { ...r, ...formData, statut } as BonReception : r));
      toast({ title: validate ? "Réception validée ✓" : "Bon modifié", description: `Le BR N°${selectedReception.num} a été mis à jour` });
    } else {
      const newNum = Math.max(...receptionsList.map((r) => r.num), 0) + 1;
      const newRec: BonReception = {
        id: Date.now(), num: newNum, commandeOrigine: formData.commandeOrigine,
        fournisseurId: formData.fournisseurId!, fournisseurNom: formData.fournisseurNom!,
        dateDoc: formData.dateDoc!, exercice: formData.exercice!, pointDeVenteId: formData.pointDeVenteId!,
        pointDeVenteNom: formData.pointDeVenteNom!, details: formData.details!, statut,
        totalHT: formData.totalHT || 0, totalTVA: formData.totalTVA || 0, totalTTC: formData.totalTTC || 0, notes: formData.notes || "",
      };
      setReceptionsList([...receptionsList, newRec]);
      toast({ title: validate ? "Réception validée ✓" : "Bon créé", description: `Le BR N°${newNum} a été créé` });
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bons de Réception</h1>
          <p className="text-muted-foreground">Gérez vos réceptions fournisseurs</p>
        </div>
        <Button onClick={handleCreate} className="neu-btn-primary">
          <Plus className="w-4 h-4 mr-2" /> Nouvelle Réception
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
              <TableHead>Point de Vente</TableHead>
              <TableHead className="text-right">Total TTC</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReceptions.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Aucun bon de réception trouvé</TableCell></TableRow>
            ) : (
              filteredReceptions.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell className="font-medium">BR-{rec.num.toString().padStart(4, "0")}</TableCell>
                  <TableCell>{new Date(rec.dateDoc).toLocaleDateString("fr-TN")}</TableCell>
                  <TableCell>{rec.fournisseurNom} <span className="text-xs text-muted-foreground">({rec.fournisseurId})</span></TableCell>
                  <TableCell>{rec.pointDeVenteNom}</TableCell>
                  <TableCell className="text-right font-semibold">{rec.totalTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</TableCell>
                  <TableCell>{rec.statut === "validee" ? <span className="neu-badge-success">Validé</span> : <span className="neu-badge-warning">Brouillon</span>}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(rec)} className="hover:bg-info/20 hover:text-info"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handlePrint(rec)} className="hover:bg-accent" title="Imprimer"><Printer className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(rec)} disabled={rec.statut === "validee"} className="hover:bg-secondary/20 hover:text-secondary"><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(rec)} disabled={rec.statut === "validee"} className="hover:bg-danger/20 hover:text-danger"><Trash2 className="w-4 h-4" /></Button>
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
          <DialogHeader><DialogTitle className="flex items-center gap-2"><PackageCheck className="w-5 h-5 text-success" />{selectedReception ? `Modifier BR N°${selectedReception.num}` : "Nouveau Bon de Réception"}</DialogTitle></DialogHeader>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4"><TabsTrigger value="general">Général</TabsTrigger><TabsTrigger value="lignes">Lignes</TabsTrigger><TabsTrigger value="notes">Notes</TabsTrigger></TabsList>
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Commande d'origine</Label><Select onValueChange={handleCommandeSelect} value={formData.commandeOrigine?.toString() || "none"}><SelectTrigger className="neu-input"><SelectValue placeholder="Sélectionner une commande..." /></SelectTrigger><SelectContent><SelectItem value="none">— Sans commande —</SelectItem>{mockCommandes.map((cmd) => (<SelectItem key={cmd.id} value={cmd.id.toString()}>CDA-{cmd.num.toString().padStart(4, "0")} — {cmd.fournisseurNom}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Date du document</Label><Input type="date" value={formData.dateDoc} onChange={(e) => setFormData({ ...formData, dateDoc: e.target.value })} className="neu-input" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Fournisseur *</Label><Select onValueChange={handleFournisseurSelect} value={formData.fournisseurId?.toString() || ""}><SelectTrigger className="neu-input"><SelectValue placeholder="Sélectionner un fournisseur..." /></SelectTrigger><SelectContent>{mockFournisseurs.map((f) => (<SelectItem key={f.id} value={f.id.toString()}>{f.raisonSociale}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Point de Vente *</Label><Select onValueChange={handlePointDeVenteSelect} value={formData.pointDeVenteId?.toString() || ""}><SelectTrigger className="neu-input"><SelectValue placeholder="Sélectionner le point de vente..." /></SelectTrigger><SelectContent>{mockPointsDeVente.map((pdv) => (<SelectItem key={pdv.id} value={pdv.id.toString()}>{pdv.nom}</SelectItem>))}</SelectContent></Select></div>
              </div>
            </TabsContent>
            <TabsContent value="lignes" className="space-y-4">
              <div className="neu-card-sm space-y-3"><Label className="font-semibold text-sm">Ajouter une ligne</Label><div className="grid grid-cols-1 md:grid-cols-6 gap-3"><div className="md:col-span-2"><ArticleSearchInput articles={mockArticles.map(a => ({ ...a, prixVenteTTC: a.prixAchatHT * 1.19 }))} value={lineItem.articleRef || ""} onSelect={handleArticleSelect} /></div><div><Input type="number" placeholder="Qté Reçue *" value={lineItem.quantiteRecue || ""} onChange={(e) => setLineItem({ ...lineItem, quantiteRecue: parseFloat(e.target.value) || 0 })} className="neu-input" /></div><div><Input type="number" placeholder="P.U. HT" value={lineItem.prixUnitaire || ""} onChange={(e) => setLineItem({ ...lineItem, prixUnitaire: parseFloat(e.target.value) || 0 })} className="neu-input" /></div><div><Input type="number" placeholder="Remise %" value={lineItem.remise || ""} onChange={(e) => setLineItem({ ...lineItem, remise: parseFloat(e.target.value) || 0 })} className="neu-input" /></div><div><Button onClick={handleAddLine} className="neu-btn-primary w-full h-full"><Plus className="w-4 h-4" /></Button></div></div></div>
              <div className="overflow-x-auto"><Table className="neu-table"><TableHeader><TableRow><TableHead>Article</TableHead><TableHead className="text-right">Qté Reçue</TableHead><TableHead className="text-right">P.U. HT</TableHead><TableHead className="text-right">Remise</TableHead><TableHead className="text-right">Montant TTC</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{(formData.details || []).length === 0 ? (<TableRow><TableCell colSpan={6} className="text-center py-6 text-muted-foreground">Aucune ligne ajoutée</TableCell></TableRow>) : (formData.details?.map((line) => (<TableRow key={line.id}><TableCell><span className="font-medium">{line.articleRef}</span> — {line.articleLibelle}</TableCell><TableCell className="text-right font-semibold">{line.quantiteRecue}</TableCell><TableCell className="text-right">{line.prixUnitaire.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell><TableCell className="text-right">{line.remise}%</TableCell><TableCell className="text-right font-semibold">{line.montantTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell><TableCell><Button variant="ghost" size="icon" onClick={() => handleRemoveLine(line.id)} className="hover:bg-danger/20 hover:text-danger"><Trash2 className="w-4 h-4" /></Button></TableCell></TableRow>)))}</TableBody></Table></div>
              <div className="flex justify-end"><div className="neu-card-sm w-72 space-y-2"><div className="flex justify-between text-sm"><span>Total HT</span><span>{(formData.totalHT || 0).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div><div className="flex justify-between font-bold border-t border-muted pt-2"><span>Total TTC</span><span>{(formData.totalTTC || 0).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div></div></div>
            </TabsContent>
            <TabsContent value="notes" className="space-y-4"><div className="space-y-2"><Label>Notes / Observations</Label><textarea value={formData.notes || ""} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="neu-input min-h-[120px] resize-y" placeholder="Remarques..." /></div></TabsContent>
          </Tabs>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4"><Button variant="outline" onClick={() => setIsFormOpen(false)}>Annuler</Button><Button onClick={() => handleSave(false)} className="neu-btn">Enregistrer (Brouillon)</Button><Button onClick={() => handleSave(true)} className="neu-btn-success"><PackageCheck className="w-4 h-4 mr-2" />Valider et mettre à jour le stock</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl bg-background">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><PackageCheck className="w-5 h-5 text-success" />BR-{selectedReception?.num.toString().padStart(4, "0")}</DialogTitle></DialogHeader>
          {selectedReception && (<div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label className="text-muted-foreground">Fournisseur</Label><p className="font-medium">{selectedReception.fournisseurNom}</p></div><div><Label className="text-muted-foreground">Date</Label><p className="font-medium">{new Date(selectedReception.dateDoc).toLocaleDateString("fr-TN")}</p></div><div><Label className="text-muted-foreground">Point de Vente</Label><p className="font-medium text-info">{selectedReception.pointDeVenteNom}</p></div><div><Label className="text-muted-foreground">Statut</Label><div className="mt-1">{selectedReception.statut === "validee" ? <span className="neu-badge-success">Validé</span> : <span className="neu-badge-warning">Brouillon</span>}</div></div></div><Table className="neu-table"><TableHeader><TableRow><TableHead>Article</TableHead><TableHead className="text-right">Qté Reçue</TableHead><TableHead className="text-right">P.U. HT</TableHead><TableHead className="text-right">Montant TTC</TableHead></TableRow></TableHeader><TableBody>{selectedReception.details.map((line) => (<TableRow key={line.id}><TableCell>{line.articleRef} — {line.articleLibelle}</TableCell><TableCell className="text-right font-semibold">{line.quantiteRecue}</TableCell><TableCell className="text-right">{line.prixUnitaire.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell><TableCell className="text-right font-semibold">{line.montantTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell></TableRow>))}</TableBody></Table><div className="flex justify-end"><div className="neu-card-sm w-72 space-y-2"><div className="flex justify-between font-bold"><span>Total TTC</span><span>{selectedReception.totalTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div></div></div><div className="flex justify-end"><Button onClick={() => handlePrint(selectedReception)} className="neu-btn-info"><Printer className="w-4 h-4 mr-2" />Imprimer</Button></div></div>)}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Confirmer la suppression</AlertDialogTitle><AlertDialogDescription>Êtes-vous sûr de vouloir supprimer le bon de réception N°{selectedReception?.num} ?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className="neu-btn-danger">Supprimer</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
};

export default BonReceptionPage;