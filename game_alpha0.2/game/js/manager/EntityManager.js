class EntityManager {
    constructor(game) {
        this.entities = [];
        this.npcSystem = new NPCSystem(); // 使用重构后的NPC系统
        this.game = game;

        this.factions = {
            "friendly": [],
            "hostile": [],
            "neutral": []
        };
    }
    
    
    addEntity(entity, type = "general") {
        this.entities.push(entity);
        // 按阵营分类
    if (entity.faction && this.factions[entity.faction]) {
        this.factions[entity.faction].push(entity);
    }
    
        // 如果是NPC，添加到NPC系统
        if (type === "npc" || entity instanceof NPC) {
            this.npcSystem.addNPC(entity);
        }
        //为实体添加game引用
        entity.game = this.game;
        //注册实体到hitbox
        this.game.hitboxSystem.registerEntity(entity);
    }

    removeEntity(entity) {
        // 从entities数组中移除
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
        // 从NPCSystem中移除（如果是NPC）
        if (entity instanceof NPC) {
            this.npcSystem.removeNPC(entity);
        }
        // 从factions中移除
        if (entity.faction && this.factions[entity.faction]) {
            const factionArray = this.factions[entity.faction];
            const factionIndex = factionArray.indexOf(entity);
            if (factionIndex > -1) {
                factionArray.splice(factionIndex, 1);
            }
        }
        //注销hitbox
        this.game.hitboxSystem.unregisterEntity(entity);
    }

     cleanupInactiveEntities() {
        for (let i = this.entities.length - 1; i >= 0; i--) {
            if (!this.entities[i].isActive) {
                this.removeEntity(this.entities[i]);
            }
        }
    }
    
    update(deltaTime, game) {
    // 按优先级顺序更新所有实体，包括NPC逻辑

    //清理不活跃实体
    this.cleanupInactiveEntities();


    for (const entity of this.entities) {
        if (entity.isActive) {
            // 先更新实体的基本状态
            entity.update(deltaTime, game);
            
            // 如果是NPC，执行特定的NPC逻辑
            if (entity instanceof NPC) {
                entity.updateAI(game);
            }
        }
    }
}
    
    render(ctx, camera) {
        // 渲染所有实体(玩家在外面后渲染)
        
        for (const entity of this.entities) {
            if (entity.isActive&&entity.type!="player") {
                entity.draw(ctx, camera);
            }
        }
    }

    getEntitiesByFaction(faction)
    {
        return this.factions[faction] || [];
    }

    getEntitiesByType(type) {
    return this.entities.filter(entity => entity.type === type);
}
    
    // 提供访问NPC系统功能的方法
    getNPCsByFaction(faction) {
        return this.npcSystem.getNPCsByFaction(faction);
    }
}