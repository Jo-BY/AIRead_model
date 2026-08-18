# AIRead - 학생 문해력 평가 서비스

AIRead는 학생의 독서 감상문을 바탕으로 문해력을 평가하고, 학생/교사용 화면에서 결과를 조회할 수 있는 WEB-WAS-DB 구조의 서비스입니다.

## 프로젝트 구조
- `WEB/`: 로그인 화면, 학생/교사 화면, 스타일, 프론트엔드 로직
- `WAS/`: Express 기반 서버와 API
- `DB/`: SQLite 데이터베이스 초기화 및 저장 로직
- `render.yaml`: Render 배포 설정

## 주요 기능
- 학생 로그인 및 독서 기록 제출
- 문해력 평가지표 기반 자동 평가
- 학생 대시보드, 타임라인, AI 진단/추천 화면 제공
- 교사용 대시보드에서 학생 목록 및 상세 결과 조회
- 평가 결과를 SQLite DB에 저장

## 실행 방법
1. 의존성 설치
   ```bash
   npm install
   ```
2. 서버 실행
   ```bash
   npm start
   ```
3. 브라우저 접속
   - 로그인 화면: http://localhost:3000/
   - 앱 화면: http://localhost:3000/app

로컬에서 3000번 포트가 이미 사용 중이면 서버가 자동으로 3001, 3002처럼 다음 포트로 올라갑니다.

## 환경 변수
- `PORT`: 서버 포트 지정. 설정하지 않으면 기본값은 `3000`
- `NODE_ENV`: 실행 환경 표시
- `DB_DIR`: SQLite DB 저장 경로 지정
- `DB_PATH`: SQLite DB 파일 경로 직접 지정
- `TEACHER_PASSWORD`: 교사 로그인 비밀번호

## API 예시
- `GET /api/health`: 상태 확인
- `GET /api/dashboard`: 교사용 대시보드 데이터
- `POST /api/submissions`: 학생 감상문 제출 및 평가 저장
- `GET /api/indicators`: 평가지표 목록
- `GET /api/my-dashboard`: 학생 대시보드 데이터
- `GET /api/my-reflection-detail`: 학생 독서 기록 상세
- `GET /api/my-ai-diagnosis`: 학생 진단/추천 결과

## 배포
Render 같은 Node 호스팅 환경에서 배포할 수 있습니다.

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

## 참고
- 이 서비스의 자동평가는 교사 평가를 보조하기 위한 도구입니다.
- 실제 운영에서는 교사의 최종 판단과 함께 사용하는 것을 권장합니다.
