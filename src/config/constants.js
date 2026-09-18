// GAS (Google Apps Script) API のエンドポイントURLや設定値
export const GAS_URL = 'https://script.google.com/macros/s/AKfycbyDPtp0_eIue-37GDg_RgrKXyW3brLsgLRIvm76Z-iMoEJR2FlNscDZ5ul9RFbXba5o/exec';

export const DRIVE_URLS = {
  PREVIEW: (id) => `https://drive.google.com/file/d/${id}/view`,
  THUMBNAIL: (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w2500`,
  FALLBACK: (id) => `https://lh3.googleusercontent.com/u/0/d/${id}`
};
