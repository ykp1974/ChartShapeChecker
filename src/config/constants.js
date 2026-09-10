// GAS (Google Apps Script) API のエンドポイントURLや設定値
export const GAS_URL = 'https://script.google.com/macros/s/AKfycbzTPAmD8FdmWWBlu9nKJ52PzrBw5lKzkvC-3wxwVJRkSz40qoOtPCA6A5tgMSKgSFQG/exec';

export const DRIVE_URLS = {
  PREVIEW: (id) => `https://drive.google.com/file/d/${id}/view`,
  THUMBNAIL: (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w2500`,
  FALLBACK: (id) => `https://lh3.googleusercontent.com/u/0/d/${id}`
};
