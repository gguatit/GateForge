// 프리셋 회로 생성 함수
function createPreset(presetType) {
    // 기존 회로 초기화 확인
    if (gates.length > 0) {
        if (!confirm('기존 회로를 지우고 프리셋을 불러오시겠습니까?')) {
            return;
        }
    }
    
    // 배열 초기화
    gates = [];
    connections = [];
    
    switch(presetType) {
        case 'half-adder':
            createHalfAdder();
            break;
        case 'full-adder':
            createFullAdder();
            break;
        case 'sr-latch':
            createSRLatch();
            break;
        case 'multiplexer':
            createMultiplexer();
            break;
        case 'decoder':
            createDecoder();
            break;
        case 'xor-neural':
            createXORNeuralNet();
            break;
        case 'pattern-matcher':
            createPatternMatcher();
            break;
        case 'simple-classifier':
            createSimpleClassifier();
            break;
        case 'deep-neural':
            createDeepNeuralNet();
            break;
    }
    
    // 화면 다시 그리기
    draw();
}

// Half Adder (반가산기)
function createHalfAdder() {
    const inputA = new Gate('INPUT', 100, 150);
    const inputB = new Gate('INPUT', 100, 250);
    const xorGate = new Gate('XOR', 300, 180);
    const andGate = new Gate('AND', 300, 280);
    const sumOutput = new Gate('OUTPUT', 500, 180);
    const carryOutput = new Gate('OUTPUT', 500, 280);
    
    gates = [inputA, inputB, xorGate, andGate, sumOutput, carryOutput];
    
    const conn1 = new Connection(inputA, xorGate, 0);
    const conn2 = new Connection(inputB, xorGate, 1);
    const conn3 = new Connection(inputA, andGate, 0);
    const conn4 = new Connection(inputB, andGate, 1);
    const conn5 = new Connection(xorGate, sumOutput, 0);
    const conn6 = new Connection(andGate, carryOutput, 0);
    
    connections = [conn1, conn2, conn3, conn4, conn5, conn6];
    
    xorGate.inputs = [conn1, conn2];
    andGate.inputs = [conn3, conn4];
    sumOutput.inputs = [conn5];
    carryOutput.inputs = [conn6];
}

// Full Adder (전가산기)
function createFullAdder() {
    const inputA = new Gate('INPUT', 80, 150);
    const inputB = new Gate('INPUT', 80, 250);
    const inputC = new Gate('INPUT', 80, 350);
    
    const xor1 = new Gate('XOR', 250, 180);
    const xor2 = new Gate('XOR', 450, 200);
    const and1 = new Gate('AND', 250, 280);
    const and2 = new Gate('AND', 450, 300);
    const or1 = new Gate('OR', 650, 280);
    
    const sumOutput = new Gate('OUTPUT', 650, 200);
    const carryOutput = new Gate('OUTPUT', 850, 280);
    
    gates = [inputA, inputB, inputC, xor1, xor2, and1, and2, or1, sumOutput, carryOutput];
    
    const conn1 = new Connection(inputA, xor1, 0);
    const conn2 = new Connection(inputB, xor1, 1);
    const conn3 = new Connection(xor1, xor2, 0);
    const conn4 = new Connection(inputC, xor2, 1);
    const conn5 = new Connection(inputA, and1, 0);
    const conn6 = new Connection(inputB, and1, 1);
    const conn7 = new Connection(xor1, and2, 0);
    const conn8 = new Connection(inputC, and2, 1);
    const conn9 = new Connection(and1, or1, 0);
    const conn10 = new Connection(and2, or1, 1);
    const conn11 = new Connection(xor2, sumOutput, 0);
    const conn12 = new Connection(or1, carryOutput, 0);
    
    connections = [conn1, conn2, conn3, conn4, conn5, conn6, conn7, conn8, conn9, conn10, conn11, conn12];
    
    xor1.inputs = [conn1, conn2];
    xor2.inputs = [conn3, conn4];
    and1.inputs = [conn5, conn6];
    and2.inputs = [conn7, conn8];
    or1.inputs = [conn9, conn10];
    sumOutput.inputs = [conn11];
    carryOutput.inputs = [conn12];
}

