# 프로젝트 컨벤션

이 문서는 코드 작성 시 지켜야 할 규약과 의사결정 패턴을 정리한다.
**작업 전에 먼저 읽고, 새 코드는 이 컨벤션을 따른다.**

## 스택

- Vue 3 (`<script setup lang="ts">`)
- Vite + TypeScript
- Pinia (스토어)
- Vue Router (history 모드)
- Tailwind CSS v4 (`@tailwindcss/vite`)
- FSD (Feature-Sliced Design) 아키텍처

## 폴더 구조

```
src/
├── app/                            # 앱 셸 (App 생명주기 동안 유지되는 것들)
│   ├── App.vue                     # <RouterView /> + <ModalHost />
│   ├── main.ts                     # 진입점
│   ├── providers/                  # registerProviders(app)
│   ├── router/
│   │   ├── index.ts                # createRouter + 자식 route 조합
│   │   └── router-name.ts          # ROUTE_NAME 상수
│   ├── layouts/                    # DefaultLayout, GameLayout 등
│   └── styles/main.css             # Tailwind import + @theme 토큰
│
├── pages/<name>/                   # 라우트 페이지
│   ├── index.ts                    # export const xxxRoute: RouteRecordRaw
│   └── ui/<Name>Page.vue           # 페이지 컴포넌트
│
├── widgets/<name>/                 # 독립 UI 블록 (header, hero, notice-list, ...)
│
├── features/<name>/                # 유저 액션 (create-room, auth-by-nickname, ...)
│   ├── index.ts                    # barrel
│   └── ui/<Feature>.vue
│
├── entities/<name>/                # 도메인 (user, room, ...)
│   ├── model/                      # 타입/상태
│   └── ui/                         # 도메인 컴포넌트 (Card 등)
│
├── games/<game>/                   # ⭐ 게임별 독립 모듈
│   ├── index.ts                    # 게임 route export (RouteRecordRaw)
│   ├── ui/                         # 게임 전용 UI (Header, Canvas, Chat, ...)
│   ├── model/                      # 게임 전용 상태/모킹 데이터
│   └── composables/                # 게임 전용 훅
│
└── shared/                         # 비즈니스 로직 없는 공통
    ├── ui/                         # 범용 컴포넌트 (BaseButton, BaseBadge, ...)
    ├── ui-modal/                   # 모달 시스템 (BaseModal, ConfirmDialog, ...)
    ├── stores/                     # *.store.ts (Pinia)
    ├── composables/                # useTheme 등
    ├── lib/                        # 순수 유틸/타입/목 데이터
    └── api/                        # API 클라이언트 (추후)
```

## 라우팅 규약

- 페이지마다 자기 route를 export: `pages/<name>/index.ts`에 `export const xxxRoute: RouteRecordRaw`
- 라우트 이름은 `ROUTE_NAME.XXX` 상수 사용, 문자열 직접 쓰지 말 것
- **레이아웃은 부모 route가 렌더한다** — 페이지 컴포넌트는 `<DefaultLayout>` 같이 감싸지 않음
  ```ts
  { path: '/', component: DefaultLayout, children: [landingRoute, ...] }
  ```
- 부모 path가 다른 두 라우트(예: DefaultLayout 자식 `/games/:gameId` + GameLayout 자식 `/games/:gameId/:roomId`)는 specificity로 자연스럽게 매칭됨
- 게임은 게임별 route를 가짐 — `games/<game>/index.ts`에 export. 디스패처 패턴 금지 (lazy load 손해)
- 라우트 name 값을 식별자(gameId 등)와 일치시키는 컨벤션 유지 → `{ name: room.gameId, params }`로 직접 사용 가능
- 네비게이션은 `<RouterLink>` 우선, 이동이 아니면 `<button>` + `router.push()` 사용. `<div @click>`로 SPA 네비게이션 금지 (a11y/우클릭 새 탭 손실)
- "나가기"류 액션은 history pollution 피하려면 `router.back()` (with `window.history.state?.back` fallback)

## Vue SFC 배럴

SFC는 default export만 있으므로 `export *`로 노출 불가. **항상 named로 재노출:**

```ts
// ❌
export * from './CtaSection.vue'

// ✅
export { default as CtaSection } from './CtaSection.vue'
```

## 디자인 토큰 / 테마

