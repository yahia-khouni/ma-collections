# M&A Collections - Documentation du Projet

Ce dossier contient la documentation complète du projet e-commerce M&A Collections.

## 📁 Structure des Documents

```
docs/
├── specification.tex          # Cahier de charge fonctionnel
├── conception-uml.tex         # Document de conception avec UML
├── pvt-testing-report.tex     # Rapport de tests PVT
├── diagrams/                  # Diagrammes PlantUML
│   ├── usecase-global.puml
│   ├── usecase-cart.puml
│   ├── usecase-checkout.puml
│   ├── class-main.puml
│   ├── class-cart.puml
│   ├── sequence-add-to-cart.puml
│   └── sequence-checkout.puml
└── README.md
```

## 📝 Documents LaTeX

### 1. Cahier de Charge Fonctionnel (`specification.tex`)
- Introduction et contexte du projet
- Description fonctionnelle détaillée
- Exigences non fonctionnelles
- Architecture technique
- Charte graphique
- Planning prévisionnel

### 2. Conception UML (`conception-uml.tex`)
- Diagrammes de cas d'utilisation
- Diagrammes de classes
- Diagrammes de séquence
- Code PlantUML intégré

### 3. Rapport de Tests PVT (`pvt-testing-report.tex`)
- 45 scénarios de test documentés
- Tests par module (Catalogue, Panier, Auth, Checkout, UI)
- Bugs et anomalies identifiés
- Résumé et recommandations

## 🔧 Compilation des Documents LaTeX

### Prérequis
- Distribution LaTeX (TeX Live, MiKTeX, ou MacTeX)
- Packages requis: `babel`, `geometry`, `hyperref`, `booktabs`, `longtable`, `xcolor`, `fancyhdr`

### Commandes de compilation

```bash
# Compiler le cahier de charge
pdflatex specification.tex

# Compiler le document de conception
pdflatex conception-uml.tex

# Compiler le rapport de tests
pdflatex pvt-testing-report.tex
```

### Compilation en ligne
Vous pouvez aussi utiliser [Overleaf](https://www.overleaf.com) pour compiler les documents LaTeX en ligne.

## 📊 Génération des Diagrammes PlantUML

### Option 1: En ligne
1. Aller sur https://www.plantuml.com/plantuml
2. Coller le contenu d'un fichier `.puml`
3. Télécharger l'image (PNG/SVG)

### Option 2: Ligne de commande
```bash
# Installation
npm install -g node-plantuml

# Génération
puml generate diagrams/usecase-global.puml -o output/
```

### Option 3: VS Code
Installer l'extension "PlantUML" pour visualiser directement dans l'éditeur.

## 📋 Résumé du Projet

| Aspect | Détail |
|--------|--------|
| **Nom** | M&A Collections |
| **Type** | E-commerce Mode Premium |
| **Région** | Tunisie (TND) |
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS |
| **Backend** | Medusa.js v2.12.2 |
| **Base de données** | PostgreSQL |
| **Tests réussis** | 95.5% (43/45) |

## 🎨 Identité Visuelle

- **Couleur principale**: Or (#D4AF37)
- **Couleur secondaire**: Gris foncé (#111827)
- **Typographie titres**: Playfair Display
- **Typographie corps**: Inter

---

*Documentation générée le 15 Décembre 2025*
