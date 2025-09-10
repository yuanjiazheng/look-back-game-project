class Home extends Entity {
    constructor(x, y, resourceManager) {
        super(x, y, 100, 100);
        this.type = "home";
        this.name = "home";
        this.resourceManager = resourceManager;
        this.level = 1;
        this.maxLevel = 5;
        this.upgradeCosts = [0, 100, 250, 500, 1000]; // 各级升级成本
        this.interactionRange = 60;
        this.interactPromptVisible = false;
        this.currentDialog = null; // 当前显示的对话框
        
        // 存储资源管理器引用
        this.resourceManager = resourceManager;

        // 添加hitbox
        this.addHitbox(0, 0, 100, 100, "Home");
        
    }
    
    update(deltaTime, game) {
        super.update(deltaTime,game);
        
        // 检查玩家是否在交互范围内
        const player = game.player;
        const isPlayerNear = player && this.isInRange(player, this.interactionRange);
        if (isPlayerNear) {
            // 显示交互提示对话框
            this.showInteractDialog(game);
            // 检查玩家是否按下交互键
            if (game.input.isInteractPressed && game.input.isInteractPressed()) {
                this.showUpgradeInterface(game);
            }
        } else {
            // 隐藏交互提示对话框
            this.hideInteractDialog(game);
        }
    }
    
    draw(ctx, camera) {
        const screenPos = worldToScreen(this.x, this.y, camera);
            // 默认绘制
            ctx.fillStyle = this.getColorForLevel();
            ctx.fillRect(screenPos.x, screenPos.y, this.width, this.height);
        
        // 绘制等级徽章
        this.drawLevelBadge(ctx, screenPos);
        
        // 绘制hitbox（调试用）
        if (window.DEBUG_HITBOXES) {
            this.drawHitboxes(ctx, camera);
            const myHitbox = this.hitboxes[0];
            const myCenterX = myHitbox.x + myHitbox.width / 2;
            const myCenterY = myHitbox.y + myHitbox.height / 2;
            const screenCenter = worldToScreen(myCenterX, myCenterY, camera);
            // 绘制检测范围
            ctx.beginPath();
            ctx.arc(screenCenter.x, screenCenter.y, this.interactionRange, 0, Math.PI * 2);
            ctx.strokeStyle ='rgba(255, 0, 0, 0.3)';
            ctx.stroke();
        }
    }
    
    getColorForLevel() {
        const colors = [
            '#8B4513', // 等级1 - saddlebrown
            '#A0522D', // 等级2 - sienna
            '#CD853F', // 等级3 - peru
            '#D2691E', // 等级4 - chocolate
            '#F4A460'  // 等级5 - sandybrown
        ];
        return colors[this.level - 1] || colors[0];
    }
    
    drawLevelBadge(ctx, screenPos) {
        // 绘制等级徽章
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(screenPos.x + 90, screenPos.y + 10, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.level.toString(), screenPos.x + 90, screenPos.y + 10);
    }
    
    // 显示交互对话框
    showInteractDialog(game) {
        if (this.currentDialog) return; // 如果对话框已显示，则不重复显示
        
        const upgradeInfo = this.getUpgradeInfo();
        let dialogText;
        
        if (upgradeInfo.canUpgrade) {
            dialogText = `按 E 键升级\n升级需要 ${upgradeInfo.cost} 金币`;
        } else {
            dialogText = "家园已达到最高等级";
        }
            this.currentDialog = game.dialogSystem.showDialog(this, dialogText, 100000); // 长时间显示
    }
    
    // 隐藏交互对话框
    hideInteractDialog(game) {
        if (this.currentDialog) {
            if (game.dialogSystem) {
                game.dialogSystem.hideDialog(this.currentDialog);
            }
            this.currentDialog = null;
        }
    }
    
    
    showUpgradeInterface(game) {
        // 显示升级界面
        if (this.level < this.maxLevel) {
            const cost = this.upgradeCosts[this.level];
            
            if (game.player.goldCount >= cost) {
                // 执行升级
                game.player.goldCount -= cost;
                this.level++;            
                this.hideInteractDialog(game);
                this.showInteractDialog(game);
            } else {
                // 金币不足提示
                game.dialogSystem.showDialog(this, "金币不足!", 1500);
            }
        } else {
            // 已达到最高等级
                game.dialogSystem.showDialog(this, "家园已达到最高等级!", 1500);
            }
    }
    
    // 获取升级信息
    getUpgradeInfo() {
        if (this.level < this.maxLevel) {
            return {
                canUpgrade: true,
                cost: this.upgradeCosts[this.level],
                nextLevel: this.level + 1
            };
        } else {
            return {
                canUpgrade: false,
                cost: 0,
                nextLevel: this.level
            };
        }
    }
}