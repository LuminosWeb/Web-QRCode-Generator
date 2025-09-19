/**
 * Classe principale pour gérer l'application QR Generator
 */
class QRGenerator {
  constructor() {
    // Fallback config si absente
    this.config = (typeof window !== 'undefined' && window.CONFIG) ? window.CONFIG : {
      QR_API_BASE: 'https://api.qrserver.com/v1/create-qr-code/',
      DEFAULT_VALUES: { text: '', size: 300, format: 'png', ecc: 'M', margin: 4 },
      LIMITS: { minSize: 120, maxSize: 800, minMargin: 0, maxMargin: 40 },
      MESSAGES: { emptyText: 'Entrée requise.', generateFirst: 'Génère d\'abord.', downloadError: 'Téléchargement impossible', copyError: 'Copie impossible', copySuccess: 'Copié.', copyTextSuccess: 'Texte copié !', nothingToCopy: 'Rien à copier.' }
    };
    if (!window.CONFIG) {
      console.warn('[QRGenerator] CONFIG global absente — utilisation du fallback interne.');
    }
    this.elements = this.initializeElements();
    this.state = this.initializeState();
    this.bindEvents();
    this.initCustomSelects();
    this.generate(); // Génération initiale
  }

  /**
   * Initialise les références aux éléments DOM
   * @returns {Object} Objet contenant les références aux éléments
   */
  initializeElements() {
    const elements = {
      // Formulaire et champs de saisie
      form: document.getElementById('qr-form'),
      dataInput: document.getElementById('data'),
      sizeInput: document.getElementById('size'),
      sizeDisplay: document.getElementById('sizeVal'),
      formatSelect: document.getElementById('format'),
  formatHidden: document.getElementById('formatValue'),
      eccSelect: document.getElementById('ecc'),
  eccHidden: document.getElementById('eccValue'),
      marginInput: document.getElementById('margin'),
  marginGroup: document.getElementById('margin')?.closest('.form-group'),
      
      // Boutons d'action
      generateBtn: document.getElementById('gen'),
      downloadBtn: document.getElementById('download'),
      copyBtn: document.getElementById('copy'),
      copyTextBtn: document.getElementById('copyText'),
      openNewBtn: document.getElementById('openNew'),
      resetBtn: document.getElementById('reset'),
      
      // Aperçu
      qrImage: document.getElementById('qrImg'),
      formatLabel: document.getElementById('fmtLabel'),
      loadingState: document.getElementById('qr-loading'),
      statusMessages: document.getElementById('status-messages')
    };

    // Vérification que tous les éléments sont présents
    Object.entries(elements).forEach(([key, element]) => {
      if (!element) {
        console.error(`Élément manquant: ${key}`);
      }
    });

    return elements;
  }

  /**
   * Initialise l'état de l'application
   * @returns {Object} État initial
   */
  initializeState() {
    return {
      isGenerating: false,
      lastGeneratedUrl: null,
      currentBlob: null,
      suppressNextImageError: false,
      lastFormatRequested: null
    };
  }

