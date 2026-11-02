# Fluxo de branches e PRs

- `main`: versão estável, sem push direto.
- `develop`: integração da equipe.
- `develop-<nome>`: área de trabalho de cada integrante.
- PR de `develop-<nome>` para `develop`, com pelo menos 1 aprovação.
- PR de `develop` para `main` quando estiver estável.
- Commits curtos, no formato `tipo(escopo): descrição`
  (feat, fix, chore, docs, refactor).
