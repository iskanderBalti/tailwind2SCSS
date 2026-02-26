import { useState } from "react";
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Search,
  Users,
  ShoppingCart,
  Package,
  FileText,
  Settings,
  BarChart3,
  CreditCard,
  Eye,
  PenSquare,
  Trash,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Copy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface PermissionCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  permissions: Permission[];
}

interface Role {
  id: number;
  name: string;
  description: string;
  color: string;
  isSystem: boolean;
  permissions: string[];
  usersCount: number;
}

const permissionCategories: PermissionCategory[] = [
  {
    id: "articles",
    name: "Gestion des Articles",
    icon: <Package size={18} />,
    permissions: [
      { id: "articles.view", name: "Consulter", description: "Voir la liste et les détails des articles" },
      { id: "articles.create", name: "Créer", description: "Ajouter de nouveaux articles" },
      { id: "articles.edit", name: "Modifier", description: "Modifier les articles existants" },
      { id: "articles.delete", name: "Supprimer", description: "Supprimer des articles" },
      { id: "articles.import", name: "Importer", description: "Importer des articles en masse" },
      { id: "articles.export", name: "Exporter", description: "Exporter la liste des articles" },
    ],
  },
  {
    id: "ventes",
    name: "Gestion des Ventes",
    icon: <ShoppingCart size={18} />,
    permissions: [
      { id: "ventes.view", name: "Consulter", description: "Voir les ventes et devis" },
      { id: "ventes.create", name: "Créer", description: "Créer des devis et factures" },
      { id: "ventes.edit", name: "Modifier", description: "Modifier les documents de vente" },
      { id: "ventes.delete", name: "Supprimer", description: "Supprimer des ventes" },
      { id: "ventes.validate", name: "Valider", description: "Valider les factures" },
      { id: "ventes.discount", name: "Remises", description: "Appliquer des remises" },
    ],
  },
  {
    id: "achats",
    name: "Gestion des Achats",
    icon: <FileText size={18} />,
    permissions: [
      { id: "achats.view", name: "Consulter", description: "Voir les achats et commandes" },
      { id: "achats.create", name: "Créer", description: "Créer des commandes fournisseurs" },
      { id: "achats.edit", name: "Modifier", description: "Modifier les documents d'achat" },
      { id: "achats.delete", name: "Supprimer", description: "Supprimer des achats" },
      { id: "achats.receive", name: "Réceptionner", description: "Valider les réceptions" },
    ],
  },
  {
    id: "stock",
    name: "Gestion du Stock",
    icon: <Package size={18} />,
    permissions: [
      { id: "stock.view", name: "Consulter", description: "Voir l'état du stock" },
      { id: "stock.adjust", name: "Ajuster", description: "Effectuer des ajustements de stock" },
      { id: "stock.transfer", name: "Transférer", description: "Transférer entre points de vente" },
      { id: "stock.inventory", name: "Inventaire", description: "Réaliser des inventaires" },
    ],
  },
  {
    id: "caisse",
    name: "Gestion de Caisse",
    icon: <CreditCard size={18} />,
    permissions: [
      { id: "caisse.view", name: "Consulter", description: "Voir l'état de la caisse" },
      { id: "caisse.open", name: "Ouvrir", description: "Ouvrir une session de caisse" },
      { id: "caisse.close", name: "Clôturer", description: "Clôturer une session de caisse" },
      { id: "caisse.withdraw", name: "Retrait", description: "Effectuer des retraits" },
      { id: "caisse.deposit", name: "Dépôt", description: "Effectuer des dépôts" },
    ],
  },
  {
    id: "clients",
    name: "Gestion des Clients",
    icon: <Users size={18} />,
    permissions: [
      { id: "clients.view", name: "Consulter", description: "Voir la liste des clients" },
      { id: "clients.create", name: "Créer", description: "Ajouter de nouveaux clients" },
      { id: "clients.edit", name: "Modifier", description: "Modifier les clients existants" },
      { id: "clients.delete", name: "Supprimer", description: "Supprimer des clients" },
      { id: "clients.credit", name: "Crédit", description: "Gérer les crédits clients" },
    ],
  },
  {
    id: "fournisseurs",
    name: "Gestion des Fournisseurs",
    icon: <Users size={18} />,
    permissions: [
      { id: "fournisseurs.view", name: "Consulter", description: "Voir la liste des fournisseurs" },
      { id: "fournisseurs.create", name: "Créer", description: "Ajouter de nouveaux fournisseurs" },
      { id: "fournisseurs.edit", name: "Modifier", description: "Modifier les fournisseurs" },
      { id: "fournisseurs.delete", name: "Supprimer", description: "Supprimer des fournisseurs" },
    ],
  },
  {
    id: "rapports",
    name: "Rapports & Statistiques",
    icon: <BarChart3 size={18} />,
    permissions: [
      { id: "rapports.ventes", name: "Ventes", description: "Accéder aux rapports de ventes" },
      { id: "rapports.achats", name: "Achats", description: "Accéder aux rapports d'achats" },
      { id: "rapports.stock", name: "Stock", description: "Accéder aux rapports de stock" },
      { id: "rapports.finance", name: "Finance", description: "Accéder aux rapports financiers" },
      { id: "rapports.export", name: "Exporter", description: "Exporter les rapports" },
    ],
  },
  {
    id: "config",
    name: "Configuration",
    icon: <Settings size={18} />,
    permissions: [
      { id: "config.societe", name: "Société", description: "Configurer les informations société" },
      { id: "config.pdv", name: "Points de vente", description: "Gérer les points de vente" },
      { id: "config.users", name: "Utilisateurs", description: "Gérer les utilisateurs" },
      { id: "config.roles", name: "Rôles", description: "Gérer les rôles et permissions" },
      { id: "config.params", name: "Paramètres", description: "Configurer les paramètres système" },
    ],
  },
];

