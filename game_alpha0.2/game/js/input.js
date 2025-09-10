class InputHandler {
    constructor() {
        this.keys = {};
        this.keyPressed = {}; // 用于检测单次按键
        
        window.addEventListener('keydown', (e) => {
            if (['a', 'd', 'ArrowLeft', 'ArrowRight', 's', 'S', 'e', 'E'].includes(e.key)) {
                e.preventDefault();
                this.keys[e.key] = true;
                this.keyPressed[e.key] = true; // 标记按键被按下
            }
            
            // 调试快捷键
            if (e.key === 'h') {
                window.DEBUG_HITBOXES = !window.DEBUG_HITBOXES;
                console.log("Hitbox调试模式: " + (window.DEBUG_HITBOXES ? "开启" : "关闭"));
            }
        });
        
        window.addEventListener('keyup', (e) => {
            if (['a', 'd', 'ArrowLeft', 'ArrowRight', 's', 'S', 'e', 'E'].includes(e.key)) {
                e.preventDefault();
                this.keys[e.key] = false;
                this.keyPressed[e.key] = false;
            }
        });
    }
    
    getHorizontalDirection() {
        if (this.keys['a'] || this.keys['ArrowLeft']) return 'left';
        if (this.keys['d'] || this.keys['ArrowRight']) return 'right';
        return null;
    }
    
    isThrowPressed() {
        // 检查单次按键，然后重置状态
        const pressed = this.keyPressed['s'] || this.keyPressed['S'];
        this.keyPressed['s'] = false;
        this.keyPressed['S'] = false;
        return pressed;
    }
    
    isInteractPressed() {
        // 检查单次按键，然后重置状态
        const pressed = this.keyPressed['e'] || this.keyPressed['E'];
        this.keyPressed['e'] = false;
        this.keyPressed['E'] = false;
        return pressed;
    }
}