const LANDING_PATHS = ['/', '/index.html'];
const SCROLL_OFFSET = 80;

const normalizeHash = (target: string) => {
  if (!target) return '';
  return target.startsWith('#') ? target : `#${target.replace(/^\/+/, '')}`;
};

const scrollToHash = (hash: string) => {
  if (!hash || hash === '#') return false;
  const elementId = hash.replace('#', '');
  const element = document.getElementById(elementId);
  if (!element) return false;

  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - SCROLL_OFFSET;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });

  return true;
};

export const navigateToSection = (target: string) => {
  const hash = normalizeHash(target);
  if (!hash) return;

  const onLanding = LANDING_PATHS.includes(window.location.pathname);

  if (onLanding) {
    if (!scrollToHash(hash)) {
      window.location.hash = hash;
    }
  } else {
    window.location.href = `/${hash}`;
  }
};

export { scrollToHash };
