## NestJS 배달 프로젝트 - User App 생성하기

이번 강의에서는 NestJS 기반의 배달 서비스 프로젝트에서 `User App`을 생성하고, 앱의 구조를 이해한 뒤 실행 테스트까지 진행합니다. 이 프로젝트는 **Monorepo 구조**로 구성되어 있으며, 여러 앱을 하나의 저장소에서 효율적으로 관리할 수 있습니다.

---

### 1. User App 생성

```bash
npx nest g app user
```

- NestJS CLI를 사용해 새로운 앱을 생성합니다.
- 위 명령어 실행 시 `apps/user` 디렉터리가 생성되며, `user` 앱이 그 하위에 포함됩니다.
- `apps` 폴더 하위에 여러 앱을 만들 수 있으며, 각각 독립적으로 실행 및 관리가 가능합니다.

> 💡 `user`는 사용자 관련 API를 담당하는 앱입니다.

---

### 2. User App 실행

```bash
pnpm run start:dev user
```

- 개발 모드로 `user` 앱을 실행합니다.
- 이때 진입점 파일은 `apps/user/src/main.ts`입니다.
- 기본적으로 서버가 열리고, "/" 경로에 접속하면 "Hello World!" 메시지를 반환하는 API가 동작합니다.

> ❗️ `pnpm` 대신 `npm` 또는 `yarn`을 사용하는 경우 해당 명령어에 맞게 실행하세요.

---

### 3. User App 기본 구조

`user` 앱 생성 시 아래와 같은 구조가 자동으로 생성됩니다:

```
apps/
└── user/
    └── src/
        ├── main.ts            # 앱 진입 파일
        ├── app.controller.ts  # 기본 컨트롤러
        ├── app.service.ts     # 기본 서비스
        └── app.module.ts      # 루트 모듈
```

- `main.ts`: Nest 앱을 초기화하고 서버를 시작하는 파일입니다.
- `app.controller.ts`: 기본 라우트(`/`)를 처리하며, "Hello World!" 메시지를 응답합니다.
- `app.service.ts`: 컨트롤러에서 사용하는 기본 서비스 로직이 포함됩니다.
- `app.module.ts`: 컨트롤러와 서비스를 등록하는 루트 모듈입니다.

---

### 4. 앱 간 독립성 이해

- `apps/user`는 기존의 `apps/delivery`와 별도로 작동합니다.
- 각각 독립적인 서버로 실행되며, 기능 분리와 유지보수에 유리합니다.
- 예: `user`는 사용자 인증/정보 관련, `delivery`는 배달 관련 기능을 담당합니다.

---

### 5. 포트 변경 (선택사항)

- 기본적으로 앱은 3000번 포트에서 실행됩니다.
- 중복 실행 방지를 위해 포트를 변경할 수 있습니다.
- `apps/user/src/main.ts`에서 아래와 같이 수정하세요:

```ts
await app.listen(3001); // 예: 3001번 포트로 변경
```

- 이후 브라우저에서 `http://localhost:3001`에 접속하면 됩니다.

---

### 6. 실행 확인

```bash
pnpm run start:dev user
```

- 명령어 실행 후 브라우저에서 `http://localhost:3001`로 접속합니다.
- "Hello World!" 메시지가 보이면 정상적으로 실행된 것입니다.
- 이후 사용자 데이터를 처리하는 실제 API들을 이곳에 추가해 나갈 예정입니다.

---

### ✅ 요약

- `npx nest g app user` 명령으로 새로운 앱을 생성합니다.
- `pnpm run start:dev user`로 개발 서버를 실행합니다.
- 앱 구조와 역할을 이해합니다.
- 포트를 변경해 충돌 없이 앱을 실행할 수 있습니다.

---

#

---

> 📌 참고:
>
> - NestJS는 모듈 단위로 구성되어 있어 유지보수 및 확장이 쉽습니다.
> - CLI 명령어 실행 시 `npx`, `pnpm exec`, 또는 `nest`를 활용하세요.
> - Monorepo 구조는 여러 앱을 하나의 프로젝트에서 효율적으로 관리할 수 있도록 도와줍니다.

