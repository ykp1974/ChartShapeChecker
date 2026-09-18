// GAS (Google Apps Script) API のエンドポイントURLや設定値
export const GAS_URL = 'https://script.google.com/macros/s/AKfycbxb2p7gK03QykxfPw-bNEX0_A_pJkgNQ_YqOVYVE63ph6-Oe_lkLFuWkCgK0p-KSlLI/exec';

export const DRIVE_URLS = {
  PREVIEW: (id) => `https://drive.google.com/file/d/${id}/view`,
  THUMBNAIL: (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w2500`,
  FALLBACK: (id) => `https://lh3.googleusercontent.com/u/0/d/${id}`
};
