import { useState } from "react";
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Shield, 
  Building2, 
  Store, 
  Mail, 
  User, 
  Lock, 
  Unlock, 
  CheckCircle, 
  XCircle,
  CreditCard,
  Clock,
  Filter
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface SocieteDTO {
  id: number;
  raisonSociale: string;
}

interface PointDeVenteDTO {
  id: number;
  nom: string;
}

interface BadgeDTO {
  id: number;
  code: string;
  dateExpiration: string;
}

interface PresenceDTO {
  status: "online" | "offline" | "away";
  lastSeen: string;
}

interface Utilisateur {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  societe: SocieteDTO | null;
  pointDeVente: PointDeVenteDTO | null;
  active: boolean;
  locked: boolean;
  badge: BadgeDTO | null;
  presence: PresenceDTO | null;
  capabilities: string[];
}

const availableCapabilities = [
  "GESTION_ARTICLES",
  "GESTION_VENTES",
  "GESTION_ACHATS",
  "GESTION_STOCK",
  "GESTION_CAISSE",
  "GESTION_UTILISATEURS",
  "CONFIGURATION",
  "RAPPORTS",
  "SUPER_ADMIN",
];

const mockSocietes: SocieteDTO[] = [
  { id: 1, raisonSociale: "Société Example SARL" },
  { id: 2, raisonSociale: "Commerce Plus" },
];

const mockPointsDeVente: PointDeVenteDTO[] = [
  { id: 1, nom: "Point de vente Principal" },
  { id: 2, nom: "Succursale Sousse" },
  { id: 3, nom: "Succursale Sfax" },
];

