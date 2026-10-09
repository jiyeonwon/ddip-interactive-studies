// [실습 17] 기호 목록 변경
// ["#", "$", "%", "^", "*", "!"]
// → ["가", "나", "다"]
// → ["★", "●", "■", "▲"]
const symbols = ["#", "$", "%", "^", "*", "!"];

// 현재 기호의 순서. 첫 번째 항목은 0부터 시작
let index = 0;

// HTML에서 기호 영역과 버튼 찾기
const symbol = document.getElementById("symbol");
const button = document.getElementById("changeButton");

// 처음 화면에도 목록의 첫 번째 기호 표시
symbol.textContent = symbols[index];

// 버튼을 클릭할 때 실행
button.addEventListener("click", function () {
  // 다음 기호로 이동하고, 마지막 다음에는 처음으로
  index = (index + 1) % symbols.length;

  // 화면에 새 기호 표시
  symbol.textContent = symbols[index];
});