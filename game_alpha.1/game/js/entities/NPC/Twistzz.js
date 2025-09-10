class twistzz extends NPC {
    constructor(x, y, resourceManager) {
        super(x, y, 128, 128, "twistzz", "friendly", 1 , 1);
        this.speed = 0.1;
        this.detectionRange = 200;
        this.interactionRange = 20;

         // 设置徘徊范围
        this.wanderRange = 300;

        // 存储资源管理器引用
        this.resourceManager = resourceManager;
        
        // 添加精确的 hitbox
        this.addHitbox(50,35,25,45, "vulnerable");
        
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
    // 首先检测附近的··(弓箭)还是直接追踪工具实体吧，追踪最近的
    //目标为金币的条件：检测到金币且现有金币数量小于其能够拥有的最大值

    
    super.updateAI(game);
}
}