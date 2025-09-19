/**
 * Générateur de QR Code
 * 
 * Application simple pour générer des QR codes avec différents formats et options.
 * Utilise l'API externe qrserver.com pour la génération des codes QR.
 * 
 * @author Luminosweb.com
 * @version 1.1.0
*/

'use strict';

/**
 * Utilitaires globaux
 */
const Utils = {
  /**
   * Fonction de debounce pour limiter les appels de fonction
   * @param {Function} func - Fonction à débouncer
   * @param {number} wait - Délai d'attente en ms
   * @returns {Function} Fonction débouncée
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Validation d'URL simple
   * @param {string} string - Chaîne à valider
   * @returns {boolean} True si l'URL est valide
   */
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  },

  /**
   * Génère un nom de fichier unique
   * @param {string} prefix - Préfixe du nom
   * @param {string} extension - Extension du fichier
   * @returns {string} Nom de fichier unique
   */
  generateUniqueFilename(prefix = 'qr_code', extension = 'png') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    return `${prefix}_${timestamp}_${random}.${extension}`;
  }
};

/**
 * Gestionnaire d'erreurs global
 */
window.addEventListener('error', (event) => {
  console.error('Erreur globale:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promesse rejetée:', event.reason);
});

/**
 * Initialisation de l'application
 */
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Vérification des APIs nécessaires
    if (!window.fetch) {
      alert('Ce navigateur ne supporte pas les fonctionnalités nécessaires. Veuillez utiliser un navigateur plus récent.');
      return;
    }

    // Application des valeurs par défaut depuis CONFIG (sécurisé si absent)
    const cfg = (typeof window !== 'undefined' && window.CONFIG) ? window.CONFIG : null;
    if (cfg && cfg.DEFAULT_VALUES) {
      const d = cfg.DEFAULT_VALUES;
      const dataEl = document.getElementById('data');
      const sizeEl = document.getElementById('size');
      const formatHidden = document.getElementById('formatValue');
      const eccHidden = document.getElementById('eccValue');
      const marginEl = document.getElementById('margin');
      if (dataEl) dataEl.value = d.text?.trim() || "";
      if (sizeEl) sizeEl.value = d.size;
      if (formatHidden) formatHidden.value = d.format;
      if (eccHidden) eccHidden.value = d.ecc;
      if (marginEl) marginEl.value = d.margin;
      // Nettoyage éventuel des espaces/blocs du textarea
      if (dataEl) dataEl.value = dataEl.value.trim();
    }

    // Initialisation de l'application
    const app = new QRGenerator();

    // Exposition globale pour le débogage (en développement uniquement)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      window.QRApp = app;
      window.QRUtils = Utils;
    }

    console.log('Application QR Generator initialisée avec succès');

    // Tooltip ECC (Tippy.js)
    const eccInfo = document.getElementById('eccInfo');
    if (eccInfo && window.tippy) {
      const content = `L (<strong>≈7%</strong>) : capacité maximale, fragile. Usage interne.<br>M (<strong>≈15%</strong>) : compromis par défaut recommandé.<br>Q (<strong>≈25%</strong>) : meilleure robustesse (légères salissures / petit logo).<br>H (<strong>≈30%</strong>) : tolérance max (petit QR, milieux difficiles, logo plus large).`;
      window.tippy(eccInfo, {
        content,
        allowHTML: true,
        interactive: true,
        maxWidth: 320,
        theme: 'light',
        placement: 'top',
        appendTo: () => document.body,
        delay: [80, 40]
      });
    }
    
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
    alert('Erreur lors du chargement de l\'application. Veuillez rafraîchir la page.');
  }
});