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
import { Plus, Pencil, Trash2, Search, Eye, Printer, CreditCard, X, Calendar } from "lucide-react";
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

type TypeReglement = "especes" | "cheque" | "virement" | "effet" | "carte_bancaire" | "avoir";

interface Reglement {
  id: number;
  type: TypeReglement;
  montant: number;
  dateReglement: string;
  reference: string;
  banque: string;
  echeance?: string;
}

interface FactureVente {
  id: number;
  num: number;
  clientId: number;
  clientNom: string;
  dateDoc: string;
  exercice: string;
  pointDeVente: string;
  blOrigine?: number;
  details: DetailsDoc[];
  reglements: Reglement[];
  statut: "brouillon" | "validee" | "partiellement_reglee" | "reglee";
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
}

const typeReglementLabels: Record<TypeReglement, string> = {
  especes: "Espèces", cheque: "Chèque", virement: "Virement", effet: "Effet", carte_bancaire: "Carte Bancaire", avoir: "Avoir",
};

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

const FacturesVentePage = () => {
  const { toast } = useToast();
  const [facturesList, setFacturesList] = useState<FactureVente[]>([
    {
      id: 1, num: 1, clientId: 1, clientNom: "Société ABC", dateDoc: "2024-01-20",
      exercice: "2024", pointDeVente: "Point de Vente Principal", blOrigine: 1,
      details: [{ id: 1, articleRef: "ART001", articleLibelle: "Article A", quantite: 5, prixUnitaire: 84.03, remise: 0, montantHT: 420.17, tauxTva: 19, montantTTC: 500 }],
      reglements: [
        { id: 1, type: "especes", montant: 200, dateReglement: "2024-01-20", reference: "", banque: "" },
        { id: 2, type: "cheque", montant: 300, dateReglement: "2024-02-15", reference: "CHQ-78542", banque: "Banque de Tunisie", echeance: "2024-03-15" },
      ], statut: "reglee", totalHT: 420.17, totalTVA: 79.83, totalTTC: 500,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isReglementOpen, setIsReglementOpen] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState<FactureVente | null>(null);
  const [currentTab, setCurrentTab] = useState("general");

  const [formData, setFormData] = useState<Partial<FactureVente>>({
    clientId: 0, clientNom: "", dateDoc: new Date().toISOString().split("T")[0],
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
      f.clientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.clientId.toString().includes(searchTerm);

    const matchesStartDate = !startDate || f.dateDoc >= startDate;
    const matchesEndDate = !endDate || f.dateDoc <= endDate;

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  const handlePrintList = () => {
    const columns = ["N°", "Date", "Client", "Total TTC", "Réglé", "Reste", "Statut"];
    const data = filteredFactures.map(f => {
      const regle = getTotalReglements(f.reglements);
      return [
        `FAC-${f.num.toString().padStart(4, "0")}`,
        new Date(f.dateDoc).toLocaleDateString("fr-TN"),
        f.clientNom,
        `${f.totalTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND`,
        `${regle.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND`,
        `${(f.totalTTC - regle).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND`,
        f.statut === "reglee" ? "Réglée" : f.statut === "partiellement_reglee" ? "Partiel" : "Non réglée"
      ];
    });
    printList("Liste des Factures Vente", columns, data);
  };

  const calculateLineTotals = (item: Partial<DetailsDoc>) => {
    const qty = item.quantite || 0;
    const prix = item.prixUnitaire || 0;
    const remise = item.remise || 0;
    const tva = item.tauxTva || 0;
    const montantBrut = qty * prix;
    const montantRemise = montantBrut * (remise / 100);
    const montantHT = montantBrut - montantRemise;
    const montantTTC = montantHT + montantHT * (tva / 100);
    return { montantHT, montantTTC };
  };

  const calculateDocumentTotals = (details: DetailsDoc[]) => {
    const totalHT = details.reduce((sum, d) => sum + d.montantHT, 0);
    const totalTTC = details.reduce((sum, d) => sum + d.montantTTC, 0);
    const totalTVA = totalTTC - totalHT;
    return { totalHT, totalTVA, totalTTC };
  };

  const getTotalReglements = (reglements: Reglement[]) => reglements.reduce((sum, r) => sum + r.montant, 0);
  const getResteAPayer = (facture: FactureVente) => facture.totalTTC - getTotalReglements(facture.reglements);

  const computeStatut = (totalTTC: number, reglements: Reglement[]): FactureVente["statut"] => {
    const totalRegle = getTotalReglements(reglements);
    if (totalRegle <= 0) return "validee";
    if (totalRegle >= totalTTC - 0.001) return "reglee";
    return "partiellement_reglee";
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
        prixUnitaire: article.prixVenteTTC / (1 + article.tauxTva / 100), tauxTva: article.tauxTva,
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
    setSelectedFacture(null);
    setFormData({
      clientId: 0, clientNom: "", dateDoc: new Date().toISOString().split("T")[0],
      exercice: new Date().getFullYear().toString(), pointDeVente: "", details: [],
      reglements: [], statut: "brouillon", totalHT: 0, totalTVA: 0, totalTTC: 0,
    });
    setCurrentTab("general");
    setIsFormOpen(true);
  };

  const handleEdit = (facture: FactureVente) => {
    if (facture.statut === "reglee") {
      toast({ title: "Action non autorisée", description: "Cette facture est déjà réglée", variant: "destructive" });
      return;
    }
    setSelectedFacture(facture);
    setFormData({ ...facture });
    setCurrentTab("general");
    setIsFormOpen(true);
  };

  const handleView = (facture: FactureVente) => {
    setSelectedFacture(facture);
    setIsViewOpen(true);
  };

  const handlePrint = (facture: FactureVente) => {
    printDocument({
      type: "Facture", numero: `FAC-${facture.num.toString().padStart(4, "0")}`,
      date: new Date(facture.dateDoc).toLocaleDateString("fr-TN"), client: facture.clientNom,
      pointDeVente: facture.pointDeVente, devisOrigine: facture.blOrigine ? `BL-${facture.blOrigine.toString().padStart(4, "0")}` : undefined,
      lines: facture.details, totalHT: facture.totalHT, totalTVA: facture.totalTVA, totalTTC: facture.totalTTC,
    });
  };

  const handleDelete = (facture: FactureVente) => {
    if (facture.statut === "reglee" || facture.statut === "partiellement_reglee") {
      toast({ title: "Action non autorisée", description: "Cette facture a des règlements associés", variant: "destructive" });
      return;
    }
    setSelectedFacture(facture);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedFacture) {
      setFacturesList(facturesList.filter((f) => f.id !== selectedFacture.id));
      toast({ title: "Facture supprimée", description: `La facture N°${selectedFacture.num} a été supprimée` });
    }
    setIsDeleteOpen(false);
    setSelectedFacture(null);
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
    const reglements = formData.reglements || [];
    const totalTTC = formData.totalTTC || 0;
    const statut = computeStatut(totalTTC, reglements);
    if (selectedFacture) {
      setFacturesList(facturesList.map((f) => f.id === selectedFacture.id ? { ...f, ...formData, statut } as FactureVente : f));
      toast({ title: "Facture modifiée", description: `La facture N°${selectedFacture.num} a été modifiée` });
    } else {
      const newNum = Math.max(...facturesList.map((f) => f.num), 0) + 1;
      const newFacture: FactureVente = {
        id: Date.now(), num: newNum, clientId: formData.clientId!, clientNom: formData.clientNom!,
        dateDoc: formData.dateDoc!, exercice: formData.exercice!, pointDeVente: formData.pointDeVente || "",
        details: formData.details!, reglements, statut, totalHT: formData.totalHT || 0,
        totalTVA: formData.totalTVA || 0, totalTTC,
      };
      setFacturesList([...facturesList, newFacture]);
      toast({ title: "Facture créée", description: `La facture N°${newNum} a été créée` });
    }
    setIsFormOpen(false);
  };

  const openReglementDialog = (facture: FactureVente) => {
    setSelectedFacture(facture);
    setReglementsList([...facture.reglements]);
    setReglementForm({ type: "especes", montant: 0, dateReglement: new Date().toISOString().split("T")[0], reference: "", banque: "", echeance: "" });
    setIsReglementOpen(true);
  };

  const handleAddReglement = () => {
    if (!reglementForm.montant || reglementForm.montant <= 0) {
      toast({ title: "Erreur", description: "Le montant doit être supérieur à 0", variant: "destructive" });
      return;
    }
    const totalExistant = getTotalReglements(reglementsList);
    const totalTTC = selectedFacture?.totalTTC || 0;
    if (totalExistant + reglementForm.montant > totalTTC + 0.001) {
      toast({ title: "Erreur", description: "Le total des règlements dépasse le montant de la facture", variant: "destructive" });
      return;
    }
    const newReglement: Reglement = {
      id: Date.now(), type: reglementForm.type as TypeReglement, montant: reglementForm.montant,
      dateReglement: reglementForm.dateReglement!, reference: reglementForm.reference || "",
      banque: reglementForm.banque || "", echeance: reglementForm.echeance || "",
    };
    setReglementsList([...reglementsList, newReglement]);
    setReglementForm({ type: "especes", montant: 0, dateReglement: new Date().toISOString().split("T")[0], reference: "", banque: "", echeance: "" });
  };

  const handleRemoveReglement = (id: number) => { setReglementsList(reglementsList.filter((r) => r.id !== id)); };

  const saveReglements = () => {
    if (!selectedFacture) return;
    const totalTTC = selectedFacture.totalTTC;
    const statut = computeStatut(totalTTC, reglementsList);
    setFacturesList(facturesList.map((f) => f.id === selectedFacture.id ? { ...f, reglements: reglementsList, statut } : f));
    toast({ title: "Règlements mis à jour", description: `Les règlements de la facture N°${selectedFacture.num} ont été enregistrés` });
    setIsReglementOpen(false);
    setSelectedFacture(null);
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "brouillon": return <span className="neu-badge-warning">Brouillon</span>;
      case "validee": return <span className="neu-badge-danger">Non réglée</span>;
      case "partiellement_reglee": return <span className="neu-badge-warning">Partiel</span>;
      case "reglee": return <span className="neu-badge-success">Réglée</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Factures Vente</h1>
          <p className="text-muted-foreground">Gérez vos factures et règlements clients</p>
        </div>
        <Button onClick={handleCreate} className="neu-btn-primary">
          <Plus className="w-4 h-4 mr-2" /> Nouvelle Facture
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
              <TableHead className="text-right">Total TTC</TableHead>
              <TableHead className="text-right">Réglé</TableHead>
              <TableHead className="text-right">Reste</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFactures.length === 0 ? (
              <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">Aucune facture trouvée</TableCell></TableRow>
            ) : (
              filteredFactures.map((facture) => (
                <TableRow key={facture.id}>
                  <TableCell className="font-medium">FAC-{facture.num.toString().padStart(4, "0")}</TableCell>
                  <TableCell>{new Date(facture.dateDoc).toLocaleDateString("fr-TN")}</TableCell>
                  <TableCell>{facture.clientNom} <span className="text-xs text-muted-foreground">({facture.clientId})</span></TableCell>
                  <TableCell className="text-right font-semibold">{facture.totalTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</TableCell>
                  <TableCell className="text-right text-green-600 font-medium">{getTotalReglements(facture.reglements).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</TableCell>
                  <TableCell className="text-right text-orange-600 font-medium">{getResteAPayer(facture).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</TableCell>
                  <TableCell>{getStatutBadge(facture.statut)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleView(facture)} title="Voir"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handlePrint(facture)} title="Imprimer"><Printer className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => openReglementDialog(facture)} className="hover:bg-green-100 hover:text-green-700" title="Règlements"><CreditCard className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(facture)} disabled={facture.statut === "reglee"} title="Modifier"><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(facture)} className="hover:bg-destructive/20 hover:text-destructive" disabled={facture.statut === "reglee" || facture.statut === "partiellement_reglee"} title="Supprimer"><Trash2 className="w-4 h-4" /></Button>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{selectedFacture ? `Modifier Facture N°${selectedFacture.num}` : "Nouvelle Facture"}</DialogTitle></DialogHeader><Tabs value={currentTab} onValueChange={setCurrentTab}><TabsList className="grid w-full grid-cols-2"><TabsTrigger value="general">Général</TabsTrigger><TabsTrigger value="lignes">Lignes</TabsTrigger></TabsList><TabsContent value="general" className="space-y-4 mt-4"><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Client *</Label><Select value={formData.clientId?.toString() || ""} onValueChange={handleClientSelect}><SelectTrigger><SelectValue placeholder="Sélectionner un client" /></SelectTrigger><SelectContent>{mockClients.map((c) => (<SelectItem key={c.id} value={c.id.toString()}>{c.raisonSociale}</SelectItem>))}</SelectContent></Select></div><div className="space-y-2"><Label>Date *</Label><Input type="date" value={formData.dateDoc || ""} onChange={(e) => setFormData({ ...formData, dateDoc: e.target.value })} /></div><div className="space-y-2"><Label>Exercice</Label><Input value={formData.exercice || ""} onChange={(e) => setFormData({ ...formData, exercice: e.target.value })} /></div><div className="space-y-2"><Label>Point de Vente</Label><Select value={formData.pointDeVente || ""} onValueChange={(val) => setFormData({ ...formData, pointDeVente: val })}><SelectTrigger><SelectValue placeholder="Sélectionner un point de vente" /></SelectTrigger><SelectContent>{mockPointsDeVente.map((p) => (<SelectItem key={p.id} value={p.nom}>{p.nom}</SelectItem>))}</SelectContent></Select></div></div></TabsContent><TabsContent value="lignes" className="space-y-4 mt-4"><div className="border rounded-lg p-4 space-y-3"><h4 className="font-medium text-sm">Ajouter une ligne</h4><div className="grid grid-cols-6 gap-2 items-end"><div className="col-span-2 space-y-1"><Label className="text-xs">Article</Label><ArticleSearchInput articles={mockArticles} value={lineItem.articleRef || ""} onSelect={handleArticleSelect} /></div><div className="space-y-1"><Label className="text-xs">Qté</Label><Input type="number" min="1" value={lineItem.quantite || ""} onChange={(e) => setLineItem({ ...lineItem, quantite: parseFloat(e.target.value) || 0 })} /></div><div className="space-y-1"><Label className="text-xs">Prix U. HT</Label><Input type="number" step="0.001" value={lineItem.prixUnitaire || ""} onChange={(e) => setLineItem({ ...lineItem, prixUnitaire: parseFloat(e.target.value) || 0 })} /></div><div className="space-y-1"><Label className="text-xs">Remise %</Label><Input type="number" min="0" max="100" value={lineItem.remise || ""} onChange={(e) => setLineItem({ ...lineItem, remise: parseFloat(e.target.value) || 0 })} /></div><Button onClick={handleAddLine} size="sm" className="self-end"><Plus className="w-4 h-4" /></Button></div></div>{(formData.details || []).length > 0 && (<Table><TableHeader><TableRow><TableHead>Réf</TableHead><TableHead>Article</TableHead><TableHead className="text-right">Qté</TableHead><TableHead className="text-right">P.U. HT</TableHead><TableHead className="text-right">Rem%</TableHead><TableHead className="text-right">HT</TableHead><TableHead className="text-right">TVA%</TableHead><TableHead className="text-right">TTC</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{(formData.details || []).map((line) => (<TableRow key={line.id}><TableCell className="text-xs">{line.articleRef}</TableCell><TableCell>{line.articleLibelle}</TableCell><TableCell className="text-right">{line.quantite}</TableCell><TableCell className="text-right">{line.prixUnitaire.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell><TableCell className="text-right">{line.remise}%</TableCell><TableCell className="text-right">{line.montantHT.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell><TableCell className="text-right">{line.tauxTva}%</TableCell><TableCell className="text-right font-semibold">{line.montantTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell><TableCell><Button variant="ghost" size="icon" onClick={() => handleRemoveLine(line.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button></TableCell></TableRow>))}</TableBody></Table>)}<div className="flex justify-end"><div className="w-64 space-y-1 text-sm"><div className="flex justify-between"><span>Total HT:</span><span className="font-medium">{(formData.totalHT || 0).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div><div className="flex justify-between"><span>Total TVA:</span><span className="font-medium">{(formData.totalTVA || 0).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div><div className="flex justify-between border-t pt-1 font-bold"><span>Total TTC:</span><span>{(formData.totalTTC || 0).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div></div></div></TabsContent></Tabs><DialogFooter><Button variant="outline" onClick={() => setIsFormOpen(false)}>Annuler</Button><Button onClick={handleSave}>Enregistrer</Button></DialogFooter></DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Facture N° FAC-{selectedFacture?.num.toString().padStart(4, "0")}</DialogTitle></DialogHeader>{selectedFacture && (<div className="space-y-6"><div className="grid grid-cols-2 gap-4 text-sm"><div><span className="text-muted-foreground">Client:</span> <strong>{selectedFacture.clientNom}</strong></div><div><span className="text-muted-foreground">Date:</span> <strong>{new Date(selectedFacture.dateDoc).toLocaleDateString("fr-TN")}</strong></div><div><span className="text-muted-foreground">Point de Vente:</span> <strong>{selectedFacture.pointDeVente || "-"}</strong></div><div><span className="text-muted-foreground">Statut:</span> {getStatutBadge(selectedFacture.statut)}</div>{selectedFacture.blOrigine && (<div><span className="text-muted-foreground">BL Origine:</span> <strong>BL-{selectedFacture.blOrigine.toString().padStart(4, "0")}</strong></div>)}</div><div><h4 className="font-medium mb-2">Lignes</h4><Table><TableHeader><TableRow><TableHead>Article</TableHead><TableHead className="text-right">Qté</TableHead><TableHead className="text-right">P.U. HT</TableHead><TableHead className="text-right">Rem%</TableHead><TableHead className="text-right">HT</TableHead><TableHead className="text-right">TTC</TableHead></TableRow></TableHeader><TableBody>{selectedFacture.details.map((line) => (<TableRow key={line.id}><TableCell>{line.articleLibelle}</TableCell><TableCell className="text-right">{line.quantite}</TableCell><TableCell className="text-right">{line.prixUnitaire.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell><TableCell className="text-right">{line.remise}%</TableCell><TableCell className="text-right">{line.montantHT.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell><TableCell className="text-right font-semibold">{line.montantTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })}</TableCell></TableRow>))}</TableBody></Table></div><div className="flex justify-end"><div className="w-64 space-y-1 text-sm"><div className="flex justify-between"><span>Total HT:</span><span>{selectedFacture.totalHT.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div><div className="flex justify-between"><span>Total TVA:</span><span>{selectedFacture.totalTVA.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div><div className="flex justify-between border-t pt-1 font-bold"><span>Total TTC:</span><span>{selectedFacture.totalTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div></div></div><div><h4 className="font-medium mb-2">Règlements</h4>{selectedFacture.reglements.length === 0 ? (<p className="text-muted-foreground text-sm">Aucun règlement enregistré</p>) : (<Table><TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Date</TableHead><TableHead>Référence</TableHead><TableHead>Banque</TableHead><TableHead>Échéance</TableHead><TableHead className="text-right">Montant</TableHead></TableRow></TableHeader><TableBody>{selectedFacture.reglements.map((r) => (<TableRow key={r.id}><TableCell>{typeReglementLabels[r.type]}</TableCell><TableCell>{new Date(r.dateReglement).toLocaleDateString("fr-TN")}</TableCell><TableCell>{r.reference || "-"}</TableCell><TableCell>{r.banque || "-"}</TableCell><TableCell>{r.echeance ? new Date(r.echeance).toLocaleDateString("fr-TN") : "-"}</TableCell><TableCell className="text-right font-semibold">{r.montant.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</TableCell></TableRow>))}</TableBody></Table>)}<div className="flex justify-end mt-2"><div className="w-64 space-y-1 text-sm"><div className="flex justify-between"><span>Total réglé:</span><span className="text-green-600 font-medium">{getTotalReglements(selectedFacture.reglements).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div><div className="flex justify-between border-t pt-1 font-bold"><span>Reste à payer:</span><span className="text-orange-600">{getResteAPayer(selectedFacture).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div></div></div></div><DialogFooter><Button variant="outline" onClick={() => handlePrint(selectedFacture)}><Printer className="w-4 h-4 mr-2" />Imprimer</Button></DialogFooter></div>)}</DialogContent>
      </Dialog>

      {/* Règlements Dialog */}
      <Dialog open={isReglementOpen} onOpenChange={setIsReglementOpen}><DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Règlements — FAC-{selectedFacture?.num.toString().padStart(4, "0")}<span className="text-sm font-normal text-muted-foreground ml-2">(Total: {selectedFacture ? selectedFacture.totalTTC.toLocaleString("fr-TN", { minimumFractionDigits: 3 }) : "0"} TND)</span></DialogTitle></DialogHeader><div className="space-y-4"><div className="border rounded-lg p-4 space-y-3"><h4 className="font-medium text-sm">Ajouter un règlement</h4><div className="grid grid-cols-3 gap-3"><div className="space-y-1"><Label className="text-xs">Type *</Label><Select value={reglementForm.type || "especes"} onValueChange={(val) => setReglementForm({ ...reglementForm, type: val as TypeReglement })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(typeReglementLabels).map(([key, label]) => (<SelectItem key={key} value={key}>{label}</SelectItem>))}</SelectContent></Select></div><div className="space-y-1"><Label className="text-xs">Montant *</Label><Input type="number" step="0.001" value={reglementForm.montant || ""} onChange={(e) => setReglementForm({ ...reglementForm, montant: parseFloat(e.target.value) || 0 })} /></div><div className="space-y-1"><Label className="text-xs">Date *</Label><Input type="date" value={reglementForm.dateReglement || ""} onChange={(e) => setReglementForm({ ...reglementForm, dateReglement: e.target.value })} /></div><div className="space-y-1"><Label className="text-xs">Référence</Label><Input placeholder="N° chèque, virement..." value={reglementForm.reference || ""} onChange={(e) => setReglementForm({ ...reglementForm, reference: e.target.value })} /></div><div className="space-y-1"><Label className="text-xs">Banque</Label><Input value={reglementForm.banque || ""} onChange={(e) => setReglementForm({ ...reglementForm, banque: e.target.value })} /></div><div className="space-y-1"><Label className="text-xs">Échéance</Label><Input type="date" value={reglementForm.echeance || ""} onChange={(e) => setReglementForm({ ...reglementForm, echeance: e.target.value })} /></div></div><Button onClick={handleAddReglement} size="sm"><Plus className="w-4 h-4 mr-1" /> Ajouter</Button></div>{reglementsList.length > 0 && (<Table><TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Date</TableHead><TableHead>Référence</TableHead><TableHead>Banque</TableHead><TableHead>Échéance</TableHead><TableHead className="text-right">Montant</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{reglementsList.map((r) => (<TableRow key={r.id}><TableCell>{typeReglementLabels[r.type]}</TableCell><TableCell>{new Date(r.dateReglement).toLocaleDateString("fr-TN")}</TableCell><TableCell>{r.reference || "-"}</TableCell><TableCell>{r.banque || "-"}</TableCell><TableCell>{r.echeance ? new Date(r.echeance).toLocaleDateString("fr-TN") : "-"}</TableCell><TableCell className="text-right font-semibold">{r.montant.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</TableCell><TableCell><Button variant="ghost" size="icon" onClick={() => handleRemoveReglement(r.id)}><X className="w-3 h-3 text-destructive" /></Button></TableCell></TableRow>))}</TableBody></Table>)}<div className="flex justify-end"><div className="w-64 space-y-1 text-sm"><div className="flex justify-between"><span>Total réglé:</span><span className="text-green-600 font-medium">{getTotalReglements(reglementsList).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div><div className="flex justify-between border-t pt-1 font-bold"><span>Reste à payer:</span><span className="text-orange-600">{((selectedFacture?.totalTTC || 0) - getTotalReglements(reglementsList)).toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></div></div></div></div><DialogFooter><Button variant="outline" onClick={() => setIsReglementOpen(false)}>Annuler</Button><Button onClick={saveReglements}>Enregistrer les règlements</Button></DialogFooter></DialogContent></Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Confirmer la suppression</AlertDialogTitle><AlertDialogDescription>Êtes-vous sûr de vouloir supprimer la facture N°{selectedFacture?.num} ? Cette action est irréversible.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
};

export default FacturesVentePage;