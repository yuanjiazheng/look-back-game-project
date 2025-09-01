// 基础实体类
class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.hitboxes = [];
        this.isActive = true;
        this.type = "entity";
        
        // 添加动画系统
        this.animator = new Animator();
        this.flipX = false; // 用于水平翻转精灵
    }
    
    // 设置hitbox引用的方法
    sethitbox(hitboxSystem) {
        this.hitboxSystem = hitboxSystem;
    }

    //re的引用方法
    setremanager(ResourceManager) {
        this.ResourceManager = ResourceManager;
    }

    //game的引用方法
    setgame(game) {
        this.game = game;
    }

    update(deltaTime) {
        // 基础更新逻辑
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
        
        // 更新所有hitbox的位置
        this.updateHitboxes();
        
        // 更新动画
        this.animator.update(deltaTime);
    }
    
    draw(ctx, camera) {
        // 基础绘制逻辑 - 由子类重写
        const screenPos = worldToScreen(this.x, this.y, camera);
        
        // 如果有动画，使用动画绘制
        if (this.animator.currentAnimation) {
            const spritesheet = this.animator.currentAnimation.spritesheet;
            const frameIndex = this.animator.getCurrentFrame();
            const frameWidth = this.animator.currentAnimation.frameWidth;
            const frameHeight = this.animator.currentAnimation.frameHeight;
            
            ctx.save();
            
            // 处理水平翻转
            if (this.flipX) {
                ctx.scale(-1, 1);
                ctx.drawImage(
                    spritesheet,
                    frameIndex * frameWidth, 0, frameWidth, frameHeight,
                    -screenPos.x - this.width, screenPos.y, this.width, this.height
                );
            } else {
                ctx.drawImage(
                    spritesheet,
                    frameIndex * frameWidth, 0, frameWidth, frameHeight, //原矩形大小
                    screenPos.x, screenPos.y, this.width, this.height  //目标大小
                );
            }
            
            ctx.restore();
        } else {
            // 如果没有动画，使用默认绘制
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(screenPos.x, screenPos.y, this.width, this.height);
        }
        
        // 绘制hitbox（调试用）
        if (window.DEBUG_HITBOXES) {
            this.drawHitboxes(ctx, camera);
        }
    }
    
    addHitbox(offsetX, offsetY, width, height, type = "default") {
        this.hitboxes.push({
            x: this.x + offsetX,
            y: this.y + offsetY,
            width: width,
            height: height,
            offsetX: offsetX,
            offsetY: offsetY,
            type: type
        });
    }

    // 获取指定类型的第一个hitbox
    getHitboxByType(type) {
        return this.hitboxes.find(hitbox => hitbox.type === type);
    }
    
    // 获取指定类型的所有hitbox
    getHitboxesByType(type) {
        return this.hitboxes.filter(hitbox => hitbox.type === type);
    }
    
    // 获取指定索引的hitbox
    getHitboxAtIndex(index) {
        return this.hitboxes[index];
    }
    
    updateHitboxes() {
        for (const hitbox of this.hitboxes) {
            hitbox.x = this.x + hitbox.offsetX;
            hitbox.y = this.y + hitbox.offsetY;
        }
    }
    
    drawHitboxes(ctx, camera) {
        for (const hitbox of this.hitboxes) {
            const screenPos = worldToScreen(hitbox.x, hitbox.y, camera);
            ctx.strokeStyle = hitbox.type === "damage" ? '#ff0000' : 
                             hitbox.type === "vulnerable" ? '#00ff00' : '#ffff00';
            ctx.lineWidth = 2;
            ctx.strokeRect(screenPos.x, screenPos.y, hitbox.width, hitbox.height);
            
            // 显示hitbox类型
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Arial';
            ctx.fillText(hitbox.type, screenPos.x + 2, screenPos.y + 10);
        }
    }
}