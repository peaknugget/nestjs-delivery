FROM node:alpine AS development

WORKDIR /usr/src/app

# PNPM 설치
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

# package.json, lock파일, 설정파일 복사
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

# 의존성 설치
RUN pnpm install

# 전체 소스 복사
COPY . .

# 앱 실행
CMD ["pnpm", "run", "start:dev", "user"]
