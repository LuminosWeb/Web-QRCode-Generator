/**
 * Générateur de QR Code - Configuration de l'application
 * 
 * Application simple pour générer des QR codes avec différents formats et options.
 * Utilise l'API externe qrserver.com pour la génération des codes QR.
 * 
 * @author Luminosweb.com
 * @version 1.1.0
*/
// IIFE pour éviter la pollution globale accidentelle tout en exposant CONFIG
(() => {
  const CONFIG = {
  // URL de base pour l'API de génération QR
  QR_API_BASE: 'https://api.qrserver.com/v1/create-qr-code/',
  
  // Valeurs par défaut
  DEFAULT_VALUES: {
    text: 'https://luminosweb.com',
    size: 300,
    format: 'png',
    ecc: 'M',
    margin: 4
  },
  
  // Limites
  LIMITS: {
    minSize: 120,
    maxSize: 800,
    minMargin: 0,
    maxMargin: 40
  },
  
  // Messages
  MESSAGES: {
    emptyText: 'Merci d\'entrer un texte ou une URL.',
    generateFirst: 'Génère d\'abord le QR code.',
    generationError: 'Erreur lors de la génération du QR code.',
    downloadError: 'Impossible de télécharger',
    copyError: 'Copie impossible',
    copySuccess: 'Image copiée dans le presse-papier.',
    copyTextSuccess: 'Texte copié !',
    nothingToCopy: 'Rien à copier.'
  }
  };

  // Validation simple des bornes (console.warn si incohérence)
  function validateConfig(cfg) {
    const { LIMITS, DEFAULT_VALUES } = cfg;
    const problems = [];
    if (LIMITS.minSize >= LIMITS.maxSize) problems.push('minSize >= maxSize');
    if (LIMITS.minMargin > LIMITS.maxMargin) problems.push('minMargin > maxMargin');
    if (DEFAULT_VALUES.size < LIMITS.minSize || DEFAULT_VALUES.size > LIMITS.maxSize) problems.push('DEFAULT size hors limites');
    if (DEFAULT_VALUES.margin < LIMITS.minMargin || DEFAULT_VALUES.margin > LIMITS.maxMargin) problems.push('DEFAULT margin hors limites');
    if (problems.length) {
      console.warn('[CONFIG] Incohérences:', problems.join(', '));
    }
  }

  validateConfig(CONFIG);

  // Gel pour éviter modifications à chaud non voulues
  Object.freeze(CONFIG.DEFAULT_VALUES);
  Object.freeze(CONFIG.LIMITS);
  Object.freeze(CONFIG.MESSAGES);
  Object.freeze(CONFIG);

  // Export global (compatibilité code existant)
  if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
  } else if (typeof globalThis !== 'undefined') {
    globalThis.CONFIG = CONFIG;
  }
})();