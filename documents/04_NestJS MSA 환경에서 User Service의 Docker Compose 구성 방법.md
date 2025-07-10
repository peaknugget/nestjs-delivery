## NestJS MSA 환경에서 User Service의 Docker Compose 구성 방법

이번 강의에서는 **NestJS 기반 MSA(Microservice Architecture)** 구조에서 `User Service`를 어떻게 PostgreSQL과 함께 Docker 환경에서 실행하는지 설명합니다. Dockerfile과 `docker-compose.yml` 구성, 그리고 주의할 점들을 실습 중심으로 살펴봅니다.

> 🎯 목표: NestJS 기반 `user` 서비스와 PostgreSQL DB를 Docker Compose로 연결하고 실행하기

---

### ✅ Dockerfile 구성 (user 서비스 전용)

```Dockerfile
FROM node:18-alpine AS development

WORKDIR /usr/src/app

# PNPM 설치
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

# package, lock, 설정 파일 복사
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
```

🔍 핵심 설명:

- `corepack`을 사용하여 `pnpm` 설치
- 의존성 설치 최적화를 위해 설정파일 먼저 복사
- 마지막에 전체 소스를 복사한 뒤 실행 커맨드 지정

---

### 🐘 PostgreSQL과 연결된 docker-compose.yml 구성

```yaml
services:
  user:
    build:
      context: .
      dockerfile: ./apps/user/Dockerfile
      target: development
    command: pnpm run start:dev user
    depends_on:
      postgres_user:
        condition: service_healthy
    ports:
      - '3001:3000'
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules

  postgres_user:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    ports:
      - '6001:5432'
    volumes:
      - ./postgres/user:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 10
      start_period: 5s
```

📌 구성 포인트:

- `user` 서비스는 PostgreSQL이 정상 구동된 후에 실행되도록 `depends_on` + `healthcheck` 설정
- DB 볼륨은 `./postgres/user`로 지정하여 로컬에도 데이터가 저장됨
- DB 포트는 5432 → 6001로 매핑

---

### 🧾 .dockerignore 파일 설정

> 빌드 오류 예방 및 속도 개선을 위해 반드시 설정 필요!

```dockerignore
node_modules
dist
.git
.gitignore
Dockerfile
docker-compose.yml
*.log
*.env
```

✅ 이유:

- `node_modules`는 pnpm 특성상 내부에 하드링크, symlink가 많아 Docker build 시 오류 유발
- `.dockerignore`에 이들을 포함시키면 빌드 컨텍스트가 깨끗하게 정리됨

> 오류 예시: `failed to checksum file node_modules/.pnpm/...: archive/tar: unknown file mode ?rwxr-xr-x`

---

### 🛠 실행 명령어

```bash
docker compose build --no-cache
docker compose up
```

> `--no-cache`를 통해 빌드 캐시 없이 깨끗하게 재빌드합니다.

---

### 📌 실행 후 확인

- `user` 서비스: [http://localhost:3001](http://localhost:3001)
- `postgres_user`: 내부 포트 5432, 외부 포트 6001로 열림 (DB Tool로 확인 가능)

---

### ✅ 요약 정리

- `Dockerfile`은 설정/의존성 복사를 분리하여 캐시 최적화
- `docker-compose.yml`에 DB와 서비스를 함께 정의하고 healthcheck로 실행 순서 제어
- `.dockerignore` 설정은 반드시 필요하며, 특히 pnpm 사용 시 중요
- `volume`을 통해 node\_modules는 컨테이너 외부와 연동하여 관리

---
