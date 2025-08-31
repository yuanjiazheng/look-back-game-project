class Obstacle extends Entity {
    constructor(x, y) {
        super(x, y, 40, 60);
        this.color = '#e74c3c';
        this.type = "obstacle";
        
        // 添加hitbox
        this.addHitbox(0, 0, 40, 60, "damage"); // 障碍物主体
    }
    
    draw(ctx, camera) {
        const screenPos = worldToScreen(this.x, this.y, camera);
        ctx.fillStyle = this.color;
        ctx.fillRect(screenPos.x, screenPos.y, this.width, this.height);
        
        // 绘制hitbox（调试用）
        if (window.DEBUG_HITBOXES) {
            super.drawHitboxes(ctx, camera);
        }
    }
}