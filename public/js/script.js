// 캔버스 설정
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 게임 상태 변수 초기화
let gates = [];
let connections = [];
let selectedGateType = null;
let draggedGate = null;
let viewMode = false;
let deleteMode = false;
let connectStart = null;
let tempConnection = null;
let animationTime = 0;
let canvasScale = 1.0;
let canvasOffsetX = 0;
let canvasOffsetY = 0;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;

// roundRect 폴리필 (구형 브라우저 호환성)
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        this.beginPath();
        this.moveTo(x + radius, y);
        this.arcTo(x + width, y, x + width, y + height, radius);
        this.arcTo(x + width, y + height, x, y + height, radius);
        this.arcTo(x, y + height, x, y, radius);
        this.arcTo(x, y, x + width, y, radius);
        this.closePath();
        return this;
    };
}

// 캔버스 크기 설정
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth - 20;
    canvas.height = container.clientHeight - 20;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 화면 좌표를 캔버스 좌표로 변환
function getCanvasCoordinates(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) / canvasScale - canvasOffsetX;
    const y = (clientY - rect.top) / canvasScale - canvasOffsetY;
    return { x, y };
}

// 줌 함수
function zoomIn() {
    canvasScale = Math.min(canvasScale + 0.1, 3.0);
    updateZoomDisplay();
    draw();
}

function zoomOut() {
    canvasScale = Math.max(canvasScale - 0.1, 0.3);
    updateZoomDisplay();
    draw();
}

function zoomReset() {
    canvasScale = 1.0;
    updateZoomDisplay();
    draw();
}

function updateZoomDisplay() {
    const zoomLevel = document.getElementById('zoomLevel');
    if (zoomLevel) {
        zoomLevel.textContent = Math.round(canvasScale * 100) + '%';
    }
}

// UI 이벤트 리스너
document.querySelectorAll('.gate-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (viewMode) return; // 보기 모드에서는 게이트 선택 불가
        
        // 프리셋 버튼인 경우
        if (btn.dataset.preset) {
            createPreset(btn.dataset.preset);
            return;
        }
        
        // 일반 게이트 버튼인 경우
        document.querySelectorAll('.gate-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedGateType = btn.dataset.gate;
        deleteMode = false;
        viewMode = false;
        updateModeButtons();
    });
});

document.getElementById('clearBtn').addEventListener('click', () => {
    if (confirm('모든 게이트와 연결을 삭제하시겠습니까?')) {
        gates = [];
        connections = [];
        draw();
    }
});

document.getElementById('viewMode').addEventListener('click', () => {
    viewMode = !viewMode;
    deleteMode = false;
    selectedGateType = null;
    document.querySelectorAll('.gate-btn').forEach(b => b.classList.remove('selected'));
    updateModeButtons();
});

document.getElementById('deleteMode').addEventListener('click', () => {
    if (viewMode) return; // 보기 모드에서는 삭제 모드 불가
    deleteMode = !deleteMode;
    viewMode = false;
    selectedGateType = null;
    document.querySelectorAll('.gate-btn').forEach(b => b.classList.remove('selected'));
    updateModeButtons();
});

// 줌 버튼 이벤트 리스너
document.getElementById('zoomIn').addEventListener('click', zoomIn);
document.getElementById('zoomOut').addEventListener('click', zoomOut);
document.getElementById('zoomReset').addEventListener('click', zoomReset);

function updateModeButtons() {
    document.getElementById('viewMode').classList.toggle('active', viewMode);
    document.getElementById('deleteMode').classList.toggle('active', deleteMode);
    
    if (viewMode) {
        canvas.style.cursor = 'pointer';
    } else if (deleteMode) {
        canvas.style.cursor = 'not-allowed';
    } else {
        canvas.style.cursor = 'default';
    }
}

// 캔버스 이벤트
canvas.addEventListener('mousedown', (e) => {
    const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);
    
    // 휠 클릭(가운데 버튼) - 패닝 시작
    if (e.button === 1) {
        isPanning = true;
        panStartX = e.clientX;
        panStartY = e.clientY;
        canvas.style.cursor = 'grab';
        e.preventDefault();
        return;
    }
    
    // 우클릭 - 연결 시작 (보기 모드에서는 불가)
    if (e.button === 2) {
        if (!viewMode) {
            handleConnectStart(x, y);
        }
        return;
    }
    
    // 좌클릭만 처리
    if (e.button !== 0) return;

    if (deleteMode) {
        handleDelete(x, y);
        return;
    }

    // 게이트 클릭 확인
    const gate = findGateAt(x, y);
    if (gate) {
        if (gate.type === 'INPUT') {
            // INPUT 게이트 클릭시 값 토글 (모든 모드에서 가능)
            gate.value = gate.value === 0 ? 1 : 0;
            console.log('INPUT 값 변경:', gate.value);
            return; // 드래그 방지
        }
        // 보기 모드에서는 드래그 불가
        if (!viewMode) {
            draggedGate = gate;
            canvas.style.cursor = 'grabbing';
        }
    }
});

// 우클릭 메뉴 방지
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

