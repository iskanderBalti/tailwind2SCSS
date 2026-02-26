import { useState } from "react";
import { Building2, Phone, Mail, MapPin, FileText, CreditCard, Plus, Edit2, Trash2, Store } from "lucide-react";

interface PointDeVente {
  id: number;
  nom: string;
  adresse: string;
  tel: string;
}

interface Societe {
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
  pointDeVente: PointDeVente[];
}

const SocieteConfig = () => {
  const [societe, setSociete] = useState<Societe>({
    id: 1,
    matriculeFiscale: "1234567/A/M/000",
    raisonSociale: "Société Example SARL",
    activite: "Commerce de gros",
    adresse: "123 Avenue Habib Bourguiba, Tunis 1000",
    tel: "+216 71 123 456",
    tel2: "+216 71 123 457",
    fax: "+216 71 123 458",
    email: "contact@example.com",
    rc: "B123456789",
    rib: "10 006 0123456789 12",
    pointDeVente: [
      { id: 1, nom: "Point de vente Principal", adresse: "123 Avenue Habib Bourguiba, Tunis", tel: "+216 71 123 456" },
      { id: 2, nom: "Succursale Sousse", adresse: "45 Rue de la République, Sousse", tel: "+216 73 456 789" },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPdvModal, setShowPdvModal] = useState(false);
  const [editingPdv, setEditingPdv] = useState<PointDeVente | null>(null);
  const [pdvForm, setPdvForm] = useState({ nom: "", adresse: "", tel: "" });

  const handleSocieteChange = (field: keyof Societe, value: string) => {
    setSociete((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSociete = () => {
    setIsEditing(false);
    // TODO: Save to backend
  };

  const handleAddPdv = () => {
    setEditingPdv(null);
    setPdvForm({ nom: "", adresse: "", tel: "" });
    setShowPdvModal(true);
  };

  const handleEditPdv = (pdv: PointDeVente) => {
    setEditingPdv(pdv);
    setPdvForm({ nom: pdv.nom, adresse: pdv.adresse, tel: pdv.tel });
    setShowPdvModal(true);
  };

  const handleDeletePdv = (id: number) => {
    setSociete((prev) => ({
      ...prev,
      pointDeVente: prev.pointDeVente.filter((p) => p.id !== id),
    }));
  };

  const handleSavePdv = () => {
    if (editingPdv) {
      setSociete((prev) => ({
        ...prev,
        pointDeVente: prev.pointDeVente.map((p) =>
          p.id === editingPdv.id ? { ...p, ...pdvForm } : p
        ),
      }));
    } else {
      const newId = Math.max(...societe.pointDeVente.map((p) => p.id), 0) + 1;
      setSociete((prev) => ({
        ...prev,
        pointDeVente: [...prev.pointDeVente, { id: newId, ...pdvForm }],
      }));
    }
    setShowPdvModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Configuration Société</h1>
          <p className="text-muted-foreground">Gérer les informations de votre société</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="neu-btn neu-btn-primary flex items-center gap-2"
          >
            <Edit2 size={18} />
            Modifier
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="neu-btn"
            >
              Annuler
            </button>
            <button
              onClick={handleSaveSociete}
              className="neu-btn neu-btn-success"
            >
              Enregistrer
            </button>
          </div>
        )}
      </div>

      {/* Informations Société */}
      <div className="neu-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="neu-icon-box">
            <Building2 size={24} className="text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Informations Générales</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Matricule Fiscale */}
          <div className="form-group">
            <label className="form-label">
              <FileText size={16} className="inline mr-2" />
              Matricule Fiscale *
            </label>
            {isEditing ? (
              <input
                type="text"
                value={societe.matriculeFiscale}
                onChange={(e) => handleSocieteChange("matriculeFiscale", e.target.value)}
                className="neu-input w-full"
                required
              />
            ) : (
              <div className="neu-inset p-3 rounded-lg">{societe.matriculeFiscale}</div>
            )}
          </div>

          {/* Raison Sociale */}
          <div className="form-group">
            <label className="form-label">
              <Building2 size={16} className="inline mr-2" />
              Raison Sociale
            </label>
            {isEditing ? (
              <input
                type="text"
                value={societe.raisonSociale}
                onChange={(e) => handleSocieteChange("raisonSociale", e.target.value)}
                className="neu-input w-full"
              />
            ) : (
              <div className="neu-inset p-3 rounded-lg">{societe.raisonSociale}</div>
            )}
          </div>

          {/* Activité */}
          <div className="form-group">
            <label className="form-label">Activité</label>
            {isEditing ? (
              <input
                type="text"
                value={societe.activite}
                onChange={(e) => handleSocieteChange("activite", e.target.value)}
                className="neu-input w-full"
              />
            ) : (
              <div className="neu-inset p-3 rounded-lg">{societe.activite}</div>
            )}
          </div>

          {/* RC */}
          <div className="form-group">
            <label className="form-label">Registre de Commerce (RC)</label>
            {isEditing ? (
              <input
                type="text"
                value={societe.rc}
                onChange={(e) => handleSocieteChange("rc", e.target.value)}
                className="neu-input w-full"
              />
            ) : (
              <div className="neu-inset p-3 rounded-lg">{societe.rc}</div>
            )}
          </div>

          {/* Adresse - Full width */}
          <div className="form-group md:col-span-2">
            <label className="form-label">
              <MapPin size={16} className="inline mr-2" />
              Adresse
            </label>
            {isEditing ? (
              <textarea
                value={societe.adresse}
                onChange={(e) => handleSocieteChange("adresse", e.target.value)}
                className="neu-input w-full"
                rows={2}
              />
            ) : (
              <div className="neu-inset p-3 rounded-lg">{societe.adresse}</div>
            )}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="neu-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="neu-icon-box">
            <Phone size={24} className="text-info" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Contact</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Téléphone */}
          <div className="form-group">
            <label className="form-label">
              <Phone size={16} className="inline mr-2" />
              Téléphone
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={societe.tel}
                onChange={(e) => handleSocieteChange("tel", e.target.value)}
                className="neu-input w-full"
              />
            ) : (
              <div className="neu-inset p-3 rounded-lg">{societe.tel}</div>
            )}
          </div>

          {/* Téléphone 2 */}
          <div className="form-group">
            <label className="form-label">Téléphone 2</label>
            {isEditing ? (
              <input
                type="tel"
                value={societe.tel2}
                onChange={(e) => handleSocieteChange("tel2", e.target.value)}
                className="neu-input w-full"
              />
            ) : (
              <div className="neu-inset p-3 rounded-lg">{societe.tel2 || "-"}</div>
            )}
          </div>

          {/* Fax */}
          <div className="form-group">
            <label className="form-label">Fax</label>
            {isEditing ? (
              <input
                type="tel"
                value={societe.fax}
                onChange={(e) => handleSocieteChange("fax", e.target.value)}
                className="neu-input w-full"
              />
            ) : (
              <div className="neu-inset p-3 rounded-lg">{societe.fax || "-"}</div>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">
              <Mail size={16} className="inline mr-2" />
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={societe.email}
                onChange={(e) => handleSocieteChange("email", e.target.value)}
                className="neu-input w-full"
              />
            ) : (
              <div className="neu-inset p-3 rounded-lg">{societe.email}</div>
            )}
          </div>
        </div>
      </div>

      {/* Informations Bancaires */}
      <div className="neu-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="neu-icon-box">
            <CreditCard size={24} className="text-success" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Informations Bancaires</h2>
        </div>

        <div className="form-group">
          <label className="form-label">
            <CreditCard size={16} className="inline mr-2" />
            RIB (Relevé d'Identité Bancaire)
          </label>
          {isEditing ? (
            <input
              type="text"
              value={societe.rib}
              onChange={(e) => handleSocieteChange("rib", e.target.value)}
              className="neu-input w-full"
              placeholder="XX XXX XXXXXXXXXXXX XX"
            />
          ) : (
            <div className="neu-inset p-3 rounded-lg font-mono">{societe.rib}</div>
          )}
        </div>
      </div>

      {/* Points de Vente */}
      <div className="neu-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="neu-icon-box">
              <Store size={24} className="text-warning" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Points de Vente</h2>
          </div>
          <button
            onClick={handleAddPdv}
            className="neu-btn neu-btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Ajouter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="neu-table w-full">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Adresse</th>
                <th>Téléphone</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {societe.pointDeVente.map((pdv) => (
                <tr key={pdv.id}>
                  <td className="font-medium">{pdv.nom}</td>
                  <td>{pdv.adresse}</td>
                  <td>{pdv.tel}</td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditPdv(pdv)}
                        className="neu-btn-icon text-info"
                        title="Modifier"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePdv(pdv.id)}
                        className="neu-btn-icon text-danger"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {societe.pointDeVente.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted-foreground py-8">
                    Aucun point de vente configuré
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Point de Vente */}
      {showPdvModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="neu-card p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              {editingPdv ? "Modifier le Point de Vente" : "Nouveau Point de Vente"}
            </h3>

            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">Nom *</label>
                <input
                  type="text"
                  value={pdvForm.nom}
                  onChange={(e) => setPdvForm((prev) => ({ ...prev, nom: e.target.value }))}
                  className="neu-input w-full"
                  placeholder="Nom du point de vente"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Adresse</label>
                <textarea
                  value={pdvForm.adresse}
                  onChange={(e) => setPdvForm((prev) => ({ ...prev, adresse: e.target.value }))}
                  className="neu-input w-full"
                  rows={2}
                  placeholder="Adresse complète"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input
                  type="tel"
                  value={pdvForm.tel}
                  onChange={(e) => setPdvForm((prev) => ({ ...prev, tel: e.target.value }))}
                  className="neu-input w-full"
                  placeholder="+216 XX XXX XXX"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPdvModal(false)}
                className="neu-btn"
              >
                Annuler
              </button>
              <button
                onClick={handleSavePdv}
                className="neu-btn neu-btn-primary"
                disabled={!pdvForm.nom.trim()}
              >
                {editingPdv ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocieteConfig;
