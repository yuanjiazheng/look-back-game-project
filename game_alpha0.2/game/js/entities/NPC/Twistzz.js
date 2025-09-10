// file: js/entities/Twistzz.js
class Twistzz extends NPC {
    constructor(x, y, resourceManager) {
        super(x, y, 128, 128, "twistzz", "friendly", 1, 1);
        this.speed = 0.1;
        this.detectionRange = 200;  // 弓箭手有更远的检测范围
        this.interactionRange = 200; // 弓箭手的攻击范围
        this.attackCooldown = 0;
        this.attackRate = 1500; // 攻击间隔1.5秒
        this.attackDamage = 10; // 攻击伤害

        // 存储资源管理器引用
        this.resourceManager = resourceManager;
        
        // 添加精确的 hitbox
        this.addHitbox(50, 35, 25, 45, "vulnerable");
        
        // 加载动画
        this.loadAnimations();
    }
    
    loadAnimations() {
        const RufugeeIdle = this.resourceManager.getResource('PlayerIdlesheet');
        const RufugeeWalk = this.resourceManager.getResource('PlayerWalksheet');
        
        if (RufugeeIdle && RufugeeWalk) {
            this.animator.addAnimation('idle', new Animation(
                RufugeeIdle, 128, 128, 150, [0, 1, 2, 3, 4, 5], true,
            ));
            
            this.animator.addAnimation('walk', new Animation(
                RufugeeWalk, 128, 128, 100, [0, 1, 2, 3, 4, 5, 6, 7], true,
            ));
            
            this.animator.playAnimation('idle');
        }
    }
    
    update(deltaTime, game) {
        super.update(deltaTime, game);
        
        // 更新攻击冷却时间
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
    }
    
    updateAI(game) {
        // 寻找最近的敌人
        const nearestEnemy = this.findNearestEnemy();
        
        if (nearestEnemy && this.isInRange(nearestEnemy, this.detectionRange)) {
            // 如果敌人在范围内，设置目标并攻击
            this.setTarget(nearestEnemy);
            this.behaviorState = "attack";
            
            // 如果在攻击范围内且冷却结束，进行攻击
            if (this.isInRange(nearestEnemy, this.interactionRange) && this.attackCooldown <= 0) {
                this.attackBehavior(game);
                }
        } else {
            // 没有发现敌人时执行默认行为
            super.updateAI(game);
        }
    }
    
    findNearestEnemy() {
        const enemyEntities = this.game.EntityManager.getEntitiesByFaction("hostile");
        let nearestEnemy = null;
        let minDistance = this.detectionRange;
        
        for (const enemy of enemyEntities) {
            if (!enemy.isActive) continue;
            
            const distance = this.getDistanceTo(enemy);
            if (distance < minDistance) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        }
        
        return nearestEnemy;
    }
    
    attackBehavior(game) {
        if (this.target && this.target.isActive) {
            // 创建箭矢并发射
            const arrow = new Arrow(
                this.x + (this.flipX ? -20 : this.width - 20),
                this.y + this.height / 2,
                this.target,
                this.attackDamage,
                this.resourceManager
            );
            
            // 添加到游戏实体管理器
            game.EntityManager.addEntity(arrow, "Arrow");
            
            // 重置攻击冷却
            this.attackCooldown = this.attackRate;
            
            // 播放攻击动画（如果有）
            console.log("Twistzz 发射了箭矢!");
        }
    }
    
    draw(ctx, camera) {
        super.draw(ctx, camera);
        
        // 绘制调试信息
        if (window.DEBUG_HITBOXES) {
            const myHitbox = this.hitboxes[0];
            const myCenterX = myHitbox.x + myHitbox.width / 2;
            const myCenterY = myHitbox.y + myHitbox.height / 2;
            const screenCenter = worldToScreen(myCenterX, myCenterY, camera);
            
            // 绘制攻击范围
            ctx.beginPath();
            ctx.arc(screenCenter.x, screenCenter.y, this.interactionRange, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 165, 0, 0.3)';
            ctx.stroke();
            
            // 绘制检测范围
            ctx.beginPath();
            ctx.arc(screenCenter.x, screenCenter.y, this.detectionRange, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
            ctx.stroke();
        }
    }
}
