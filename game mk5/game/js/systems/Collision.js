// 碰撞检测系统
class CollisionSystem {
    constructor(hitboxSystem) {
        this.hitboxSystem = hitboxSystem;
    }
    
    update(deltaTime) {
        // 更新所有hitbox位置
        this.hitboxSystem.updateAllHitboxes();
        
        // 这里可以添加更复杂的碰撞检测逻辑
        // 例如空间分区优化等
    }
    
    // // 检查玩家与环境的碰撞
    // checkPlayerEnvironmentCollisions(player) {
    //     // 检查玩家是否站在地面上
    //     const footHitbox = {
    //         x: player.hiboxes.x + 5,
    //         y: player.hiboxes.y + player.height,
    //         width: player.width - 10,
    //         height: 5
    //     };
        
    //     const groundCollisions = this.hitboxSystem.getCollisionsFor(footHitbox);
    //     const isOnGround = groundCollisions.length > 0;
        
    //     return {
    //         isOnGround: isOnGround,
    //         groundCollisions: groundCollisions
    //     };
    // }
    
    // 检查实体之间的碰撞
    checkEntityCollisions(entity, targetType = null) {
        return this.hitboxSystem.getCollisionsForEntity(entity, targetType);
    }
}