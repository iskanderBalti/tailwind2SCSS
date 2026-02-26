import { useState } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Users, 
  X, 
  Phone, 
  Mail, 
  Printer, 
  CreditCard, 
  Eye, 
  FileText, 
  History,
  Receipt,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { printList } from "@/utils/printList";

interface Contact {
  id: number;
  nom: string;
  telephone: string;
  email: string;
}

interface Client {
  id: number;
  matriculeFiscale: string;
  raisonSociale: string;
  activite: string;
  adresse: string;
  tel: string;
  tel2: string;
  fax: string;
  email: string;
  rc: string;
  rib: string;
  solde: number;
  bloque: boolean;
  numCompte: number;
  carteFidelite: number | null;
  contacts: Contact[];
}

// Mock data for history
const mockFactures = [
  { id: 1, num: "FAC-2024-102", date: "2024-01-12", montant: 1250.000, statut: "Payée" },
  { id: 2, num: "FAC-2024-215", date: "2024-02-15", montant: 3400.750, statut: "Partiel" },
];

const mockReglements = [
  { id: 1, date: "2024-01-20", montant: 1250.000, mode: "Espèces", ref: "CASH-001" },
  { id: 2, date: "2024-02-20", montant: 2000.000, mode: "Chèque", ref: "CHQ-4452" },
];

const mockRetenues = [
  { id: 1, date: "2024-02-20", montant: 51.011, taux: "1.5%", facture: "FAC-2024-215" },
];

const initialClients: Client[] = [
  {
    id: 1,
    matriculeFiscale: "1234567ABC",
    raisonSociale: "Société ABC",
    activite: "Commerce général",
    adresse: "123 Rue de Tunis, Tunis 1000",
    tel: "+216 71 123 456",
    tel2: "+216 98 765 432",
    fax: "+216 71 123 457",
    email: "contact@abc.tn",
    rc: "B123456789",
    rib: "TN59 1234 5678 9012 3456 7890",
    solde: 15000.500,
    bloque: false,
    numCompte: 411001,
    carteFidelite: 100001,
    contacts: [
      { id: 1, nom: "Ahmed Ben Ali", telephone: "+216 98 111 222", email: "ahmed@abc.tn" }
    ],
  },
  {
    id: 2,
    matriculeFiscale: "9876543XYZ",
    raisonSociale: "Entreprise XYZ",
    activite: "Distribution",
    adresse: "456 Avenue Habib Bourguiba, Sfax 3000",
    tel: "+216 74 234 567",
    tel2: "",
    fax: "+216 74 234 568",
    email: "info@xyz.tn",
    rc: "C987654321",
    rib: "TN59 9876 5432 1098 7654 3210",
    solde: -2500.000,
    bloque: true,
    numCompte: 411002,
    carteFidelite: null,
    contacts: [],
  },
];

const emptyClient: Omit<Client, "id"> = {
  matriculeFiscale: "",
  raisonSociale: "",
  activite: "",
  adresse: "",
  tel: "",
  tel2: "",
  fax: "",
  email: "",
  rc: "",
  rib: "",
  solde: 0,
  bloque: false,
  numCompte: 0,
  carteFidelite: null,
  contacts: [],
};

