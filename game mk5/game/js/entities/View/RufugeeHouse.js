class RufugeeHouse extends Entity{
    constructor(x, y, resourceManager) {
        super(x, y, 100, 50);
        this.type = "RufugeeHouse";
        this.resourceManager = resourceManager;
        this.color = '#273239ff';
        this.rufugeeNumber = 0;
        
        // 存储资源管理器引用
        this.resourceManager = resourceManager;

        // 添加hitbox
        this.addHitbox(0,0,100,50, "RufugeeHouse"); // 主体hitbox
        
    }

    draw(ctx,camera){
        const screenPos = worldToScreen(this.x, this.y, camera);
        ctx.fillStyle = this.color;
        ctx.fillRect(screenPos.x, screenPos.y, this.width, this.height);

        if (window.DEBUG_HITBOXES) {
            this.drawHitboxes(ctx, camera);
    }
    }

    AddRufugee(){
        // 检查RufugeeHouse是否有Rufugee
        if (this.rufugeeNumber < 2)
        {
        const myHitbox = this.hitboxes[0];
        const addX = myHitbox.x + myHitbox.width/2;
        const rufugee = new Rufugee( addX - 30, GROUND_Y-80, this.resourceManager, myHitbox.x, this);
        this.game.npcManager.addNPC(rufugee);
        this.game.hitboxSystem.registerEntity(rufugee);
        this.rufugeeNumber++;
        }
    }

    update(deltaTime)
    {
        //决定是否添加rufugee
        if(this.game.time.NowTime == 5||this.game.time.NowTime == 6)
        {
        this.AddRufugee();
        }
    }
}