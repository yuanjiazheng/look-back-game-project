// Hitbox系统 - 管理所有实体的碰撞箱
class HitboxSystem {
    constructor() {
        this.entities = [];
    }
    
    registerEntity(entity) {
        this.entities.push(entity);
    }
    
    unregisterEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
    }
    
    updateAllHitboxes() {
        for (const entity of this.entities) {
            entity.updateHitboxes();
        }
    }
    
    // 检查两个hitbox是否相交
    checkCollision(hitboxA, hitboxB) {
        return hitboxA.x < hitboxB.x + hitboxB.width &&
               hitboxA.x + hitboxA.width > hitboxB.x &&
               hitboxA.y < hitboxB.y + hitboxB.height &&
               hitboxA.y + hitboxA.height > hitboxB.y;
    }
    
    // 获取与指定hitbox相交的所有hitbox
    getCollisionsFor(hitbox, typeFilter = null) {
        const collisions = [];
        
        for (const entity of this.entities) {
            if (!entity.isActive) continue;
            
            for (const entityHitbox of entity.hitboxes) {
                if (typeFilter && entityHitbox.type !== typeFilter) continue;
                
                if (this.checkCollision(hitbox, entityHitbox)) {
                    collisions.push({
                        entity: entity,
                        hitbox: entityHitbox
                    });
                }
            }
        }
        
        return collisions;
    }
    
    // 获取与指定实体相交的所有hitbox
    getCollisionsForEntity(entity, typeFilter = null) {
        const collisions = [];
        
        if (!entity.isActive) return collisions;
        
        for (const entityHitbox of entity.hitboxes) {
            const hitboxCollisions = this.getCollisionsFor(entityHitbox, typeFilter);
            collisions.push(...hitboxCollisions);
        }
        
        return collisions;
    }
}