  /**
   * Lie les événements aux éléments
   */
  bindEvents() {
    // Événements du formulaire
    this.elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.generate();
    });

    // Mise à jour en temps réel de la taille
    this.elements.sizeInput.addEventListener('input', () => {
      this.updateSizeDisplay();
    });

    // Boutons d'action
    this.elements.generateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.generate();
    });

    this.elements.downloadBtn.addEventListener('click', () => {
      this.downloadImage();
    });

    this.elements.copyBtn.addEventListener('click', () => {
      this.copyImageToClipboard();
    });

    this.elements.openNewBtn.addEventListener('click', () => {
      this.openImageInNewTab();
    });

    this.elements.resetBtn.addEventListener('click', () => {
      this.resetForm();
    });

    // Gestion des erreurs d'image
    this.elements.qrImage.addEventListener('load', () => {
      this.onImageLoad();
    });

    this.elements.qrImage.addEventListener('error', () => {
      this.onImageError();
    });

    // Validation en temps réel
    this.elements.dataInput.addEventListener('input', () => {
      this.validateInput();
    });

    // Génération automatique sur changement de paramètres
    // Listener spécifique pour la marge (car selects custom gérés ailleurs)
    this.elements.marginInput.addEventListener('change', () => {
      if (this.elements.dataInput.value.trim()) {
        this.generate();
      }
    });
    this.toggleMarginVisibility();
  }

  /**
   * Initialise les composants custom select
   */
  initCustomSelects() {
    this.customSelects = [];
    document.querySelectorAll('[data-select]').forEach(el => {
      const instance = new CustomSelect(el, {
        onChange: ({ id, value }) => {
          if (id === 'format') {
            // Mettre à jour label format + marge
            this.toggleMarginVisibility();
          }
          // Déclencher génération si utilisateur a déjà saisi un texte
            if (this.elements.dataInput.value.trim()) {
              this.generate();
            }
        }
      });
      this.customSelects.push(instance);
    });
    // Remplacer références anciennes vers selects natifs par conteneurs custom
    this.elements.formatSelect = document.getElementById('format');
    this.elements.eccSelect = document.getElementById('ecc');
  }

  /**
   * Met à jour l'affichage de la taille
   */
  updateSizeDisplay() {
    this.elements.sizeDisplay.textContent = this.elements.sizeInput.value;
  }

  /**
   * Valide l'entrée utilisateur
   * @returns {boolean} True si valide
   */
  validateInput() {
    const text = this.elements.dataInput.value.trim();
    const isValid = text.length > 0;
    
    // Met à jour l'état visuel
    this.elements.dataInput.classList.toggle('invalid', !isValid);
    this.elements.generateBtn.disabled = !isValid;
    
    return isValid;
  }

  /**
   * Construit l'URL de l'API pour générer le QR code
   * @param {string} text - Texte à encoder
   * @param {number} size - Taille en pixels
   * @param {string} ecc - Niveau de correction d'erreur
   * @param {number} margin - Marge en pixels
   * @param {string} format - Format (png/svg)
   * @returns {string} URL de l'API
   */
  buildApiUrl(text, size, ecc, margin, format = 'png') {
    const limits = this.config.LIMITS || { minSize: 120, maxSize: 800, minMargin: 0, maxMargin: 40 };
    // Clamp proactif
    const safeSize = Math.min(Math.max(size, limits.minSize), limits.maxSize);
    const safeMargin = Math.min(Math.max(margin, limits.minMargin), limits.maxMargin);
    const params = new URLSearchParams({ data: text, size: `${safeSize}x${safeSize}`, ecc: ecc, margin: format === 'svg' ? '0' : String(safeMargin) });
    if (format === 'svg') params.append('format', 'svg');
    return `${this.config.QR_API_BASE}?${params.toString()}`;
  }

  /**
   * Obtient les paramètres actuels du formulaire
   * @returns {Object} Paramètres du formulaire
   */
  getFormData() {
    return {
      text: this.elements.dataInput.value.trim(),
      size: parseInt(this.elements.sizeInput.value, 10),
      format: this.elements.formatHidden ? this.elements.formatHidden.value : 'png',
      ecc: this.elements.eccHidden ? this.elements.eccHidden.value : 'M',
      margin: parseInt(this.elements.marginInput.value, 10) || 0
    };
  }

  /**
   * Affiche l'état de chargement
   */
  showLoading() {
    this.state.isGenerating = true;
    this.state.loadingStartedAt = performance.now();
    this.elements.loadingState.setAttribute('aria-hidden', 'false');
    // Plus d'opacité inline: géré par data-mode (png-loading / svg-loading)
    this.elements.generateBtn.disabled = true;
    this.elements.generateBtn.textContent = 'Génération...';
  }

  /**
   * Cache l'état de chargement après un délai minimal et exécute un callback
   * @param {Function} callback
   */
  hideLoading(callback) {
    const MIN = 700; // ms (délai minimal total ressenti)
    const elapsed = performance.now() - (this.state.loadingStartedAt || 0);
    const remaining = elapsed < MIN ? MIN - elapsed : 0;
    const finalize = () => {
      this.state.isGenerating = false;
      this.elements.loadingState.setAttribute('aria-hidden', 'true');
      const container = this.elements.qrImage.closest('.qr-container');
      if (container) {
        const mode = container.getAttribute('data-mode');
        if (mode === 'png-loading') container.setAttribute('data-mode', 'png');
        else if (mode === 'svg-loading') container.setAttribute('data-mode', 'svg');
      }
      this.elements.generateBtn.disabled = false;
      this.elements.generateBtn.textContent = 'Générer le code';
      if (typeof callback === 'function') callback();
    };
    if (remaining > 0) {
      setTimeout(finalize, remaining);
    } else {
      finalize();
    }
  }

  /**
   * Affiche un message à l'utilisateur
   * @param {string} message - Message à afficher
   * @param {string} type - Type de message (success, error, info)
   */
  showMessage(message, type = 'info') {
    if (this.elements.statusMessages) {
      this.elements.statusMessages.textContent = message;
      // Pour l'accessibilité, le message sera lu par le lecteur d'écran
      setTimeout(() => {
        this.elements.statusMessages.textContent = '';
      }, 5000);
    }
    
    // Affichage alternatif avec alert pour les messages d'erreur importants
    if (type === 'error') {
      alert(message);
    } else if (type === 'success') {
      // Pour les succès, on peut utiliser une notification moins intrusive
      console.log(`✓ ${message}`);
    }
  }

  /**
   * Génère le QR code
   */
  async generate() {
    if (!this.validateInput()) {
      this.showMessage(this.config.MESSAGES.emptyText || 'Champ vide', 'error');
      this.elements.dataInput.focus();
      return;
    }

    const formData = this.getFormData();
  this.state.lastFormatRequested = formData.format;

    // Mise à jour preview contenu (sécurisée + troncature)
    const previewEl = document.getElementById('contentPreview');
    if (previewEl) {
      const raw = formData.text;
      const truncated = raw.length > 120 ? raw.slice(0,117) + '…' : raw;
      // Neutraliser balises éventuelles
      previewEl.textContent = truncated || '(vide)';
      previewEl.title = raw || 'Aucun contenu généré';
    }
    
    this.showLoading();
    // Marquer le conteneur comme en chargement pour l'effet d'opacité
    const container = this.elements.qrImage.closest('.qr-container');
    if (container) {
      container.setAttribute('data-mode', formData.format === 'svg' ? 'svg-loading' : 'png-loading');
    }
    
    try {
      // Construction de l'URL
      const url = this.buildApiUrl(
        formData.text,
        formData.size,
        formData.ecc,
        formData.margin,
        formData.format
      );
      // Mise à jour label format
      this.elements.formatLabel.textContent = formData.format.toUpperCase();

  // container déjà défini plus haut
      const svgWrap = document.getElementById('qrSvgWrap');

      if (formData.format !== 'svg') {
        // Mode raster : rester en png-loading jusqu'au onload
        if (container) container.setAttribute('data-mode', 'png-loading');
        this.state.lastGeneratedUrl = url;
        svgWrap && (svgWrap.innerHTML = '');
        // Masquer totalement jusqu'au chargement effectif
        this.elements.qrImage.style.display = 'none';
        this.elements.qrImage.setAttribute('aria-hidden', 'true');
        // Définir src (déclenchera onImageLoad)
        this.elements.qrImage.src = url;
      } else {
        // Tentative inline SVG sans vider immédiatement src de l'image pour éviter onerror
        container && container.setAttribute('data-mode', 'svg-loading');
        try {
          const resp = await fetch(url, { cache: 'no-store' });
          if (!resp.ok) throw new Error('HTTP ' + resp.status);
          const ct = (resp.headers.get('content-type') || '').toLowerCase();
          const svgText = await resp.text();
          if (!ct.includes('svg') && !svgText.trim().startsWith('<svg')) {
            throw new Error('Réponse non-SVG (content-type=' + ct + ')');
          }
          const safe = svgText.replace(/<script[\s\S]*?<\/script>/gi, '');
          if (svgWrap) {
            svgWrap.innerHTML = safe;
            svgWrap.removeAttribute('aria-hidden');
          }
          // On masque seulement après succès
          this.state.suppressNextImageError = true; // si l'image précédente se vide
          // Masquer l'image raster en mode SVG
          this.elements.qrImage.setAttribute('aria-hidden', 'true');
          this.elements.qrImage.style.display = 'none';
          this.elements.qrImage.src = '';
          container && container.setAttribute('data-mode', 'svg');
          const blob = new Blob([safe], { type: 'image/svg+xml' });
          this.state.currentBlob = blob;
          this.state.lastGeneratedUrl = url;
          this.hideLoading(() => {
            this.enableActionButtons(true);
            this.showMessage('QR code SVG généré avec succès', 'success');
          });
          return;
        } catch (inlineErr) {
          console.warn('[SVG inline échec]', inlineErr);
          // Fallback -> PNG
          const pngUrl = this.buildApiUrl(
            formData.text,
            formData.size,
            formData.ecc,
            formData.margin,
            'png'
          );
          this.showMessage('Impossible de charger le SVG, passage en PNG.', 'info');
          this.state.suppressNextImageError = true;
          svgWrap && (svgWrap.innerHTML = '');
          container && container.setAttribute('data-mode', 'png');
          this.elements.qrImage.style.display = '';
          this.elements.qrImage.removeAttribute('aria-hidden');
          this.elements.qrImage.src = pngUrl;
          this.state.lastGeneratedUrl = pngUrl;
          this.state.lastFormatRequested = 'png';
        }
      }
      
    } catch (error) {
      this.onImageError();
      console.error('Erreur lors de la génération:', error);
    }
  }

  /**
   * Gestionnaire de chargement réussi de l'image
   */
  onImageLoad() {
    this.hideLoading(() => {
      const container = this.elements.qrImage.closest('.qr-container');
      if (container && container.getAttribute('data-mode') === 'png-loading') {
        container.setAttribute('data-mode', 'png');
      }
      this.elements.qrImage.style.display = '';
      this.elements.qrImage.removeAttribute('aria-hidden');
      this.enableActionButtons(true);
      this.showMessage('QR code généré avec succès', 'success');
    });
  }

  /**
   * Gestionnaire d'erreur de chargement de l'image
   */
  onImageError() {
    // Ignorer erreurs liées à un src vide ou transition contrôlée
    if (this.state.suppressNextImageError || !this.elements.qrImage.src) {
      this.state.suppressNextImageError = false;
      return;
    }
    this.hideLoading(() => {
      this.enableActionButtons(false);
      const fmt = this.state.lastFormatRequested || 'png';
      this.showMessage(`Erreur lors de la génération du QR code (${fmt.toUpperCase()}).`, 'error');
    });
  }

  /**
   * Active ou désactive les boutons d'action
   * @param {boolean} enabled - État d'activation
   */
  enableActionButtons(enabled) {
    this.elements.downloadBtn.disabled = !enabled;
    this.elements.copyBtn.disabled = !enabled;
    this.elements.openNewBtn.disabled = !enabled;
  }

  /**
   * Télécharge l'image du QR code
   */
  async downloadImage() {
    if (!this.state.lastGeneratedUrl) {
      this.showMessage(CONFIG.MESSAGES.generateFirst, 'error');
      return;
    }

    try {
      const format = this.elements.formatHidden ? this.elements.formatHidden.value : 'png';
      let blob = this.state.currentBlob;
      if (!blob) {
        const response = await fetch(this.state.lastGeneratedUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        blob = await response.blob();
        this.state.currentBlob = blob;
      }
      const extension = format === 'svg' ? 'svg' : 'png';
      const filename = `qr_code_${Date.now()}.${extension}`;
      this.downloadBlob(blob, filename);
      this.showMessage('Téléchargement démarré', 'success');
      
    } catch (error) {
      console.error('Erreur de téléchargement:', error);
      this.showMessage(`${CONFIG.MESSAGES.downloadError}: ${error.message}`, 'error');
    }
  }

  /**
   * Utilitaire pour télécharger un blob
   * @param {Blob} blob - Blob à télécharger
   * @param {string} filename - Nom du fichier
   */
  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Nettoyage de l'URL objet
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /**
   * Copie l'image dans le presse-papier
   */
  async copyImageToClipboard() {
    if (!this.state.lastGeneratedUrl) {
      this.showMessage(CONFIG.MESSAGES.generateFirst, 'error');
      return;
    }

    // Vérification du support des APIs
    if (!navigator.clipboard || !navigator.clipboard.write) {
      this.showMessage('Copie d\'image non supportée par ce navigateur', 'error');
      return;
    }

    try {
      let blob = this.state.currentBlob;
      if (!blob) {
        const response = await fetch(this.state.lastGeneratedUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        blob = await response.blob();
        this.state.currentBlob = blob;
      }
      
      // Vérification du type MIME
      if (!blob.type.startsWith('image/')) {
        throw new Error('Type de fichier non supporté pour la copie');
      }
      
      const clipboardItem = new ClipboardItem({ [blob.type]: blob });
      await navigator.clipboard.write([clipboardItem]);
      
      this.showMessage(CONFIG.MESSAGES.copySuccess, 'success');
      
    } catch (error) {
      console.error('Erreur de copie d\'image:', error);
      this.showMessage(`${CONFIG.MESSAGES.copyError}: ${error.message}`, 'error');
    }
  }

  /**
   * Méthode de fallback pour copier du texte
   * @param {string} text - Texte à copier
   */
  fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (!successful) {
      throw new Error('Échec de la copie');
    }
  }

  /**
   * Ouvre l'image dans un nouvel onglet
   */
  openImageInNewTab() {
    if (!this.state.lastGeneratedUrl) {
      this.showMessage(CONFIG.MESSAGES.generateFirst, 'error');
      return;
    }
    
    const newWindow = window.open(this.state.lastGeneratedUrl, '_blank');
    if (!newWindow) {
      this.showMessage('Impossible d\'ouvrir une nouvelle fenêtre. Vérifiez le bloqueur de pop-ups.', 'error');
    }
  }

  /**
   * Remet le formulaire aux valeurs par défaut
   */
  resetForm() {
    const defaults = this.config.DEFAULT_VALUES;
    
    this.elements.dataInput.value = defaults.text;
    this.elements.sizeInput.value = defaults.size;
    this.elements.formatSelect.value = defaults.format;
    this.elements.eccSelect.value = defaults.ecc;
    this.elements.marginInput.value = defaults.margin;
    
    this.updateSizeDisplay();
    this.elements.formatLabel.textContent = defaults.format.toUpperCase();
    
    // Réinitialisation de l'état
  this.elements.qrImage.src = '';
  this.elements.qrImage.style.display = '';
  const svgWrap = document.getElementById('qrSvgWrap');
  if (svgWrap) svgWrap.innerHTML = '';
    this.state.lastGeneratedUrl = null;
    this.state.currentBlob = null;
    this.enableActionButtons(false);
    
    // Génération automatique avec les valeurs par défaut
    this.generate();
    
    this.showMessage('Formulaire réinitialisé', 'info');
  }

  /**
   * Affiche ou masque le champ marge selon le format choisi
   */
  toggleMarginVisibility() {
    if (!this.elements.marginGroup) return;
    const format = this.elements.formatHidden ? this.elements.formatHidden.value : 'png';
    const isSvg = format === 'svg';
    this.elements.marginGroup.classList.toggle('is-hidden', isSvg);
  }
}