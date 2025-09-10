class Environment {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.mapWidth = MAP_WIDTH;
        this.mapHeight = MAP_HEIGHT;
        this.groundHeight = GROUND_HEIGHT;
        this.groundY = GROUND_Y;
        
        // 创建环境实体
        this.groundEntity = new Entity(0, this.groundY, this.mapWidth, this.groundHeight);
        this.groundEntity.addHitbox(0, 0, this.mapWidth, this.groundHeight, "environment");
    }
    
    getGroundEntity() {
    // 确保地面实体有正确的碰撞类型
    this.groundEntity.addHitbox(0, 0, this.mapWidth, this.groundHeight, "environment");
    return this.groundEntity;
    }

    draw(camera) {
        const screenLeft = camera.x;
        const screenRight = camera.x + camera.width;
        
        // 绘制天空背景
        this.ctx.fillStyle = '#78b0e3';
        this.ctx.fillRect(0, 0, this.canvas.width, this.groundY);
        
        // 绘制远处山脉
        this.drawMountains(camera);
        
        // 绘制地面（只绘制摄像机可见部分）
        this.ctx.fillStyle = '#5a3921';
        this.ctx.fillRect(0 - screenLeft, this.groundY, this.mapWidth, this.groundHeight);
        
        // 绘制草地顶部
        this.ctx.fillStyle = '#2a8f55';
        this.ctx.fillRect(0 - screenLeft, this.groundY, this.mapWidth, 5);
    }
    
    drawMountains(camera) {
        const screenLeft = camera.x;
        const screenRight = camera.x + camera.width;
        
        // 绘制远处的山脉
        this.ctx.fillStyle = '#5d8aa8';
        for (let i = 0; i < 10; i++) {
            const x = (i * 300) - screenLeft;
            const height = 80 + Math.sin(i) * 20;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.groundY - height);
            this.ctx.lineTo(x + 150, this.groundY - height - 50);
            this.ctx.lineTo(x + 300, this.groundY - height);
            this.ctx.lineTo(x + 300, this.groundY);
            this.ctx.lineTo(x, this.groundY);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }
}