const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3001/api';
const backendBase = API_BASE.replace(/\/api\/?$/, '');

export const buildAssetUrl = (relativePath?: string | null) => {
  if (!relativePath) return '';
  if (/^https?:\/\//i.test(relativePath)) {
    return relativePath;
  }
  return `${backendBase}${relativePath}`;
};
