// 基础 NPC 类
class NPC extends Entity {
    constructor(x, y, width, height, type, faction = "neutral", goldCount, maxCountGold) {
        super(x, y, width, height);
        this.type = type || "npc";
        this.faction = faction; // "friendly", "hostile", "neutral"
        this.behaviorState = "idle"; // 行为状态
        this.target = null; // 当前目标
        this.goldCount = goldCount;
        this.maxCountGold = maxCountGold;
        this.lastAIUpdate = 0;
        this.detectionRange = 200; // 默认检测范围
        this.interactionRange = 50; // 默认交互范围


         // 添加徘徊行为相关属性
        this.wanderRange = 150; // 徘徊范围半径
        this.wanderCenterX = x; // 徘徊中心点X坐标
        this.wanderCenterY = y; // 徘徊中心点Y坐标
        this.wanderTimer = 0; // 徘徊计时器
        this.wanderInterval = 2000; // 徘徊状态切换间隔(毫秒)
        this.wanderDirection = 0; // 徘徊方向 (-1:左, 0:停, 1:右)
        this.wanderState = "idle"; // 徘徊状态 ("idle"或"walking")
    }
    
    update(deltaTime, game) {
        super.update(deltaTime);


        //每次都更新
        this.updateAI(game);
        
        // 更新动画
        this.updateAnimation();
    }
    
    // AI 行为更新（由子类实现）
    updateAI(game) {
        // 基础 AI 逻辑
        switch (this.behaviorState) {
            case "idle":
                this.idleBehavior(game);
                break;
            case "follow":
                this.followBehavior(game);
                break;
            case "attack":
                this.attackBehavior(game);
                break;
            case "flee":
                this.fleeBehavior(game);
                break;
        }
    }
    
    // 各种行为状态的基础实现（可由子类重写）
    idleBehavior1(game) {
        // 默认空闲行为：什么都不做
        this.velocityX = 0;
        this.velocityY = 0;
    }

     // 各种行为状态的基础实现（可由子类重写）
    idleBehavior(game) {
        // 更新徘徊计时器
        this.wanderTimer += game.lastDeltaTime || 16;
        
        // 如果计时器超过间隔，切换徘徊状态
        if (this.wanderTimer >= this.wanderInterval) {
            this.changeWanderState();
            this.wanderTimer = 0;
        }
        
        // 根据徘徊状态执行行为
        if (this.wanderState === "walking") {
            this.wanderBehavior();
        } else {
            // 空闲状态：什么都不做
            this.velocityX = 0;
            this.velocityY = 0;
        }
    }
    
    // 切换徘徊状态
    changeWanderState() {
        // 50%几率切换状态
        if (Math.random() > 0.5) {
            if (this.wanderState === "idle") {
                this.wanderState = "walking";
                // 随机选择方向
                this.wanderDirection = Math.random() > 0.5 ? 1 : -1;
                // 随机设置新的间隔时间(2-4秒)
                this.wanderInterval = 2000 + Math.random() * 2000;
            } else {
                this.wanderState = "idle";
                // 随机设置新的间隔时间(2-5秒)
                this.wanderInterval = 2000 + Math.random() * 3000;
            }
        }
    }
    
    // 徘徊行为
    wanderBehavior() {
        // 计算与徘徊中心的距离
        const myHitbox = this.hitboxes[0];
        const myCenterX = myHitbox.x + myHitbox.width / 2;
        const distanceFromCenter = Math.abs(myCenterX - this.wanderCenterX);
        
        // 如果超出徘徊范围，改变方向
        if (distanceFromCenter >= this.wanderRange) {
            this.wanderDirection *= -1;
        }
        
        // 根据方向移动
        this.velocityX = this.wanderDirection * this.speed * 0.7; // 徘徊时速度稍慢
        
        // 随机有小概率改变方向
        if (Math.random() < 0.01) {
            this.wanderDirection *= -1;
        }
    }
    
