## 실행

```bash

docker compose down

docker compose up  --build



```

### -no-cache: Dockerfile 빌드시 중간 이미지 캐시 없이 무조건 새로 빌드합니다.

```
docker compose up --build --no-cache

```

##### ✅ 1. 신버전 (v2 이상) 사용 중일 경우

```bash
docker compose build --no-cache
docker compose up

##
docker compose up --build --no-cache  ✅ (v2 이상에서 정상 작동)
```

##### ✅ 2. 구버전 (v1) docker-compose 사용해야 함

```bash
docker-compose build --no-cache
docker-compose up
```

## .env 환경변수 예

```bash
COMPOSE_PROJECT_NAME=nestjs-delivery

PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/mydb
JWT_SECRET=your-secret-key
```

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest 로고" /></a>
</p>

<p align="center">효율적이고 확장 가능한 서버 사이드 앱토치를 구축하기 위한 진보적인 <a href="http://nodejs.org" target="_blank">Node.js</a> 프레임워크</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM 버전" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="라이센스" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="다운로드 수" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI 상태" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="디스코드 채널" /></a>
</p>

---

## 프로젝트 소개

이 프로젝트는 **NestJS와 NextJS**를 활용해 개발한 **배달 웹앱 애플리케이션** 프로젝트입니다.
NestJS는 백엔드 API 서버 구축을 위해, NextJS는 프러티언드 UI 구현에 사용됩니다.

본 저장소는 Nest 프레임워크 기반의 TypeScript 스타터 프로젝트로 구성되어 있으며,
효율적인 구조와 테스팅 환경, 배포 설정과 같은 내용이 포함되어 있습니다.

---

## 프로젝트 설정

```bash
$ pnpm install
```

## 앱을 실행하기

```bash
# 개발 환경 실행
$ pnpm run start

# 실시간 변경 감지 모드
$ pnpm run start:dev

# 프로드 환경 실행
$ pnpm run start:prod
```

---

## 테스트 실행

```bash
# 유니트 테스트
$ pnpm run test

# e2e 테스트
$ pnpm run test:e2e

# 커버리지 리포트
$ pnpm run test:cov
```

---

## 배포

NestJS 앱을 프로드션 환경에 배포하려면 최적화를 위한 몇 가지 단계가 필요합니다.
자세한 내용은 [배포 가이드](https://docs.nestjs.com/deployment)를 참고하세요.

또한 AWS를 기본으로 한 NestJS 공식 배포 플랫폼 [NestJS Mau](https://mau.nestjs.com)를 통해 쉽게 배포할 수 있습니다.

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

---

## 참고 자료

- [NestJS 공식 문서](https://docs.nestjs.com)
- [NestJS 디스코드 채널](https://discord.gg/G7Qnnhy)
- [NestJS 공식 강의](https://courses.nestjs.com)
- [NestJS Devtools](https://devtools.nestjs.com)
- [NestJS 기억 기억 기억](https://enterprise.nestjs.com)
- [NestJS 공식 채용 게시판](https://jobs.nestjs.com)
- [NestJS X (Twitter)](https://x.com/nestframework) | [LinkedIn](https://linkedin.com/company/nestjs)

---
