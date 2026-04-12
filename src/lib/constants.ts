export const PORTAL = {
  BASE: 'https://expinterweb.inclusion.gob.es/iley11/inicio/showTramites.action?procedimientoSel=200&proc=1',
  SUBMIT: 'https://expinterweb.inclusion.gob.es/iley11/inicio/elegirTramite.action?tramiteSel=1&procedimientoSel=200&proc=1',
  STATUS: 'https://expinterweb.inclusion.gob.es/iley11/consultaSolicitud/verExptesPresentador.action',
  NOTIFICATIONS: 'https://expinterweb.inclusion.gob.es/iley11/inicio/elegirTramite.action?tramiteSel=3&procedimientoSel=200&proc=1',
  FEE_PAYMENT: 'https://expinterweb.inclusion.gob.es/Tasa038/presentarFormulario038.action',
  INFOEXT2: 'https://sede.administracionespublicas.gob.es/infoext2/',
  FNMT: 'https://www.sede.fnmt.gob.es',
  CLAVE: 'https://clave.gob.es',
  AUTOFIRMA: 'https://firmaelectronica.gob.es/Home/Descargas.html',
  INFO: 'https://sede.inclusion.gob.es/-/presentacion-solicitudes-autorizacion-residencia',
  FORMS: 'http://extranjeros.inclusion.gob.es/es/ModelosSolicitudes/ley_14_2013/index.html',
  DOCS_PDF: 'https://www.inclusion.gob.es/documents/1823432/1826095/renovaciones_ingles_feb_2018.pdf',
} as const;

export const CONTACT = {
  UGE_EMAIL: 'movilidad.internacional@inclusion.gob.es',
  SMS: '651 714 610',
  PHONE: '902 02 22 22',
  PHONE_ALT: '060',
} as const;

export const THRESHOLDS = {
  RENEWAL_WINDOW_DAYS: 60,
  LATE_FILING_DAYS: 90,
  SILENCIO_BUSINESS_DAYS: 20,
  REQUERIMIENTO_RESPONSE_DAYS: 10,
} as const;

export const FEE = {
  MODEL: '790',
  AMOUNT_EUR: 78.67,
  DESCRIPTION: 'Tasa modelo 790',
} as const;

export const STATUSES = {
  SUBMITTED: 'submitted',
  EN_TRAMITE: 'en_tramite',
  PENDIENTE_INFORMES: 'pendiente_informes',
  REQUERIDO: 'requerido',
  RESUELTO_FAVORABLE: 'resuelto_favorable',
  RESUELTO_NO_FAVORABLE: 'resuelto_no_favorable',
  SILENCIO_POSITIVO: 'silencio_positivo',
} as const;

export type StatusType = typeof STATUSES[keyof typeof STATUSES];

export const STATUS_LABELS: Record<StatusType, string> = {
  [STATUSES.SUBMITTED]: 'Submitted',
  [STATUSES.EN_TRAMITE]: 'In Process (En trámite)',
  [STATUSES.PENDIENTE_INFORMES]: 'Pending Reports',
  [STATUSES.REQUERIDO]: 'Documents Requested',
  [STATUSES.RESUELTO_FAVORABLE]: 'Approved',
  [STATUSES.RESUELTO_NO_FAVORABLE]: 'Denied',
  [STATUSES.SILENCIO_POSITIVO]: 'Auto-Approved (Silencio)',
};

export const REQUIRED_DOCUMENTS = [
  { id: 'passport', label: 'Full passport copy', description: 'All pages, single PDF' },
  { id: 'fee_receipt', label: 'Tasa 790 payment receipt', description: 'Downloaded after paying €78.67 online' },
  { id: 'contract', label: 'Employment contract', description: 'Signed by you AND your company, all pages, PDF' },
  { id: 'formulario_mit', label: 'Formulario MIT (MOV-INT)', description: 'Application form, signed by you, PDF' },
] as const;