    collectGold(goldEntity) {
    if (goldEntity.collected || !goldEntity.isActive) return;
    
    const value = goldEntity.collect();
    // 这里可以添加NPC收集金币后的逻辑
    console.log(`${this.type} 收集了 ${value} 金币`);
    // 清除目标
    this.clearTarget();
    this.behaviorState = "idle";
}

// 修改followBehavior方法
followBehavior(game) {
    if (this.target && this.target.isActive) {
        this.moveTowardsTarget();
        
        // 如果目标是金币且在交互范围内，收集它
        if (this.target.type === "gold" && this.isInRange(this.target, this.interactionRange) && (this.type == "rufugee")) {
            this.collectGold(this.target);
            this.goldCount++;
        }
    } else {
        this.behaviorState = "idle";
    }
}
    
    attackBehavior(game) {
        // 默认攻击行为：向目标移动并攻击
        if (this.target && this.target.isActive) {
            this.moveTowardsTarget();
            // 检查是否在攻击范围内
            if (this.isInRange(this.target, this.interactionRange)) {
                this.attackTarget();
            }
        } else {
            this.behaviorState = "idle";
        }
    }
    
    fleeBehavior(game) {
        // 默认逃跑行为：远离目标
        if (this.target && this.target.isActive) {
            this.moveAwayFromTarget();
        } else {
            this.behaviorState = "idle";
        }
    }
    
    // 移动到目标
    moveTowardsTarget() {
        if (!this.target) return;
        
        const targetHitbox = this.target.hitboxes[0];
        const myHitbox = this.hitboxes[0];
        
        const targetCenterX = targetHitbox.x + targetHitbox.width / 2;
        const myCenterX = myHitbox.x + myHitbox.width / 2;
        
        const dx = targetCenterX - myCenterX;
        const distance = Math.sqrt(dx * dx);
        
        if (distance > 0) {
            this.velocityX = (dx / distance) * this.speed;
        }
    }
    
