// 浮动文字系统
class FloatingTextSystem {
    constructor() {
        this.texts = [];
    }
    
    // 添加浮动文字
    addText(text, worldX, worldY, color = '#FFFFFF', duration = 1000, size = 16) {
        const floatingText = {
            text: text,
            worldX: worldX,
            worldY: worldY,
            color: color,
            size: size,
            alpha: 1,
            life: duration,
            totalLife: duration,
            velocityY: -0.5, // 向上移动的速度
            offsetX: Math.random() * 20 - 10 // 随机水平偏移
        };
        
        this.texts.push(floatingText);
    }
    
    // 更新所有浮动文字
    update(deltaTime, camera) {
        for (let i = this.texts.length - 1; i >= 0; i--) {
            const text = this.texts[i];
            text.life -= deltaTime;
            
            // 更新位置
            text.worldY += text.velocityY;
            
            // 计算淡出效果
            text.alpha = text.life / text.totalLife;
            
            // 移除生命周期结束的文字
            if (text.life <= 0) {
                this.texts.splice(i, 1);
            }
        }
    }
    
    // 渲染所有浮动文字
    render(ctx, camera) {
        ctx.save();
        
        this.texts.forEach(text => {
            // 转换为屏幕坐标
            const screenPos = worldToScreen(
                text.worldX + text.offsetX, 
                text.worldY, 
                camera
            );
            
            // 设置透明度
            ctx.globalAlpha = text.alpha;
            
            // 绘制文字阴影
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            
            // 绘制文字
            ctx.fillStyle = text.color;
            ctx.font = `bold ${text.size}px Arial`;
            ctx.fillText(text.text, screenPos.x, screenPos.y);
        });
        
        ctx.restore();
    }
    
    // 清空所有浮动文字
    clear() {
        this.texts = [];
    }
    
    // 获取当前浮动文字数量
    getCount() {
        return this.texts.length;
    }
}

// 浮动文字预设样式
FloatingTextSystem.PRESETS = {
    GOLD: {
        color: '#FFD700',
        size: 18,
        duration: 1200
    },
    DAMAGE: {
        color: '#FF0000',
        size: 16,
        duration: 800
    },
    HEAL: {
        color: '#00FF00',
        size: 16,
        duration: 800
    },
    INFO: {
        color: '#FFFFFF',
        size: 14,
        duration: 1500
    }
};

// 使用预设创建浮动文字
FloatingTextSystem.createWithPreset = function(system, text, worldX, worldY, presetName) {
    const preset = FloatingTextSystem.PRESETS[presetName] || FloatingTextSystem.PRESETS.INFO;
    system.addText(
        text, 
        worldX, 
        worldY, 
        preset.color, 
        preset.duration, 
        preset.size
    );
};