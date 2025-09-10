class Gold extends Entity {
    constructor(x, y, value = 1, throwVelocityX = 0, throwVelocityY = 0) {
        super(x, y, 20, 20);
        this.color = '#FFD700';
        this.type = "gold";
        this.rotation = 0;
        this.collected = false;
        this.collectionTime = 0;
        this.isOnGround = false;
        this.gravity = 0.2;
        this.bounceFactor = 0;
        this.thrown = false; // 标记是否是被扔出的金币
        
        // 如果被扔出，设置初始速度
        if (throwVelocityX !== 0 || throwVelocityY !== 0) {
            this.velocityX = throwVelocityX;
            this.velocityY = throwVelocityY;
            this.thrown = true;
        }
        
        // 添加圆形hitbox
        this.addHitbox(0, 0, 20, 20, "gold");
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 如果被收集，更新收集时间
        if (this.collected) {
            this.collectionTime += deltaTime;
            
            // 收集后一段时间消失
            if (this.collectionTime > 100) {
                this.isActive = false;
            }
            return; // 被收集后不再处理物理
        }
        
        // 应用重力（如果不在平台上）
        if (!this.isOnGround) {
            this.velocityY += this.gravity;
            this.y += this.velocityY;
            this.x += this.velocityX; // 水平移动
        } else {
            // 在地面上时，水平速度逐渐减小
            this.velocityX *= 0.7;
            if (Math.abs(this.velocityX) < 0.1) {
                this.velocityX = 0;
            }
            this.x += this.velocityX;
        }
        
        // 检测与地面的碰撞
        this.checkGroundCollision();
        
        // 检测与墙壁的碰撞（防止金币飞出地图）
        this.checkWallCollision();
    }
    
    checkGroundCollision() {
        // 检查金币是否与地面碰撞
        const footHitbox = {
            x: this.x + 2,
            y: this.y + this.height,
            width: this.width - 4,
            height: 5
        };
        
        // 获取与地面实体的碰撞
        const groundCollisions = this.game.hitboxSystem.getCollisionsFor(footHitbox, "environment");
        
        if (groundCollisions.length > 0 && this.velocityY > 0) {
            // 找到最高的地面碰撞点
            let highestGround = GROUND_Y;
            groundCollisions.forEach(collision => {
                if (collision.entity.type === "environment" && collision.hitbox.y < highestGround) {
                    highestGround = collision.hitbox.y;
                }
            });
            
            // 放置金币在地面上
            this.y = highestGround - this.height;
            this.velocityY = -this.velocityY * this.bounceFactor; // 弹跳
            
            // 如果弹跳速度很小，则认为金币已经稳定
            if (Math.abs(this.velocityY) < 0.5) {
                this.velocityY = 0;
                this.isOnGround = true;
                this.thrown = false; // 落地后不再是被扔出的状态
            }
        } else {
            this.isOnGround = false;
        }
    }
    
    checkWallCollision() {
        // 检查与左右边界的碰撞
        if (this.x < 0) {
            this.x = 0;
            this.velocityX = -this.velocityX * this.bounceFactor; // 反弹
        } else if (this.x + this.width > MAP_WIDTH) {
            this.x = MAP_WIDTH - this.width;
            this.velocityX = -this.velocityX * this.bounceFactor; // 反弹
        }
    }
    
    draw(ctx, camera) {
        if (!this.isActive) return;
        
        const screenPos = worldToScreen(this.x, this.y, camera);
        
        // 保存当前状态
        ctx.save();
        
        // 移动到金币中心
        ctx.translate(screenPos.x + this.width/2, screenPos.y + this.height/2);
        
        // 应用旋转
        ctx.rotate(this.rotation);
        
        // 绘制金币圆形
        ctx.fillStyle = this.collected ? '#FFFF00' : this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制金币内部图案
        ctx.fillStyle = '#D4AF37';
        ctx.beginPath();
        ctx.arc(0, 0, this.width/3, 0, Math.PI * 2);
        ctx.fill();
        
        // 恢复状态
        ctx.restore();

        // 绘制hitbox（调试用）
        if (window.DEBUG_HITBOXES) {
            super.drawHitboxes(ctx, camera);
            
            // 绘制地面检测区域
            const footScreenPos = worldToScreen(
                this.x + 2, 
                this.y + this.height, 
                camera
            );
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 1;
            ctx.strokeRect(
                footScreenPos.x, 
                footScreenPos.y, 
                this.width - 4, 
                5
            );
            
            // 显示速度信息
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Arial';
            ctx.fillText(
                `vx: ${this.velocityX.toFixed(1)}, vy: ${this.velocityY.toFixed(1)}`, 
                screenPos.x, 
                screenPos.y - 10
            );
        }
    }

}