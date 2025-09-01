// js/entities/View/tree.js
class Tree extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.type = "tree";
        this.isMarked = false; // 是否被标记为“待砍”

        // 默认 idle 动画（其实就是一张静态图）
        if (this.ResourceManager) {
            const treeSprite = this.ResourceManager.getImage("tree"); 
            this.animator.addAnimation("idle", treeSprite, width, height, 1, 1);
            this.animator.play("idle");
        }
    }

    // 标记为待砍
    markForCut() {
        this.isMarked = true;
        console.log("Tree marked for cutting:", this);
    }

    // 取消标记
    unmark() {
        this.isMarked = false;
    }

    update(deltaTime) {
        this.animator.update(deltaTime);
    }

    draw(ctx, camera) {
        super.draw(ctx, camera);

        // 如果树被标记，画一个提示（比如红框）
        if (this.isMarked) {
            const screenPos = worldToScreen(this.x, this.y, camera);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 3;
            ctx.strokeRect(screenPos.x, screenPos.y, this.width, this.height);
        }
    }
}
