# Générateur QR Code 🚀

Une application web moderne et élégante pour générer des codes QR avec un design violet foncé sophistiqué. Développée par [Luminosweb](https://luminosweb.com).

## ✨ Fonctionnalités

- **Génération de QR codes** : Convertit n'importe quel texte ou URL en code QR haute qualité
- **Formats multiples** : Support PNG et SVG avec rendu optimisé
- **Personnalisation avancée** :
  - Taille ajustable (120px à 800px)
  - Niveaux de correction d'erreur (L, M, Q, H)
  - Marge personnalisable (PNG uniquement)
- **Actions pratiques** :
  - Téléchargement direct avec nommage automatique
  - Copie d'image dans le presse-papier
  - Copie de texte source
  - Ouverture dans un nouvel onglet
- **Interface moderne** :
  - Selects customisés avec design cohérent
  - Animations fluides et micro-interactions
  - Indicateurs de chargement élégants
- **Design responsive** : Optimisé pour tous les appareils (mobile, tablette, desktop)
- **Accessibilité** : Conforme aux standards WCAG 2.1 AA

## 🚀 Utilisation

1. **Ouvrez `index.html`** dans votre navigateur web moderne
2. **Entrez votre texte ou URL** dans le champ de saisie
3. **Ajustez les paramètres** selon vos besoins :
   - Taille du QR code (slider interactif)
   - Format (PNG ou SVG via select custom)
   - Niveau de correction d'erreur
   - Marge (masquée automatiquement pour SVG)
4. **Cliquez sur "Générer"** pour créer votre QR code
5. **Utilisez les actions** pour télécharger, copier ou ouvrir le QR code

## 📁 Structure du projet

```
qrcode.luminosweb.com/
├── index.html                      # Structure HTML principale et accessible
├── config.js                       # Configuration globale de l'application
├── package.json                    # Métadonnées et scripts du projet
├── README.md                       # Documentation complète
├── assets/
│   └── logo.png                    # Logo Luminosweb
└── internal/
    ├── css/
    │   ├── styles.css              # Styles principaux (design violet foncé)
    │   └── breakpoints.css         # Media queries responsives
    └── javascript/
        ├── main.js                 # Point d'entrée et initialisation
        └── class/
            ├── CustomSelect.js     # Composant select personnalisé
            └── QRGenerator.js      # Classe principale de l'application
```

## 🛠️ Technologies utilisées

- **HTML5** : Structure sémantique avec support ARIA et accessibilité
- **CSS3** : Design moderne avec variables CSS, Grid, Flexbox et animations
- **JavaScript ES6+** : 
  - Classes modulaires (`QRGenerator`, `CustomSelect`)
  - Configuration centralisée (`config.js`)
  - APIs modernes (Fetch, Clipboard, File)
- **API externe** : [QR Server API](https://api.qrserver.com/v1/) pour la génération des QR codes

## 🎨 Caractéristiques du design

- **Thème violet foncé** : Palette de couleurs moderne et élégante
- **Composants custom** : Selects personnalisés avec animations
- **Design glassmorphism** : Effets de transparence et backdrop-filter
- **Animations fluides** : Transitions CSS et états de chargement
- **Typographie optimisée** : Hiérarchie claire et lisibilité parfaite
- **Responsive design** : Adaptation intelligente sur tous les écrans

## ⚡ Architecture technique

### Organisation modulaire
- **`config.js`** : Configuration globale avec validation et gel des objets
- **`QRGenerator`** : Classe principale gérant l'état et les interactions
- **`CustomSelect`** : Composant réutilisable pour les sélecteurs
- **`main.js`** : Point d'entrée et initialisation de l'application

### Gestion d'état robuste
- **Validation des entrées** : Vérification en temps réel et sanitisation
- **Gestion d'erreurs** : Try-catch complets avec fallbacks gracieux
- **États de chargement** : Indicateurs visuels avec durée minimale
- **Cache intelligent** : Réutilisation des blobs générés

### Performance optimisée
- **Chargement différé** : CSS et JS dans des fichiers séparés
- **Debouncing** : Limitation des appels API redondants
- **Gestion mémoire** : Nettoyage automatique des URLs objets
- **Fallbacks SVG→PNG** : Basculement automatique en cas d'échec

### Accessibilité avancée
- **ARIA complet** : Labels, états et descriptions pour lecteurs d'écran
- **Navigation clavier** : Support intégral du clavier
- **Messages d'état** : Annonces dynamiques pour les actions
- **Contraste optimisé** : Respect des ratios WCAG 2.1 AA

## 🔧 Configuration

### Paramètres par défaut (`config.js`)
```javascript
DEFAULT_VALUES: {
  text: 'https://luminosweb.com',
  size: 300,
  format: 'png',
  ecc: 'M',
  margin: 4
}
```

### Limites système
```javascript
LIMITS: {
  minSize: 120,
  maxSize: 800,
  minMargin: 0,
  maxMargin: 40
}
```

### Messages utilisateur
Configuration centralisée des messages d'interface avec support multilingue potentiel.

## 🌐 Support navigateur

- **Chrome/Edge** : 88+ (support Clipboard API complet)
- **Firefox** : 85+ (toutes fonctionnalités)
- **Safari** : 14+ (iOS 14+)
- **Mobile** : Android 10+, iOS 14+

### APIs modernes utilisées
- **Fetch API** : Génération QR avec gestion d'erreurs robuste
- **Clipboard API** : Copie d'images et de texte native
- **File API** : Téléchargement automatique avec nommage
- **URL.createObjectURL** : Gestion des blobs SVG/PNG

## 📱 Design responsive

### Breakpoints (`breakpoints.css`)
- **Mobile** : < 600px (interface simplifiée)
- **Tablet** : 600px à 879px (mise en page adaptée)
- **Desktop** : 880px+ (layout en grille optimisé)

### Adaptations mobiles
- Boutons tactiles agrandis
- Espacement optimisé
- Selects personnalisés adaptés au touch
- Animations réduites pour les performances

### Hébergement statique
Le projet est entièrement statique et compatible avec :
- **GitHub Pages**
- **Netlify** 
- **Vercel**
- **Firebase Hosting**
- **Cloudflare Pages**
- Tout serveur web standard

### Optimisations de production
- Compression gzip/brotli recommandée
- Headers de cache agressif pour assets statiques
- CSP (Content Security Policy) compatible
- HTTPS fortement recommandé pour Clipboard API

## 🔒 Sécurité et bonnes pratiques

- **Validation des entrées** : Sanitisation complète des données utilisateur
- **APIs externes sécurisées** : Utilisation exclusive de qrserver.com (HTTPS)
- **CSP ready** : Compatible avec les Content Security Policies strictes
- **No-JS graceful** : Dégradation élégante si JavaScript désactivé
- **HTTPS recommandé** : Fonctionnement optimal des APIs modernes

## 📊 Métriques de performance

### Tailles des fichiers
- **HTML** : ~4KB (gzippé)
- **CSS total** : ~12KB (styles + breakpoints)
- **JavaScript total** : ~18KB (classes + config)
- **Assets** : ~2KB (logo PNG optimisé)
- **Total** : ~36KB

### Temps de chargement
- **First Paint** : <100ms
- **Fully Interactive** : <200ms
- **API QR** : 200-500ms (selon taille)

## 📄 Licence

Ce projet est open source et disponible sous **licence MIT**.

```
MIT License - Copyright (c) 2025 Luminosweb
Permission is hereby granted, free of charge, to any person obtaining a copy...
```

## 👥 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet sur GitHub
2. **Créer** une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commit** vos changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Ouvrir** une Pull Request avec description détaillée

### Guidelines de contribution
- Respecter l'architecture modulaire existante
- Maintenir la compatibilité avec les navigateurs supportés
- Ajouter des tests si applicable
- Documenter les nouvelles fonctionnalités

## 📞 Support et contact

Pour toute question, problème ou suggestion :

- **Email** : [contact@luminosweb.com](mailto:contact@luminosweb.com)
- **Website** : [luminosweb.com](https://luminosweb.com)
- **GitHub Issues** : [Signaler un bug](https://github.com/LuminosWeb/Web-QRCode-Generator/issues)

## 🔄 Changelog

### Version 1.1.0 (Actuelle)
- ✅ **Architecture modulaire** : Séparation en classes et fichiers dédiés
- ✅ **Configuration centralisée** : `config.js` avec validation et gel
- ✅ **Composants personnalisés** : `CustomSelect` avec design cohérent  
- ✅ **Accessibilité renforcée** : ARIA complet et navigation clavier
- ✅ **Gestion d'erreurs robuste** : Fallbacks SVG→PNG et messages clairs
- ✅ **Design système** : Variables CSS et breakpoints organisés
- ✅ **Performance optimisée** : Chargement différé et cache intelligent

### Version 1.0.0
- ✅ **Version initiale** avec fonctionnalités de base
- ✅ **Design violet foncé** élégant et moderne
- ✅ **Génération QR** en formats PNG/SVG
- ✅ **Interface responsive** multi-appareils
- ✅ **Actions utilisateur** : téléchargement, copie, ouverture

---

<div align="center">

**Développé avec ❤️ par [Luminosweb](https://luminosweb.com)**

*Générateur QR Code - Version 1.1.0*

</div>

