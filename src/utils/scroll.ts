const LANDING_PATHS = ['/', '/index.html'];

const formatHash = (target: string) => {
  if (!target) return '';
  return target.startsWith('#') ? target : `#${target.replace(/^#/, '').replace(/^\/+/, '')}`;
};

const SCROLL_OFFSET = 88;
const scrollElementIntoView = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    return false;
  }

  const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
  const targetPosition = elementTop - SCROLL_OFFSET;

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
  return true;
};

export const goToSection = (target: string) => {
  if (typeof window === 'undefined') return;

  const hash = formatHash(target);
  if (!hash || hash === '#') return;

  const isLanding = LANDING_PATHS.includes(window.location.pathname);
  if (!isLanding) {
    window.location.href = `/${hash}`;
    return;
  }

  const elementId = hash.slice(1);
  if (!scrollElementIntoView(elementId)) {
    window.location.hash = hash;
  } else if (window.location.hash !== hash) {
    history.replaceState(null, '', hash);
  }
};

export const scrollToCurrentHash = () => {
  if (typeof window === 'undefined') return;
  const currentHash = window.location.hash;
  if (!currentHash || currentHash === '#') return;
  scrollElementIntoView(currentHash.slice(1));
};
