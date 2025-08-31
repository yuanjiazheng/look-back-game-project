class Player extends Entity {
    constructor(x, y, resourceManager) {
        super(x, y, 128, 128);
        this.speed = 0.5;
        this.direction = 'right';
        this.color = '#3498db';
        this.type = "player";
        this.goldCount = 5; // 添加金币数量属性
        this.gravity = 0.2;
        
        // 添加hitbox
        this.addHitbox(50,35,25,45, "vulnerable"); // 主体hitbox
        
        // 存储资源管理器引用
        this.resourceManager = resourceManager;
        
        // 加载动画
        this.loadAnimations();
    }
    
    loadAnimations() {
        // 从资源管理器获取精灵图
        const PlayerIdle = this.resourceManager.getResource('PlayerIdlesheet');
        const PlayerWalk = this.resourceManager.getResource('PlayerWalksheet');
        
        if (PlayerIdle&&PlayerWalk) {
            this.animator.addAnimation('idle', new Animation(
                PlayerIdle, 128, 128, 150, [0,1,2,3,4,5], true
            ));
            this.animator.addAnimation('walk', new Animation(
                PlayerWalk, 128, 128, 100, [0,1,2,3,4,5,6,7], true
            ));
            
            // 设置默认动画
            this.animator.playAnimation('idle');
            
            // 标记精灵图已加载
            this.spritesheetLoaded = true;
        } else {
            console.error("玩家精灵图未找到");
            this.spritesheetLoaded = false;
        }
    }
      // 检查玩家与环境的碰撞
    checkPlayerEnvironmentCollisions() {
        // 检查玩家是否站在地面上
        const playerhitbox = this.hitboxes[0];
        const footHitbox = {
            x: playerhitbox.x + 5,
            y: playerhitbox.y + playerhitbox.height,
            width: playerhitbox.width - 10,
            height: 5
        };
        
        const groundCollisions = this.hitboxSystem.getCollisionsFor(footHitbox,"environment");
        if(groundCollisions.length > 0)
        {
           let highestGround = GROUND_Y;
            groundCollisions.forEach(collision => {
                if (collision.entity.type === "environment" && collision.hitbox.y < highestGround) {
                    highestGround = collision.hitbox.y;
                }
            });

            //!!!不能调整hitbox的位置，要调整只能调实体位置，让hitbox跟着实体移动
            this.isOnGround = true;
            this.y = highestGround - playerhitbox.height-35;
            this.velocityY = 0; 
        }
        else {
            this.isOnGround = false;
        }
 
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 确保玩家不超出地图边界
        this.x = clamp(this.x, 0, MAP_WIDTH - this.width);
        
        // 根据玩家状态更新动画
        this.updateAnimation();

        //
        this.checkPlayerEnvironmentCollisions();
        if (!this.isOnGround) {
            this.velocityY += this.gravity;
            this.y += this.velocityY;
        }
    }
    
    updateAnimation() {
        // 根据玩家状态选择适当的动画
        // 这里只是示例，你需要根据实际游戏逻辑调整
         if (this.velocityX !== 0) {
            this.animator.playAnimation('walk');
        } else {
            this.animator.playAnimation('idle');
        }
        
        // 根据方向设置翻转
        this.flipX = this.direction === 'left';
    }
    
    // 确认移动方向，并给速度
    move(direction) {
        if (direction === 'left') {
            this.velocityX = -this.speed;
            this.direction = 'left';
        } else if (direction === 'right') {
            this.velocityX = this.speed;
            this.direction = 'right';
        } else {
            this.velocityX = 0;
        }
    }

    
}