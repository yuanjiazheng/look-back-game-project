// file: js/entities/Arrow.js
class Arrow extends Entity {
    constructor(x, y, target, damage, resourceManager) {
        super(x, y, 20, 5); // 箭矢尺寸
        this.target = target;
        this.damage = damage;
        this.speed = 0.5; // 箭矢飞行速度
        this.type = "Arrow";
        this.faction = "neutral"; // 
        this.hasHit = false; // 是否已命中目标
        
        // 存储资源管理器引用
        this.resourceManager = resourceManager;
        
        // 添加精确的 hitbox
        this.addHitbox(0, 0, 20, 5, "Arrow");
        
        // 计算初始方向
        this.calculateDirection();
        
        // 加载箭矢图像
        this.loadImage();
    }
    
    loadImage() {
        this.arrowImage = this.resourceManager.getResource('Arrow');
    }
    
    calculateDirection() {
        if (!this.target || !this.target.isActive) {
            this.isActive = false;
            return;
        }
        
        const targetHitbox = this.target.hitboxes[0];
        const targetCenterX = targetHitbox.x + targetHitbox.width / 2;
        const targetCenterY = targetHitbox.y + targetHitbox.height / 2;
        
        const dx = targetCenterX - this.x;
        const dy = targetCenterY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 设置初始速度方向
        this.velocityX = (dx / distance) * this.speed;
        this.velocityY = (dy / distance) * this.speed;
        
        // 设置箭矢朝向
        this.rotation = Math.atan2(dy, dx);
    }
    
    update(deltaTime, game) {
        super.update(deltaTime);   
        // 检查是否命中目标
            const collisions = game.hitboxSystem.getCollisionsForEntity(this);
            for (const collision of collisions) {
                if (collision.entity.name === "enemy") {
                    collision.entity.takeDamage(10);
                    this.isActive = false;
                    break;
                }
            }
            
            // 检查是否超出地图边界
            if (this.x < 0 || this.x > MAP_WIDTH || this.y < 0 || this.y > MAP_HEIGHT) {
                game.EntityManager.removeEntity(this);
            }
        
    }
    
    
    draw(ctx, camera) {
        if (!this.isActive) return;
        
        const screenPos = worldToScreen(this.x, this.y, camera);
        
        ctx.save();
        
        // 移动到箭矢中心
        ctx.translate(screenPos.x + this.width / 2, screenPos.y + this.height / 2);
        
        // 应用旋转
        ctx.rotate(this.rotation);
        
        // 使用贴图绘制箭矢
        if (this.arrowImage) {
            ctx.drawImage(
                this.arrowImage,
                -this.width / 2, 
                -this.height / 2,
                this.width,
                this.height
            );
        } else {
            // 如果没有图像，使用默认绘制
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }
        
        ctx.restore();
        
        // 绘制hitbox（调试用）
        if (window.DEBUG_HITBOXES) {
            super.drawHitboxes(ctx, camera);
        }
    }
}