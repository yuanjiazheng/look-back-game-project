// js/systems/DialogSystem.js
class DialogSystem {
    constructor() {
        this.dialogs = [];
        this.activeDialog = null;
    }
    
    // 显示对话框
    showDialog(entity, text, duration = 5000) {
        // 如果已有对话框，先关闭它
        if (this.activeDialog) {
            this.hideDialog(this.activeDialog);
        }
        
        const dialog = {
            entity: entity,
            text: text,
            duration: duration,
            elapsedTime: 0,
            isActive: true,
            alpha: 0,
            lines: this.wrapText(text, 200, "14px Arial") // 文本换行
        };
        
        this.dialogs.push(dialog);
        this.activeDialog = dialog;
        
        return dialog;
    }
    
    // 隐藏对话框
    hideDialog(dialog) {
        dialog.isActive = false;
        if (this.activeDialog === dialog) {
            this.activeDialog = null;
        }
    }
    
    // 更新所有对话框
    update(deltaTime) {
        for (let i = this.dialogs.length - 1; i >= 0; i--) {
            const dialog = this.dialogs[i];
            
            if (!dialog.isActive) {
                // 淡出效果
                dialog.alpha -= 0.05;
                if (dialog.alpha <= 0) {
                    this.dialogs.splice(i, 1);
                    continue;
                }
            } else {
                // 淡入效果
                dialog.alpha += 0.05;
                if (dialog.alpha > 1) dialog.alpha = 1;
                
                // 更新持续时间
                dialog.elapsedTime += deltaTime;
                if (dialog.elapsedTime >= dialog.duration) {
                    this.hideDialog(dialog);
                }
            }
        }
    }
    
    // 渲染所有对话框
    render(ctx, camera) {
        this.dialogs.forEach(dialog => {
            if (!dialog.entity.isActive) return;
            
            const entityHitbox = dialog.entity.hitboxes[0];
            const entityCenterX = entityHitbox.x + entityHitbox.width / 2;
            const entityTopY = entityHitbox.y;
            
            const screenPos = worldToScreen(entityCenterX, entityTopY, camera);
            
            this.drawDialog(ctx, dialog, screenPos.x, screenPos.y-10);
        });
    }
    
    // 绘制对话框
    drawDialog(ctx, dialog, x, y) {
        const padding = 10;
        const lineHeight = 18;
        const maxWidth = 200;
        const tailHeight = 10;
        
        // 计算对话框尺寸
        const height = dialog.lines.length * lineHeight + padding * 2;
        const width = maxWidth + padding * 2;
        
        ctx.save();
        ctx.globalAlpha = dialog.alpha;
        
        // 绘制对话框背景
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        // 绘制气泡主体（圆角矩形）
        this.drawBubble(ctx, x - width / 2, y - height - tailHeight, width, height, 10);
        
        // 绘制气泡尾巴（指向实体）
        ctx.beginPath();
        ctx.moveTo(x, y - tailHeight);
        ctx.lineTo(x - 10, y);
        ctx.lineTo(x + 10, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 绘制文本
        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        
        dialog.lines.forEach((line, index) => {
            ctx.fillText(line, x, y - height - tailHeight + padding + (index + 0.5) * lineHeight);
        });
        
        ctx.restore();
    }
    
    // 绘制圆角矩形气泡
    drawBubble(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    // 文本换行处理
    wrapText(text, maxWidth, font) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        // 临时canvas用于测量文本宽度
        const measureCanvas = document.createElement('canvas');
        const measureCtx = measureCanvas.getContext('2d');
        measureCtx.font = font;
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = measureCtx.measureText(currentLine + ' ' + word).width;
            
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        
        lines.push(currentLine);
        return lines;
    }
    
    // 检查是否有活跃对话框
    hasActiveDialog() {
        return this.activeDialog !== null;
    }
}