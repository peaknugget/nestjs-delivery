## NestJS MSA 환경에서 User Service의 Docker Compose 구성 방법

이번 강의에서는 **NestJS 기반 MSA(Microservice Architecture)** 구조에서 `User Service`를 어떻게 Docker 환경에서 구성하고, `docker-compose.yml` 파일에 반영하는지 단계별로 설명합니다.

> 🎯 목표: `User Service`를 다른 서비스와 함께 Docker 컨테이너로 실행할 수 있도록 `docker-compose.yml` 파일에 정의합니다.

---

### ✅ 기본 docker-compose.yml 구성

강의에서 제공된 코드는 기존 gateway 설정 대신 user 서비스 중심으로 Docker를 구성하는 예시입니다. 현재는 `gateway`라는 이름이지만 내부적으로는 `user` 서비스의 설정이 포함되어 있습니다.

```yaml
docker-compose.yml

services:
  user:
    build:
      context: .
      dockerfile: ./apps/user/Dockerfile
      target: development
    command: pnpm run start:dev user
    ports:
      - '3001:3000'
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
```

📌 설명:

- `gateway`로 되어 있지만 실제 동작은 `user` 서비스를 실행하는 형태입니다.
- `dockerfile` 경로와 `command`를 통해 `apps/user` 디렉토리의 개발 환경을 실행합니다.
- 외부 접근을 위해 `3001` 포트를 열고, 내부 컨테이너는 3000 포트를 사용합니다.

---

### 🧩 올바른 user 서비스 분리 예시

보다 명확하게 `user` 서비스를 별도 정의한 예시는 다음과 같습니다:

```yaml
user:
  build:
    context: .
    dockerfile: ./apps/user/Dockerfile
    target: development
  command: pnpm run start:dev user
  ports:
    - "3001:3000"
  volumes:
    - .:/usr/src/app
    - /usr/src/app/node_modules
```

📝 이처럼 `user`라는 이름으로 명시해두면 추후 gateway, auth 등 서비스와 구분이 명확해집니다.

---

### 🐳 user 서비스용 Dockerfile 설명

아래는 `apps/user/Dockerfile` 파일의 예시로, NestJS 프로젝트를 컨테이너로 실행할 수 있도록 구성합니다.

```dockerfile
# 어떤 이미지를 사용할지
FROM node:alpine AS development

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 패키지 관련 파일 복사
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

# pnpm 설치
RUN npm i -g pnpm

# 의존성 설치
RUN pnpm i

# 전체 프로젝트 복사
COPY . .
```

🔍 설명:

- `node:alpine` 이미지를 사용해 가볍고 빠른 빌드 환경 제공
- `WORKDIR`로 컨테이너 내 작업 위치 지정
- 종속성 설치 전 필요한 설정 파일을 먼저 복사하여 **Docker 캐시 최적화**
- 마지막에 전체 프로젝트 복사하여 NestJS 실행에 필요한 파일을 모두 포함

---

### 🛠 전체 docker-compose.yml 예시 (수정본)

> ✅ 참고: `version` 속성은 더 이상 필요하지 않습니다.
> Docker Compose 최신 버전에서는 `version` 항목 없이도 자동 인식됩니다.

```yaml
docker-compose.yml

services:
  gateway:
    build:
      context: .
      dockerfile: ./apps/gateway/Dockerfile
      target: development
    command: pnpm run start:dev gateway
    env_file:
      - ./apps/gateway/.env
    ports:
      - '3000:3000'
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules

  user:
    build:
      context: .
      dockerfile: ./apps/user/Dockerfile
      target: development
    command: pnpm run start:dev user
    ports:
      - '3001:3000'
    env_file:
      - ./apps/user/.env
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
```

---

### 🧪 실행 방법

1. 루트 디렉토리에서 다음 명령어 실행:

```bash
docker-compose up --build
```

2. gateway 접근: [http://localhost:3000](http://localhost:3000)
3. user 서비스 접근: [http://localhost:3001](http://localhost:3001)

---

### 📦 MSA 구조에서 서비스 분리와 통합의 핵심

- 각 서비스는 독립적인 포트, 환경변수 설정, 실행 커맨드를 가짐
- Dockerfile과 디렉토리를 구분하여 유지보수 편리함
- `docker-compose.yml` 한 파일로 전체 서비스 관리 가능

---
