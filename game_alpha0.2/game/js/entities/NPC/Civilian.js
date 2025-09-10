class Civilian extends NPC {
    constructor(x, y, resourceManager) {
        super(x, y, 128, 128, "civilian", "friendly", 1 , 1);
        this.speed = 0.1;
        this.detectionRange = 200;
        this.interactionRange = 20;

         // 设置徘徊范围
        this.wanderRange = 300;

        // 存储资源管理器引用
        this.resourceManager = resourceManager;
        
        // 添加精确的 hitbox
        this.addHitbox(50,35,25,45, "civilian");
        
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
    super.updateAI(game);
    if(this.goldCount==0)
    {
        this.transformToName = "rufugee";
        this.game.EntityManager.addEntity(this.transform())
        this.isActive = false;
    }
}
}