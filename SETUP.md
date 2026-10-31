# SLP Quiz Lab

두 과목(조음음운장애 · 언어기관해부생리)을 한 사이트에서 운영하는 학습 관리 웹사이트입니다.
학생이 직접 문제를 제출하고, 교수자가 검토 후 퀴즈를 게시하면 학생들이 퀴즈를 풀 수 있습니다.
과목마다 별도의 Google Sheets(DB)를 쓰지만, Google Apps Script(GAS) 배포는 하나만 유지하고
`subject` 파라미터로 분기합니다.

---

## 기존 배포에서 업그레이드하는 경우 — 반드시 이 순서대로

기존에 조음음운장애 한 과목으로 운영 중이던 사이트를 이 버전으로 올리는 경우, **아래 순서를
지키지 않으면 기존 데이터에 접근할 수 없거나 학생들이 접속 오류를 보게 됩니다.**

1. **백업**: 기존 스프레드시트를 사본으로 한 번 더 저장해둡니다(파일 → 사본 만들기).
2. **기존 스프레드시트 ID 확인**: 조음음운장애용으로 지금까지 쓰던 스프레드시트를 열고, 주소창의
   `https://docs.google.com/spreadsheets/d/`와 `/edit` 사이 문자열(ID)을 복사해둡니다.
3. **두 번째 스프레드시트 생성**: 언어기관해부생리용으로 새 Google Sheets를 만들고, 마찬가지로
   ID를 복사해둡니다. 시트 자체는 비워둬도 됩니다(아래 5단계에서 자동 생성됩니다).
4. **Code.gs 교체**: 기존 스프레드시트에 연결된 Apps Script 프로젝트(확장 프로그램 → Apps
   Script)를 열고, `Code.gs` 내용을 이 저장소의 `Code.gs`로 전부 교체합니다. **배포 URL이 걸린
   그 프로젝트를 그대로 씁니다.** 새 프로젝트를 만들지 마세요.
5. **Script Properties 설정**: Apps Script 편집기 왼쪽 톱니바퀴(프로젝트 설정) → **스크립트
   속성**에서 아래 두 값을 추가합니다.
   - `SHEET_IDS` : `{"articulation":"<2번에서 복사한 ID>","anatomy":"<3번에서 복사한 ID>"}`
     (따옴표 포함, 한 줄 JSON 문자열 그대로)
   - `ADMIN_PASSWORD_HASH` : 아래 6번에서 만든 해시값
6. **관리자 비밀번호 해시 생성**: Apps Script 에디터 함수 목록에서
   `generateAdminPasswordHash`를 선택해 실행합니다. 원하는 비밀번호를 입력하면 해시값이
   대화상자와 실행 로그에 나옵니다. 그 값을 5번의 `ADMIN_PASSWORD_HASH`에 붙여넣습니다.
   (기존 `ADMIN_PASSWORD` 평문 상수는 이제 코드에 없습니다.)
7. **시트 셋업**: 함수 목록에서 `setupSheetsArticulation`을 실행해 조음음운장애 스프레드시트에
   필요한 시트(submissions/deadlines/quizzes/results/명단)와 헤더를 만듭니다. 이어서
   `setupSheetsAnatomy`도 실행해 언어기관해부생리 스프레드시트에 동일하게 만듭니다.
8. **기존 수강생 명단 이관** (조음음운장애에 이미 `roster` 시트가 있던 경우만): 함수 목록에서
   `migrateRosterToMyeongdanArticulation`을 실행합니다. 기존 `roster`(이름,학번,분반) 데이터를
   새 `명단`(학번,이름,분반,등록일시) 시트로 옮겨줍니다. 언어기관해부생리는 새 과목이라 이 단계가
   필요 없고, 관리자 패널의 **명단** 탭에서 바로 붙여넣으면 됩니다.
9. **시간대 확인**: 왼쪽 톱니바퀴(프로젝트 설정)에서 "'appsscript.json' 매니페스트 파일을
   편집기에서 보기"를 켜고, `appsscript.json`의 `"timeZone"`이 `"Asia/Seoul"`인지 확인합니다.
   아니라면 고쳐서 저장합니다. (마감 판정이 전부 이 시간대 기준입니다.)
10. **주간 백업 트리거 설치**: 함수 목록에서 `installWeeklyBackupTrigger`를 실행합니다. 매주
    월요일 아침 두 과목 스프레드시트를 자동으로 사본 백업합니다. (관리자 패널의 "백업 만들기"
    버튼은 그대로 있고, 이 트리거와 별개로 즉시 백업할 때 씁니다.)
