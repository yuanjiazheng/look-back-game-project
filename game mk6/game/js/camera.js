class Camera {
    constructor(canvas, mapWidth, mapHeight) {
        this.canvas = canvas;
        this.x = 0;
        this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.followSpeed = 0.8;
        this.xOffset = 0.5; // 摄像机在玩家前方的偏移比例
    }

    // 更新摄像机位置以跟随目标
    follow(target) {
        // 计算目标位置（考虑偏移）
        const targetX = target.x - this.width * this.xOffset;
        
        // 使用线性插值平滑移动摄像机
        this.x += (targetX - this.x) * this.followSpeed;
        
        // 限制摄像机不超出地图边界
        this.x = Math.max(0, Math.min(this.x, this.mapWidth - this.width));
    }
}