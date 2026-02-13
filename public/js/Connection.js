// 연결 클래스
class Connection {
    constructor(from, to, toIndex) {
        this.from = from;
        this.to = to;
        this.toIndex = toIndex;
    }

    draw(ctx) {
        const fromPos = this.from.getOutputPortPosition();
        const toPos = this.to.getInputPortPosition(this.toIndex);
        
        const value = this.from.compute();
        ctx.strokeStyle = value === 1 ? '#666' : '#bbb';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        
        // 베지어 곡선으로 부드러운 연결선
        const midX = (fromPos.x + toPos.x) / 2;
        ctx.bezierCurveTo(
            midX, fromPos.y,
            midX, toPos.y,
            toPos.x, toPos.y
        );
        
        ctx.stroke();

        // 신호가 활성(1)일 때만 움직이는 점 표시
        if (value === 1) {
            const numDots = 3;
            const dotRadius = 4;
            
            for (let i = 0; i < numDots; i++) {
                // 각 점의 위치를 시간에 따라 조정
                const offset = (animationTime * 0.002 + i / numDots) % 1;
                
                // 베지어 곡선 상의 점 계산
                const t = offset;
                const x = Math.pow(1 - t, 3) * fromPos.x +
                         3 * Math.pow(1 - t, 2) * t * midX +
                         3 * (1 - t) * Math.pow(t, 2) * midX +
                         Math.pow(t, 3) * toPos.x;
                const y = Math.pow(1 - t, 3) * fromPos.y +
                         3 * Math.pow(1 - t, 2) * t * fromPos.y +
                         3 * (1 - t) * Math.pow(t, 2) * toPos.y +
                         Math.pow(t, 3) * toPos.y;
                
                ctx.fillStyle = '#333';
                ctx.beginPath();
                ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}
