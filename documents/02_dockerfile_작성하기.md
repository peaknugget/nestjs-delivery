## NestJS 배달 프로젝트 - Dockerfile 작성하기 (최종 정리)

이번 강의에서는 NestJS 기반 배달 프로젝트에서 `User App`을 Docker 이미지로 만들기 위한 `Dockerfile`을 작성합니다. 개발 환경과 운영 환경을 분리하여, 안정적이고 일관된 배포 환경을 구성하는 것이 목표입니다.


##### ✅ Dockerfile
```dockerfile
# 어떤 이미지를 사용할지
FROM node:alpine AS development

WORKDIR /usr/src/app

# package.json 복사해오기
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

# PNPM 설치하기
RUN npm i -g pnpm

# Dependency 설치하기
RUN pnpm i


# 소스파일 복사하기
COPY . .

```



---

### 1. 멀티 스테이지 빌드 개요

이 Dockerfile은 **멀티 스테이지 빌드(Multi-stage build)** 방식으로 작성되어 있습니다.

- **개발 스테이지**: NestJS 앱을 빌드하고 필요한 결과물을 생성합니다.
- **운영 스테이지**: 빌드된 결과물만을 사용하여 가볍고 효율적인 운영용 이미지를 생성합니다.

> ✅ 멀티 스테이지 빌드는 이미지 크기 감소, 보안 강화, 배포 효율 향상에 효과적입니다.

---

### 2. 개발 스테이지 설정

```dockerfile
FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm i -g pnpm \
    && pnpm install

COPY apps/user apps/user
COPY libs libs

RUN pnpm build user

CMD ["pnpm", "start:dev", "user"]
```

#### 🔍 설명

- `node:alpine`: 가볍고 빠른 Node.js 이미지 사용
- `WORKDIR`: 작업 디렉토리 설정
- 설정 및 패키지 파일 복사 후 `pnpm`으로 의존성 설치
- 앱 소스 코드(`apps/user`, `libs`) 복사 후 빌드 실행
- 개발 모드로 앱 실행 (`start:dev`)

---

### 3. 운영 스테이지 설정

```dockerfile
FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm \
    && pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist
COPY proto proto

CMD ["node", "dist/apps/user/main"]
```

#### 🔍 설명

- `NODE_ENV` 환경 변수를 설정하여 운영 모드 지정
- 의존성은 production 전용만 설치하여 용량 절감
- 개발 스테이지에서 빌드된 `dist` 디렉토리만 복사
- gRPC 혹은 기타 인터페이스 정의가 들어있는 `proto` 폴더 포함
- `node` 명령어로 실행 파일 직접 구동

---

### 4. 실무 적용 팁

- `.dockerignore` 파일을 설정해 `node_modules`, `src`, `.git` 등 불필요한 파일 제외
- NestJS는 기본적으로 빌드 결과를 `dist/`에 생성하므로 이 경로 기준으로 복사해야 함
- 현재 Dockerfile은 `apps/user` 기준으로 작성됨. 다른 앱을 도커라이징할 경우 동일한 패턴으로 적용 가능

---

### ✅ 요약

| 단계     | 설명                                                |
| ------ | ------------------------------------------------- |
| 개발 빌드  | 의존성 설치 및 `apps/user` 앱 빌드 수행                      |
| 운영 이미지 | 빌드 결과물만 복사하여 최소 환경 구성                             |
| 명령어    | `pnpm start:dev user`, `node dist/apps/user/main` |


---

> 📘 참고:
>
> - `pnpm`은 빠른 설치 속도와 모노레포 지원에 강점을 가진 패키지 매니저입니다.
> - NestJS + Docker 환경은 팀 개발과 배포 자동화에 매우 유리한 조합입니다.

