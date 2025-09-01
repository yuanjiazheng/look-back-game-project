class Rufugee extends NPC {
    constructor(x, y, resourceManager, wanderCenterX, Rufugeehouse) {
        super(x, y, 128, 128, "rufugee", "friendly", 0 , 1);
        this.speed = 0.05;
        this.detectionRange = 200;
        this.interactionRange = 20;
        this.wanderCenterX = wanderCenterX;
        this.Rufugeehouse = Rufugeehouse;
         // 设置徘徊范围
        this.wanderRange = 150; // 难民有更大的徘徊范围

        // 存储资源管理器引用
        this.resourceManager = resourceManager;
        
        // 添加精确的 hitbox
        this.addHitbox(50,35,25,45, "Rufugee");
        
        // 加载动画
        this.loadAnimations();

    }
    
    loadAnimations() {
        const RufugeeIdle = this.resourceManager.getResource('PlayerIdlesheet');
        const RufugeeWalk = this.resourceManager.getResource('PlayerWalksheet');
        
        if (RufugeeIdle&&RufugeeWalk) {
            this.animator.addAnimation('idle', new Animation(
                RufugeeIdle, 128, 128, 150, [0, 1, 2, 3, 4, 5], true,
            ));
            
            this.animator.addAnimation('walk', new Animation(
                RufugeeWalk, 128, 128, 100, [0, 1, 2, 3, 4, 5, 6, 7], true,
            ));
            
            this.animator.playAnimation('idle');
        }
    }
    
    updateAI(game) {
    // 首先检测附近的金币
    
    const goldEntities = game.goldCollectionSystem.goldEntities;
    let nearestGold = null;
    let minDistance = this.detectionRange;
    
    for (const gold of goldEntities) {
        if (!gold.isActive || gold.collected) continue;
        
        const distance = this.getDistanceTo(gold);
        if (distance < minDistance) {
            minDistance = distance;
            nearestGold = gold;
        }
    }
    //目标为金币的条件：检测到金币且现有金币数量小于其能够拥有的最大值
    if (nearestGold&&this.goldCount<this.maxCountGold) {
        this.setTarget(nearestGold);
        this.behaviorState = "follow";
    } 
    if(this.goldCount==1)
    {
        this.Rufugeehouse.rufugeeNumber--;
    }
    
    super.updateAI(game);
}

}