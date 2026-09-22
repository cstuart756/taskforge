# Contributing to TaskForge

This repository is currently closed to external contributions while the
project is in active development.

## For the project owner (Stuart)

### Development workflow

1. Start from an up-to-date main branch:

git switch main
git pull origin main
text


2. Create a feature branch:

git switch -c feature/your-feature-name
text


3. Make focused changes.

4. Run local checks (once the project has scripts):

npm run lint
npx tsc --noEmit
npm test
text


5. Commit with a descriptive message (see conventions below).

6. Push the branch:

git push -u origin feature/your-feature-name
text


7. Open a pull request on GitHub.

8. After merge, delete the branch:

git switch main
git pull origin main
git branch -d feature/your-feature-name
text


### Commit message conventions

| Prefix | Use |
|--------|-----|
| `feat:` | New functionality |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `test:` | Tests |
| `refactor:` | Code restructuring without behaviour change |
| `chore:` | Maintenance, dependency updates, tooling |

Examples:

- `feat: add task creation form`
- `fix: correct login validation error message`
- `docs: update README with deployment steps`

### Branch naming

- `feature/` — new features
- `fix/` — bug fixes
- `docs/` — documentation only
- `chore/` — maintenance

### Code style

- TypeScript with strict mode enabled
- ESLint and Prettier enforced
- Meaningful variable and function names
- Small, focused commits

### Definition of Done

A task is not finished when the code is written. It is finished when:

- Acceptance criteria are met.
- Code is reviewed (or self-reviewed for solo work).
- Relevant tests pass.
- No known critical errors are introduced.
- Accessibility and responsive behaviour are checked.
- Documentation is updated if needed.
- Changes are merged into the target branch.