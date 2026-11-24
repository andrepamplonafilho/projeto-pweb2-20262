# Cursos e Aulas — Frontend

Interface web do projeto Cursos e Aulas (PWEB2), feita com React, TypeScript e Vite.

## Tecnologias

- React 19 e TypeScript
- Vite
- Redux Toolkit e react-redux (estado global)
- React Router (rotas)
- Storybook (documentação e teste visual dos componentes)
- ESLint e Prettier

## Como rodar

```bash
cd frontend
npm install
npm run dev
```

O Vite mostra no terminal o endereço local (normalmente `http://localhost:5173`).

## Scripts

| Comando                   | O que faz                                        |
| ------------------------- | ------------------------------------------------ |
| `npm run dev`             | Servidor de desenvolvimento com HMR              |
| `npm run build`           | Checagem de tipos (`tsc -b`) e build de produção |
| `npm run preview`         | Serve o build de produção localmente             |
| `npm run lint`            | Roda o ESLint                                    |
| `npm run format`          | Formata `src` com o Prettier                     |
| `npm run format:check`    | Verifica a formatação sem alterar arquivos       |
| `npm run storybook`       | Abre o Storybook em `http://localhost:6006`      |
| `npm run build-storybook` | Gera a versão estática do Storybook              |

Antes de cada commit, rode `npm run build` e `npm run lint`.

## Storybook

```bash
npm run storybook
```

Os componentes de `src/components/ui` têm stories ao lado do código (`*.stories.tsx`). A configuração fica em `.storybook/` (`main.ts` e `preview.tsx`).

## Estrutura de pastas

```
src/
├── app/          # store, hooks tipados, rotas e RotaProtegida
├── assets/       # imagens e arquivos estáticos
├── components/
│   ├── layout/   # Header e estrutura de página
│   └── ui/       # componentes reutilizáveis (Button, Badge, Avatar, ...)
├── features/     # uma pasta por funcionalidade
│   ├── anuncios/ # detalhe e formulário de anúncios
│   ├── auth/     # login, sessão e authSlice
│   ├── busca/    # busca e filtros (/vendas, /doacoes)
│   └── perfil/   # perfil próprio, perfil de outros usuários e edição
├── shared/
│   ├── api/      # cliente HTTP e tipos da API
│   ├── components/
│   ├── hooks/
│   └── rotulos.ts  # rótulos de nível e estado de anúncio
├── styles/       # estilos globais
└── main.tsx      # ponto de entrada
```

## Convenções

- Rótulos exibidos ao usuário (nível, estado) vêm de `src/shared/rotulos.ts`, para não divergir entre telas.
