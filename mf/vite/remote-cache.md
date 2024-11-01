## Github Workflow 가이드

### Vercel Remote Cache

```
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "remoteCache": {
    "enabled": true
  }
}

```

root의 turbo.json에 remoteCache enabled를 수행한다.

https://turbo.build/repo/docs/guides/ci-vendors/github-actions

문서 참고

### token

https://vercel.com/account/tokens

토큰을 발급받으세요

### workflow yml

```
name: CI

on:
  push:
    branches: ["main"]
  pull_request:
    types: [opened, synchronize]

jobs:
  build:
    name: Build and Test
    timeout-minutes: 15
    runs-on: ubuntu-latest
    # To use Remote Caching, uncomment the next lines and follow the steps below.
    env:
     TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
     TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
     TURBO_REMOTE_ONLY: true

    steps:
      - name: Check out code
        uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - uses: pnpm/action-setup@v4
        name: Install pnpm
        with:
          run_install: false

      - name: Setup Node.js environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Get pnpm store directory
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - uses: actions/cache@v4
        name: Setup pnpm cache
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        if: steps.cache.outputs.cache-hit == false
        run: pnpm install

      - name: Build
        run: pnpm run build


```

TURBO_TEAM : https://vercel.com/{TURBO_TEAM} vercel 대시보드의 첫번째 파라미터가 팀입니다.

TURBO_TOKEN : https://vercel.com/account/tokens

여기서 발급받아오세요

### 환경변수

[나의 프로젝트 레포지토리]/settings/security/secretsandvariables/actions/screts

variables에 등록하면 secrets.로 접근하는게아니라 vars.로 접근해야됨!! 주의

## 로컬 가이드

https://turbo.build/repo/docs/core-concepts/remote-caching

```
// 로컬에서 가이드입니다.
// 터보에 로그인하기
turbo login

turbo link
```