// SR Latch
function createSRLatch() {
    const inputS = new Gate('INPUT', 100, 150);
    const inputR = new Gate('INPUT', 100, 350);
    const nor1 = new Gate('NOR', 350, 180);
    const nor2 = new Gate('NOR', 350, 320);
    const outputQ = new Gate('OUTPUT', 600, 180);
    const outputQbar = new Gate('OUTPUT', 600, 320);
    
    gates = [inputS, inputR, nor1, nor2, outputQ, outputQbar];
    
    const conn1 = new Connection(inputS, nor1, 0);
    const conn2 = new Connection(inputR, nor2, 0);
    const conn3 = new Connection(nor2, nor1, 1);
    const conn4 = new Connection(nor1, nor2, 1);
    const conn5 = new Connection(nor1, outputQ, 0);
    const conn6 = new Connection(nor2, outputQbar, 0);
    
    connections = [conn1, conn2, conn3, conn4, conn5, conn6];
    
    nor1.inputs = [conn1, conn3];
    nor2.inputs = [conn2, conn4];
    outputQ.inputs = [conn5];
    outputQbar.inputs = [conn6];
}

// 2:1 Multiplexer
function createMultiplexer() {
    const input0 = new Gate('INPUT', 100, 150);
    const input1 = new Gate('INPUT', 100, 250);
    const select = new Gate('INPUT', 100, 350);
    
    const notGate = new Gate('NOT', 250, 350);
    const and1 = new Gate('AND', 400, 180);
    const and2 = new Gate('AND', 400, 280);
    const orGate = new Gate('OR', 600, 220);
    const output = new Gate('OUTPUT', 800, 220);
    
    gates = [input0, input1, select, notGate, and1, and2, orGate, output];
    
    const conn1 = new Connection(input0, and1, 0);
    const conn2 = new Connection(select, notGate, 0);
    const conn3 = new Connection(notGate, and1, 1);
    const conn4 = new Connection(input1, and2, 0);
    const conn5 = new Connection(select, and2, 1);
    const conn6 = new Connection(and1, orGate, 0);
    const conn7 = new Connection(and2, orGate, 1);
    const conn8 = new Connection(orGate, output, 0);
    
    connections = [conn1, conn2, conn3, conn4, conn5, conn6, conn7, conn8];
    
    notGate.inputs = [conn2];
    and1.inputs = [conn1, conn3];
    and2.inputs = [conn4, conn5];
    orGate.inputs = [conn6, conn7];
    output.inputs = [conn8];
}

// 2:4 Decoder
function createDecoder() {
    const inputA = new Gate('INPUT', 100, 200);
    const inputB = new Gate('INPUT', 100, 300);
    
    const notA = new Gate('NOT', 250, 200);
    const notB = new Gate('NOT', 250, 300);
    
    const and0 = new Gate('AND', 450, 150);
    const and1 = new Gate('AND', 450, 250);
    const and2 = new Gate('AND', 450, 350);
    const and3 = new Gate('AND', 450, 450);
    
    const out0 = new Gate('OUTPUT', 650, 150);
    const out1 = new Gate('OUTPUT', 650, 250);
    const out2 = new Gate('OUTPUT', 650, 350);
    const out3 = new Gate('OUTPUT', 650, 450);
    
    gates = [inputA, inputB, notA, notB, and0, and1, and2, and3, out0, out1, out2, out3];
    
    const conn1 = new Connection(inputA, notA, 0);
    const conn2 = new Connection(inputB, notB, 0);
    const conn3 = new Connection(notA, and0, 0);
    const conn4 = new Connection(notB, and0, 1);
    const conn5 = new Connection(notA, and1, 0);
    const conn6 = new Connection(inputB, and1, 1);
    const conn7 = new Connection(inputA, and2, 0);
    const conn8 = new Connection(notB, and2, 1);
    const conn9 = new Connection(inputA, and3, 0);
    const conn10 = new Connection(inputB, and3, 1);
    const conn11 = new Connection(and0, out0, 0);
    const conn12 = new Connection(and1, out1, 0);
    const conn13 = new Connection(and2, out2, 0);
    const conn14 = new Connection(and3, out3, 0);
    
    connections = [conn1, conn2, conn3, conn4, conn5, conn6, conn7, conn8, conn9, conn10, conn11, conn12, conn13, conn14];
    
    notA.inputs = [conn1];
    notB.inputs = [conn2];
    and0.inputs = [conn3, conn4];
    and1.inputs = [conn5, conn6];
    and2.inputs = [conn7, conn8];
    and3.inputs = [conn9, conn10];
    out0.inputs = [conn11];
    out1.inputs = [conn12];
    out2.inputs = [conn13];
    out3.inputs = [conn14];
}

