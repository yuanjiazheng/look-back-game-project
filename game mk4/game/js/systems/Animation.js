// 动画类 - 管理单个动画序列
class Animation {
    constructor(spritesheet, frameWidth, frameHeight, frameDuration, frames, loop = true) {
        this.spritesheet = spritesheet; // 精灵图图像
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameDuration = frameDuration; // 每帧持续时间（毫秒）
        this.frames = frames; // 帧序列（数组，表示精灵图中的帧索引）
        this.loop = loop;
        this.totalTime = frameDuration * frames.length;
        this.elapsedTime = 0;
    }

    // 更新动画
    update(deltaTime) {
        this.elapsedTime += deltaTime;
        if (this.loop) {
            this.elapsedTime %= this.totalTime;
        } else {
            this.elapsedTime = Math.min(this.elapsedTime, this.totalTime);
        }
    }

    // 获取当前帧
    getCurrentFrame() {
        let frameIndex = Math.floor(this.elapsedTime / this.frameDuration);
        if (!this.loop && frameIndex >= this.frames.length) {
            frameIndex = this.frames.length - 1;
        } else {
            frameIndex = frameIndex % this.frames.length;
        }
        return this.frames[frameIndex];
    }

    // 检查动画是否播放完毕（对于非循环动画）
    isDone() {
        return !this.loop && this.elapsedTime >= this.totalTime;
    }

    // 重置动画
    reset() {
        this.elapsedTime = 0;
    }
}

// 动画管理器类 - 管理实体的多个动画状态
class Animator {
    constructor() {
        this.animations = {};
        this.currentAnimation = null;
    }

    // 添加动画
    addAnimation(name, animation) {
        this.animations[name] = animation;
    }

    // 播放指定动画
    playAnimation(name, reset = true) {
        if (this.currentAnimation === this.animations[name]) {
            return;
        }
        
        if (this.animations[name]) {
            this.currentAnimation = this.animations[name];
            if (reset) {
                this.currentAnimation.reset();
            }
        }
    }

    // 更新当前动画
    update(deltaTime) {
        if (this.currentAnimation) {
            this.currentAnimation.update(deltaTime);
        }
    }

    // 获取当前动画的当前帧
    getCurrentFrame() {
        return this.currentAnimation ? this.currentAnimation.getCurrentFrame() : 0;
    }

    // 检查当前动画是否完成
    isCurrentAnimationDone() {
        return this.currentAnimation ? this.currentAnimation.isDone() : false;
    }
}