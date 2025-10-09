# Nuxt Template

[中文說明](./docs/README_cn.md) | [English Document](./README.md)

## Development Rules

- **Branch Protection**
  - `main` and `dev` are protected branches.
  - For all features, bugfixes, or chores, please create a new branch from the most stable upstream branch. If the change is for a specific branch, merge it back to that branch; otherwise, always prefer merging back to `dev` regardless of the upstream.

- **Workflow**
  1. Develop and commit your changes locally (see commit rules below).
  2. Open a PR to merge into `dev`.
  3. After passing code review and CI, merge into `dev`.
  4. After full testing and review, merge `dev` into `main` for release.

- **Commit Message Convention**: Please follow, as much as possible, the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard.

## Tech Stack

- Framework: Nuxt 4 (Vue 3, Vite, Nitro2)
- Language: TypeScript
- Styling: UnoCSS
- Linting: ESLint + Prettier
- Container: Docker (Node ^20.19)
- Package Manager: yarn || bun
- CI/CD: GitHub Actions | Gitlab CI

---

## Build & Development

### Start the Service

#### Development

First, install dependencies:

```bash
# yarn
yarn install

cp .env.development.example .env.development
yarn dev # for development

cp .env.production.example .env.production
yarn build # for production
```

Open [localhost:3000](http://localhost:3000) to view the app.

#### Production

```bash
cp .env.production.example .env.production
yarn build # for production

# set environment variable directly
PORT=<PORT> node .output/server/index.mjs
# or use start (need set PORT in .env.production)
yarn start
# or use script
./directly-run.sh
# or use docker
./docker-run.sh
```

---

Reference Nuxt 4 official docs: [Nuxt Documentation](https://nuxt.com/docs)