// XOR Neural Network (AI 기본 개념 - 다층 신경망)
// XOR 문제는 단층 퍼셉트론으로 해결 불가능하지만 2층 구조로 해결 가능
function createXORNeuralNet() {
    // 입력층 (Input Layer)
    const inputA = new Gate('INPUT', 100, 200);
    const inputB = new Gate('INPUT', 100, 300);
    
    // 은닉층 (Hidden Layer) - 비선형 특징 추출
    const hidden1 = new Gate('NAND', 300, 180);  // A NAND B
    const hidden2 = new Gate('OR', 300, 280);     // A OR B
    
    // 출력층 (Output Layer) - 최종 결정
    const output = new Gate('AND', 500, 230);      // (A NAND B) AND (A OR B) = XOR
    const result = new Gate('OUTPUT', 700, 230);
    
    gates = [inputA, inputB, hidden1, hidden2, output, result];
    
    // 연결 (Connections = Weights in Neural Network)
    const conn1 = new Connection(inputA, hidden1, 0);
    const conn2 = new Connection(inputB, hidden1, 1);
    const conn3 = new Connection(inputA, hidden2, 0);
    const conn4 = new Connection(inputB, hidden2, 1);
    const conn5 = new Connection(hidden1, output, 0);
    const conn6 = new Connection(hidden2, output, 1);
    const conn7 = new Connection(output, result, 0);
    
    connections = [conn1, conn2, conn3, conn4, conn5, conn6, conn7];
    
    hidden1.inputs = [conn1, conn2];
    hidden2.inputs = [conn3, conn4];
    output.inputs = [conn5, conn6];
    result.inputs = [conn7];
}

// Pattern Matcher (패턴 인식 - AI의 기본)
// 특정 입력 패턴을 인식하는 회로 (예: "101" 패턴 감지)
function createPatternMatcher() {
    // 3비트 입력
    const input1 = new Gate('INPUT', 100, 150);  // Bit 1
    const input2 = new Gate('INPUT', 100, 250);  // Bit 2
    const input3 = new Gate('INPUT', 100, 350);  // Bit 3
    
    // 특징 추출 계층 (Feature Extraction)
    const not2 = new Gate('NOT', 250, 250);      // Bit 2의 반전
    
    // 패턴 매칭 계층 (Pattern Matching)
    const and1 = new Gate('AND', 400, 200);      // Bit1 AND NOT(Bit2)
    const finalAnd = new Gate('AND', 550, 225);  // (Bit1 AND NOT(Bit2)) AND Bit3
    
    // 결과
    const patternDetected = new Gate('OUTPUT', 750, 225);
    const noPattern = new Gate('NOT', 550, 325);
    const noPatternOut = new Gate('OUTPUT', 750, 325);
    
    gates = [input1, input2, input3, not2, and1, finalAnd, patternDetected, noPattern, noPatternOut];
    
    const conn1 = new Connection(input2, not2, 0);
    const conn2 = new Connection(input1, and1, 0);
    const conn3 = new Connection(not2, and1, 1);
    const conn4 = new Connection(and1, finalAnd, 0);
    const conn5 = new Connection(input3, finalAnd, 1);
    const conn6 = new Connection(finalAnd, patternDetected, 0);
    const conn7 = new Connection(finalAnd, noPattern, 0);
    const conn8 = new Connection(noPattern, noPatternOut, 0);
    
    connections = [conn1, conn2, conn3, conn4, conn5, conn6, conn7, conn8];
    
    not2.inputs = [conn1];
    and1.inputs = [conn2, conn3];
    finalAnd.inputs = [conn4, conn5];
    patternDetected.inputs = [conn6];
    noPattern.inputs = [conn7];
    noPatternOut.inputs = [conn8];
}

