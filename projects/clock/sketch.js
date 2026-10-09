
/*
  [아날로그 시계 디자인 실습]

  디자인 변경 사항
  1. 시계를 브라우저 화면 정중앙에 배치
  2. 전체 배경을 흰색으로 변경
  3. 시계 원판에 코리락.jpg 이미지 삽입
  4. 시계 바늘과 눈금은 검은색으로 변경
  5. 화면 크기가 달라져도 중앙 정렬 유지
*/

// 시계 바늘 길이를 저장하는 변수
let secondsRadius;
let minutesRadius;
let hoursRadius;

// 시계 원판 지름
let clockDiameter;

// 시계 원판에 들어갈 이미지
let clockImage;

// [디자인 변경 1] 이미지 불러오기
function preload() {
  clockImage = loadImage('코리락.jpg');
}

function setup() {

  // [디자인 변경 2] 캔버스를 브라우저 전체 크기로 설정
  createCanvas(windowWidth, windowHeight);

  // 회전 각도를 도 단위로 설정
  angleMode(DEGREES);

  // [디자인 변경 3] 시계 크기 설정
  // 숫자가 커질수록 시계 크기가 커짐
  let radius = 230;

  // 초침 길이
  secondsRadius = radius * 0.71;

  // 분침 길이
  minutesRadius = radius * 0.6;

  // 시침 길이
  hoursRadius = radius * 0.5;

  // 시계 원판 크기
  clockDiameter = radius * 1.7;

  describe('흰색 배경 중앙에 이미지가 들어간 아날로그 시계');
}

function draw() {

  // [디자인 변경 4] 전체 배경 흰색
  // RGB (255, 255, 255)
  background(255);

  // [디자인 변경 5] 시계를 화면 정중앙에 배치
  translate(width / 2, height / 2);
  scale(Math.min(1, (width - 24) / 393, (height - 24) / 393));

  // 시계 원판에 원형 이미지 적용
  drawingContext.save();
  drawingContext.beginPath();

  drawingContext.arc(
    0,
    0,
    clockDiameter / 2,
    0,
    Math.PI * 2
  );

  drawingContext.clip();

  // 이미지 원본 비율을 유지하면서 원판에 채우기
  let scaleFactor = max(
    clockDiameter / clockImage.width,
    clockDiameter / clockImage.height
  );

  let imgWidth = clockImage.width * scaleFactor;
  let imgHeight = clockImage.height * scaleFactor;

  imageMode(CENTER);
  image(clockImage, 0, 0, imgWidth, imgHeight);

  drawingContext.restore();

  // [디자인 변경 6] 시계 테두리
  noFill();
  stroke(30);
  strokeWeight(2);

  ellipse(0, 0, clockDiameter, clockDiameter);

  // 현재 시간을 각도로 변환
  let secondAngle = map(second(), 0, 60, 0, 360);
  let minuteAngle = map(minute(), 0, 60, 0, 360);
  let hourAngle = map(hour() % 12, 0, 12, 0, 360);

  // [디자인 변경 7] 시계 바늘 색상
  // 검은색 RGB (30, 30, 30)
  stroke(30);

  // 초침
  push();
  rotate(secondAngle);
  strokeWeight(1);
  line(0, 0, 0, -secondsRadius);
  pop();

  // 분침
  push();
  rotate(minuteAngle);
  strokeWeight(2);
  line(0, 0, 0, -minutesRadius);
  pop();

  // 시침
  push();
  rotate(hourAngle);
  strokeWeight(4);
  line(0, 0, 0, -hoursRadius);
  pop();

  // [디자인 변경 8] 시계 눈금
  push();
  stroke(30);
  strokeWeight(2);

  // 60개 눈금을 6도 간격으로 표시
  for (let ticks = 0; ticks < 60; ticks++) {
    point(0, -secondsRadius);
    rotate(6);
  }

  pop();

  // 시계 중앙 점
  noStroke();
  fill(30);
  ellipse(0, 0, 8, 8);
}

// [디자인 변경 9] 브라우저 크기가 변경되면
// 캔버스 크기도 자동으로 변경
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
