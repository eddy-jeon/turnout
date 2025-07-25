# turnout

## 소개

**turnout**은 터미널 기반(TUI)에서 동적으로 API 프록시 타겟을 변경할 수 있는 프록시 서버 도구입니다. 개발 및 테스트 환경에서 다양한 API 엔드포인트로 빠르게 전환하며 요청을 중계할 수 있습니다.

## 주요 기능
- **동적 프록시 타겟 변경**: 터미널 UI를 통해 프록시 타겟 주소를 실시간으로 변경할 수 있습니다.
- **최근 사용한 주소 관리**: 최근에 사용한 타겟 주소를 최대 5개까지 저장하고, 쉽게 선택할 수 있습니다.
- **간편한 터미널 UI**: enquirer와 chalk를 활용한 직관적인 CLI 인터페이스 제공
- **설정 파일 관리**: `proxy-config.json` 파일로 타겟 및 최근 주소를 관리합니다.

## 사용법
1. 의존성 설치: `pnpm install`
2. 실행: `pnpm start`
3. 터미널 UI에서 타겟 주소를 입력하거나 최근 주소를 선택해 프록시 타겟을 변경할 수 있습니다.
4. 프록시 서버는 기본적으로 `http://localhost:3001`에서 동작하며, 설정된 타겟으로 모든 요청을 중계합니다.

## 파일 구조
- `src/proxy.ts`: 프록시 서버 구동 및 타겟 변경 함수
- `src/config.ts`: 설정 파일 로드/저장 및 최근 주소 관리
- `src/tui.ts`: 터미널 UI 루프
- `src/index.ts`: 진입점, 전체 실행 흐름 관리
- `proxy-config.json`: 타겟 및 최근 주소 저장

## 활용 예시
- 여러 개발/테스트 서버를 오가며 API를 테스트할 때
- 프론트엔드 개발자가 다양한 백엔드 환경에 쉽게 연결하고자 할 때

---
