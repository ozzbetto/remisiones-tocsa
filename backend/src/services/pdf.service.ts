import { IRemission } from '../models/Remission.js';
import { TDocumentDefinitions } from 'pdfmake/interfaces.js';

export const generateRemissionPDF = (remission: IRemission): TDocumentDefinitions => {
  const isAnnulled = remission.status === 'annulled';

  const tableHeader = [
    { text: 'Descripción', style: 'tableHeader' },
    { text: 'Marca', style: 'tableHeader' },
    { text: 'Modelo', style: 'tableHeader' },
    { text: 'Nro. Serie', style: 'tableHeader' },
    { text: 'Cant.', style: 'tableHeader' },
    { text: 'Estado', style: 'tableHeader' },
    { text: 'Observación', style: 'tableHeader' },
  ];

  const tableRows = remission.items.map(item => [
    item.description,
    item.brand,
    item.model,
    item.serial,
    item.quantity.toString(),
    item.condition,
    item.observation || '',
  ]);

  const definition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    background: isAnnulled ? [
      {
        text: 'ANULADA',
        color: '#ff0000',
        opacity: 0.1,
        fontSize: 80,
        bold: true,
        alignment: 'center',
        margin: [0, 350, 0, 0]
      }
    ] : [],
    content: [
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: remission.sender.name, style: 'headerTitle' },
              { text: `RUC: ${remission.sender.ruc}`, style: 'headerSub' },
              { text: remission.sender.address, style: 'headerSub' },
            ],
          },
          {
            width: 'auto',
            stack: [
              { text: isAnnulled ? 'NOTA DE REMISIÓN (ANULADA)' : 'NOTA DE REMISIÓN', style: 'docType', color: isAnnulled ? '#e02424' : '#1f2937' },
              { text: `NRO: ${remission.remissionNumber}`, style: 'docNumber' },
              { text: `Fecha: ${remission.date.toLocaleDateString()}`, style: 'headerSub' },
            ],
            alignment: 'right',
          },
        ],
      },
      { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, lineColor: '#cccccc' }] },
      { text: '\n' },
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: 'DESTINATARIO:', style: 'sectionLabel' },
              { text: remission.recipient.name, style: 'infoTextBold' },
              { text: `CI/RUC: ${remission.recipient.idNumber}`, style: 'infoText' },
              { text: `Cargo/Área: ${remission.recipient.positionArea}`, style: 'infoText' },
              { text: `Ubicación: ${remission.recipient.location}`, style: 'infoText' },
            ],
          },
          {
            width: '50%',
            stack: [
              { text: 'MOTIVO TRASLADO:', style: 'sectionLabel' },
              { text: remission.transferReason.toUpperCase(), style: 'infoTextBold' },
              { text: '\n' },
              { text: 'OBSERVACIONES:', style: 'sectionLabel' },
              { text: remission.observations || 'Sin observaciones adicionales.', style: 'infoText' },
            ],
          },
        ],
      },
      { text: '\n' },
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto', 30, 45, 'auto'],
          body: [tableHeader, ...tableRows],
        },
        layout: 'lightHorizontalLines',
      },
      { text: '\n\n\n' },
      {
        columns: [
          {
            stack: [
              { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 150, y2: 0, lineWidth: 1 }] },
              { text: `Autorizado por: ${remission.authorizedBy}`, style: 'signature' },
            ],
            alignment: 'center',
          },
          {
            stack: [
              { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 150, y2: 0, lineWidth: 1 }] },
              { text: `Recibido por: ${remission.receivedBy}`, style: 'signature' },
            ],
            alignment: 'center',
          },
        ],
      },
    ],
    styles: {
      headerTitle: { fontSize: 14, bold: true, color: '#1a56db' },
      headerSub: { fontSize: 9, color: '#4b5563' },
      docType: { fontSize: 16, bold: true, color: '#1f2937' },
      docNumber: { fontSize: 12, bold: true, color: '#e02424' },
      sectionLabel: { fontSize: 8, bold: true, color: '#6b7280' },
      infoText: { fontSize: 10, color: '#111827' },
      infoTextBold: { fontSize: 10, bold: true, color: '#111827' },
      tableHeader: { fontSize: 9, bold: true, color: '#ffffff', fillColor: '#1a56db', margin: [5, 2, 5, 2] },
      signature: { fontSize: 9, margin: [0, 5, 0, 0] },
    },
    defaultStyle: {
      font: 'Roboto',
    },
  };

  const trItems = remission.items.filter(item => item.requiresResponsibilityTerm);

  if (trItems.length > 0) {
    const trTableRows = trItems.map(item => [
      item.description,
      item.brand,
      item.model,
      item.serial,
      item.condition
    ]);

    const trPage = [
      { text: '', pageBreak: 'before' },
      { text: 'TÉRMINO DE RESPONSABILIDAD Y CUSTODIA DE EQUIPOS INFORMÁTICOS', style: 'trTitle', alignment: 'center', margin: [0, 0, 0, 20] },
      { text: `Fecha: ${remission.date.toLocaleDateString()}`, style: 'infoText', margin: [0, 0, 0, 10] },
      { text: `Por medio de la presente, el/la Sr./Sra. ${remission.recipient.name} con CI/RUC ${remission.recipient.idNumber}, asume la responsabilidad, cuidado y custodia de los siguientes equipos informáticos asignados para el desempeño de sus funciones en el cargo de ${remission.recipient.positionArea}:`, style: 'infoText', margin: [0, 0, 0, 15], alignment: 'justify' },
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'Descripción', style: 'tableHeader' },
              { text: 'Marca', style: 'tableHeader' },
              { text: 'Modelo', style: 'tableHeader' },
              { text: 'Nro. Serie', style: 'tableHeader' },
              { text: 'Estado', style: 'tableHeader' },
            ],
            ...trTableRows
          ]
        },
        layout: {
          hLineWidth: function (i: number, node: any) {
            return (i === 0 || i === node.table.body.length) ? 2 : 1;
          },
          vLineWidth: function (i: number, node: any) {
            return (i === 0 || i === node.table.widths.length) ? 2 : 1;
          },
          hLineColor: function (i: number, node: any) {
            return '#a0aabf';
          },
          vLineColor: function (i: number, node: any) {
            return '#a0aabf';
          },
        },
        margin: [0, 0, 0, 20]
      },
      { text: 'Condiciones de Uso y Responsabilidad:', style: 'sectionLabel', margin: [0, 0, 0, 10] },
      {
        ul: [
          { text: 'El responsable asume el cuidado y custodia de los equipos descritos.', margin: [0, 0, 0, 5] },
          { text: 'En caso de extravío, daño por negligencia o robo, el responsable asume el 100% del valor del equipo al momento de su compra.', margin: [0, 0, 0, 5] },
          { text: 'Se compromete al uso adecuado del software y al estricto cumplimiento de las políticas de seguridad de la empresa.', margin: [0, 0, 0, 5] },
          { text: 'Se compromete a la devolución inmediata del equipo en las mismas condiciones entregadas cuando le sea requerido o al término de su relación laboral.', margin: [0, 0, 0, 5] }
        ],
        style: 'infoText',
        alignment: 'justify',
        margin: [0, 0, 0, 40]
      },
      {
        columns: [
          {
            stack: [
              { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 1 }] },
              { text: `Firma de Recepción y Conformidad\n${remission.recipient.name}\nCI/RUC: ${remission.recipient.idNumber}`, style: 'signature' },
            ],
            alignment: 'center',
          },
        ],
      }
    ];

    definition.content = (definition.content as any[]).concat(trPage);
    if (!definition.styles) definition.styles = {};
    definition.styles['trTitle'] = { fontSize: 14, bold: true, color: '#1f2937' };
  }

  return definition;
};
