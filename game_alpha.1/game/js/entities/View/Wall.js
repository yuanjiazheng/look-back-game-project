class Wall extends Entity {
    constructor(x, y, resourceManager) {
        super(x, y, 60, 80); // 墙的尺寸
        this.type = "wall";
        this.name = "wall";
        this.resourceManager = resourceManager;
        
        // 墙的属性
        this.level = 0; // 0表示未建造
        this.maxLevel = 3; // 最大等级
        this.buildCosts = [50, 100, 200]; // 各级建造/升级成本
        this.maxHealthByLevel = [0, 100, 200, 400]; // 各级最大血量
        this.health = 0; // 当前血量
        this.interactionRange = 60;
        this.currentDialog = null;
        
        // 存储资源管理器引用
        this.resourceManager = resourceManager;

        // 添加hitbox - 只有建造后才有碰撞箱
        if (this.level > 0) {
            this.addHitbox(0, 0, 60, 80, "wall");
        }
    }
    
    update(deltaTime, game) {
        super.update(deltaTime, game);
        
        // 只有已建造的墙才需要更新
        if (this.level === 0) return;
        
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
        
        if (this.level === 0) {
            // 未建造状态 - 显示地基或建造标记
            this.drawFoundation(ctx, screenPos);
        } else {
            // 已建造状态 - 显示墙体和血条
            this.drawWall(ctx, screenPos);
            this.drawHealthBar(ctx, screenPos);
        }
        
        // 绘制hitbox（调试用）
        if (window.DEBUG_HITBOXES && this.level > 0) {
            this.drawHitboxes(ctx, camera);
            
            // 绘制交互范围
            const myHitbox = this.hitboxes[0];
            const myCenterX = myHitbox.x + myHitbox.width / 2;
            const myCenterY = myHitbox.y + myHitbox.height / 2;
            const screenCenter = worldToScreen(myCenterX, myCenterY, camera);
            
            ctx.beginPath();
            ctx.arc(screenCenter.x, screenCenter.y, this.interactionRange, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.stroke();
        }
    }
    
    // 绘制未建造的地基
    drawFoundation(ctx, screenPos) {
        // 绘制地基轮廓
        ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
        ctx.fillRect(screenPos.x, screenPos.y, this.width, this.height);
        
        // 绘制建造标记
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(screenPos.x, screenPos.y, this.width, this.height);
        ctx.setLineDash([]);
        
        // 绘制建造提示
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('可建造', screenPos.x + this.width/2, screenPos.y + this.height/2);
    }
    
    // 绘制已建造的墙体
    drawWall(ctx, screenPos) {
        // 根据等级选择颜色
        const colors = [
            '#8B4513', // 等级1 - 棕色
            '#A0522D', // 等级2 - 深棕色
            '#CD853F'  // 等级3 - 浅棕色
        ];
        
        ctx.fillStyle = colors[this.level - 1] || colors[0];
        ctx.fillRect(screenPos.x, screenPos.y, this.width, this.height);
        
        // 绘制砖块纹理
        this.drawBrickPattern(ctx, screenPos);
        
        // 绘制等级徽章
        this.drawLevelBadge(ctx, screenPos);
    }
    
    // 绘制砖块纹理
    drawBrickPattern(ctx, screenPos) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        
        // 水平线
        for (let y = 0; y < this.height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(screenPos.x, screenPos.y + y);
            ctx.lineTo(screenPos.x + this.width, screenPos.y + y);
            ctx.stroke();
        }
        
        // 垂直线 - 交错排列
        for (let x = 0; x < this.width; x += 30) {
            ctx.beginPath();
            ctx.moveTo(screenPos.x + x, screenPos.y);
            ctx.lineTo(screenPos.x + x, screenPos.y + this.height);
            ctx.stroke();
        }
    }
    
    // 绘制血条
    drawHealthBar(ctx, screenPos) {
        const barWidth = 50;
        const barHeight = 5;
        const barX = screenPos.x + (this.width - barWidth) / 2;
        const barY = screenPos.y - 10;
        
        // 计算血量百分比
        const healthPercent = this.health / this.maxHealthByLevel[this.level];
        
        // 绘制背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // 绘制血量
        if (healthPercent > 0.6) {
            ctx.fillStyle = '#00ff00'; // 绿色 - 健康
        } else if (healthPercent > 0.3) {
            ctx.fillStyle = '#ffff00'; // 黄色 - 警告
        } else {
            ctx.fillStyle = '#ff0000'; // 红色 - 危险
        }
        
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // 绘制边框
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // 显示血量数值
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            `${Math.ceil(this.health)}/${this.maxHealthByLevel[this.level]}`,
            barX + barWidth / 2,
            barY - 3
        );
    }
    
    // 绘制等级徽章
    drawLevelBadge(ctx, screenPos) {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(screenPos.x + 50, screenPos.y + 10, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.level.toString(), screenPos.x + 50, screenPos.y + 10);
    }
    
    // 显示交互对话框
    showInteractDialog(game) {
        if (this.currentDialog) return;
        
        let dialogText;
        
        if (this.level === 0) {
            // 未建造状态
            dialogText = `按 E 键建造墙壁\n需要 ${this.buildCosts[0]} 金币`;
        } else if (this.level < this.maxLevel) {
            // 可升级状态
            dialogText = `按 E 键升级墙壁\n需要 ${this.buildCosts[this.level]} 金币`;
        } else {
            // 已满级状态
            dialogText = "墙壁已达到最高等级";
        }
        
        if (game.dialogSystem) {
            this.currentDialog = game.dialogSystem.showDialog(this, dialogText, 100000);
        }
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
    
    // 显示升级/建造界面
    showUpgradeInterface(game) {
        if (this.level === 0) {
            // 建造墙壁
            this.buildWall(game);
        } else if (this.level < this.maxLevel) {
            // 升级墙壁
            this.upgradeWall(game);
        } else {
            // 已达到最高等级
            game.dialogSystem.showDialog(this, "墙壁已达到最高等级!", 1500);
        }
    }
    
    // 建造墙壁
    buildWall(game) {
        const cost = this.buildCosts[0];
        
        if (game.player.goldCount >= cost) {
            // 执行建造
            game.player.goldCount -= cost;
            this.level = 1;
            this.health = this.maxHealthByLevel[1];
            
            // 添加碰撞箱
            this.addHitbox(0, 0, 60, 80, "wall");
            
            // 显示建造成功提示
            game.dialogSystem.showDialog(this, "墙壁建造成功!", 1500);
            
            // 更新交互对话框
            this.hideInteractDialog(game);
            this.showInteractDialog(game);
        } else {
            // 金币不足提示
            game.dialogSystem.showDialog(this, "金币不足!", 1500);
        }
    }
    
    // 升级墙壁
    upgradeWall(game) {
        const cost = this.buildCosts[this.level];
        
        if (game.player.goldCount >= cost) {
            // 执行升级
            game.player.goldCount -= cost;
            this.level++;
            this.health = this.maxHealthByLevel[this.level]; // 升级后恢复满血
            
            // 显示升级成功提示
            game.dialogSystem.showDialog(this, `墙壁升级到等级 ${this.level}!`, 1500);
            
            // 更新交互对话框
            this.hideInteractDialog(game);
            this.showInteractDialog(game);
        } else {
            // 金币不足提示
            game.dialogSystem.showDialog(this, "金币不足!", 1500);
        }
    }
    
    // 墙壁受到伤害
    takeDamage(amount) {
        if (this.level === 0) return; // 未建造的墙不受伤害
        
        this.health -= amount;
        
        // 检查是否被摧毁
        if (this.health <= 0) {
            this.destroy();
        }
    }
    
    // 修复墙壁
    repair(amount) {
        if (this.level === 0) return; // 未建造的墙不能修复
        
        this.health += amount;
        
        // 确保不超过最大血量
        const maxHealth = this.maxHealthByLevel[this.level];
        if (this.health > maxHealth) {
            this.health = maxHealth;
        }
    }
    
    // 摧毁墙壁
    destroy() {
        this.level = 0;
        this.health = 0;
        
        // 移除碰撞箱
        this.hitboxes = this.hitboxes.filter(hitbox => hitbox.type !== "wall");
        
        // 显示摧毁提示
        if (this.game && this.game.dialogSystem) {
            this.game.dialogSystem.showDialog(this, "墙壁已被摧毁!", 2000);
        }
    }
    
    // 检查墙壁是否已建造
    isBuilt() {
        return this.level > 0;
    }
    
    // 获取建造/升级信息
    getBuildInfo() {
        if (this.level === 0) {
            return {
                canBuild: true,
                cost: this}

            }
        }
}