const initialRoles: Role[] = [
  {
    id: 1,
    name: "Super Administrateur",
    description: "Accès complet à toutes les fonctionnalités",
    color: "purple",
    isSystem: true,
    permissions: permissionCategories.flatMap((c) => c.permissions.map((p) => p.id)),
    usersCount: 1,
  },
  {
    id: 2,
    name: "Manager",
    description: "Gestion complète sauf configuration système",
    color: "blue",
    isSystem: false,
    permissions: [
      "articles.view", "articles.create", "articles.edit", "articles.export",
      "ventes.view", "ventes.create", "ventes.edit", "ventes.validate", "ventes.discount",
      "achats.view", "achats.create", "achats.edit", "achats.receive",
      "stock.view", "stock.adjust", "stock.transfer", "stock.inventory",
      "caisse.view", "caisse.open", "caisse.close",
      "clients.view", "clients.create", "clients.edit", "clients.credit",
      "fournisseurs.view", "fournisseurs.create", "fournisseurs.edit",
      "rapports.ventes", "rapports.achats", "rapports.stock", "rapports.finance", "rapports.export",
    ],
    usersCount: 2,
  },
  {
    id: 3,
    name: "Vendeur",
    description: "Gestion des ventes et de la caisse",
    color: "green",
    isSystem: false,
    permissions: [
      "articles.view",
      "ventes.view", "ventes.create", "ventes.edit",
      "caisse.view", "caisse.open", "caisse.close",
      "clients.view", "clients.create",
    ],
    usersCount: 5,
  },
  {
    id: 4,
    name: "Caissier",
    description: "Gestion de la caisse uniquement",
    color: "orange",
    isSystem: false,
    permissions: [
      "articles.view",
      "ventes.view", "ventes.create",
      "caisse.view", "caisse.open", "caisse.close",
      "clients.view",
    ],
    usersCount: 3,
  },
  {
    id: 5,
    name: "Magasinier",
    description: "Gestion du stock et des réceptions",
    color: "teal",
    isSystem: false,
    permissions: [
      "articles.view",
      "achats.view", "achats.receive",
      "stock.view", "stock.adjust", "stock.transfer", "stock.inventory",
    ],
    usersCount: 2,
  },
];

