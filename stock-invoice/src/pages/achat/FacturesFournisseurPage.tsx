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
import { Plus, Pencil, Trash2, Search, Eye, Printer, CreditCard, X, Calendar, FileText } from "lucide-react";
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

type TypeReglement = "especes" | "cheque" | "virement" | "effet" | "avoir";

interface Reglement {
  id: number;
  type: TypeReglement;
  montant: number;
  dateReglement: string;
  reference: string;
  banque: string;
  echeance?: string;
}

interface FactureFournisseur {
  id: number;
  num: number;
  fournisseurId: number;
  fournisseurNom: string;
  dateDoc: string;
  exercice: string;
  pointDeVente: string;
  brOrigine?: number;
  details: DetailsDoc[];
  reglements: Reglement[];
  statut: "brouillon" | "validee" | "partiellement_reglee" | "reglee";
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
}

const typeReglementLabels: Record<TypeReglement, string> = {
  especes: "Espèces", cheque: "Chèque", virement: "Virement", effet: "Effet", avoir: "Avoir",
};

const mockFournisseurs = [
  { id: 1, raisonSociale: "Fournisseur Alpha" },
  { id: 2, raisonSociale: "Fournisseur Beta" },
];

const mockArticles = [
  { ref: "ART001", libelle: "Article A", prixAchatHT: 84.03, tauxTva: 19 },
];