- 색은 항상 토큰 사용: `text-text-primary`, `bg-bg-card`, `border-border`, `text-brand`, `text-on-brand`, `text-warning`
- `text-white`, `text-black` 등 하드코딩 금지 (다크/라이트 모드 깨짐)
- 토큰은 [app/styles/main.css](src/app/styles/main.css)의 `@theme`에 light 기본, `.dark` 셀렉터에서 override
- 다크 모드 전환: [shared/composables/useTheme.ts](src/shared/composables/useTheme.ts) (`light` | `dark` | `system`, localStorage 영속, FOUC 방지 위해 createApp 전에 한 번 호출)
- 커스텀 variant: `@custom-variant dark (&:where(.dark, .dark *))` — `dark:` 유틸리티도 사용 가능

## Tailwind v4 표기

- important: `class!` (뒤에 붙임). `!class` (앞) 아님
- 임의 값: `z-100` 우선, `z-[100]`은 fallback
- 토큰 색은 자동으로 Tailwind 유틸로 변환됨 (`--color-bg-card` → `bg-bg-card`)

## 모달 시스템

- **단일 진실원**: `useModalStore`([shared/stores/modal.store.ts](src/shared/stores/modal.store.ts))
- **호스트 위치**: `<BaseModal />`를 [app/App.vue](src/app/App.vue)에 한 번만 마운트 (Layout이 아니라 App에 두는 이유: 라우트/레이아웃 전환과 무관하게 살아있어야 함)
- **사용법**: Promise 기반
  ```ts
  const ok = await modal.open<boolean>(
    MyModal,
    { someProps },
    {
      transition: 'up' | 'down' | 'left' | 'right' | 'fade',
      closeOnBackdrop: true,
      closeOnEsc: true,
    },
  )
  ```
- **모달 컨텐츠 작성**:
  ```vue
  <script setup lang="ts">
  const props = defineProps<{ modalId: number; ... }>()
  const modal = useModalStore()
  // 닫기: modal.close(props.modalId, result)
  </script>
  ```
- 스택, ESC, 백드롭 클릭, body 스크롤락, 포커스 복원, inert 백그라운드는 스토어/호스트가 자동 처리

## 컴포넌트/추상화 원칙

- **사용처 2곳 이상일 때만 추상화**. 1곳이면 인라인이 더 낫다 (예: 한 줄 wrapper composable 만들지 말 것)
- 기존 파일을 수정하는 것을 새 파일 생성보다 우선
- 주석은 **WHY가 비자명할 때만**. WHAT은 잘 지은 이름으로 표현
- 에러 핸들링/검증은 시스템 경계(유저 입력, 외부 API)에서만. 내부 함수 호출에 방어 로직 넣지 말 것
- 사용 안 하는 export, 옛 import alias, "// removed XX" 같은 잔재 코드 남기지 말고 삭제

## 톤 / 응답 규약

- 응답은 한국어, 짧게
- 결정과 결과만 알리고 사고 과정은 생략
- 코드 변경 후 마지막에 "변경 요약" 1~3줄 + 확인 방법
- 시각적 검증이 필요한 UI 변경은 `npm run dev`로 띄워서 HTTP 200 확인까지 (실제 렌더는 사용자가 봄)

## Docker

`docker compose --profile dev up` (개발, HMR) / `--profile prod up --build` (프로덕션, nginx). nginx는 SPA history 모드 + asset 캐싱 설정([docker/nginx.conf](docker/nginx.conf)).

## 새 기능 추가 체크리스트

**새 페이지 추가 시:**

1. `pages/<name>/index.ts` — route 정의
2. `pages/<name>/ui/<Name>Page.vue` — 컴포넌트 (레이아웃 감싸지 않음)
3. `ROUTE_NAME.XXX` 추가
4. `app/router/index.ts`의 적절한 부모 children에 push

**새 게임 추가 시:**

1. `games/<game>/index.ts` — route export (lazy import)
2. `games/<game>/ui/<Game>.vue` 등 게임 UI
3. `games/<game>/model/`에 mock/state
4. `ROUTE_NAME.<GAME>: '<game-id>'` (값 = gameId와 일치)
5. `shared/lib/games.ts`에 게임 메타 추가
6. router의 GameLayout children에 route push

**새 모달 추가 시:**

1. 적절한 슬라이스(features/entities/shared)에 `*.vue` 작성, `modalId` prop 선언
2. 결과 반환 시 `modal.close(props.modalId, value)` 호출
3. 부모에서 `await modal.open<T>(Component, props, options)`로 사용