    // 远离目标
    moveAwayFromTarget() {
        if (!this.target) return;
        
        const targetHitbox = this.target.hitboxes[0];
        const myHitbox = this.hitboxes[0];
        
        const targetCenterX = targetHitbox.x + targetHitbox.width / 2;
        const targetCenterY = targetHitbox.y + targetHitbox.height / 2;
        const myCenterX = myHitbox.x + myHitbox.width / 2;
        const myCenterY = myHitbox.y + myHitbox.height / 2;
        
        const dx = myCenterX - targetCenterX;
        const dy = myCenterY - targetCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.velocityX = (dx / distance) * this.speed;
            this.velocityY = (dy / distance) * this.speed;
        }
    }
    
    // 攻击目标
    attackTarget() {
        // 基础攻击逻辑（由子类实现具体攻击方式）
        console.log(`${this.type} 攻击 ${this.target.type}`);
    }

    collectGold(goldEntity) {
    if (goldEntity.collected || !goldEntity.isActive) return;
    
    const value = 1;
    goldEntity.collected=true;
    // 这里可以添加NPC收集金币后的逻辑
    console.log(`${this.type} 收集了 ${value} 金币`);
    
    // 显示收集效果
    if (this.game && this.game.floatingTextSystem) {
        this.game.floatingTextSystem.addText(
            `金币+${value}`,
            goldEntity.x,
            goldEntity.y,
            '#ffd17cff',
            800,
            14
        );
    }
    
    // 清除目标
    this.clearTarget();
    this.behaviorState = "idle";
    }

    
    // 检查是否在范围内
    isInRange(target, range) {
        const targetHitbox = target.hitboxes[0];
        const myHitbox = this.hitboxes[0];
        
        const targetCenterX = targetHitbox.x + targetHitbox.width / 2;
        const targetCenterY = targetHitbox.y + targetHitbox.height / 2;
        const myCenterX = myHitbox.x + myHitbox.width / 2;
        const myCenterY = myHitbox.y + myHitbox.height / 2;
        
        const dx = targetCenterX - myCenterX;
        const dy = targetCenterY - myCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance <= range;
    }
    
    // 检测范围内的实体
    detectEntitiesInRange(game, range, typeFilter = null) {
        const myHitbox = this.hitboxes[0];
        const myCenterX = myHitbox.x + myHitbox.width / 2;
        const myCenterY = myHitbox.y + myHitbox.height / 2;
        
        // 创建一个检测范围的圆形 hitbox
        const detectionHitbox = {
            x: myCenterX - range,
            y: myCenterY - range,
            width: range * 2,
            height: range * 2,
            type: "detection"
        };
        
        // 获取范围内的所有实体
        return game.hitboxSystem.getCollisionsFor(detectionHitbox, typeFilter);
    }
    
    // 设置目标
    setTarget(entity) {
        this.target = entity;
    }
    
    // 清除目标
    clearTarget() {
        this.target = null;
    }
    
    // 更新动画（由子类实现）
    updateAnimation() {
        // 基础动画逻辑
        if (this.velocityX !== 0 || this.velocityY !== 0) {
            this.animator.playAnimation('walk');
        } else {
            this.animator.playAnimation('idle');
        }
        
        // 根据移动方向设置翻转
        if (this.velocityX !== 0) {
            this.flipX = this.velocityX < 0;
        }
    }
    
    // 绘制调试信息
    draw(ctx, camera) {
        super.draw(ctx, camera);
        
        // 绘制调试信息
        if (window.DEBUG_HITBOXES) {
            const myHitbox = this.hitboxes[0];
            const myCenterX = myHitbox.x + myHitbox.width / 2;
            const myCenterY = myHitbox.y + myHitbox.height / 2;
            const screenCenter = worldToScreen(myCenterX, myCenterY, camera);
            
            // 绘制检测范围
            ctx.beginPath();
            ctx.arc(screenCenter.x, screenCenter.y, this.detectionRange, 0, Math.PI * 2);
            ctx.strokeStyle = this.faction === "hostile" ? 'rgba(255, 0, 0, 0.3)' : 
                             this.faction === "friendly" ? 'rgba(0, 255, 0, 0.3)' : 
                             'rgba(255, 255, 0, 0.3)';
            ctx.stroke();
            
            // 绘制交互范围
            ctx.beginPath();
            ctx.arc(screenCenter.x, screenCenter.y, this.interactionRange, 0, Math.PI * 2);
            ctx.strokeStyle = this.faction === "hostile" ? 'rgba(255, 0, 0, 0.6)' : 
                             this.faction === "friendly" ? 'rgba(0, 255, 0, 0.6)' : 
                             'rgba(255, 255, 0, 0.6)';
            ctx.stroke();
            
            // 绘制行为状态
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.fillText(this.behaviorState, screenCenter.x - 20, screenCenter.y - this.detectionRange - 10);

            // 绘制NPC类型
            ctx.fillStyle = '#ff3131ff';
            ctx.font = '12px Arial';
            ctx.fillText(this.type, screenCenter.x - 20, screenCenter.y - this.detectionRange - 23);

            
            // 如果有关注目标，绘制连线
            if (this.target && this.target.isActive) {
                const targetHitbox = this.target.hitboxes[0];
                const targetCenterX = targetHitbox.x + targetHitbox.width / 2;
                const targetCenterY = targetHitbox.y + targetHitbox.height / 2;
                const targetScreen = worldToScreen(targetCenterX, targetCenterY, camera);
                
                ctx.beginPath();
                ctx.moveTo(screenCenter.x, screenCenter.y);
                ctx.lineTo(targetScreen.x, targetScreen.y);
                ctx.strokeStyle = this.faction === "hostile" ? 'rgba(255, 0, 0, 0.5)' : 
                                 this.faction === "friendly" ? 'rgba(0, 255, 0, 0.5)' : 
                                 'rgba(255, 255, 0, 0.5)';
                ctx.stroke();
            }
        }
    }

    //计算距离的方式，只计算x方向
    getDistanceTo(entity) {
    const myHitbox = this.hitboxes[0];
    const targetHitbox = entity.hitboxes[0];
    
    const myCenterX = myHitbox.x + myHitbox.width / 2;
    const targetCenterX = targetHitbox.x + targetHitbox.width / 2;
    
    const dx = targetCenterX - myCenterX;
    return Math.sqrt(dx*dx);
    }
}