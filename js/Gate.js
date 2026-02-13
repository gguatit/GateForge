// 게이트 클래스
class Gate {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 60;
        this.value = 0;
        this.inputs = [];
        this.id = Date.now() + Math.random();
        
        // 입력 및 출력 포트 설정
        this.setupPorts();
    }

    setupPorts() {
        switch (this.type) {
            case 'INPUT':
                this.inputCount = 0;
                this.outputCount = 1;
                this.value = 0;
                break;
            case 'OUTPUT':
                this.inputCount = 1;
                this.outputCount = 0;
                break;
            case 'NOT':
                this.inputCount = 1;
                this.outputCount = 1;
                break;
            default:
                this.inputCount = 2;
                this.outputCount = 1;
        }
    }

    getInputPortPosition(index) {
        // 실제 연결된 입력 개수를 고려 (최소 inputCount와 실제 inputs 길이 중 큰 값)
        const actualInputCount = Math.max(this.inputCount, this.inputs.length, index + 1);
        const spacing = this.height / (actualInputCount + 1);
        return {
            x: this.x,
            y: this.y + spacing * (index + 1)
        };
    }

    getOutputPortPosition() {
        return {
            x: this.x + this.width,
            y: this.y + this.height / 2
        };
    }

    compute() {
        if (this.type === 'INPUT') {
            return this.value;
        }

        const inputValues = this.inputs.map(conn => {
            if (conn && conn.from) {
                return conn.from.compute();
            }
            return 0;
        });

        switch (this.type) {
            case 'AND':
                if (inputValues.length === 0) return 0;
                return inputValues.every(v => v === 1) ? 1 : 0;
            case 'OR':
                if (inputValues.length === 0) return 0;
                return inputValues.some(v => v === 1) ? 1 : 0;
            case 'NOT':
                return inputValues[0] === 1 ? 0 : 1;
            case 'NAND':
                if (inputValues.length === 0) return 1;
                return inputValues.every(v => v === 1) ? 0 : 1;
            case 'NOR':
                if (inputValues.length === 0) return 1;
                return inputValues.some(v => v === 1) ? 0 : 1;
            case 'XOR':
                if (inputValues.length === 0) return 0;
                return inputValues.filter(v => v === 1).length === 1 ? 1 : 0;
            case 'XNOR':
                if (inputValues.length === 0) return 1;
                return inputValues.filter(v => v === 1).length === 1 ? 0 : 1;
            case 'OUTPUT':
                return inputValues[0] || 0;
            default:
                return 0;
        }
    }

    draw(ctx) {
        const output = this.compute();
        ctx.save();
        
        // 게이트 심볼 그리기
        switch(this.type) {
            case 'INPUT':
                this.drawInput(ctx, output);
                break;
            case 'OUTPUT':
                this.drawOutput(ctx, output);
                break;
            case 'AND':
                this.drawAnd(ctx, output);
                break;
            case 'OR':
                this.drawOr(ctx, output);
                break;
            case 'NOT':
                this.drawNot(ctx, output);
                break;
            case 'NAND':
                this.drawNand(ctx, output);
                break;
            case 'NOR':
                this.drawNor(ctx, output);
                break;
            case 'XOR':
                this.drawXor(ctx, output);
                break;
            case 'XNOR':
                this.drawXnor(ctx, output);
                break;
        }
        
        ctx.restore();
        
        // 입력 포트 그리기 (실제 연결된 개수만큼)
        ctx.fillStyle = '#333';
        const actualInputCount = Math.max(this.inputCount, this.inputs.length);
        for (let i = 0; i < actualInputCount; i++) {
            const pos = this.getInputPortPosition(i);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }

        // 출력 포트 그리기
        if (this.outputCount > 0) {
            const pos = this.getOutputPortPosition();
            ctx.fillStyle = output === 1 ? '#666' : '#ddd';
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    drawInput(ctx, output) {
        // 육각형 INPUT
        ctx.fillStyle = output === 1 ? '#666' : '#ddd';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const w = this.width * 0.45;
        const h = this.height * 0.38;
        
        ctx.beginPath();
        ctx.moveTo(cx - w + 8, cy - h);
        ctx.lineTo(cx + w - 8, cy - h);
        ctx.lineTo(cx + w, cy);
        ctx.lineTo(cx + w - 8, cy + h);
        ctx.lineTo(cx - w + 8, cy + h);
        ctx.lineTo(cx - w, cy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 값 표시
        ctx.fillStyle = output === 1 ? '#fff' : '#333';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(output.toString(), cx, cy);
    }

    drawOutput(ctx, output) {
        // 육각형 OUTPUT
        ctx.fillStyle = output === 1 ? '#666' : '#ddd';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const w = this.width * 0.45;
        const h = this.height * 0.38;
        
        ctx.beginPath();
        ctx.moveTo(cx - w + 8, cy - h);
        ctx.lineTo(cx + w - 8, cy - h);
        ctx.lineTo(cx + w, cy);
        ctx.lineTo(cx + w - 8, cy + h);
        ctx.lineTo(cx - w + 8, cy + h);
        ctx.lineTo(cx - w, cy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 값 표시
        ctx.fillStyle = output === 1 ? '#fff' : '#333';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(output.toString(), cx, cy);
    }

    drawAnd(ctx, output) {
        // AND 게이트: 직선 + 반원
        ctx.fillStyle = output === 1 ? '#666' : '#ddd';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        
        const x = this.x + 5;
        const y = this.y + 8;
        const w = this.width - 10;
        const h = this.height - 16;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w/2, y);
        ctx.arc(x + w/2, y + h/2, h/2, -Math.PI/2, Math.PI/2);
        ctx.lineTo(x, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 레이블
        ctx.fillStyle = output === 1 ? '#fff' : '#333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('&', x + w/3, y + h/2);
    }

    drawOr(ctx, output) {
        // OR 게이트: 곡선 모양
        ctx.fillStyle = output === 1 ? '#666' : '#ddd';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        
        const x = this.x + 5;
        const y = this.y + 8;
        const w = this.width - 10;
        const h = this.height - 16;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + w * 0.75, y, x + w, y + h/2);
        ctx.quadraticCurveTo(x + w * 0.75, y + h, x, y + h);
        ctx.quadraticCurveTo(x + w * 0.25, y + h/2, x, y);
        ctx.fill();
        ctx.stroke();
        
        // 레이블
        ctx.fillStyle = output === 1 ? '#fff' : '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('≥1', x + w * 0.55, y + h/2);
    }

    drawNot(ctx, output) {
        // NOT 게이트: 삼각형 + 버블
        ctx.fillStyle = output === 1 ? '#666' : '#ddd';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        
        const x = this.x + 5;
        const y = this.y + 8;
        const w = this.width - 14;
        const h = this.height - 16;
        
        // 삼각형
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x + w, y + h/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 버블
        ctx.beginPath();
        ctx.arc(x + w + 5, y + h/2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 레이블
        ctx.fillStyle = output === 1 ? '#fff' : '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('1', x + w/2.5, y + h/2);
    }

    drawNand(ctx, output) {
        // NAND 게이트: AND + 버블
        ctx.fillStyle = output === 1 ? '#666' : '#ddd';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        
        const x = this.x + 5;
        const y = this.y + 8;
        const w = this.width - 20;
        const h = this.height - 16;
        
        // AND 부분
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w/2, y);
        ctx.arc(x + w/2, y + h/2, h/2, -Math.PI/2, Math.PI/2);
        ctx.lineTo(x, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 버블
        ctx.beginPath();
        ctx.arc(x + w/2 + h/2 + 5, y + h/2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 레이블
        ctx.fillStyle = output === 1 ? '#fff' : '#333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('&', x + w/3, y + h/2);
    }

    drawNor(ctx, output) {
        // NOR 게이트: OR + 버블
        ctx.fillStyle = output === 1 ? '#666' : '#ddd';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        
        const x = this.x + 5;
        const y = this.y + 8;
        const w = this.width - 20;
        const h = this.height - 16;
        
        // OR 부분
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + w * 0.75, y, x + w, y + h/2);
        ctx.quadraticCurveTo(x + w * 0.75, y + h, x, y + h);
        ctx.quadraticCurveTo(x + w * 0.25, y + h/2, x, y);
        ctx.fill();
        ctx.stroke();
        
        // 버블
        ctx.beginPath();
        ctx.arc(x + w + 5, y + h/2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 레이블
        ctx.fillStyle = output === 1 ? '#fff' : '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('≥1', x + w * 0.5, y + h/2);
    }

    drawXor(ctx, output) {
        // XOR 게이트: OR + 입력 라인
        ctx.fillStyle = output === 1 ? '#666' : '#ddd';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        
        const x = this.x + 12;
        const y = this.y + 8;
        const w = this.width - 17;
        const h = this.height - 16;
        
        // 입력 라인
        ctx.beginPath();
        ctx.moveTo(x - 6, y);
        ctx.quadraticCurveTo(x + w * 0.18, y + h/2, x - 6, y + h);
        ctx.stroke();
        
        // OR 부분
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + w * 0.75, y, x + w, y + h/2);
        ctx.quadraticCurveTo(x + w * 0.75, y + h, x, y + h);
        ctx.quadraticCurveTo(x + w * 0.25, y + h/2, x, y);
        ctx.fill();
        ctx.stroke();
        
        // 레이블
        ctx.fillStyle = output === 1 ? '#fff' : '#333';
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('=1', x + w * 0.55, y + h/2);
    }

    drawXnor(ctx, output) {
        // XNOR 게이트: XOR + 버블
        ctx.fillStyle = output === 1 ? '#666' : '#ddd';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        
        const x = this.x + 12;
        const y = this.y + 8;
        const w = this.width - 27;
        const h = this.height - 16;
        
        // 입력 라인
        ctx.beginPath();
        ctx.moveTo(x - 6, y);
        ctx.quadraticCurveTo(x + w * 0.18, y + h/2, x - 6, y + h);
        ctx.stroke();
        
        // OR 부분
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + w * 0.75, y, x + w, y + h/2);
        ctx.quadraticCurveTo(x + w * 0.75, y + h, x, y + h);
        ctx.quadraticCurveTo(x + w * 0.25, y + h/2, x, y);
        ctx.fill();
        ctx.stroke();
        
        // 버블
        ctx.beginPath();
        ctx.arc(x + w + 5, y + h/2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 레이블
        ctx.fillStyle = output === 1 ? '#fff' : '#333';
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('=1', x + w * 0.5, y + h/2);
    }

    containsPoint(x, y) {
        return x >= this.x && x <= this.x + this.width &&
               y >= this.y && y <= this.y + this.height;
    }

    getPortAt(x, y) {
        // 입력 포트 확인 (실제 연결된 개수 고려)
        const actualInputCount = Math.max(this.inputCount, this.inputs.length);
        for (let i = 0; i < actualInputCount; i++) {
            const pos = this.getInputPortPosition(i);
            const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
            if (dist < 10) {
                return { type: 'input', index: i };
            }
        }

        // 출력 포트 확인
        if (this.outputCount > 0) {
            const pos = this.getOutputPortPosition();
            const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
            if (dist < 10) {
                return { type: 'output' };
            }
        }

        return null;
    }
}
