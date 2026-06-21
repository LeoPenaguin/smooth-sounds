# Faire une release

Le projet utilise [release-please](https://github.com/googleapis/release-please) :
le versioning, le `CHANGELOG.md` et les notes de release sont générés
automatiquement à partir des commits. Le déploiement sur GitHub Pages ne se
fait **que** lors d'une release — plus à chaque push.

## Pourquoi ce flux

- **Des déploiements versionnés** : chaque mise en ligne correspond à une version
  (`vX.Y.Z`) avec ses notes, au lieu de pousser le dernier commit en aveugle.
- **Zéro travail manuel de versioning** : la version et le changelog sont déduits
  des [commits conventionnels](https://www.conventionalcommits.org/).
- **Tu gardes le contrôle** : rien n'est publié tant que tu n'as pas mergé la PR
  de release. C'est ton « bouton publier ».

## Le principe

```
1. Push de commits sur main  ──► release-please ouvre/met à jour une PR de release
                                  (bump de version + CHANGELOG). Pas de déploiement.

2. Tu merges la PR de release ──► tag + GitHub Release créés, puis déploiement
                                  automatique sur GitHub Pages.
```

La PR de release s'accumule : tant que tu ne la merges pas, chaque nouveau
`feat:`/`fix:` poussé sur `main` enrichit la même PR.

## Pas à pas

### 1. Committer avec des messages conventionnels

C'est ce qui pilote la version. Le préfixe détermine le bump :

| Préfixe                         | Effet sur la version | Exemple                          |
| ------------------------------- | -------------------- | -------------------------------- |
| `fix:`                          | patch (`0.0.X`)      | `fix: corrige le mute`           |
| `feat:`                         | minor (`0.X.0`)      | `feat: ajoute un son de pluie`   |
| `feat!:` ou `BREAKING CHANGE:`  | major (`X.0.0`)      | `feat!: refonte de l'API du bus` |
| `chore:`, `docs:`, `refactor:`… | aucun bump           | `docs: complète le README`       |

> Le hook `commit-msg` (commitlint) refuse un message non conforme.

### 2. Pousser sur `main`

```bash
git push origin main
```

Le workflow **Release & Deploy** se lance et ouvre (ou met à jour) une PR
nommée `chore(main): release X.Y.Z`. Le job `deploy` est **skippé** à cette
étape : c'est normal, aucune release n'a encore été créée.

### 3. Publier : merger la PR de release

Quand tu es prêt à sortir une version, **merge la PR de release**. Cela :

1. crée le tag `vX.Y.Z` et la **GitHub Release** avec les notes générées ;
2. déclenche le job `deploy` (`release_created == true`) qui build et publie
   sur GitHub Pages.

C'est la seule action manuelle du cycle.

## Vérifier / dépanner

```bash
gh pr list --label "autorelease: pending"   # la PR de release en cours
gh release list                             # les releases publiées
gh run list --workflow="Release & Deploy"   # l'historique des workflows
```

- **`deploy` toujours skippé après un push** → attendu : il ne tourne qu'au merge
  de la PR de release.
- **Pas de PR de release créée** → vérifier _Settings → Actions → General →
  Workflow permissions_ : « Read and write permissions » + « Allow GitHub Actions
  to create and approve pull requests » doivent être activés.

## Fichiers concernés

- `.github/workflows/release.yml` — workflow release + deploy
- `release-please-config.json` — configuration release-please
- `.release-please-manifest.json` — version actuellement publiée
- `CHANGELOG.md` — généré automatiquement, ne pas éditer à la main