const FacturesFournisseurPage = () => {
  const { toast } = useToast();
  const [facturesList, setFacturesList] = useState<FactureFournisseur[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isReglementOpen, setIsReglementOpen] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState<FactureFournisseur | null>(null);
  const [currentTab, setCurrentTab] = useState("general");

  const [formData, setFormData] = useState<Partial<FactureFournisseur>>({
    fournisseurId: 0, fournisseurNom: "", dateDoc: new Date().toISOString().split("T")[0],
    exercice: new Date().getFullYear().toString(), pointDeVente: "", details: [],
    reglements: [], statut: "brouillon",
  });

  const [lineItem, setLineItem] = useState<Partial<DetailsDoc>>({
    articleRef: "", articleLibelle: "", quantite: 1, prixUnitaire: 0, remise: 0, tauxTva: 19,
  });

  const [reglementForm, setReglementForm] = useState<Partial<Reglement>>({
    type: "especes", montant: 0, dateReglement: new Date().toISOString().split("T")[0], reference: "", banque: "", echeance: "",
  });

  const [reglementsList, setReglementsList] = useState<Reglement[]>([]);

  const filteredFactures = facturesList.filter((f) => {
    const matchesSearch =
      f.num.toString().includes(searchTerm) ||
      f.fournisseurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.fournisseurId.toString().includes(searchTerm);

    const matchesStartDate = !startDate || f.dateDoc >= startDate;
    const matchesEndDate = !endDate || f.dateDoc <= endDate;

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  const handlePrintList = () => {
    const columns = ["N°", "Date", "Fournisseur", "Total TTC", "Réglé", "Reste", "Statut"];
    const data = filteredFactures.map(f => {
      const regle = f.reglements.reduce((sum, r) => sum + r.montant, 0);
      return [
        `FAC-${f.num.toString().padStart(4, "0")}`,
        new Date(f.dateDoc).toLocaleDateString("fr-TN"),
        f.fournisseurNom,
        `${f.totalTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND`,
        `${regle.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND`,
        `${(f.totalTTC - regle).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND`,
        f.statut === "reglee" ? "Réglée" : f.statut === "partiellement_reglee" ? "Partiel" : "Non réglée"
      ];
    });
    printList("Liste des Factures Fournisseurs", columns, data);
  };

  const calculateLineTotals = (item: Partial<DetailsDoc>) => {
    const qty = item.quantite || 0;
    const prix = item.prixUnitaire || 0;
    const remise = item.remise || 0;
    const tva = item.tauxTva || 0;
    const montantHT = (qty * prix) * (1 - remise / 100);
    const montantTTC = montantHT * (1 + tva / 100);
    return { montantHT, montantTTC };
  };

  const calculateDocumentTotals = (details: DetailsDoc[]) => {
    const totalHT = details.reduce((sum, d) => sum + d.montantHT, 0);
    const totalTTC = details.reduce((sum, d) => sum + d.montantTTC, 0);
    const totalTVA = totalTTC - totalHT;
    return { totalHT, totalTVA, totalTTC };
  };

  const handleAddLine = () => {
    if (!lineItem.articleRef) return;
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
      setLineItem({ ...lineItem, articleRef: article.ref, articleLibelle: article.libelle, prixUnitaire: article.prixAchatHT, tauxTva: article.tauxTva });
    }
  };

  const handleFournisseurSelect = (id: string) => {
    const f = mockFournisseurs.find((f) => f.id === parseInt(id));
    if (f) setFormData({ ...formData, fournisseurId: f.id, fournisseurNom: f.raisonSociale });
  };

  const handleSave = () => {
    if (!formData.fournisseurId || !formData.details?.length) return;
    const totalTTC = formData.totalTTC || 0;
    const totalRegle = (formData.reglements || []).reduce((sum, r) => sum + r.montant, 0);
    const statut = totalRegle >= totalTTC - 0.001 ? "reglee" : totalRegle > 0 ? "partiellement_reglee" : "validee";
    if (selectedFacture) {
      setFacturesList(facturesList.map((f) => f.id === selectedFacture.id ? { ...f, ...formData, statut } as FactureFournisseur : f));
    } else {
      const newNum = Math.max(...facturesList.map((f) => f.num), 0) + 1;
      setFacturesList([...facturesList, { ...formData, id: Date.now(), num: newNum, statut } as FactureFournisseur]);
    }
    setIsFormOpen(false);
  };

  const openReglementDialog = (facture: FactureFournisseur) => {
    setSelectedFacture(facture);
    setReglementsList([...facture.reglements]);
    setIsReglementOpen(true);
  };

  const handleAddReglement = () => {
    if (!reglementForm.montant || reglementForm.montant <= 0) return;
    const newReglement: Reglement = {
      id: Date.now(), type: reglementForm.type as TypeReglement, montant: reglementForm.montant,
      dateReglement: reglementForm.dateReglement!, reference: reglementForm.reference || "",
      banque: reglementForm.banque || "", echeance: reglementForm.echeance || "",
    };
    setReglementsList([...reglementsList, newReglement]);
    setReglementForm({ type: "especes", montant: 0, dateReglement: new Date().toISOString().split("T")[0], reference: "", banque: "", echeance: "" });
  };

  const saveReglements = () => {
    if (!selectedFacture) return;
    const totalTTC = selectedFacture.totalTTC;
    const totalRegle = reglementsList.reduce((sum, r) => sum + r.montant, 0);
    const statut = totalRegle >= totalTTC - 0.001 ? "reglee" : totalRegle > 0 ? "partiellement_reglee" : "validee";
    setFacturesList(facturesList.map((f) => f.id === selectedFacture.id ? { ...f, reglements: reglementsList, statut } : f));
    setIsReglementOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Factures Fournisseurs</h1>
          <p className="text-muted-foreground">Gérez vos factures et règlements fournisseurs</p>
        </div>
        <Button onClick={() => { setSelectedFacture(null); setFormData({ fournisseurId: 0, dateDoc: new Date().toISOString().split("T")[0], exercice: new Date().getFullYear().toString(), details: [], reglements: [], statut: "brouillon" }); setIsFormOpen(true); }} className="neu-btn-primary">
          <Plus className="w-4 h-4 mr-2" /> Nouvelle Facture
        </Button>
      </div>

      <div className="neu-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="N° ou Fournisseur (Nom/ID)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="neu-input pl-10" />
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

      <div className="neu-card overflow-hidden">
        <Table className="neu-table">
          <TableHeader>
            <TableRow>
              <TableHead>N°</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead className="text-right">Total TTC</TableHead>
              <TableHead className="text-right">Reste</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFactures.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Aucune facture trouvée</TableCell></TableRow>
            ) : (
              filteredFactures.map((f) => {
                const reste = f.totalTTC - f.reglements.reduce((sum, r) => sum + r.montant, 0);
                return (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">FAC-{f.num.toString().padStart(4, "0")}</TableCell>
                    <TableCell>{new Date(f.dateDoc).toLocaleDateString("fr-TN")}</TableCell>
                    <TableCell>{f.fournisseurNom} <span className="text-xs text-muted-foreground">({f.fournisseurId})</span></TableCell>
                    <TableCell className="text-right font-semibold">{f.totalTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</TableCell>
                    <TableCell className="text-right text-orange-600 font-medium">{reste.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</TableCell>
                    <TableCell>{f.statut === "reglee" ? <span className="neu-badge-success">Réglée</span> : f.statut === "partiellement_reglee" ? <span className="neu-badge-warning">Partiel</span> : <span className="neu-badge-danger">Non réglée</span>}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedFacture(f); setIsViewOpen(true); }}><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => openReglementDialog(f)} className="hover:bg-green-100 hover:text-green-700"><CreditCard className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedFacture(f); setFormData({ ...f }); setIsFormOpen(true); }} disabled={f.statut === "reglee"}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedFacture(f); setIsDeleteOpen(true); }} className="hover:bg-destructive/20 hover:text-destructive" disabled={f.statut === "reglee"}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{selectedFacture ? `Modifier Facture N°${selectedFacture.num}` : "Nouvelle Facture"}</DialogTitle></DialogHeader>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="general">Général</TabsTrigger><TabsTrigger value="lignes">Lignes</TabsTrigger></TabsList>
            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Fournisseur *</Label><Select value={formData.fournisseurId?.toString() || ""} onValueChange={handleFournisseurSelect}><SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger><SelectContent>{mockFournisseurs.map((f) => (<SelectItem key={f.id} value={f.id.toString()}>{f.raisonSociale}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Date *</Label><Input type="date" value={formData.dateDoc || ""} onChange={(e) => setFormData({ ...formData, dateDoc: e.target.value })} /></div>
              </div>
            </TabsContent>
            <TabsContent value="lignes" className="space-y-4 mt-4">
              <div className="border rounded-lg p-4 space-y-3"><div className="grid grid-cols-6 gap-2 items-end"><div className="col-span-2"><ArticleSearchInput articles={mockArticles.map(a => ({ ...a, prixVenteTTC: a.prixAchatHT * 1.19 }))} value={lineItem.articleRef || ""} onSelect={handleArticleSelect} /></div><div><Input type="number" placeholder="Qté" value={lineItem.quantite || ""} onChange={(e) => setLineItem({ ...lineItem, quantite: parseFloat(e.target.value) || 0 })} /></div><div><Input type="number" placeholder="P.U. HT" value={lineItem.prixUnitaire || ""} onChange={(e) => setLineItem({ ...lineItem, prixUnitaire: parseFloat(e.target.value) || 0 })} /></div><Button onClick={handleAddLine} size="sm"><Plus className="w-4 h-4" /></Button></div></div>
              <Table><TableHeader><TableRow><TableHead>Article</TableHead><TableHead className="text-right">Qté</TableHead><TableHead className="text-right">P.U. HT</TableHead><TableHead className="text-right">TTC</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{(formData.details || []).map((line) => (<TableRow key={line.id}><TableCell>{line.articleLibelle}</TableCell><TableCell className="text-right">{line.quantite}</TableCell><TableCell className="text-right">{line.prixUnitaire.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell><TableCell className="text-right font-semibold">{line.montantTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell><TableCell><Button variant="ghost" size="icon" onClick={() => handleRemoveLine(line.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button></TableCell></TableRow>))}</TableBody></Table>
              <div className="flex justify-end"><div className="w-64 space-y-1 text-sm font-bold border-t pt-2"><div className="flex justify-between"><span>Total TTC:</span><span>{(formData.totalTTC || 0).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div></div></div>
            </TabsContent>
          </Tabs>
          <DialogFooter><Button variant="outline" onClick={() => setIsFormOpen(false)}>Annuler</Button><Button onClick={handleSave}>Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reglements Dialog */}
      <Dialog open={isReglementOpen} onOpenChange={setIsReglementOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Règlements — FAC-{selectedFacture?.num}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3"><Select value={reglementForm.type || "especes"} onValueChange={(val) => setReglementForm({ ...reglementForm, type: val as TypeReglement })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(typeReglementLabels).map(([key, label]) => (<SelectItem key={key} value={key}>{label}</SelectItem>))}</SelectContent></Select><Input type="number" placeholder="Montant" value={reglementForm.montant || ""} onChange={(e) => setReglementForm({ ...reglementForm, montant: parseFloat(e.target.value) || 0 })} /><Button onClick={handleAddReglement} size="sm"><Plus className="w-4 h-4" /></Button></div>
            <Table><TableHeader><TableRow><TableHead>Type</TableHead><TableHead className="text-right">Montant</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{reglementsList.map((r) => (<TableRow key={r.id}><TableCell>{typeReglementLabels[r.type]}</TableCell><TableCell className="text-right">{r.montant.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</TableCell><TableCell><Button variant="ghost" size="icon" onClick={() => setReglementsList(reglementsList.filter(x => x.id !== r.id))}><X className="w-3 h-3" /></Button></TableCell></TableRow>))}</TableBody></Table>
          </div>
          <DialogFooter><Button onClick={saveReglements}>Enregistrer</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Supprimer ?</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Annuler</Button><Button className="bg-danger" onClick={() => { setFacturesList(facturesList.filter(f => f.id !== selectedFacture?.id)); setIsDeleteOpen(false); }}>Supprimer</Button></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
};

export default FacturesFournisseurPage;