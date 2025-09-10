// NPC 管理器
class NPCManager {
    constructor() {
        this.npcs = []; // 所有 NPC
        this.factions = {
            "player": [],
            "friendly": [],
            "hostile": [],
            "neutral": []
        };
    }
    
    // 添加 NPC
    addNPC(npc) {
        this.npcs.push(npc);
        
        // 按阵营分类
        if (this.factions[npc.faction]) {
            this.factions[npc.faction].push(npc);
        }
    }
    
    // 移除 NPC
    removeNPC(npc) {
        const index = this.npcs.indexOf(npc);
        if (index > -1) {
            this.npcs.splice(index, 1);
            
            // 从阵营中移除
            if (this.factions[npc.faction]) {
                const factionIndex = this.factions[npc.faction].indexOf(npc);
                if (factionIndex > -1) {
                    this.factions[npc.faction].splice(factionIndex, 1);
                }
            }
        }
    }
    
    // 更新所有 NPC
    update(deltaTime, game) {
        for (let i = this.npcs.length - 1; i >= 0; i--) {
            const npc = this.npcs[i];
            
            if (npc.isActive) {
                npc.update(deltaTime, game);
            } else {
                this.removeNPC(npc);
            }
        }
    }
    
    // 渲染所有 NPC
    render(ctx, camera) {
        this.npcs.forEach(npc => {
            if (npc.isActive) {
                npc.draw(ctx, camera);
            }
        });
    }
    
    // 获取特定阵营的 NPC
    getNPCsByFaction(faction) {
        return this.factions[faction] || [];
    }
    
    // 获取特定类型的 NPC
    getNPCsByType(type) {
        return this.npcs.filter(npc => npc.type === type);
    }
    
    // 获取特定范围内的 NPC
    getNPCsInRange(x, y, range, factionFilter = null) {
        return this.npcs.filter(npc => {
            if (factionFilter && npc.faction !== factionFilter) return false;
            
            const npcHitbox = npc.hitboxes[0];
            const npcCenterX = npcHitbox.x + npcHitbox.width / 2;
            const npcCenterY = npcHitbox.y + npcHitbox.height / 2;
            
            const dx = npcCenterX - x;
            const dy = npcCenterY - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            return distance <= range;
        });
    }
    
    // 清除所有 NPC
    clear() {
        this.npcs = [];
        for (const faction in this.factions) {
            this.factions[faction] = [];
        }
    }
}