canvas.addEventListener('mousemove', (e) => {
    // 패닝 중일 때
    if (isPanning) {
        const dx = (e.clientX - panStartX) / canvasScale;
        const dy = (e.clientY - panStartY) / canvasScale;
        canvasOffsetX += dx;
        canvasOffsetY += dy;
        panStartX = e.clientX;
        panStartY = e.clientY;
        canvas.style.cursor = 'grabbing';
        draw();
        return;
    }
    
    const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);

    if (draggedGate) {
        draggedGate.x = x - draggedGate.width / 2;
        draggedGate.y = y - draggedGate.height / 2;
        draw();
    }

    if (connectStart) {
        tempConnection = { x, y };
        draw();
    }
});

canvas.addEventListener('mouseup', (e) => {
    // 패닝 종료
    if (e.button === 1 && isPanning) {
        isPanning = false;
        canvas.style.cursor = 'default';
        return;
    }
    
    const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);
    
    // 우클릭 - 연결 종료
    if (e.button === 2) {
        if (connectStart) {
            handleConnectEnd(x, y);
        }
        return;
    }
    
    // 좌클릭만 처리
    if (e.button !== 0) return;

    if (connectStart) {
        handleConnectEnd(x, y);
        return;
    }

    if (draggedGate) {
        draggedGate = null;
        canvas.style.cursor = 'default';
        return;
    }

    // 새 게이트 추가 (보기 모드에서는 불가)
    if (selectedGateType && !viewMode) {
        const gate = new Gate(selectedGateType, x - 40, y - 30);
        gates.push(gate);
        draw();
    }
});

canvas.addEventListener('mouseleave', () => {
    draggedGate = null;
    isPanning = false;
    if (connectStart) {
        connectStart = null;
        tempConnection = null;
        draw();
    }
});

function handleConnectStart(x, y) {
    for (const gate of gates) {
        const port = gate.getPortAt(x, y);
        if (port && port.type === 'output') {
            connectStart = { gate, port };
            tempConnection = { x, y };
            draw();
            return;
        }
    }
}

function handleConnectEnd(x, y) {
    if (!connectStart) return;

    for (const gate of gates) {
        const port = gate.getPortAt(x, y);
        if (port && port.type === 'input') {
            // 연결 생성
            const conn = new Connection(connectStart.gate, gate, port.index);
            
            // 기존 연결 제거
            const existingIndex = connections.findIndex(
                c => c.to === gate && c.toIndex === port.index
            );
            if (existingIndex >= 0) {
                connections.splice(existingIndex, 1);
            }
            
            connections.push(conn);
            gate.inputs[port.index] = conn;
            break;
        }
    }

    connectStart = null;
    tempConnection = null;
    draw();
}

function handleDelete(x, y) {
    // 게이트 삭제
    const gateIndex = gates.findIndex(g => g.containsPoint(x, y));
    if (gateIndex >= 0) {
        const gate = gates[gateIndex];
        
        // 관련 연결 삭제
        connections = connections.filter(c => c.from !== gate && c.to !== gate);
        
        // 다른 게이트의 입력에서 제거
        gates.forEach(g => {
            g.inputs = g.inputs.filter(conn => !conn || conn.from !== gate);
        });
        
        gates.splice(gateIndex, 1);
        draw();
        return;
    }

    // 연결선 삭제
    const connIndex = findConnectionAt(x, y);
    if (connIndex >= 0) {
        const conn = connections[connIndex];
        conn.to.inputs[conn.toIndex] = null;
        connections.splice(connIndex, 1);
        draw();
    }
}

function findGateAt(x, y) {
    for (let i = gates.length - 1; i >= 0; i--) {
        if (gates[i].containsPoint(x, y)) {
            return gates[i];
        }
    }
    return null;
}

function findConnectionAt(x, y) {
    for (let i = 0; i < connections.length; i++) {
        const conn = connections[i];
        const fromPos = conn.from.getOutputPortPosition();
        const toPos = conn.to.getInputPortPosition(conn.toIndex);
        
        // 간단한 거리 기반 검사
        const dist = distanceToLine(x, y, fromPos.x, fromPos.y, toPos.x, toPos.y);
        if (dist < 10) {
            return i;
        }
    }
    return -1;
}

function distanceToLine(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) {
        param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;

    return Math.sqrt(dx * dx + dy * dy);
}

function draw() {
    // 캔버스 클리어
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 점 패턴 그리기 (줌 적용 전)
    ctx.fillStyle = '#d0d0d0';
    const dotSize = 1.0;
    const dotSpacing = 20;

    for (let x = 0; x < canvas.width; x += dotSpacing) {
        for (let y = 0; y < canvas.height; y += dotSpacing) {
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 줌과 오프셋 적용 시작
    ctx.save();
    ctx.scale(canvasScale, canvasScale);
    ctx.translate(canvasOffsetX, canvasOffsetY);

    // 연결선 그리기
    connections.forEach(conn => conn.draw(ctx));

    // 임시 연결선 그리기
    if (connectStart && tempConnection) {
        const fromPos = connectStart.gate.getOutputPortPosition();
        const value = connectStart.gate.compute();
        
        ctx.strokeStyle = value === 1 ? '#666' : '#bbb';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(tempConnection.x, tempConnection.y);
        ctx.stroke();
        
        ctx.setLineDash([]);
    }

    // 게이트 그리기
    gates.forEach(gate => gate.draw(ctx));
    
    // 줌 적용 종료
    ctx.restore();
}

// 애니메이션 루프
function animate() {
    animationTime++;
    draw();
    requestAnimationFrame(animate);
}

// 초기 그리기 및 애니메이션 시작
animate();
