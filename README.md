# 조음음운장애 학습 퀴즈 | SLP Girin

SLP 수업용 학습 관리 웹사이트입니다.  
학생이 직접 문제를 제출하고, 교수자가 검토 후 퀴즈를 게시하면 학생들이 퀴즈를 풀 수 있습니다.

---

## 배포 순서

### 1단계. Google Sheets 생성

1. [Google Sheets](https://sheets.google.com) 에서 새 스프레드시트를 만듭니다.
2. 스프레드시트 이름을 원하는 이름(예: `SLP Quiz DB`)으로 지정합니다.
3. 아래 4개의 시트(탭)를 만들고 **헤더 행**을 각각 입력합니다.

**시트 1: `submissions`**
```
A1: timestamp
B1: name
C1: student_id
D1: class
E1: week
F1: question_type
G1: question
H1: choices
I1: answer
J1: status
K1: professor_note
```

**시트 2: `deadlines`**
```
A1: week
B1: deadline_date
C1: is_open
```

**시트 3: `quizzes`**
```
A1: week
B1: quiz_number
C1: question_type
D1: question
E1: choices
F1: answer
G1: created_by
H1: source_student_id
```

**시트 4: `results`**
```
A1: timestamp
B1: name
C1: student_id
D1: class
E1: week
F1: score
G1: total
H1: answers_json
```

> **팁**: `Code.gs`에서 시트가 없으면 자동 생성하는 코드가 있으므로, 헤더 행만 미리 만들어두면 충분합니다.

---

### 2단계. Google Apps Script 설정

1. 스프레드시트에서 **확장 프로그램 → Apps Script** 를 클릭합니다.
2. 기본으로 있는 `Code.gs` 파일의 내용을 전부 지우고, 이 저장소의 `Code.gs` 내용을 붙여넣습니다.
3. 상단에 있는 `const ADMIN_PASSWORD = "girin2025";` 를 원하는 비밀번호로 변경합니다.
4. **저장(Ctrl+S)** 합니다.

---

### 3단계. Apps Script 웹 앱으로 배포

1. Apps Script 편집기 우측 상단 **배포 → 새 배포** 를 클릭합니다.
2. 설정 아이콘(⚙️) → **웹 앱** 을 선택합니다.
3. 다음과 같이 설정합니다:
   - **설명**: SLP Quiz API (원하는 이름)
   - **다음 사용자로 실행**: 나 (본인 Google 계정)
   - **액세스 권한**: **모든 사용자**
4. **배포** 버튼을 클릭합니다.
5. 팝업에서 **웹 앱 URL**을 복사합니다.  
   형태: `https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXX/exec`

> 코드를 수정한 경우에는 **배포 → 배포 관리 → 버전 새로 만들기** 로 재배포해야 반영됩니다.

---

### 4단계. index.html에 URL 입력

`index.html` 파일을 열어 상단의 아래 부분을 찾습니다:

```javascript
const GAS_URL = "";  // 예: "https://script.google.com/macros/s/XXXXX/exec"
```

큰따옴표 안에 3단계에서 복사한 URL을 붙여넣습니다:

```javascript
const GAS_URL = "https://script.google.com/macros/s/여기에_URL/exec";
```

저장합니다.

---

### 5단계. GitHub Pages로 배포 (무료 호스팅)

#### 5-1. GitHub 저장소 생성
1. [GitHub](https://github.com) 에 로그인합니다.
2. **New repository** 를 클릭합니다.
3. Repository name에 원하는 이름 입력 (예: `slp-quiz`).
4. **Public** 선택 → **Create repository** 클릭.

#### 5-2. 파일 업로드
1. 저장소 페이지에서 **Add file → Upload files** 클릭.
2. `index.html` 파일을 드래그하여 업로드합니다.
3. **Commit changes** 클릭.

#### 5-3. GitHub Pages 활성화
1. 저장소 **Settings** 탭 → 왼쪽 메뉴 **Pages** 클릭.
2. **Source**: `Deploy from a branch` 선택.
3. **Branch**: `main` / `/ (root)` 선택 → **Save**.
4. 잠시 후 상단에 배포 URL이 표시됩니다.  
   형태: `https://사용자명.github.io/slp-quiz/`

---

## 주차별 기한 설정 방법

1. 웹사이트 하단의 **관리자 로그인** 링크 클릭.
2. 비밀번호 입력 후 로그인.
3. **⏰ 기한** 탭 선택.
4. 각 주차의 날짜/시간을 선택하고 **저장** 클릭.

---

## 운영 흐름

```
학생이 문제 제출
    ↓
관리자 페이지 [📋 검토] 탭에서 문제 승인/반려/수정
    ↓
관리자 페이지 [📤 업로드] 탭에서 해당 주차 퀴즈 게시
    ↓
학생이 [🧩 퀴즈 풀기] 탭에서 퀴즈 응시
    ↓
관리자 페이지 [📊 결과] 탭에서 결과 확인 및 단답/서술 채점
```

---

## 관리자 기능 요약

| 탭 | 기능 |
|---|---|
| 📋 검토 | 학생 제출 문제 승인/반려/수정, 교수자 문제 추가 |
| 📤 업로드 | 승인된 문제로 퀴즈 게시 (즉시 학생에게 공개) |
| 📊 결과 | 응시 결과 조회, 단답/서술 채점, CSV 다운로드 |
| ⏰ 기한 | 주차별 제출 마감 날짜/시간 설정 |

---

## 자주 묻는 질문

**Q. 배포 후 API 호출이 안 됩니다.**  
A. Apps Script 배포 시 "액세스 권한"을 **모든 사용자**로 설정했는지 확인하세요.  
   코드 수정 후에는 반드시 **새 버전으로 재배포**해야 합니다.

**Q. CORS 오류가 납니다.**  
A. Apps Script가 웹 앱으로 배포되어 있어야 하며, `doGet` 함수가 `ContentService`로 JSON을 반환해야 합니다. Code.gs를 다시 붙여넣고 재배포하세요.

**Q. 관리자 비밀번호를 바꾸고 싶습니다.**  
A. `Code.gs` 상단의 `ADMIN_PASSWORD` 값을 수정하고 **재배포**하세요.

**Q. 학생이 같은 주차에 문제를 두 번 제출하려고 합니다.**  
A. 학번+주차 조합이 중복되면 서버에서 자동으로 막습니다.
