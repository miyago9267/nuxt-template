# Nuxt Template

[中文說明](./README_cn.md) | [English Document](../README.md)

## 開發規範

- **分支保護**
  - `main` 與 `dev` 為保護分支。
  - 所有功能、修復、雜項修改，請從**穩定之最上游**新建分支，若針對特定分支之修正請合回原處，否則無論上游為何皆以合回`dev`為優先。

- **開發流程**
  1. 在本地開發並提交（commit）變更（請見下方 commit 規則）。
  2. 發起 PR 合併至 `dev`。
  3. 通過 Code Review 與 CI 後合併進 `dev`。
  4. 經過完整測試與審核後，將 `dev` 合併至 `main` 發佈。

- **Commit 訊息規範**：請盡量遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hant/v1.0.0/) 標準

## Tech Stack

- 應用框架：Nuxt 4 (Vue 3, Vite, Nitro2)
- 語言：TypeScript
- 樣式：UnoCSS
- 規範：ESLint + Prettier
- 容器：Docker (Node ^20.19)
- 套件管理器： yarn || bun
- 自動化：GitHub Actions | Gitlab CI

---

## Build & Development

### 啟動服務

#### 測試環境

請先安裝依賴

```bash
# yarn
yarn install

cp .env.development.example .env.development
yarn dev # for development
```

開啟[localhost:3000](http://localhost:3000)來查看

#### 生產環境

```bash
cp .env.production.example .env.production
yarn build # for production

# set environment variable directly
PORT=<PORT> node .output/server/index.mjs
# or use script
./directly-run.sh
# or use docker
./docker-run.sh
```

---

參考 Nuxt 4 官方文件：[Nuxt Documentation](https://nuxt.com/docs)
