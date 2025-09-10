class HammerStore extends Entity{
    constructor(x, y, resourceManager) {
        super(x, y, 100, 50);
        this.type = "Store";
        this.name = "HammerStore"
        this.resourceManager = resourceManager;
        this.color = '#7bac93ff';
        this.Hammercount = 0;
        this.maxHammercount = 4;
        this.Hammerprice = 3;
        this.interactionRange = 50;
        this.currentDialog = null;
        
        // 存储资源管理器引用
        this.resourceManager = resourceManager;

        // 添加hitbox
        this.addHitbox(0,0,100,50, "HammerStore"); // 主体hitbox
        
    }

    draw(ctx,camera){
        const screenPos = worldToScreen(this.x, this.y, camera);
        ctx.fillStyle = this.color;
        ctx.fillRect(screenPos.x, screenPos.y, this.width, this.height);
        ctx.fillStyle = '#000000ff';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(this.Hammercount.toString(), screenPos.x + this.width/2,screenPos.y+5);
    }

    

    update(deltaTime,game)
    {
        super.update(deltaTime,game);
        const player = game.player;
        const isPlayerNear = player && this.isInRange(player, this.interactionRange);
        if (isPlayerNear) {
            // 显示交互提示对话框
            this.showInteractDialog(game);
            // 检查玩家是否按下交互键
            if (game.input.isInteractPressed && game.input.isInteractPressed()) {
                this.addHammer();
            }
        } else {
            // 隐藏交互提示对话框
            this.hideInteractDialog(game);
        }
    }

    addHammer()
    {
        if(this.game.player.goldCount>3)
        {
        if(this.Hammercount < this.maxHammercount)
        {
            this.Hammercount++;
            this.game.player.goldCount -=3;
        }
        else{
            this.game.dialogSystem.showDialog(this, "已达上限!", 1500);
        }
        }
        else{
            this.game.dialogSystem.showDialog(this, "金币不足!", 1500);
        }
    }

    showInteractDialog(game) {
        if (this.currentDialog) return; // 如果对话框已显示，则不重复显示
        let dialogText;
        
        if (this.Hammercount < this.maxHammercount) {
            dialogText = `按 E 键购买一把锤头\n需要 ${this.Hammerprice} 金币`;
        } else {
            dialogText = "你存储的锤头上线已达最大";
        }
        
        // 使用对话框系统显示提示
            this.currentDialog = game.dialogSystem.showDialog(this, dialogText, 100000); // 长时间显示
    }

    hideInteractDialog(game) {
        if (this.currentDialog) {
            if (game.dialogSystem) {
                game.dialogSystem.hideDialog(this.currentDialog);
            }
            this.currentDialog = null;
        }
    }

}