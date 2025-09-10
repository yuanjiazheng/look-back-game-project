class Tree extends Entity {
    constructor(x, y, resourceManager) {
        super(x, y, 64, 128); // 假设树的尺寸是 64x128，可以改
        this.type = "tree";
        this.resourceManager = resourceManager;

        // 添加hitbox（树干的碰撞范围）
        this.addHitbox(20, 30, 24, 98, "tree");

        // 可以增加一个“生命值”，方便后面砍树
        this.hp = 3;
    }

    draw(ctx, camera) {
        const screenPos = worldToScreen(this.x, this.y, camera);

        const treeSprite = this.resourceManager.getResource("tree");
        if (treeSprite) {
            ctx.drawImage(treeSprite, screenPos.x, screenPos.y, this.width, this.height);
        } else {
            // 如果资源没加载成功，就画一个替代色块
            ctx.fillStyle = "green";
            ctx.fillRect(screenPos.x, screenPos.y, this.width, this.height);
        }

        if (window.DEBUG_HITBOXES) {
            this.drawHitboxes(ctx, camera);
        }
    }

    update(deltaTime) {
        // 树的逻辑（比如掉落、被砍等），目前先留空
    }

    markAsChopped() {
        this.hp--;
        if (this.hp <= 0) {
            console.log("树被砍倒了！");
            // 后续可以在这里触发掉落木材等逻辑
        }
    }
}