const colorOptions = [
  { value: "purple", label: "Violet", class: "bg-purple-500" },
  { value: "blue", label: "Bleu", class: "bg-blue-500" },
  { value: "green", label: "Vert", class: "bg-green-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "teal", label: "Turquoise", class: "bg-teal-500" },
  { value: "red", label: "Rouge", class: "bg-red-500" },
  { value: "pink", label: "Rose", class: "bg-pink-500" },
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
];

const RolesConfig = () => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    permissionCategories.map((c) => c.id)
  );

  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    color: "blue",
    permissions: [] as string[],
  });

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddRole = () => {
    setEditingRole(null);
    setRoleForm({
      name: "",
      description: "",
      color: "blue",
      permissions: [],
    });
    setShowModal(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      color: role.color,
      permissions: [...role.permissions],
    });
    setShowModal(true);
  };

  const handleDuplicateRole = (role: Role) => {
    setEditingRole(null);
    setRoleForm({
      name: `${role.name} (copie)`,
      description: role.description,
      color: role.color,
      permissions: [...role.permissions],
    });
    setShowModal(true);
  };

  const handleDeleteRole = (roleId: number) => {
    setRoles((prev) => prev.filter((r) => r.id !== roleId));
    if (selectedRole?.id === roleId) {
      setSelectedRole(null);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setRoleForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const handleCategoryToggle = (category: PermissionCategory) => {
    const categoryPermissionIds = category.permissions.map((p) => p.id);
    const allSelected = categoryPermissionIds.every((id) =>
      roleForm.permissions.includes(id)
    );

    setRoleForm((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter((p) => !categoryPermissionIds.includes(p))
        : [...new Set([...prev.permissions, ...categoryPermissionIds])],
    }));
  };

  const handleSaveRole = () => {
    if (editingRole) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRole.id
            ? { ...r, ...roleForm }
            : r
        )
      );
    } else {
      const newRole: Role = {
        id: Math.max(...roles.map((r) => r.id), 0) + 1,
        name: roleForm.name,
        description: roleForm.description,
        color: roleForm.color,
        isSystem: false,
        permissions: roleForm.permissions,
        usersCount: 0,
      };
      setRoles((prev) => [...prev, newRole]);
    }
    setShowModal(false);
  };

  const getColorClass = (color: string, type: "bg" | "text" | "border") => {
    const colorMap: Record<string, Record<string, string>> = {
      purple: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
      blue: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
      green: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
      orange: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
      teal: { bg: "bg-teal-500/20", text: "text-teal-400", border: "border-teal-500/30" },
      red: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
      pink: { bg: "bg-pink-500/20", text: "text-pink-400", border: "border-pink-500/30" },
      indigo: { bg: "bg-indigo-500/20", text: "text-indigo-400", border: "border-indigo-500/30" },
    };
    return colorMap[color]?.[type] || colorMap.blue[type];
  };

  const getCategoryPermissionCount = (category: PermissionCategory, permissions: string[]) => {
    return category.permissions.filter((p) => permissions.includes(p.id)).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Gestion des Rôles</h1>
          <p className="text-muted-foreground">Configurer les rôles et leurs permissions</p>
        </div>
        <button onClick={handleAddRole} className="neu-btn neu-btn-primary flex items-center gap-2">
          <Plus size={18} />
          Nouveau Rôle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <div className="neu-card p-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un rôle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neu-input w-full pl-10"
              />
            </div>
          </div>

          {/* Roles */}
          <div className="neu-card p-4 space-y-3">
            {filteredRoles.map((role) => (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedRole?.id === role.id
                    ? "bg-primary/10 border border-primary/30"
                    : "bg-background/50 hover:bg-background border border-transparent"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`${getColorClass(role.color, "bg")} ${getColorClass(role.color, "text")} ${getColorClass(role.color, "border")}`}>
                        {role.name}
                      </Badge>
                      {role.isSystem && (
                        <Badge variant="outline" className="text-xs">Système</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{role.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {role.usersCount} utilisateur{role.usersCount > 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield size={12} />
                        {role.permissions.length} permission{role.permissions.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDuplicateRole(role); }}
                      className="neu-btn-icon text-muted-foreground hover:text-foreground"
                      title="Dupliquer"
                    >
                      <Copy size={14} />
                    </button>
                    {!role.isSystem && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditRole(role); }}
                          className="neu-btn-icon text-info"
                          title="Modifier"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteRole(role.id); }}
                          className="neu-btn-icon text-danger"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions View */}
        <div className="lg:col-span-2">
          {selectedRole ? (
            <div className="neu-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={`${getColorClass(selectedRole.color, "bg")} ${getColorClass(selectedRole.color, "text")} ${getColorClass(selectedRole.color, "border")} text-lg px-4 py-1`}>
                      {selectedRole.name}
                    </Badge>
                    {selectedRole.isSystem && (
                      <Badge variant="outline">Rôle Système</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{selectedRole.description}</p>
                </div>
                {!selectedRole.isSystem && (
                  <button
                    onClick={() => handleEditRole(selectedRole)}
                    className="neu-btn neu-btn-primary flex items-center gap-2"
                  >
                    <Edit2 size={16} />
                    Modifier
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {permissionCategories.map((category) => {
                  const count = getCategoryPermissionCount(category, selectedRole.permissions);
                  const total = category.permissions.length;
                  const isExpanded = expandedCategories.includes(category.id);

                  return (
                    <div key={category.id} className="neu-inset rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-background/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-primary">{category.icon}</div>
                          <span className="font-medium text-foreground">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={count === total ? "default" : count > 0 ? "secondary" : "outline"}>
                            {count}/{total}
                          </Badge>
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                          {category.permissions.map((permission) => {
                            const hasPermission = selectedRole.permissions.includes(permission.id);
                            return (
                              <div
                                key={permission.id}
                                className={`p-3 rounded-lg flex items-center gap-3 ${
                                  hasPermission ? "bg-primary/10" : "bg-background/30"
                                }`}
                              >
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                  hasPermission ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}>
                                  {hasPermission && <CheckCircle size={12} />}
                                </div>
                                <div>
                                  <div className={`text-sm font-medium ${hasPermission ? "text-foreground" : "text-muted-foreground"}`}>
                                    {permission.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{permission.description}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="neu-card p-12 text-center">
              <Shield size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Sélectionnez un rôle</h3>
              <p className="text-muted-foreground">
                Cliquez sur un rôle pour voir ses permissions détaillées
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="neu-card p-6 w-full max-w-3xl my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Shield size={24} className="text-primary" />
              {editingRole ? "Modifier le Rôle" : "Nouveau Rôle"}
            </h3>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="neu-inset p-4 rounded-xl">
                <h4 className="font-medium text-foreground mb-4">Informations du rôle</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Nom du rôle *</label>
                    <input
                      type="text"
                      value={roleForm.name}
                      onChange={(e) => setRoleForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="neu-input w-full"
                      placeholder="Ex: Responsable ventes"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Couleur</label>
                    <div className="flex gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setRoleForm((prev) => ({ ...prev, color: color.value }))}
                          className={`w-8 h-8 rounded-full ${color.class} transition-transform ${
                            roleForm.color === color.value ? "ring-2 ring-offset-2 ring-primary scale-110" : ""
                          }`}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="form-group md:col-span-2">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      value={roleForm.description}
                      onChange={(e) => setRoleForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="neu-input w-full"
                      placeholder="Description du rôle..."
                    />
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="neu-inset p-4 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-foreground">Permissions</h4>
                  <span className="text-sm text-muted-foreground">
                    {roleForm.permissions.length} sélectionnée{roleForm.permissions.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {permissionCategories.map((category) => {
                    const categoryPermissionIds = category.permissions.map((p) => p.id);
                    const selectedCount = categoryPermissionIds.filter((id) =>
                      roleForm.permissions.includes(id)
                    ).length;
                    const allSelected = selectedCount === category.permissions.length;
                    const someSelected = selectedCount > 0 && !allSelected;

                    return (
                      <div key={category.id} className="bg-background/50 rounded-lg p-3">
                        <label className="flex items-center gap-3 cursor-pointer mb-2">
                          <div
                            onClick={() => handleCategoryToggle(category)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer ${
                              allSelected
                                ? "bg-primary border-primary text-primary-foreground"
                                : someSelected
                                ? "bg-primary/50 border-primary"
                                : "border-muted-foreground"
                            }`}
                          >
                            {(allSelected || someSelected) && <CheckCircle size={12} />}
                          </div>
                          <div className="text-primary">{category.icon}</div>
                          <span className="font-medium text-foreground">{category.name}</span>
                          <Badge variant="outline" className="ml-auto">
                            {selectedCount}/{category.permissions.length}
                          </Badge>
                        </label>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-8">
                          {category.permissions.map((permission) => {
                            const isSelected = roleForm.permissions.includes(permission.id);
                            return (
                              <label
                                key={permission.id}
                                className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                                  isSelected ? "bg-primary/10" : "hover:bg-background"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handlePermissionToggle(permission.id)}
                                  className="sr-only"
                                />
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                                    isSelected
                                      ? "bg-primary border-primary text-primary-foreground"
                                      : "border-muted-foreground"
                                  }`}
                                >
                                  {isSelected && <CheckCircle size={10} />}
                                </div>
                                <span className={`text-sm ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                                  {permission.name}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="neu-btn">
                Annuler
              </button>
              <button
                onClick={handleSaveRole}
                className="neu-btn neu-btn-primary"
                disabled={!roleForm.name.trim()}
              >
                {editingRole ? "Modifier" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesConfig;