11. **재배포 (기존 배포 URL 유지)**: **배포 → 배포 관리** → 기존 배포 옆 연필 아이콘 클릭 →
    버전 **"새 버전"** 선택 → **배포**. 배포 URL은 바뀌지 않습니다. (⚠️ "새 배포"를 누르면 URL이
    바뀌어 학생들이 쓰던 링크가 끊기니 절대 누르지 마세요.)
12. **config.js 확인**: `config.js`의 `GAS_URL`은 그대로 두면 됩니다(URL이 안 바뀌었으므로).
    이 저장소를 GitHub에 push하면 GitHub Pages가 자동 반영됩니다. 캐시 때문에 반영이 늦게
    보이면 `index.html`의 `<script src="./config.js?v=...">` 쿼리 값을 오늘 날짜로 한 번 올려
    커밋하세요.
13. **QA 체크리스트 실행**: 아래 [배포 후 QA 체크리스트](#배포-후-qa-체크리스트)를 순서대로
    확인합니다.

---

## 처음부터 새로 배포하는 경우

### 1단계. 과목별 Google Sheets 생성

과목마다(조음음운장애/언어기관해부생리) 스프레드시트를 하나씩 만듭니다. 시트 탭과 헤더는
아래 5개이며, `Code.gs`에 시트가 없으면 자동 생성하는 코드가 있어 **직접 만들 필요 없이
`setupSheetsArticulation()` / `setupSheetsAnatomy()`만 실행하면 됩니다.**

**시트 1: `submissions`**
```
A1: timestamp   B1: name        C1: student_id  D1: class
E1: week        F1: question_type
G1: question    H1: choices     I1: answer      J1: explanation
K1: status      L1: professor_note
```

**시트 2: `deadlines`**
```
A1: week   B1: deadline_date   C1: is_open   D1: quiz_deadline_date   E1: quiz_is_open
```

**시트 3: `quizzes`**
```
A1: week   B1: quiz_number   C1: class   D1: question_type
E1: question   F1: choices   G1: answer   H1: explanation
I1: created_by   J1: source_student_id
```

**시트 4: `results`**
```
A1: timestamp   B1: name   C1: student_id   D1: class   E1: week
F1: attempt_number   G1: score   H1: total   I1: answers_json
```

**시트 5: `명단`** (수강 명단 — 이 시트가 비어 있으면 명단 대조 없이 누구나 통과합니다)
```
A1: 학번   B1: 이름   C1: 분반   D1: 등록일시
```
분반 값은 항상 `A` 또는 `B`(코드)만 넣습니다. "A반"처럼 "반"을 붙이면 학생 쪽 입력("A반" 선택
시 실제로 전송되는 값은 "A")과 일치하지 않아 명단 대조에 실패합니다. 관리자 패널 **명단** 탭에서
붙여넣기로 등록하면 이 규칙이 자동으로 지켜집니다.

### 2단계. Google Apps Script 설정

1. 두 스프레드시트 중 하나(보통 조음음운장애)에서 **확장 프로그램 → Apps Script**를 클릭합니다.
   이 프로젝트 하나만 배포하며, 나머지 과목 스프레드시트는 `SHEET_IDS`로 ID만 참조합니다.
2. 기본 `Code.gs` 내용을 지우고 이 저장소의 `Code.gs`를 붙여넣습니다.
3. **저장(Ctrl+S)** 합니다.
4. 프로젝트 설정 → **스크립트 속성**에 아래 두 값을 등록합니다.
   - `SHEET_IDS` : `{"articulation":"<조음음운장애 스프레드시트 ID>","anatomy":"<언어기관해부생리 스프레드시트 ID>"}`
   - `ADMIN_PASSWORD_HASH` : 함수 목록에서 `generateAdminPasswordHash`를 실행해 얻은 값
5. 함수 목록에서 `setupSheetsArticulation`, `setupSheetsAnatomy`를 각각 한 번씩 실행합니다.
6. (선택) 함수 목록에서 `installWeeklyBackupTrigger`를 실행해 주간 자동 백업을 켭니다.

### 3단계. Apps Script 웹 앱으로 배포

1. Apps Script 편집기 우측 상단 **배포 → 새 배포**를 클릭합니다.
2. 설정 아이콘 → **웹 앱**을 선택합니다.
3. **다음 사용자로 실행**: 나(본인 Google 계정) / **액세스 권한**: 모든 사용자.
4. **배포**를 클릭하고 웹 앱 URL을 복사합니다.
   (`https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXX/exec`)

> 이후 코드를 수정할 때는 **배포 → 배포 관리 → 기존 배포 편집 → 새 버전**으로만 재배포하세요.
> "새 배포"를 누르면 URL이 바뀌어 이미 배포된 index.html/config.js와 어긋납니다.

### 4단계. config.js에 URL/과목 입력

`config.js` 파일을 엽니다.
```js
const GAS_URL = "";  // 3단계에서 복사한 웹 앱 URL
const SUBJECTS = [
  { id:'articulation', name:'조음음운장애',     weeks:15, sections:['A','B'] },
  { id:'anatomy',      name:'언어기관해부생리', weeks:15, sections:['A','B'] }
];
```
과목을 추가/변경할 때는 이 배열만 고치면 됩니다. **`id`는 Script Properties의 `SHEET_IDS`
키와 반드시 같아야 하고**, `sections`은 "A반"이 아니라 코드값 `"A"`/`"B"`로 씁니다(화면에는
자동으로 "반"이 붙어 표시됩니다). 라벨이 아니라 코드로 통일해야 기존에 쌓인
submissions/quizzes/results 데이터(class 값이 전부 "A"/"B")와 어긋나지 않습니다.

### 5단계. GitHub Pages로 배포

1. [GitHub](https://github.com)에서 새 저장소를 만들고 `index.html`, `config.js`를
   업로드합니다 (`Code.gs`는 올리지 않습니다 — 비밀번호 해시 등 민감정보가 없더라도, GAS
   코드는 저장소가 아니라 Apps Script 프로젝트에서 직접 관리합니다. `.gitignore`에 이미
   `Code.gs`가 등록되어 있습니다).
2. 저장소 **Settings → Pages**에서 **Deploy from a branch** → `main` / `/(root)` → **Save**.
3. 잠시 후 `https://사용자명.github.io/저장소명/` 형태로 배포 URL이 표시됩니다.

수정 후 반영이 늦게 보이면(CDN 캐시) `index.html`의
`<script src="./config.js?v=20260901"></script>` 쿼리 값을 올려서 다시 커밋하세요.

---

## 운영 흐름

```
학생이 본인 확인(이름·학번·분반 → 명단 대조) 통과
    ↓
학생이 문제 제출
    ↓
관리자 패널 [검토] 탭에서 문제 승인/반려/수정
    ↓
관리자 패널 [업로드] 탭에서 해당 주차 퀴즈 게시
    ↓
학생이 [퀴즈 풀기] 탭에서 퀴즈 응시
    ↓
관리자 패널 [결과] 탭에서 결과 확인 및 단답/서술 채점
    ↓
관리자 패널 [학생별] 탭에서 개인별 제출·응시 이력 확인
```

## 관리자 기능 요약

| 탭 | 기능 |
|---|---|
| 검토 | 학생 제출 문제 승인/반려/수정, 교수자 문제 추가 |
| 업로드 | 승인된 문제로 퀴즈 게시 (즉시 학생에게 공개) |
| 결과 | 응시 결과 조회, 단답/서술 채점, CSV 다운로드 |
| 학생별 | 학생 검색·필터, 주차별 제출/응시 상세, 응답 원본, 개별 CSV |
| 명단 | 수강 명단 붙여넣기 등록/교체, 차단 토글, 명단 CSV |
| 기한 | 주차별 제출/응시 마감 날짜·시간 설정 |

과목은 헤더 아래 드롭다운으로 전환하며, 관리자 패널의 모든 탭은 현재 선택된 과목 기준으로
동작합니다(다른 과목 데이터가 섞이지 않습니다).

---

## 배포 후 QA 체크리스트

1. 휴대폰 실기기에서 두 과목 모두 열리고 드롭다운 전환이 되는가
2. 명단에 없는 이름으로는 제출·응시가 모두 막히는가
3. 명단에 있는 이름으로 확인 후 세 탭(문제 제출/퀴즈 풀기/제출 현황)이 동시에 풀리는가
4. 브라우저를 완전히 닫았다 열어도 본인 확인이 유지되는가 (localStorage)
5. "정보 지우기"를 누르면 다시 잠기는가
6. 개발자도구 네트워크 탭에서 퀴즈 문항 응답(`getQuiz`)에 `answer`/`explanation`이 보이지
   않는가
7. 관리자 [학생별] 탭에서 특정 학생의 주차별 제출·응시가 정확히 나오는가
8. 더미 계정 3개로 A반·B반 동시 제출 → 검토 → 게시 → 응시 → CSV까지 한 사이클이 도는가
9. 관리자 로그인 후 새로고침해도 (6시간 이내) 다시 로그인하지 않아도 되는가 (세션 토큰)
10. 관리자 [명단] 탭에서 쉼표 구분/탭 구분 붙여넣기가 모두 인식되는가

---

## 주간 요약 이메일 자동 발송 (트리거 설정)

`Code.gs`의 `sendWeeklySummary(subject)`는 현재 마감이 임박한 주차의 A반/B반 제출 현황과
미제출자 명단을 정리해 스프레드시트 소유자 이메일로 보냅니다. 두 과목을 한 번에 처리하는
진입점은 `sendWeeklySummaryAll()`입니다. 이 함수를 주기적으로 자동 실행하려면 Apps Script의
시간 기반 트리거를 설정해야 합니다.

1. Apps Script 편집기 왼쪽 메뉴에서 **시계 모양 아이콘(트리거)**을 클릭합니다.
2. 우측 하단 **+ 트리거 추가** 버튼을 클릭합니다.
3. 다음과 같이 설정합니다:
   - **실행할 함수 선택**: `sendWeeklySummaryAll`
   - **실행할 배포 선택**: `Head`
   - **이벤트 소스 선택**: `시간 기반 트리거`
   - **시간 기반 트리거 유형 선택**: 예) `일 단위 타이머` → `오전 8시~9시`
4. **저장**을 클릭합니다. 최초 저장 시 Google 계정 권한 승인 팝업이 뜨면 승인합니다.

> 마감 임박 주차가 없으면(모든 주차가 마감되었거나 마감일이 미설정) 메일을 보내지 않고
> 로그만 남깁니다. 실행 기록은 Apps Script 편집기의 **실행** 메뉴에서 확인할 수 있습니다.

---

## 자주 묻는 질문

**Q. 배포 후 API 호출이 안 됩니다.**
A. Apps Script 배포 시 "액세스 권한"을 **모든 사용자**로 설정했는지 확인하세요. 코드 수정
   후에는 반드시 **기존 배포를 새 버전으로** 재배포해야 합니다.

**Q. "SHEET_IDS Script Property가 설정되지 않았습니다" 오류가 납니다.**
A. Apps Script 프로젝트 설정 → 스크립트 속성에 `SHEET_IDS`를 등록했는지, JSON 형식이
   올바른지(따옴표, 중괄호) 확인하세요.

**Q. 관리자 비밀번호를 바꾸고 싶습니다.**
A. Apps Script 함수 목록에서 `generateAdminPasswordHash`를 실행해 새 해시를 만들고,
   Script Properties의 `ADMIN_PASSWORD_HASH`를 그 값으로 바꾼 뒤 **재배포**하세요. (코드에
   비밀번호를 직접 적지 않습니다.)

**Q. 학생이 같은 주차에 문제를 두 번 제출하려고 합니다.**
A. 제출 마감 전이면 기존 제출을 자동으로 덮어쓰고(재검토 대기 상태로 초기화) "기존 제출을
   수정했습니다" 메시지를 보여줍니다. 마감 후에는 기존처럼 제출이 차단됩니다.

**Q. 명단에 없는 학생도 임시로 쓰게 하고 싶습니다.**
A. 관리자 패널 **명단** 탭의 "명단에 없는 학생 차단" 토글을 끄면, 명단 대조는 하되(가능하면
   명단 값으로 정규화) 막지는 않습니다. 학기 시작 직후 명단이 아직 미완성일 때 임시로 쓰는
   용도이며, 되도록 빨리 다시 켜는 것을 권장합니다.

**Q. 두 과목이 아니라 세 번째 과목을 추가하고 싶습니다.**
A. ① 새 스프레드시트를 만들고, ② Script Properties의 `SHEET_IDS`에 `"과목id":"ID"`를
   추가하고, ③ `config.js`의 `SUBJECTS` 배열에 같은 id로 항목을 추가하고, ④
   `setupSheets("과목id")`를 Apps Script 에디터에서 1회 실행하면 됩니다(임시로
   `function setupSheetsX(){return setupSheets("과목id");}`를 추가해 실행해도 됩니다).