const ClientsConfig = () => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Omit<Client, "id">>(emptyClient);
  const [newContact, setNewContact] = useState({ nom: "", telephone: "", email: "" });
  
  // Period for statement
  const [releveStart, setReleveStart] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]);
  const [releveEnd, setReleveEnd] = useState(new Date().toISOString().split('T')[0]);

  const { toast } = useToast();

  const filteredClients = clients.filter(
    (client) =>
      client.raisonSociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.matriculeFiscale.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      const { id, ...rest } = client;
      setFormData(rest);
    } else {
      setEditingClient(null);
      setFormData(emptyClient);
    }
    setIsDialogOpen(true);
  };

  const handleConsult = (client: Client) => {
    setSelectedClient(client);
    setIsConsultOpen(true);
  };

  const handleSave = () => {
    if (!formData.matriculeFiscale || !formData.raisonSociale) {
      toast({
        title: "Erreur",
        description: "Le matricule fiscale et la raison sociale sont obligatoires",
        variant: "destructive",
      });
      return;
    }

    if (editingClient) {
      setClients(
        clients.map((c) =>
          c.id === editingClient.id ? { ...formData, id: editingClient.id } : c
        )
      );
      toast({ title: "Succès", description: "Client modifié avec succès" });
    } else {
      const newClient: Client = {
        ...formData,
        id: Math.max(...clients.map((c) => c.id), 0) + 1,
      };
      setClients([...clients, newClient]);
      toast({ title: "Succès", description: "Client ajouté avec succès" });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setClients(clients.filter((c) => c.id !== id));
    toast({ title: "Succès", description: "Client supprimé avec succès" });
  };

  const handlePrintList = () => {
    const columns = ["Raison Sociale", "Matricule Fiscale", "Téléphone", "Email", "Solde", "Statut"];
    const data = filteredClients.map(c => [
      c.raisonSociale,
      c.matriculeFiscale,
      c.tel,
      c.email,
      `${c.solde.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND`,
      c.bloque ? "Bloqué" : "Actif"
    ]);
    printList("Liste des Clients", columns, data);
  };

  const handlePrintReleve = () => {
    if (!selectedClient) return;

    const formatNum = (n: number) => n.toLocaleString("fr-TN", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

    const operations = [
      ...mockFactures.map(f => ({ date: f.date, desc: `Facture ${f.num}`, debit: f.montant, credit: 0 })),
      ...mockReglements.map(r => ({ date: r.date, desc: `Règlement ${r.mode} (${r.ref})`, debit: 0, credit: r.montant })),
      ...mockRetenues.map(rt => ({ date: rt.date, desc: `Retenue à la source (Fact. ${rt.facture})`, debit: 0, credit: rt.montant }))
    ]
    .filter(op => op.date >= releveStart && op.date <= releveEnd)
    .sort((a, b) => a.date.localeCompare(b.date));

    let runningBalance = 0;
    const rowsHtml = operations.map(op => {
      runningBalance += (op.debit - op.credit);
      return `
        <tr>
          <td>${new Date(op.date).toLocaleDateString('fr-TN')}</td>
          <td>${op.desc}</td>
          <td style="text-align:right">${op.debit > 0 ? formatNum(op.debit) : '-'}</td>
          <td style="text-align:right">${op.credit > 0 ? formatNum(op.credit) : '-'}</td>
          <td style="text-align:right; font-weight:bold">${formatNum(runningBalance)}</td>
        </tr>
      `;
    }).join('');

    const totalDebit = operations.reduce((sum, op) => sum + op.debit, 0);
    const totalCredit = operations.reduce((sum, op) => sum + op.credit, 0);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relevé Client - ${selectedClient.raisonSociale}</title>
        <style>
          body { font-family: 'Nunito Sans', sans-serif; padding: 40px; color: #333; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #2D4CC8; padding-bottom: 20px; }
          .company-info h1 { color: #2D4CC8; margin: 0; font-size: 24px; }
          .releve-info { text-align: right; }
          .client-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 13px; }
          th { background-color: #2D4CC8; color: white; }
          .totals { margin-top: 20px; float: right; width: 300px; }
          .totals table td { font-weight: bold; }
          @media print { body { padding: 20px; } .header { margin-bottom: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            <h1>RELEVÉ DE COMPTE CLIENT</h1>
            <p>Période du ${new Date(releveStart).toLocaleDateString('fr-TN')} au ${new Date(releveEnd).toLocaleDateString('fr-TN')}</p>
          </div>
          <div class="releve-info">
            <p>Date d'édition: ${new Date().toLocaleDateString('fr-TN')}</p>
          </div>
        </div>
        <div class="client-box">
          <h3 style="margin-top:0">${selectedClient.raisonSociale}</h3>
          <p>Matricule Fiscale: ${selectedClient.matriculeFiscale}</p>
          <p>Adresse: ${selectedClient.adresse}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Libellé</th>
              <th style="text-align:right">Débit (Factures)</th>
              <th style="text-align:right">Crédit (Paiements)</th>
              <th style="text-align:right">Solde</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="5" style="text-align:center">Aucune opération sur cette période</td></tr>'}
          </tbody>
        </table>
        <div class="totals">
          <table>
            <tr><td>Total Débit</td><td style="text-align:right">${formatNum(totalDebit)}</td></tr>
            <tr><td>Total Crédit</td><td style="text-align:right">${formatNum(totalCredit)}</td></tr>
            <tr style="background:#f0f0f0"><td>Solde Période</td><td style="text-align:right">${formatNum(totalDebit - totalCredit)}</td></tr>
          </table>
        </div>
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

  const handleAddContact = () => {
    if (!newContact.nom) return;
    const contact: Contact = { id: Date.now(), ...newContact };
    setFormData({ ...formData, contacts: [...formData.contacts, contact] });
    setNewContact({ nom: "", telephone: "", email: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des Clients</h1>
          <p className="text-muted-foreground">Gérez votre portefeuille clients</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handlePrintList} variant="outline" className="neu-btn gap-2">
            <Printer className="h-4 w-4" /> Imprimer
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="neu-btn-primary">
                <Plus className="mr-2 h-4 w-4" /> Nouveau Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background">
              <DialogHeader>
                <DialogTitle>{editingClient ? "Modifier le client" : "Nouveau client"}</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">Général</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="financier">Financier</TabsTrigger>
                  <TabsTrigger value="contacts">Contacts</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Matricule Fiscale *</Label>
                      <Input value={formData.matriculeFiscale} onChange={(e) => setFormData({ ...formData, matriculeFiscale: e.target.value })} className="neu-input" />
                    </div>
                    <div className="space-y-2">
                      <Label>Raison Sociale *</Label>
                      <Input value={formData.raisonSociale} onChange={(e) => setFormData({ ...formData, raisonSociale: e.target.value })} className="neu-input" />
                    </div>
                    <div className="space-y-2">
                      <Label>Activité</Label>
                      <Input value={formData.activite} onChange={(e) => setFormData({ ...formData, activite: e.target.value })} className="neu-input" />
                    </div>
                    <div className="space-y-2">
                      <Label>RC</Label>
                      <Input value={formData.rc} onChange={(e) => setFormData({ ...formData, rc: e.target.value })} className="neu-input" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Adresse</Label>
                      <Textarea value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} className="neu-input" rows={2} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={formData.bloque} onCheckedChange={(checked) => setFormData({ ...formData, bloque: checked })} />
                      <Label>Client bloqué</Label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Téléphone 1</Label><Input value={formData.tel} onChange={(e) => setFormData({ ...formData, tel: e.target.value })} className="neu-input" /></div>
                    <div className="space-y-2"><Label>Téléphone 2</Label><Input value={formData.tel2} onChange={(e) => setFormData({ ...formData, tel2: e.target.value })} className="neu-input" /></div>
                    <div className="space-y-2"><Label>Fax</Label><Input value={formData.fax} onChange={(e) => setFormData({ ...formData, fax: e.target.value })} className="neu-input" /></div>
                    <div className="space-y-2"><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="neu-input" /></div>
                  </div>
                </TabsContent>

                <TabsContent value="financier" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Numéro de Compte</Label><Input type="number" value={formData.numCompte || ""} onChange={(e) => setFormData({ ...formData, numCompte: Number(e.target.value) })} className="neu-input" /></div>
                    <div className="space-y-2"><Label>Solde Initial (TND)</Label><Input type="number" step="0.001" value={formData.solde || ""} onChange={(e) => setFormData({ ...formData, solde: Number(e.target.value) })} className="neu-input" /></div>
                    <div className="col-span-2 space-y-2"><Label>RIB</Label><Input value={formData.rib} onChange={(e) => setFormData({ ...formData, rib: e.target.value })} className="neu-input" /></div>
                  </div>
                </TabsContent>

                <TabsContent value="contacts" className="space-y-4 mt-4">
                  <div className="neu-card-sm space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input placeholder="Nom" value={newContact.nom} onChange={(e) => setNewContact({ ...newContact, nom: e.target.value })} className="neu-input" />
                      <Input placeholder="Tél" value={newContact.telephone} onChange={(e) => setNewContact({ ...newContact, telephone: e.target.value })} className="neu-input" />
                      <Input placeholder="Email" value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} className="neu-input" />
                    </div>
                    <Button onClick={handleAddContact} type="button" className="neu-btn"><Plus className="mr-2 h-4 w-4" /> Ajouter Contact</Button>
                  </div>
                  <div className="space-y-2">
                    {formData.contacts.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-3 neu-inset rounded-lg">
                        <div><p className="font-medium">{c.nom}</p><p className="text-xs text-muted-foreground">{c.telephone} | {c.email}</p></div>
                        <Button variant="ghost" size="icon" onClick={() => setFormData({ ...formData, contacts: formData.contacts.filter(x => x.id !== c.id) })}><X className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleSave} className="neu-btn-primary">Enregistrer</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="neu-card">
        <CardHeader className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher par raison sociale, matricule ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="neu-input pl-10" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="neu-table">
            <TableHeader>
              <TableRow>
                <TableHead>Raison Sociale</TableHead>
                <TableHead>Matricule Fiscale</TableHead>
                <TableHead className="hidden md:table-cell">Téléphone</TableHead>
                <TableHead>Solde</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium"><div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" />{c.raisonSociale}</div></TableCell>
                  <TableCell>{c.matriculeFiscale}</TableCell>
                  <TableCell className="hidden md:table-cell">{c.tel}</TableCell>
                  <TableCell><span className={c.solde >= 0 ? "text-green-600 font-medium" : "text-destructive font-medium"}>{c.solde.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</span></TableCell>
                  <TableCell>{c.bloque ? <Badge variant="destructive">Bloqué</Badge> : <Badge variant="secondary">Actif</Badge>}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleConsult(c)} className="text-info" title="Consulter historique"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(c)} title="Modifier"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} className="text-destructive" title="Supprimer"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredClients.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Aucun client trouvé</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Consultation Dialog */}
      <Dialog open={isConsultOpen} onOpenChange={setIsConsultOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-info" />
              Historique Client : {selectedClient?.raisonSociale}
            </DialogTitle>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-6">
              {/* Period Selection for Statement */}
              <div className="neu-card-sm p-4 bg-muted/20">
                <div className="flex flex-col sm:flex-row items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <Label className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Période du relevé</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="date" value={releveStart} onChange={(e) => setReleveStart(e.target.value)} className="neu-input" />
                      <Input type="date" value={releveEnd} onChange={(e) => setReleveEnd(e.target.value)} className="neu-input" />
                    </div>
                  </div>
                  <Button onClick={handlePrintReleve} className="neu-btn-primary gap-2">
                    <Printer className="w-4 h-4" /> Imprimer Relevé
                  </Button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="neu-card-sm p-4 flex flex-col items-center justify-center">
                  <p className="text-xs text-muted-foreground mb-1">Solde Actuel</p>
                  <p className={`text-lg font-bold ${selectedClient.solde >= 0 ? "text-green-600" : "text-destructive"}`}>
                    {selectedClient.solde.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND
                  </p>
                </div>
                <div className="neu-card-sm p-4 flex flex-col items-center justify-center">
                  <p className="text-xs text-muted-foreground mb-1">Total Facturé</p>
                  <p className="text-lg font-bold text-primary">4,650.750 TND</p>
                </div>
                <div className="neu-card-sm p-4 flex flex-col items-center justify-center">
                  <p className="text-xs text-muted-foreground mb-1">Total Réglé</p>
                  <p className="text-lg font-bold text-green-600">3,250.000 TND</p>
                </div>
                <div className="neu-card-sm p-4 flex flex-col items-center justify-center">
                  <p className="text-xs text-muted-foreground mb-1">Total Retenues</p>
                  <p className="text-lg font-bold text-orange-600">51.011 TND</p>
                </div>
              </div>

              <Tabs defaultValue="factures" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="factures" className="gap-2"><FileText className="w-4 h-4" /> Factures</TabsTrigger>
                  <TabsTrigger value="reglements" className="gap-2"><CreditCard className="w-4 h-4" /> Règlements</TabsTrigger>
                  <TabsTrigger value="retenues" className="gap-2"><Receipt className="w-4 h-4" /> Retenues à la source</TabsTrigger>
                </TabsList>

                <TabsContent value="factures" className="mt-4">
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead>N° Facture</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Montant TTC</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockFactures.map((fac) => (
                          <TableRow key={fac.id}>
                            <TableCell className="font-medium">{fac.num}</TableCell>
                            <TableCell>{new Date(fac.date).toLocaleDateString("fr-TN")}</TableCell>
                            <TableCell className="text-right font-semibold">{fac.montant.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</TableCell>
                            <TableCell>
                              <Badge variant={fac.statut === "Payée" ? "secondary" : "outline"}>{fac.statut}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="reglements" className="mt-4">
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead>Date</TableHead>
                          <TableHead>Mode</TableHead>
                          <TableHead>Référence</TableHead>
                          <TableHead className="text-right">Montant</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockReglements.map((reg) => (
                          <TableRow key={reg.id}>
                            <TableCell>{new Date(reg.date).toLocaleDateString("fr-TN")}</TableCell>
                            <TableCell>{reg.mode}</TableCell>
                            <TableCell className="text-xs font-mono">{reg.ref}</TableCell>
                            <TableCell className="text-right font-semibold text-green-600">{reg.montant.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="retenues" className="mt-4">
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead>Date</TableHead>
                          <TableHead>Facture liée</TableHead>
                          <TableHead>Taux</TableHead>
                          <TableHead className="text-right">Montant Retenu</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockRetenues.map((ret) => (
                          <TableRow key={ret.id}>
                            <TableCell>{new Date(ret.date).toLocaleDateString("fr-TN")}</TableCell>
                            <TableCell className="text-xs">{ret.facture}</TableCell>
                            <TableCell>{ret.taux}</TableCell>
                            <TableCell className="text-right font-semibold text-orange-600">{ret.montant.toLocaleString("fr-TN", { minimumFractionDigits: 3 })} TND</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsConsultOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsConfig;