interface PrintLine {
  articleRef: string;
  articleLibelle: string;
  quantite: number;
  prixUnitaire: number;
  remise: number;
  tauxTva: number;
  montantTTC: number;
}

interface PrintDocData {
  type: "Devis" | "Bon de Livraison" | "Facture" | "Commande d'Achat" | "Bon de Réception";
  numero: string;
  date: string;
  client: string;
  pointDeVente?: string;
  vehicule?: string;
  livreur?: string;
  devisOrigine?: string;
  lines: PrintLine[];
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
}

export const printDocument = (data: PrintDocData) => {
  const formatNum = (n: number) =>
    n.toLocaleString("fr-TN", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

  const linesHtml = data.lines
    .map(
      (l) => `
      <tr>
        <td>${l.articleRef} - ${l.articleLibelle}</td>
        <td style="text-align:right">${l.quantite}</td>
        <td style="text-align:right">${formatNum(l.prixUnitaire)}</td>
        <td style="text-align:right">${l.remise}%</td>
        <td style="text-align:right">${l.tauxTva}%</td>
        <td style="text-align:right">${formatNum(l.montantTTC)}</td>
      </tr>`
    )
    .join("");

  const extraInfo = [
    data.pointDeVente ? `<p><strong>Point de Vente:</strong> ${data.pointDeVente}</p>` : "",
    data.vehicule ? `<p><strong>Véhicule:</strong> ${data.vehicule}</p>` : "",
    data.livreur ? `<p><strong>Livreur:</strong> ${data.livreur}</p>` : "",
    data.devisOrigine ? `<p><strong>Devis d'origine:</strong> ${data.devisOrigine}</p>` : "",
  ].join("");

  const html = `
    <!DOCTYPE html>
    <html><head>
      <title>${data.type} ${data.numero}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1a1a1a; }
        h1 { font-size: 24px; margin-bottom: 4px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 16px; }
        .info { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 24px; font-size: 14px; }
        .info p { margin: 2px 0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
        th { background: #f0f0f0; padding: 8px 12px; text-align: left; border: 1px solid #ddd; font-weight: 600; }
        td { padding: 8px 12px; border: 1px solid #ddd; }
        .totals { float: right; width: 260px; }
        .totals table { margin-bottom: 0; }
        .totals td { font-size: 14px; }
        .totals tr:last-child td { font-weight: bold; font-size: 16px; border-top: 2px solid #333; }
        @media print { body { padding: 20px; } }
      </style>
    </head><body>
      <div class="header">
        <div>
          <h1>${data.type}</h1>
          <p style="font-size:16px;color:#666">${data.numero}</p>
        </div>
        <div style="text-align:right">
          <p><strong>Date:</strong> ${data.date}</p>
        </div>
      </div>
      <div class="info">
        <p><strong>Client:</strong> ${data.client}</p>
        ${extraInfo}
      </div>
      <table>
        <thead>
          <tr>
            <th>Article</th>
            <th style="text-align:right">Qté</th>
            <th style="text-align:right">P.U. HT</th>
            <th style="text-align:right">Remise</th>
            <th style="text-align:right">TVA</th>
            <th style="text-align:right">Montant TTC</th>
          </tr>
        </thead>
        <tbody>${linesHtml}</tbody>
      </table>
      <div class="totals">
        <table>
          <tr><td>Total HT</td><td style="text-align:right">${formatNum(data.totalHT)} TND</td></tr>
          <tr><td>Total TVA</td><td style="text-align:right">${formatNum(data.totalTVA)} TND</td></tr>
          <tr><td>Total TTC</td><td style="text-align:right">${formatNum(data.totalTTC)} TND</td></tr>
        </table>
      </div>
    </body></html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
    win.onload = () => win.print();
  }
};
