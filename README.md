# Générateur QR Code

Une application web simple et élégante pour générer des codes QR avec un design moderne violet foncé.

## ✨ Fonctionnalités

- **Génération de QR codes** : Convertit n'importe quel texte ou URL en code QR
- **Formats multiples** : Support PNG et SVG
- **Personnalisation avancée** :
  - Taille ajustable (120px à 800px)
  - Niveaux de correction d'erreur (L, M, Q, H)
  - Marge personnalisable
- **Actions pratiques** :
  - Téléchargement direct
  - Copie dans le presse-papier (image et texte)
  - Ouverture dans un nouvel onglet
- **Design responsive** : Optimisé pour tous les appareils
- **Accessibilité** : Conforme aux standards d'accessibilité web

## 🚀 Utilisation

1. **Ouvrez `index.html`** dans votre navigateur web
2. **Entrez votre texte ou URL** dans le champ de saisie
3. **Ajustez les paramètres** selon vos besoins :
   - Taille du QR code
   - Format (PNG ou SVG)
   - Niveau de correction d'erreur
   - Marge
4. **Cliquez sur "Générer"** pour créer votre QR code
5. **Utilisez les actions** pour télécharger, copier ou ouvrir le QR code

## 📁 Structure du projet

```
qrcode.luminosweb.com/
├── index.html          # Structure HTML principale
├── styles.css          # Styles CSS avec design violet foncé
├── script.js           # Logique JavaScript modulaire
├── main.html           # Fichier original (archive)
└── README.md           # Documentation du projet
```

## 🛠️ Technologies utilisées

- **HTML5** : Structure sémantique et accessible
- **CSS3** : Design moderne avec variables CSS et gradients
- **JavaScript ES6+** : Code modulaire avec classes et fonctions asynchrones
- **API externe** : [QR Server API](https://goqr.me/api/) pour la génération des QR codes

## 🎨 Caractéristiques du design

- **Thème violet foncé** : Palette de couleurs moderne et élégante
- **Design glassmorphism** : Effets de verre et transparence
- **Animations fluides** : Transitions et micro-interactions
- **Typographie soignée** : Police Inter pour une lisibilité optimale
- **Responsive design** : Adaptation automatique sur mobile et desktop

## ⚡ Optimisations techniques

### Structure du code
- **Séparation des préoccupations** : HTML, CSS, et JavaScript dans des fichiers séparés
- **Code modulaire** : Classe principale `QRGenerator` avec méthodes organisées
- **Gestion d'erreurs robuste** : Try-catch et validation des entrées
- **Configuration centralisée** : Objet `CONFIG` pour les paramètres

### Performance
- **Chargement optimisé** : CSS et JS externes pour une meilleure mise en cache
- **Debouncing** : Limitation des appels API lors des modifications
- **Gestion mémoire** : Nettoyage des URLs objets et événements

### Accessibilité
- **ARIA labels** : Descriptions pour les lecteurs d'écran
- **Navigation clavier** : Support complet de la navigation au clavier
- **Contraste élevé** : Respect des ratios de contraste WCAG
- **Messages d'état** : Retours visuels et audio pour les actions

## 🔧 Configuration

### Paramètres par défaut
```javascript
DEFAULT_VALUES: {
  text: 'https://example.com',
  size: 300,
  format: 'png',
  ecc: 'M',
  margin: 4
}
```

### Limites
```javascript
LIMITS: {
  minSize: 120,
  maxSize: 800,
  minMargin: 0,
  maxMargin: 40
}
```

## 🌐 Support navigateur

- **Chrome/Edge** : 88+
- **Firefox** : 85+
- **Safari** : 14+
- **Mobile** : iOS 14+, Android 10+

### APIs utilisées
- Fetch API (génération QR)
- Clipboard API (copie d'image/texte)
- File API (téléchargement)

## 📱 Responsive breakpoints

- **Desktop** : 880px et plus (layout en grille)
- **Tablet** : 600px à 879px (colonne unique)
- **Mobile** : moins de 600px (optimisations mobile)

## 🔍 SEO et métadonnées

- **Meta description** : Description optimisée pour les moteurs de recherche
- **Meta keywords** : Mots-clés pertinents
- **Open Graph** : Prêt pour l'intégration des balises OG
- **Schema.org** : Structure sémantique pour les rich snippets

## 🚀 Déploiement

### Hébergement statique
Le projet est entièrement statique et peut être hébergé sur :
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting
- Tout serveur web standard

### CDN et cache
- Les fichiers CSS/JS peuvent être mis en cache agressivement
- Support des en-têtes de cache HTTP
- Compression gzip/brotli recommandée

## 🔒 Sécurité

- **Validation des entrées** : Sanitisation des données utilisateur
- **APIs externes** : Utilisation d'APIs fiables (qrserver.com)
- **CSP ready** : Compatible avec les Content Security Policies
- **HTTPS only** : Fonctionnement optimal en HTTPS

## 📄 Licence

Ce projet est open source et disponible sous licence MIT.

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème :
- **Email** : contact@luminosweb.com
- **Website** : [luminosweb.com](https://luminosweb.com)

## 🔄 Changelog

### Version 1.1.0
- ✅ Réorganisation du code en fichiers séparés
- ✅ Amélioration de l'accessibilité
- ✅ Code JavaScript modulaire avec classes
- ✅ CSS avec variables et meilleure organisation
- ✅ HTML sémantique et conforme aux standards

### Version 1.0.0
- ✅ Version initiale avec toutes les fonctionnalités de base
- ✅ Design violet foncé
- ✅ Génération QR en PNG/SVG
- ✅ Interface responsive