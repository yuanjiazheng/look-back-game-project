class Tree extends Entity {
    constructor(x, y, resourceManager) {
        super(x, y, 128, 256); 
        this.type = "tree";
        this.resourceManager = resourceManager; // ✅ 保存引用
        this.loadAnimations();
    }

    loadAnimations() {
        const treeSprite = this.resourceManager.getResource("tree"); // ✅
        if (treeSprite) {
            this.animator.addAnimation("idle", new Animation(
                treeSprite, 128, 256, 1000, [0], true
            ));
            this.animator.playAnimation("idle");
        } else {
            console.error("树的资源未找到！");
        }
    }

    update(deltaTime) {
        super.update(deltaTime);
    }
    draw(ctx, camera) {
        super.draw(ctx, camera);

        // 如果被标记，额外画一个高亮边框/提示
        if (this.isMarked) {
            const screenPos = worldToScreen(this.x, this.y, camera);
            ctx.save();
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 4;
            ctx.strokeRect(screenPos.x, screenPos.y, this.width, this.height);
            ctx.restore();
        }
    }

    // 玩家交互：标记/取消标记树
    toggleMark() {
        this.isMarked = !this.isMarked;
        console.log(`Tree at (${this.x},${this.y}) marked = ${this.isMarked}`);
    }
}
