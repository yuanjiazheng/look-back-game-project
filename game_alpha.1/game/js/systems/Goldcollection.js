class Goldcollection {
    constructor(hitboxSystem, game) {
        this.hitboxSystem = hitboxSystem;
        this.game = game;
        this.totalGold = 0;
        this.collectedGold = 0;
        this.goldEntities = [];
        this.throwCooldown = 0; // 扔金币冷却时间
    }
    
    registerGold(goldEntity) {
        // 为每个金币添加对游戏的引用
        goldEntity.game = this.game;
        this.goldEntities.push(goldEntity);
        this.totalGold += goldEntity.value;   
        this.hitboxSystem.registerEntity(goldEntity);
    }
    
    update(deltaTime) {
        // 更新冷却时间
        if (this.throwCooldown > 0) {
            this.throwCooldown -= deltaTime;
        }
        
        // 检查是否按下了扔金币键
        if (this.game.input.isThrowPressed() && this.throwCooldown <= 0) {
            this.throwGold();
            this.throwCooldown = 300; // 设置冷却时间（毫秒）
        }
        
        // 更新所有金币的物理状态
        for (let i = this.goldEntities.length - 1; i >= 0; i--) {
            const gold = this.goldEntities[i];
            
            if (!gold.isActive) {
                // 从系统中移除
                this.hitboxSystem.unregisterEntity(gold);
                this.goldEntities.splice(i, 1);
            } else {
                gold.update(deltaTime);
            }
        }
        //处理金币与玩家的碰撞，并处理捡起的金币
        this.CollectionEffect();
    }
    
    //捡起金币处理
    CollectionEffect() {
    // 检查玩家与金币的碰撞
    const player = this.game.player;
    const goldCollisions = this.hitboxSystem.getCollisionsForEntity(player, "gold");
    
    // 处理收集到的金币
    goldCollisions.forEach(collision => {
        if (collision.entity.type === "gold" && !collision.entity.collected) {
            collision.entity.collected=true;
            this.collectedGold += 1;
            player.goldCount += 1; // 增加玩家金币数量
            
            // 显示收集效果
            this.showCollectionEffect(collision.entity);
            
        }
    });
}


    // 扔出金币的方法
    throwGold() {
    const player = this.game.player;
    
    // 检查玩家是否有金币
    if (player.goldCount <= 0) {
        // 显示提示信息
        if (this.game.floatingTextSystem) {
            this.game.floatingTextSystem.addText(
                "没有金币可扔!",
                player.x,
                player.y - 30,
                '#FF0000',
                800,
                14
            );
        }
        return;
    }
    
    // 减少玩家金币数量
    player.goldCount--;
    
    const playerhitbox = player.hitboxes[0];
    // 确定扔出的方向（基于玩家朝向）
    const throwDirection = player.direction === 'right' ? 1 : -1;
    
    // 计算初始位置（玩家前方）
    const throwX = playerhitbox.x + (throwDirection > 0 ? playerhitbox.width : -20);
    const throwY = playerhitbox.y + playerhitbox.height / 2;
    
    // 计算速度（水平速度和垂直速度）
    const throwVelocityX = throwDirection * 0.5; // 水平速度
    const throwVelocityY = -0.3; // 垂直速度（向上）
    
    // 创建金币
    const gold = new Gold(throwX, throwY, 1, throwVelocityX, throwVelocityY);
    
    // 注册金币
    this.registerGold(gold);
    
    // 显示扔出效果
    this.showThrowEffect(gold);
    
}

    
    
    showCollectionEffect(gold) {
        // 显示捡起金币的效果
        if (this.game.floatingTextSystem) {
            this.game.floatingTextSystem.addText(
                "金币+1",
                gold.x,
                gold.y,
                '#ffd17cff',
                800,
                14
            );
        }
    }
    
    
    showThrowEffect(gold) {
        // 显示扔出金币的效果
        if (this.game.floatingTextSystem) {
            this.game.floatingTextSystem.addText(
                "扔出金币!",
                gold.x,
                gold.y - 30,
                '#FFA500',
                800,
                14
            );
        }
    }
    
    getCollectionRate() {
        return this.totalGold > 0 ? (this.collectedGold / this.totalGold) * 100 : 0;
    }
    
    reset() {
        this.collectedGold = 0;
        
        // 重置所有金币状态
        this.goldEntities.forEach(gold => {
            gold.collected = false;
            gold.isActive = true;
            gold.collectionTime = 0;
            gold.isOnGround = false;
            gold.velocityY = 0;
            gold.velocityX = 0;
            gold.thrown = false;
        });
    }
    
    // 生成随机金币分布
    // generateGoldDistribution(count, minX, maxX, minY, maxY) {
    //     const golds = [];
        
    //     for (let i = 0; i < count; i++) {
    //         const x = Math.random() * (maxX - minX) + minX;
    //         const y = Math.random() * (maxY - minY) + minY;
            
    //         const value = 1;
            
    //         golds.push(new Gold(x, y, value));
    //     }
        
    //     return golds;
    // }

    // generateGold() {
    //     // 在地图上随机生成金币
    //     const golds = this.generateGoldDistribution(
    //         20, // 数量
    //         100, // 最小X
    //         MAP_WIDTH - 100, // 最大X
    //         100, // 最小Y
    //         GROUND_Y - 100 // 最大Y（地面上方）
    //     );
        
    //     // 注册所有金币
    //     golds.forEach(gold => {
    //         this.registerGold(gold);
    //     });
    // }
}