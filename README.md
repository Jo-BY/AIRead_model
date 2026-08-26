# AIRead - 학생 문해력 평가 서비스

AIRead는 학생의 독서 감상문을 바탕으로 문해력을 평가하고, 학생/교사용 화면에서 결과를 조회할 수 있는 WEB-WAS-DB 구조의 서비스입니다.

## 프로젝트 구조
- `WEB/`: 로그인 화면, 학생/교사 화면, 스타일, 프론트엔드 로직
- `WAS/`: Express 기반 서버와 API
- `DB/`: SQLite 데이터베이스 초기화 및 저장 로직
- `render.yaml`: Render 배포 설정

## 주요 기능
- 학생 로그인 및 독서 기록 제출
- LLM이 문해력 루브릭에 따라 평가/진단/추천을 생성 (LLM 미가동 시 규칙 기반 evaluator.js로 자동 폴백)
- `LLM_MODEL` 환경 변수로 사용할 모델을 선택 가능 (`qwen2.5-7b`: vLLM, `gemma3-12b`: Ollama)
- 학생 대시보드, 타임라인, AI 진단/추천 화면 제공
- 교사용 대시보드에서 학생 목록 및 상세 결과 조회
- 평가 결과(근거 인용, 신뢰도, 모델/프롬프트 버전 포함)를 SQLite DB에 저장

## 실행 방법
1. Node.js 22 LTS 사용
   - `better-sqlite3` 네이티브 모듈 호환성을 위해 Node.js 22 LTS를 사용합니다.
   - NVM for Windows를 사용하는 경우:
     ```powershell
     nvm install 22.23.2
     nvm use 22.23.2
     ```
   - `node --version`이 `v22.x`인지 확인하세요.
2. 의존성 설치
   ```bash
   npm install
   ```
   - `.env.example`을 `.env`로 복사해 값을 조정하세요. 서버 시작 시 `dotenv`가 이 파일을 자동으로 읽습니다.
3. 레퍼런스 데이터 시드 (최초 1회, 루브릭/성취기준/추천 교과서·도서)
   ```bash
   npm run seed:reference
   ```
4. (선택) LLM 서버 구동 - LLM 기반 평가/진단을 사용하려면 필요. 아래 중 하나를 선택하세요.
   - **vLLM** (기본 프리셋 `qwen2.5-7b`)
     ```bash
     docker compose --env-file infra/.env -f infra/docker-compose.vllm.yml up -d
     ```
     - `infra/.env.example`을 `infra/.env`로 복사해 모델/포트 등을 조정하세요.
   - **Ollama** (프리셋 `gemma3-12b`, VRAM이 부족하면 CPU로 자동 오프로드)
     ```bash
     docker compose -f infra/docker-compose.ollama.yml up -d
     docker exec airead-ollama ollama pull gemma3:12b
     ```
     - `.env`에서 `LLM_MODEL=gemma3-12b`로 설정한 뒤 서버를 (재)시작하세요.
   - LLM 서버 없이도 앱은 정상 동작하며, 이 경우 규칙 기반 evaluator.js로 자동 폴백합니다.
5. 서버 실행
   ```bash
   npm start
   ```
6. 브라우저 접속
   - 로그인 화면: http://localhost:3000/
   - 앱 화면: http://localhost:3000/app

로컬에서 3000번 포트가 이미 사용 중이면 서버가 자동으로 3001, 3002처럼 다음 포트로 올라갑니다.

## 환경 변수
- `PORT`: 서버 포트 지정. 설정하지 않으면 기본값은 `3000`
- `NODE_ENV`: 실행 환경 표시
- `DB_DIR`: SQLite DB 저장 경로 지정
- `DB_PATH`: SQLite DB 파일 경로 직접 지정
- `TEACHER_PASSWORD`: 교사 로그인 비밀번호
- `LLM_ENABLED`: LLM 기반 평가/진단 사용 여부 (기본값 `true`, `false`면 항상 규칙 기반)
- `LLM_MODEL`: 사용할 모델 프리셋 (`WAS/services/llm/modelPresets.js` 참고, 기본값 `qwen2.5-7b`)
  - `qwen2.5-7b`: Qwen2.5-7B-Instruct-AWQ, vLLM(`infra/docker-compose.vllm.yml`)으로 서빙
  - `gemma3-12b`: Gemma 3 12B, Ollama(`infra/docker-compose.ollama.yml`)로 서빙
- `LLM_TIMEOUT_MS`: LLM 호출 타임아웃(ms, 기본값 60000. enforce-eager/CPU 오프로드 시 응답이 느릴 수 있어 넉넉하게 설정)
- `LLM_FALLBACK_TO_RULE`: LLM 실패 시 규칙 기반 evaluator.js로 자동 폴백 여부 (기본값 `true`)
- `LLM_PROVIDER` / `LLM_BASE_URL` / `LLM_MODEL_NAME`: 선택값. 설정하면 `LLM_MODEL` 프리셋 값 대신 이 값을 그대로 사용(커스텀 서버/모델용)

## API 예시
- `GET /api/health`: 상태 확인 (`llm.reachable`, `llm.provider`, `llm.model`로 현재 연결 상태와 활성 모델 확인 가능)
- `GET /api/dashboard`: 교사용 대시보드 데이터
- `POST /api/submissions`: 학생 감상문 제출 및 LLM 기반 평가 저장
- `GET /api/indicators`: 평가지표 목록
- `GET /api/my-dashboard`: 학생 대시보드 데이터
- `GET /api/my-reflection-detail`: 학생 독서 기록 상세
- `GET /api/my-ai-diagnosis`: 학생 진단/추천 결과 (LLM 생성, candidate 목록 기반 추천)

## 배포
Render 같은 Node 호스팅 환경에서 배포할 수 있습니다. GPU가 없는 환경이므로 `render.yaml`은 `LLM_ENABLED=false`로 설정되어 있어 규칙 기반 evaluator.js로만 동작합니다.

### Render 설정
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`

### 권장 환경 변수
- `NODE_ENV=production`
- `DB_DIR=/tmp/airead-data`
- `TEACHER_PASSWORD=0000`

## 데이터 저장
- 기본 DB 파일: `DB/data/literacy.db`
- 서버 시작 시 DB가 없으면 자동 생성됩니다.
- 로컬 환경에서는 파일 기반 SQLite를 사용합니다.
- 루브릭/성취기준/추천 교과서·도서 원본 데이터: `DB/data/reference/*.json` (`npm run seed:reference`로 DB에 반영)

## LLM 평가 신뢰도 점검
- `npm run eval:llm`: `tools/llm-eval/golden-set.json` 골든셋으로 LLM 평가 정확도(MAE)와 추천 할루시네이션 여부를 점검합니다.
- 골든셋은 팀 자체 라벨링 초안이며, 운영 반영 전 국어 교사 검수가 필요합니다.
- `DB/data/reference/curriculum_standards.json`의 성취기준 코드는 초안이며, 국가교육과정정보센터(ncic.re.kr) 원문 대조가 필요합니다.

## 참고
- 이 서비스의 자동평가는 교사 평가를 보조하기 위한 도구입니다.
- 실제 운영에서는 교사의 최종 판단과 함께 사용하는 것을 권장합니다.
