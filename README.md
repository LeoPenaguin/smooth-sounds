# smooth-sounds

![Version](https://img.shields.io/github/package-json/v/LeoPenaguin/smooth-sounds)

Mixer de sons d'ambiance : superpose pluie, feu, forêt… règle le volume de
chaque son et celui de l'ensemble, avec un minuteur de mise en veille.

**Démo en ligne : [leopenaguin.github.io/smooth-sounds](https://leopenaguin.github.io/smooth-sounds/)**

## Stack

- [Vue 3](https://vuejs.org/) (`<script setup>` + TypeScript)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [pnpm](https://pnpm.io/)

## Développement

```bash
pnpm install     # installer les dépendances
pnpm dev         # serveur de dev avec hot-reload
pnpm build       # build de production (type-check + bundle)
pnpm preview     # prévisualiser le build
```

Qualité de code :

```bash
pnpm lint        # ESLint avec correction automatique
pnpm format      # Prettier
pnpm check       # ESLint + Prettier en lecture seule (lancé au pre-commit)
```

Les commits suivent la convention [Conventional Commits](https://www.conventionalcommits.org/)
(vérifiée par commitlint au moment du commit).

## Release & déploiement

Le déploiement sur GitHub Pages est piloté par [release-please](https://github.com/googleapis/release-please) :
versioning et changelog automatiques, déploiement à chaque release.
Voir [docs/releasing.md](docs/releasing.md) pour la marche à suivre.
