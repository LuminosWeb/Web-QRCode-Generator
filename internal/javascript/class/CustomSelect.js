/**
 * Composant Custom Select accessible
 */
class CustomSelect {
  constructor(root, { onChange } = {}) {
    this.root = root; // conteneur principal
    this.onChange = onChange;
    this.button = root.querySelector('[data-select-trigger]');
    this.valueEl = root.querySelector('[data-select-value]');
    this.optionsList = root.querySelector('.c-select__list');
    this.hiddenInput = root.querySelector('input[type="hidden"]');
    this.options = Array.from(this.optionsList.querySelectorAll('[role="option"]'));
    this.activeIndex = this.options.findIndex(o => o.getAttribute('aria-selected') === 'true');
    if (this.activeIndex < 0) this.activeIndex = 0;
    this.closeOnOutsideClick = this.handleOutsideClick.bind(this);
    this.handleKeyDown = this.onKeyDown.bind(this);
    this.bindEvents();
  }

  bindEvents() {
    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });

    this.root.addEventListener('keydown', this.handleKeyDown);

    this.options.forEach((opt, index) => {
      opt.addEventListener('click', (e) => {
        e.preventDefault();
        this.select(index, true);
      });
      opt.addEventListener('mousemove', () => {
        this.setActive(index, false);
      });
    });
  }

  open() {
    if (this.isOpen()) return;
    this.root.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', this.closeOnOutsideClick, { capture: true });
    this.scrollActiveIntoView();
  }

  close() {
    if (!this.isOpen()) return;
    this.root.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', this.closeOnOutsideClick, { capture: true });
  }

  toggle() {
    this.isOpen() ? this.close() : this.open();
  }

  isOpen() {
    return this.root.getAttribute('aria-expanded') === 'true';
  }

  setActive(index, updateAria = true) {
    if (index < 0 || index >= this.options.length) return;
    this.activeIndex = index;
    const active = this.options[index];
    if (updateAria) {
      this.options.forEach(o => o.classList.remove('is-active'));
      active.classList.add('is-active');
      this.root.setAttribute('aria-activedescendant', active.id);
    }
  }

  select(index, userInitiated = false) {
    if (index < 0 || index >= this.options.length) return;
    this.options.forEach(o => o.setAttribute('aria-selected', 'false'));
    const opt = this.options[index];
    opt.setAttribute('aria-selected', 'true');
    this.valueEl.textContent = opt.textContent;
    const newValue = opt.getAttribute('data-value');
    if (this.hiddenInput) this.hiddenInput.value = newValue;
    this.setActive(index);
    this.close();
    if (this.onChange && userInitiated) {
      this.onChange({ id: this.root.id, value: newValue, label: opt.textContent });
    }
  }

  handleOutsideClick(e) {
    if (!this.root.contains(e.target)) {
      this.close();
    }
  }

  onKeyDown(e) {
    const key = e.key;
    if (key === ' ' || key === 'Enter') {
      if (!this.isOpen()) {
        e.preventDefault();
        this.open();
      } else {
        e.preventDefault();
        this.select(this.activeIndex, true);
      }
    } else if (key === 'Escape') {
      if (this.isOpen()) {
        e.preventDefault();
        this.close();
      }
    } else if (key === 'ArrowDown') {
      e.preventDefault();
      if (!this.isOpen()) this.open();
      this.setActive(Math.min(this.activeIndex + 1, this.options.length - 1));
      this.scrollActiveIntoView();
    } else if (key === 'ArrowUp') {
      e.preventDefault();
      if (!this.isOpen()) this.open();
      this.setActive(Math.max(this.activeIndex - 1, 0));
      this.scrollActiveIntoView();
    } else if (key === 'Home') {
      e.preventDefault();
      this.setActive(0);
      this.scrollActiveIntoView();
    } else if (key === 'End') {
      e.preventDefault();
      this.setActive(this.options.length - 1);
      this.scrollActiveIntoView();
    } else if (/^[a-z0-9]$/i.test(key)) {
      // Recherche rapide par première lettre
      const lower = key.toLowerCase();
      const start = (this.activeIndex + 1) % this.options.length;
      const found = this.options.findIndex((o, i) => {
        const idx = (start + i) % this.options.length;
        return this.options[idx].textContent.trim().toLowerCase().startsWith(lower);
      });
      if (found !== -1) {
        this.setActive((start + found) % this.options.length);
        this.scrollActiveIntoView();
      }
    }
  }

  scrollActiveIntoView() {
    const active = this.options[this.activeIndex];
    if (!active) return;
    const list = this.optionsList;
    const listRect = list.getBoundingClientRect();
    const optRect = active.getBoundingClientRect();
    if (optRect.top < listRect.top) {
      list.scrollTop -= (listRect.top - optRect.top);
    } else if (optRect.bottom > listRect.bottom) {
      list.scrollTop += (optRect.bottom - listRect.bottom);
    }
  }
}