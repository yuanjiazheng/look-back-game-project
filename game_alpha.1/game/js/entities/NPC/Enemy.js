class Enemy extends NPC {
    constructor(x, y, resourceManager) {
        super(x, y, 25, 45, "enemy", "hostile", 0, 1);
        this.speed = 0.1;
        this.interactionRange = 50;
        this.detectionRange = 50;
        this.color = '#273239ff';
        
        // 存储资源管理器引用
        this.resourceManager = resourceManager;
        
        // 添加精确的 hitbox
        this.addHitbox(0, 0, 25, 45, "Enemy");
        
    }

    update(deltaTime, game) {
        super.update(deltaTime,game);
    }

    updateAI(game) {
        // 如果没有金币
        if (this.goldCount == 0) {
            this.setTarget(this.game.player);
            this.behaviorState = "follow";
            this.nearestFriendly =this.findNearestFriendly();
            if (this.nearestFriendly&&this.nearestFriendly.goldCount !=0) {
                // 找到有金币的友好，设为目标并攻击
                this.setTarget(this.nearestFriendly);
                this.behaviorState = "attack";
            }
        } 
        // 执行当前行为状态
        super.updateAI(game);
    }
    
    // 重写攻击行为
    attackBehavior(game) {
        if (this.target && this.target.isActive) {
            this.stealGoldFromTarget();
            // 偷到金币后立即逃跑
            if (this.goldCount > 0) {
                this.setTarget(this.game.player);
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