const UtilisateursConfig = () => {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([
    {
      userId: 1,
      username: "admin",
      fullName: "Administrateur Système",
      email: "admin@example.com",
      societe: null,
      pointDeVente: null,
      active: true,
      locked: false,
      badge: { id: 1, code: "ADM001", dateExpiration: "2025-12-31" },
      presence: { status: "online", lastSeen: "2024-01-15T10:30:00" },
      capabilities: ["SUPER_ADMIN"],
    },
    {
      userId: 2,
      username: "manager1",
      fullName: "Ahmed Ben Ali",
      email: "ahmed.benali@example.com",
      societe: { id: 1, raisonSociale: "Société Example SARL" },
      pointDeVente: null,
      active: true,
      locked: false,
      badge: { id: 2, code: "MGR001", dateExpiration: "2025-06-30" },
      presence: { status: "away", lastSeen: "2024-01-15T09:00:00" },
      capabilities: ["GESTION_ARTICLES", "GESTION_VENTES", "GESTION_ACHATS", "RAPPORTS"],
    },
    {
      userId: 3,
      username: "vendeur1",
      fullName: "Fatma Trabelsi",
      email: "fatma.trabelsi@example.com",
      societe: { id: 1, raisonSociale: "Société Example SARL" },
      pointDeVente: { id: 1, nom: "Point de vente Principal" },
      active: true,
      locked: false,
      badge: { id: 3, code: "VND001", dateExpiration: "2025-03-15" },
      presence: { status: "online", lastSeen: "2024-01-15T10:25:00" },
      capabilities: ["GESTION_VENTES", "GESTION_CAISSE"],
    },
    {
      userId: 4,
      username: "caissier1",
      fullName: "Mohamed Sassi",
      email: "mohamed.sassi@example.com",
      societe: { id: 1, raisonSociale: "Société Example SARL" },
      pointDeVente: { id: 2, nom: "Succursale Sousse" },
      active: false,
      locked: true,
      badge: null,
      presence: { status: "offline", lastSeen: "2024-01-10T18:00:00" },
      capabilities: ["GESTION_CAISSE"],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "locked">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Utilisateur | null>(null);
  const [userForm, setUserForm] = useState({
    username: "",
    fullName: "",
    email: "",
    societeId: "",
    pointDeVenteId: "",
    active: true,
    locked: false,
    badgeCode: "",
    badgeExpiration: "",
    capabilities: [] as string[],
  });

  const filteredUsers = utilisateurs.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && user.active && !user.locked) ||
      (filterStatus === "inactive" && !user.active) ||
      (filterStatus === "locked" && user.locked);

    return matchesSearch && matchesFilter;
  });

  const handleAddUser = () => {
    setEditingUser(null);
    setUserForm({
      username: "",
      fullName: "",
      email: "",
      societeId: "",
      pointDeVenteId: "",
      active: true,
      locked: false,
      badgeCode: "",
      badgeExpiration: "",
      capabilities: [],
    });
    setShowModal(true);
  };

  const handleEditUser = (user: Utilisateur) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      societeId: user.societe?.id.toString() || "",
      pointDeVenteId: user.pointDeVente?.id.toString() || "",
      active: user.active,
      locked: user.locked,
      badgeCode: user.badge?.code || "",
      badgeExpiration: user.badge?.dateExpiration || "",
      capabilities: user.capabilities,
    });
    setShowModal(true);
  };

  const handleDeleteUser = (userId: number) => {
    setUtilisateurs((prev) => prev.filter((u) => u.userId !== userId));
  };

  const handleToggleActive = (userId: number) => {
    setUtilisateurs((prev) =>
      prev.map((u) => (u.userId === userId ? { ...u, active: !u.active } : u))
    );
  };

  const handleToggleLocked = (userId: number) => {
    setUtilisateurs((prev) =>
      prev.map((u) => (u.userId === userId ? { ...u, locked: !u.locked } : u))
    );
  };

  const handleCapabilityToggle = (capability: string) => {
    setUserForm((prev) => ({
      ...prev,
      capabilities: prev.capabilities.includes(capability)
        ? prev.capabilities.filter((c) => c !== capability)
        : [...prev.capabilities, capability],
    }));
  };

  const handleSaveUser = () => {
    const societe = userForm.societeId
      ? mockSocietes.find((s) => s.id === parseInt(userForm.societeId)) || null
      : null;
    const pointDeVente = userForm.pointDeVenteId
      ? mockPointsDeVente.find((p) => p.id === parseInt(userForm.pointDeVenteId)) || null
      : null;

    if (editingUser) {
      setUtilisateurs((prev) =>
        prev.map((u) =>
          u.userId === editingUser.userId
            ? {
                ...u,
                username: userForm.username,
                fullName: userForm.fullName,
                email: userForm.email,
                societe,
                pointDeVente,
                active: userForm.active,
                locked: userForm.locked,
                badge: userForm.badgeCode
                  ? { id: u.badge?.id || Date.now(), code: userForm.badgeCode, dateExpiration: userForm.badgeExpiration }
                  : null,
                capabilities: userForm.capabilities,
              }
            : u
        )
      );
    } else {
      const newUser: Utilisateur = {
        userId: Math.max(...utilisateurs.map((u) => u.userId), 0) + 1,
        username: userForm.username,
        fullName: userForm.fullName,
        email: userForm.email,
        societe,
        pointDeVente,
        active: userForm.active,
        locked: userForm.locked,
        badge: userForm.badgeCode
          ? { id: Date.now(), code: userForm.badgeCode, dateExpiration: userForm.badgeExpiration }
          : null,
        presence: { status: "offline", lastSeen: new Date().toISOString() },
        capabilities: userForm.capabilities,
      };
      setUtilisateurs((prev) => [...prev, newUser]);
    }
    setShowModal(false);
  };

  const getPresenceColor = (status: string | undefined) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  const getRoleBadge = (user: Utilisateur) => {
    if (user.capabilities.includes("SUPER_ADMIN")) {
      return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Super Admin</Badge>;
    }
    if (!user.societe) {
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Admin Système</Badge>;
    }
    if (!user.pointDeVente) {
      return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Manager Société</Badge>;
    }
    return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Utilisateur</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">Gérer les utilisateurs et leurs droits d'accès</p>
        </div>
        <button onClick={handleAddUser} className="neu-btn neu-btn-primary flex items-center gap-2">
          <Plus size={18} />
          Nouvel Utilisateur
        </button>
      </div>

      {/* Filters */}
      <div className="neu-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par nom, username ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neu-input w-full pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="neu-input"
            >
              <option value="all">Tous</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
              <option value="locked">Verrouillés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="neu-card p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{utilisateurs.length}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </div>
        <div className="neu-card p-4 text-center">
          <div className="text-2xl font-bold text-green-500">
            {utilisateurs.filter((u) => u.active && !u.locked).length}
          </div>
          <div className="text-sm text-muted-foreground">Actifs</div>
        </div>
        <div className="neu-card p-4 text-center">
          <div className="text-2xl font-bold text-gray-400">
            {utilisateurs.filter((u) => !u.active).length}
          </div>
          <div className="text-sm text-muted-foreground">Inactifs</div>
        </div>
        <div className="neu-card p-4 text-center">
          <div className="text-2xl font-bold text-red-500">
            {utilisateurs.filter((u) => u.locked).length}
          </div>
          <div className="text-sm text-muted-foreground">Verrouillés</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="neu-card p-6">
        <div className="overflow-x-auto">
          <table className="neu-table w-full">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th className="hidden md:table-cell">Contexte</th>
                <th className="hidden lg:table-cell">Badge</th>
                <th>Statut</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.userId}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getPresenceColor(user.presence?.status)}`}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{user.fullName}</div>
                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    <div className="space-y-1">
                      {getRoleBadge(user)}
                      {user.societe && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Building2 size={12} />
                          {user.societe.raisonSociale}
                        </div>
                      )}
                      {user.pointDeVente && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Store size={12} />
                          {user.pointDeVente.nom}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="hidden lg:table-cell">
                    {user.badge ? (
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-primary" />
                        <div>
                          <div className="font-mono text-sm">{user.badge.code}</div>
                          <div className="text-xs text-muted-foreground">
                            Exp: {new Date(user.badge.dateExpiration).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </td>
                  <td>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        {user.active ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <XCircle size={16} className="text-gray-400" />
                        )}
                        <span className={`text-sm ${user.active ? "text-green-500" : "text-gray-400"}`}>
                          {user.active ? "Actif" : "Inactif"}
                        </span>
                      </div>
                      {user.locked && (
                        <div className="flex items-center gap-2 text-red-500">
                          <Lock size={16} />
                          <span className="text-sm">Verrouillé</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleToggleActive(user.userId)}
                        className={`neu-btn-icon ${user.active ? "text-green-500" : "text-gray-400"}`}
                        title={user.active ? "Désactiver" : "Activer"}
                      >
                        {user.active ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      </button>
                      <button
                        onClick={() => handleToggleLocked(user.userId)}
                        className={`neu-btn-icon ${user.locked ? "text-red-500" : "text-muted-foreground"}`}
                        title={user.locked ? "Déverrouiller" : "Verrouiller"}
                      >
                        {user.locked ? <Lock size={16} /> : <Unlock size={16} />}
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="neu-btn-icon text-info"
                        title="Modifier"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.userId)}
                        className="neu-btn-icon text-danger"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted-foreground py-8">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="neu-card p-6 w-full max-w-2xl my-8">
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Users size={24} className="text-primary" />
              {editingUser ? "Modifier l'Utilisateur" : "Nouvel Utilisateur"}
            </h3>

            <div className="space-y-6">
              {/* Informations de base */}
              <div className="neu-inset p-4 rounded-xl">
                <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <User size={18} />
                  Informations de base
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Username *</label>
                    <input
                      type="text"
                      value={userForm.username}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, username: e.target.value }))}
                      className="neu-input w-full"
                      placeholder="Nom d'utilisateur"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nom complet *</label>
                    <input
                      type="text"
                      value={userForm.fullName}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, fullName: e.target.value }))}
                      className="neu-input w-full"
                      placeholder="Prénom et nom"
                    />
                  </div>
                  <div className="form-group md:col-span-2">
                    <label className="form-label">
                      <Mail size={14} className="inline mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="neu-input w-full"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Contexte métier */}
              <div className="neu-inset p-4 rounded-xl">
                <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <Building2 size={18} />
                  Contexte Métier
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Société</label>
                    <select
                      value={userForm.societeId}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, societeId: e.target.value }))}
                      className="neu-input w-full"
                    >
                      <option value="">-- Super Admin --</option>
                      {mockSocietes.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.raisonSociale}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-muted-foreground">Laisser vide pour super-admin</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Point de Vente</label>
                    <select
                      value={userForm.pointDeVenteId}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, pointDeVenteId: e.target.value }))}
                      className="neu-input w-full"
                      disabled={!userForm.societeId}
                    >
                      <option value="">-- Manager Société --</option>
                      {mockPointsDeVente.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nom}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-muted-foreground">Laisser vide pour manager société</span>
                  </div>
                </div>
              </div>

              {/* Badge */}
              <div className="neu-inset p-4 rounded-xl">
                <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <CreditCard size={18} />
                  Badge & Accès
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Code Badge</label>
                    <input
                      type="text"
                      value={userForm.badgeCode}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, badgeCode: e.target.value }))}
                      className="neu-input w-full font-mono"
                      placeholder="ABC123"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date d'expiration</label>
                    <input
                      type="date"
                      value={userForm.badgeExpiration}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, badgeExpiration: e.target.value }))}
                      className="neu-input w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Statut */}
              <div className="neu-inset p-4 rounded-xl">
                <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <Shield size={18} />
                  Statut
                </h4>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={userForm.active}
                      onCheckedChange={(checked) => setUserForm((prev) => ({ ...prev, active: checked }))}
                    />
                    <label className="text-sm">Compte actif</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={userForm.locked}
                      onCheckedChange={(checked) => setUserForm((prev) => ({ ...prev, locked: checked }))}
                    />
                    <label className="text-sm">Compte verrouillé</label>
                  </div>
                </div>
              </div>

              {/* Capabilities */}
              <div className="neu-inset p-4 rounded-xl">
                <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <Shield size={18} />
                  Capacités Fonctionnelles
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableCapabilities.map((cap) => (
                    <label
                      key={cap}
                      className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                        userForm.capabilities.includes(cap)
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-background/50 border border-transparent hover:border-border"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={userForm.capabilities.includes(cap)}
                        onChange={() => handleCapabilityToggle(cap)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          userForm.capabilities.includes(cap)
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-muted-foreground"
                        }`}
                      >
                        {userForm.capabilities.includes(cap) && <CheckCircle size={12} />}
                      </div>
                      <span className="text-sm">{cap.replace(/_/g, " ")}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="neu-btn">
                Annuler
              </button>
              <button
                onClick={handleSaveUser}
                className="neu-btn neu-btn-primary"
                disabled={!userForm.username.trim() || !userForm.fullName.trim() || !userForm.email.trim()}
              >
                {editingUser ? "Modifier" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UtilisateursConfig;