// Simple Classifier (간단한 분류기)
// 3비트 입력을 받아 "대부분 1인지" 판단 (다수결 투표)
function createSimpleClassifier() {
    // 입력 데이터 (Features)
    const feature1 = new Gate('INPUT', 100, 150);
    const feature2 = new Gate('INPUT', 100, 250);
    const feature3 = new Gate('INPUT', 100, 350);
    
    // 중간 처리 계층 (Intermediate Processing)
    const pair1 = new Gate('AND', 300, 180);     // Feature1 AND Feature2
    const pair2 = new Gate('AND', 300, 280);     // Feature1 AND Feature3
    const pair3 = new Gate('AND', 300, 380);     // Feature2 AND Feature3
    
    // 결정 계층 (Decision Layer)
    const majorityOr = new Gate('OR', 500, 230);  // 2개 이상의 쌍이 참
    const decisionAnd = new Gate('OR', 500, 330); // 다른 경로
    
    // 최종 출력 (Classification Output)
    const isClass1 = new Gate('OR', 700, 280);    // "Class 1" (대부분 1)
    const classOutput = new Gate('OUTPUT', 900, 280);
    
    gates = [feature1, feature2, feature3, pair1, pair2, pair3, majorityOr, decisionAnd, isClass1, classOutput];
    
    const conn1 = new Connection(feature1, pair1, 0);
    const conn2 = new Connection(feature2, pair1, 1);
    const conn3 = new Connection(feature1, pair2, 0);
    const conn4 = new Connection(feature3, pair2, 1);
    const conn5 = new Connection(feature2, pair3, 0);
    const conn6 = new Connection(feature3, pair3, 1);
    const conn7 = new Connection(pair1, majorityOr, 0);
    const conn8 = new Connection(pair2, majorityOr, 1);
    const conn9 = new Connection(pair3, decisionAnd, 0);
    const conn10 = new Connection(majorityOr, decisionAnd, 1);
    const conn11 = new Connection(majorityOr, isClass1, 0);
    const conn12 = new Connection(decisionAnd, isClass1, 1);
    const conn13 = new Connection(isClass1, classOutput, 0);
    
    connections = [conn1, conn2, conn3, conn4, conn5, conn6, conn7, conn8, conn9, conn10, conn11, conn12, conn13];
    
    pair1.inputs = [conn1, conn2];
    pair2.inputs = [conn3, conn4];
    pair3.inputs = [conn5, conn6];
    majorityOr.inputs = [conn7, conn8];
    decisionAnd.inputs = [conn9, conn10];
    isClass1.inputs = [conn11, conn12];
    classOutput.inputs = [conn13];
}

