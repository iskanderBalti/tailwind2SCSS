export const printList = (title: string, columns: string[], data: any[][]) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: 'Nunito Sans', sans-serif; padding: 20px; color: #333; }
        h1 { text-align: center; color: #31344b; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 12px; }
        th { background-color: #f8f9fa; color: #66799e; font-weight: bold; }
        tr:nth-child(even) { background-color: #fcfcfc; }
        .footer { margin-top: 20px; text-align: right; font-size: 10px; color: #999; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <table>
        <thead>
          <tr>${columns.map(col => `<th>${col}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${data.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
      <div class="footer">Imprimé le ${new Date().toLocaleString('fr-TN')}</div>
    </body>
    </html>
  `;
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    win.onload = () => {
      win.print();
    };
  }
};