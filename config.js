// =============================================
// SLP Quiz Lab — 설정 (프런트엔드)
// =============================================
// GitHub Pages는 index.html/config.js를 CDN에 캐싱하므로, 값을 바꿔 재배포할
// 때마다 index.html에서 이 파일을 불러오는 <script src="./config.js?v=..."> 의
// 쿼리 버전을 함께 올려주세요. (README "캐시" 절 참고)

// Google Apps Script 웹 앱 배포 URL. 기존 배포를 "새 버전"으로 재배포해도
// 이 URL은 바뀌지 않으므로, 값을 바꿀 일은 거의 없습니다.
const GAS_URL = "https://script.google.com/macros/s/AKfycbwR1rxyuvh83mxnzCuNJbhb1J8661Ra7DDLgkYHtcO7ex_CZhXT3H3wfmFFSPNT28UQNA/exec";

// 과목 설정. 과목을 추가/변경할 때는 이 배열만 고치면 됩니다.
// id: Code.gs의 Script Properties(SHEET_IDS)에 등록한 키와 반드시 같아야 합니다.
// sections: 분반 "코드"입니다("A반"이 아니라 "A"). 화면에는 코드 뒤에 "반"을 붙여
// 표시하며(기존 라디오 버튼 표기와 동일한 규칙), 시트/제출 데이터도 항상 이
// 코드로 저장·비교합니다. 라벨이 아니라 코드로 통일해야 기존에 쌓인
// submissions/quizzes/results 데이터(class 값이 전부 "A"/"B")와 어긋나지 않습니다.
const SUBJECTS = [
  { id: "articulation", name: "조음음운장애",     weeks: 15, sections: ["A", "B"] },
  { id: "anatomy",      name: "언어기관해부생리", weeks: 15, sections: ["A", "B"] }
];