// Deep Neural Network (다층 신경망) - 매우 복잡한 AI 회로
function createDeepNeuralNet() {
    // ===== 입력 계층 (Input Layer) - 4개 입력 =====
    const x1 = new Gate('INPUT', 80, 120);
    const x2 = new Gate('INPUT', 80, 220);
    const x3 = new Gate('INPUT', 80, 320);
    const x4 = new Gate('INPUT', 80, 420);
    
    // ===== 은닉 계층 1 (Hidden Layer 1) - 6개 뉴런 =====
    const h11 = new Gate('NAND', 280, 80);    // 복잡한 조합
    const h12 = new Gate('AND', 280, 160);    // AND 조합
    const h13 = new Gate('OR', 280, 240);     // OR 조합
    const h14 = new Gate('XOR', 280, 320);    // XOR 패턴
    const h15 = new Gate('NOR', 280, 400);    // NOR 조합
    const h16 = new Gate('XNOR', 280, 480);   // XNOR 패턴
    
    // ===== 은닉 계층 2 (Hidden Layer 2) - 4개 뉴런 =====
    const h21 = new Gate('AND', 520, 140);    // 상위 패턴 1
    const h22 = new Gate('OR', 520, 240);     // 상위 패턴 2
    const h23 = new Gate('NAND', 520, 340);   // 상위 패턴 3
    const h24 = new Gate('XOR', 520, 440);    // 상위 패턴 4
    
    // ===== 출력 계층 (Output Layer) - 2개 출력 =====
    const y1 = new Gate('OR', 760, 220);      // 최종 출력 1
    const y2 = new Gate('AND', 760, 360);     // 최종 출력 2
    const out1 = new Gate('OUTPUT', 960, 220);
    const out2 = new Gate('OUTPUT', 960, 360);
    
    gates = [x1, x2, x3, x4, h11, h12, h13, h14, h15, h16, h21, h22, h23, h24, y1, y2, out1, out2];
    
    // ===== 입력층 → 은닉층1 연결 (각 은닉 뉴런이 모든 입력을 받음 - 24개 연결) =====
    const c1 = new Connection(x1, h11, 0);
    const c2 = new Connection(x2, h11, 1);
    const c3 = new Connection(x1, h12, 0);
    const c4 = new Connection(x3, h12, 1);
    const c5 = new Connection(x2, h13, 0);
    const c6 = new Connection(x3, h13, 1);
    const c7 = new Connection(x1, h14, 0);
    const c8 = new Connection(x4, h14, 1);
    const c9 = new Connection(x2, h15, 0);
    const c10 = new Connection(x4, h15, 1);
    const c11 = new Connection(x3, h16, 0);
    const c12 = new Connection(x4, h16, 1);
    
    // 추가 교차 연결 (더 복잡한 패턴)
    const c13 = new Connection(x1, h13, 2);   // x1도 h13에 연결
    const c14 = new Connection(x4, h12, 2);   // x4도 h12에 연결
    const c15 = new Connection(x2, h14, 2);   // x2도 h14에 연결
    const c16 = new Connection(x3, h15, 2);   // x3도 h15에 연결
    const c17 = new Connection(x1, h16, 2);   // x1도 h16에 연결
    const c18 = new Connection(x4, h13, 2);   // x4도 h13에 연결
    
    // ===== 은닉층1 → 은닉층2 연결 (복잡한 조합 - 24개 연결) =====
    const c19 = new Connection(h11, h21, 0);
    const c20 = new Connection(h12, h21, 1);
    const c21 = new Connection(h13, h21, 2);
    
    const c22 = new Connection(h12, h22, 0);
    const c23 = new Connection(h13, h22, 1);
    const c24 = new Connection(h14, h22, 2);
    
    const c25 = new Connection(h13, h23, 0);
    const c26 = new Connection(h14, h23, 1);
    const c27 = new Connection(h15, h23, 2);
    
    const c28 = new Connection(h14, h24, 0);
    const c29 = new Connection(h15, h24, 1);
    const c30 = new Connection(h16, h24, 2);
    
    // 추가 피드포워드 연결
    const c31 = new Connection(h11, h22, 2);
    const c32 = new Connection(h16, h21, 2);
    const c33 = new Connection(h11, h23, 2);
    const c34 = new Connection(h12, h24, 2);
    const c35 = new Connection(h15, h21, 2);
    const c36 = new Connection(h16, h22, 2);
    
    // ===== 은닉층2 → 출력층 연결 (12개 연결) =====
    const c37 = new Connection(h21, y1, 0);
    const c38 = new Connection(h22, y1, 1);
    const c39 = new Connection(h23, y1, 2);
    
    const c40 = new Connection(h22, y2, 0);
    const c41 = new Connection(h23, y2, 1);
    const c42 = new Connection(h24, y2, 2);
    
    const c43 = new Connection(h21, y2, 2);
    const c44 = new Connection(h24, y1, 2);
    
    // ===== 출력층 → 최종 출력 =====
    const c45 = new Connection(y1, out1, 0);
    const c46 = new Connection(y2, out2, 0);
    
    connections = [
        c1, c2, c3, c4, c5, c6, c7, c8, c9, c10,
        c11, c12, c13, c14, c15, c16, c17, c18, c19, c20,
        c21, c22, c23, c24, c25, c26, c27, c28, c29, c30,
        c31, c32, c33, c34, c35, c36, c37, c38, c39, c40,
        c41, c42, c43, c44, c45, c46
    ];
    
    // 입력 배열 설정
    h11.inputs = [c1, c2];
    h12.inputs = [c3, c4, c14];
    h13.inputs = [c5, c6, c13, c18];
    h14.inputs = [c7, c8, c15];
    h15.inputs = [c9, c10, c16];
    h16.inputs = [c11, c12, c17];
    
    h21.inputs = [c19, c20, c21, c32, c35];
    h22.inputs = [c22, c23, c24, c31, c36];
    h23.inputs = [c25, c26, c27, c33];
    h24.inputs = [c28, c29, c30, c34];
    
    y1.inputs = [c37, c38, c39, c44];
    y2.inputs = [c40, c41, c42, c43];
    
    out1.inputs = [c45];
    out2.inputs = [c46];
}
