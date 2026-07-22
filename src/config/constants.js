export const GAS_URL = 'https://script.google.com/macros/s/AKfycbwhlZbrfwxRe3jhHTz1vI8I4Vj__9nauHZtOlqImwcMQwobgVfj_fXCUqblhn7aRAT7/exec';

export const DRIVE_URLS = {
  PREVIEW: (id) => `https://drive.google.com/file/d/${id}/view`,
  THUMBNAIL: (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w2500`,
  FALLBACK: (id) => `https://lh3.googleusercontent.com/u/0/d/${id}`
};
