// NPCSystem.js (重构后的NPC管理器)
class NPCSystem {
    constructor() {
        this.npcs = [];
        this.factions = {
            "friendly": [],
            "hostile": [],
            "neutral": []
        };
    }
    
    addNPC(npc) {
        this.npcs.push(npc);
        
        // 按阵营分类
        if (this.factions[npc.faction]) {
            this.factions[npc.faction].push(npc);
        }
    }
    
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
    
    // 只处理NPC特定的逻辑，不负责更新
    updateNPCs(deltaTime, game) {
        // NPC特定的AI逻辑、交互等
        for (const npc of this.npcs) {
            if (npc.updateAI) {
                npc.updateAI(game);
            }
            
            // 处理NPC之间的特殊交互
            this.handleNPCInteractions(npc, game);
        }
    }
    
    handleNPCInteractions(npc, game) {
        // NPC特定的交互逻辑
        // 例如：阵营关系、对话系统、交易系统等
    }
    
    // 保留查询方法
    getNPCsByFaction(faction) {
        return this.factions[faction] || [];
    }
    
    getNPCsByType(type) {
        return this.npcs.filter(npc => npc.type === type);
    }
}