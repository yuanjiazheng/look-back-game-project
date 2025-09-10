class Enemy extends NPC {
    constructor(x, y, resourceManager) {
        super(x, y, 25, 45, "enemy", "hostile", 0, 1);
        this.speed = 0.1;
        this.interactionRange = 50;
        this.detectionRange = 50;
        this.color = '#273239ff';

        this.attackCooldown = 0;
        this.attackRate = 1000; // 1秒攻击一次(攻击墙)
        //血量
        this.health=10;
        
        // 存储资源管理器引用
        this.resourceManager = resourceManager;
        
        // 添加精确的 hitbox
        this.addHitbox(0, 0, 25, 45, "Enemy");
        
    }

    update(deltaTime, game) {
        super.update(deltaTime, game);
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
    }

    updateAI(game) {
        // 首先检查附近是否有墙
        const nearestWall = this.findNearestWall();
        if (nearestWall) {
            this.setTarget(nearestWall);
            this.behaviorState = "attackwall";
        } else {
            // 如果没有墙，执行原来的逻辑
            if (this.goldCount == 0) {
                this.setTarget(this.game.player);
                this.behaviorState = "follow";
                this.nearestFriendly = this.findNearestFriendly();
                if (this.nearestFriendly && this.nearestFriendly.goldCount != 0) {
                    this.setTarget(this.nearestFriendly);
                    this.behaviorState = "attack";
                }
            }
        }
        super.updateAI(game);
    }


    // 在Enemy类中添加takeDamage方法
    takeDamage(amount) {
        console.log(`${this.type} 受到 ${amount} 点伤害`);
        this.health -= amount;
        if (this.health <= 0) {
            
        this.isActive = false;
        this.game.EntityManager.removeEntity(this);
    }
    }

    findNearestWall() {
        let nearestWall = null;
        let minDistance = this.detectionRange;
        for (const entity of this.game.EntityManager.entities) {
            if (entity.type === "wall" && entity.isActive && entity.isBuilt()) {
                const distance = this.getDistanceTo(entity);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestWall = entity;
                }
            }
        }
        return nearestWall;
    }
    
    // 重写攻击行为
    attackBehavior(game) {
        if (this.target && this.target.isActive) {
            this.stealGoldFromTarget();
            // 偷到金币后立即逃跑
            if (this.goldCount > 0) {
                this.setTarget(this.game.home);
                this.behaviorState = "flee";
                }
            }
        } 
    
    // 寻找最近的友好NPC
    findNearestFriendly() {
        const friendlyEntities = this.game.EntityManager.getEntitiesByFaction("friendly");
        let nearestFriendly = null;
        let minDistance = this.interactionRange;
        for (const npc of friendlyEntities) {
            if (!npc.isActive) continue;
            const distance = this.getDistanceTo(npc);
            if (distance < minDistance) {
                minDistance = distance;
                nearestFriendly = npc;
            }
        }
        
        return nearestFriendly;
    }
    
    // 从目标偷取金币
    stealGoldFromTarget() {
        if (this.target) {
            // 从目标那里偷取一枚金币
            this.target.goldCount--;
            this.goldCount++;   
            console.log(`${this.type} 从 ${this.target.type} 偷取了 1 金币`);
        }
    }
    
    draw(ctx, camera) {
        // 绘制敌人
        const myHitbox = this.hitboxes[0];
        const screenPos = worldToScreen(myHitbox.x, myHitbox.y, camera);
        
        ctx.fillStyle = this.color;
        ctx.fillRect(screenPos.x, screenPos.y, myHitbox.width, myHitbox.height);
        
        // 调用父类的绘制方法以显示调试信息
        super.draw(ctx, camera);
    }
}