// Registrar Service Worker
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado:', registration.scope)
        })
        .catch((error) => {
          console.log('Error al registrar Service Worker:', error)
        })
    })
  }
}

// Detectar si es dispositivo móvil
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768
}

// Detectar si la app está instalada
export function isInstalled(): boolean {
  if (typeof window === 'undefined') return false
  
  return (
    (window.navigator as any).standalone ||
    window.matchMedia('(display-mode: standalone)').matches
  )
}
