# 🔌 GateForge - 논리 게이트 시뮬레이터

0과 1을 사용한 여러 가지 게이트를 캔버스로 표현하고 상호작용하며 결과를 보는 웹 애플리케이션입니다.

## 📁 프로젝트 구조

```
GateForge/
├── index.html          # 메인 HTML 파일
├── styles.css          # 스타일시트 (모노크롬 디자인)
├── js/                 # JavaScript 모듈
│   ├── Gate.js         # Gate 클래스 (게이트 로직 및 렌더링)
│   ├── Connection.js   # Connection 클래스 (연결선 및 애니메이션)
│   ├── presets.js      # 프리셋 회로 생성 함수들
│   └── script.js       # 메인 애플리케이션 로직
├── test.html           # 코드 검증 테스트 페이지
├── README.md           # 프로젝트 문서
├── _headers            # Cloudflare Pages 설정
└── .gitignore
```

## ✨ 주요 기능

### 🎛️ 게이트 종류
- **INPUT**: 입력 게이트 (클릭으로 0/1 토글)
- **OUTPUT**: 출력 게이트
- **AND, OR, NOT**: 기본 논리 게이트
- **NAND, NOR**: 부정 논리 게이트
- **XOR, XNOR**: 배타적 논리 게이트

### 🔧 모드
- **일반 모드**: 게이트 추가 및 이동
- **보기 모드**: INPUT 토글만 가능 (편집 불가)
- **삭제 모드**: 게이트 및 연결 삭제

### 🎨 인터랙션
- **좌클릭**: 게이트 추가 및 이동
- **우클릭**: 게이트 연결 (출력 포트 → 입력 포트)
- **INPUT 클릭**: 값 토글 (0 ↔ 1)
- **애니메이션**: 신호(1) 흐름 시각화

### 📦 프리셋 회로

#### 기본 회로
- **Half Adder** (반가산기): 1비트 덧셈 회로
- **Full Adder** (전가산기): 캐리를 포함한 1비트 덧셈
- **SR Latch**: 기본 메모리 회로
- **Multiplexer** (2:1 MUX): 선택 신호로 입력 선택
- **Decoder** (2:4): 2비트 입력을 4개 출력으로 디코딩

#### AI 개념 회로
- **XOR Neural Net**: 다층 신경망 구조 (은닉층 개념)
- **Pattern Matcher**: 패턴 인식 (101 비트 패턴 감지)
- **Simple Classifier**: 다수결 투표 분류기

## 🚀 사용 방법

### 로컬 실행
1. 프로젝트 폴더를 다운로드합니다
2. `index.html`을 브라우저로 엽니다
3. 게이트를 선택하고 캔버스를 클릭하여 배치합니다
4. 우클릭으로 게이트를 연결합니다
5. INPUT 게이트를 클릭하여 신호를 변경하고 결과를 확인합니다

### 테스트 실행
`test.html`을 브라우저로 열어 코드 검증을 수행할 수 있습니다.

### Cloudflare Pages 배포
1. GitHub 리포지토리에 푸시
2. Cloudflare Pages에서 프로젝트 연결
3. 빌드 설정 없이 바로 배포
4. `_headers` 파일이 자동으로 적용됩니다

## 🛠️ 기술 스택

- **HTML5 Canvas**: 게이트 및 연결선 렌더링
- **Vanilla JavaScript**: 논리 엔진 및 인터랙션
- **CSS3**: 모노크롬 디자인 (회색, 검정, 흰색)
- **ES6 Classes**: 모듈화된 코드 구조

## 📝 코드 구조

### Gate.js
```javascript
class Gate {
    constructor(type, x, y) { ... }
    setupPorts() { ... }
    compute() { ... }  // 논리 연산
    draw(ctx) { ... }   // 캔버스 렌더링
}
```

### Connection.js
```javascript
class Connection {
    constructor(from, to, toIndex) { ... }
    draw(ctx) { ... }  // 베지어 곡선 + 애니메이션
}
```

### presets.js
- `createPreset()`: 프리셋 선택 라우터
- `createHalfAdder()`, `createFullAdder()`, ...
- `createXORNeuralNet()`, `createPatternMatcher()`, ...

### script.js
- 전역 변수: `gates`, `connections`, `animationTime`
- 이벤트 핸들러: 마우스, 키보드
- 렌더링 루프: `draw()`, `animate()`

## 🎨 디자인 특징

- **모노크롬 색상**: #333, #666, #ddd, #fff
- **그라데이션 없음**: 단색 디자인
- **이모지 없음**: 텍스트만 사용
- **점 패턴 배경**: 20px 간격
- **애니메이션**: 신호 흐름 시각화

## 🚀 배포 (Cloudflare Pages)

### 방법 1: Cloudflare Pages 대시보드
1. Cloudflare Pages에 로그인
2. 프로젝트 연결 (GitHub 저장소)
3. 빌드 설정:
   - **Build command**: (비워두기)
   - **Build output directory**: `.`
4. 배포 시작

### 방법 2: Wrangler CLI
```bash
# wrangler.toml 파일이 이미 설정되어 있음
npx wrangler deploy

# 또는 직접 지정
npx wrangler pages deploy . --project-name=gateforge
```

### wrangler.toml 설정
```toml
name = "gateforge"
compatibility_date = "2026-02-13"

[assets]
directory = "."
```

## 🧪 검증 완료 사항

✅ **모듈 구조 검증**
- js/ 폴더로 모든 JavaScript 파일 정리
- HTML에서 올바른 순서로 스크립트 로드
- Gate.js → Connection.js → presets.js → script.js

✅ **클래스 정의 검증**
- Gate 클래스: 165줄, 9개 게이트 타입 지원
- Connection 클래스: 60줄, 애니메이션 효과

✅ **함수 정의 검증**
- 8개 프리셋 생성 함수
- 10개 유틸리티 함수 (이벤트 핸들러, 렌더링)

✅ **전역 변수 의존성 검증**
- Connection.js는 animationTime 사용 (script.js에서 정의)
- presets.js는 Gate, Connection 클래스 사용
- 모든 의존성 로드 순서 확인 완료

## 🐛 문제 해결

### 게이트가 추가되지 않을 때
- 보기 모드나 삭제 모드가 활성화되어 있는지 확인
- 게이트 버튼이 선택되어 있는지 확인

### 연결이 안 될 때
- 우클릭으로 출력 포트를 먼저 클릭
- 그 다음 입력 포트를 우클릭

### 애니메이션이 느릴 때
- 게이트와 연결 수를 줄이기
- 브라우저 하드웨어 가속 확인

## 📜 라이선스

This project is open source and available under the MIT License.

## 🤝 기여

버그 리포트, 기능 제안, Pull Request를 환영합니다!

---

Made with ❤️ for logic gate enthusiasts
