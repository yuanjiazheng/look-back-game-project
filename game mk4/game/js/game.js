class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // 创建资源管理器
        this.resourceManager = new ResourceManager();

        //NPC(敌我ai)管理器
        this.npcManager = new NPCManager();
        
        // 标记游戏是否已初始化
        this.initialized = false;
        
        // // 创建加载屏幕
        // this.setupLoadingScreen();
        
        // 开始加载资源
        this.loadResources().then(() => {
            // 资源加载完成后初始化游戏
            this.initGame();
        });
    }
    
    // setupLoadingScreen() {
    //     // 创建加载屏幕元素
    //     this.loadingScreen = document.createElement('div');
    //     this.loadingScreen.style.position = 'absolute';
    //     this.loadingScreen.style.top = '0';
    //     this.loadingScreen.style.left = '0';
    //     this.loadingScreen.style.width = '100%';
    //     this.loadingScreen.style.height = '100%';
    //     this.loadingScreen.style.backgroundColor = '#2c3e50';
    //     this.loadingScreen.style.display = 'flex';
    //     this.loadingScreen.style.flexDirection = 'column';
    //     this.loadingScreen.style.justifyContent = 'center';
    //     this.loadingScreen.style.alignItems = 'center';
    //     this.loadingScreen.style.color = 'white';
    //     this.loadingScreen.style.fontFamily = 'Arial';
        
    //     this.loadingText = document.createElement('div');
    //     this.loadingText.textContent = '加载中... 0%';
    //     this.loadingText.style.fontSize = '24px';
    //     this.loadingText.style.marginBottom = '20px';
        
    //     this.progressBar = document.createElement('div');
    //     this.progressBar.style.width = '300px';
    //     this.progressBar.style.height = '20px';
    //     this.progressBar.style.backgroundColor = '#34495e';
    //     this.progressBar.style.borderRadius = '10px';
    //     this.progressBar.style.overflow = 'hidden';
        
    //     this.progressBarInner = document.createElement('div');
    //     this.progressBarInner.style.width = '0%';
    //     this.progressBarInner.style.height = '100%';
    //     this.progressBarInner.style.backgroundColor = '#3498db';
    //     this.progressBarInner.style.transition = 'width 0.3s';
        
    //     this.progressBar.appendChild(this.progressBarInner);
    //     this.loadingScreen.appendChild(this.loadingText);
    //     this.loadingScreen.appendChild(this.progressBar);
        
    //     this.canvas.parentNode.style.position = 'relative';
    //     this.canvas.parentNode.appendChild(this.loadingScreen);
        
    //     // 更新加载进度
    //     this.loadingInterval = setInterval(() => {
    //         const progress = Math.floor(this.resourceManager.getProgress() * 100);
    //         this.loadingText.textContent = `加载中... ${progress}%`;
    //         this.progressBarInner.style.width = `${progress}%`;
    //     }, 100);
    // }
    
    async loadResources() {
        // 添加所有需要加载的资源(你希望的资源名称，类型，路径)
        this.resourceManager.addResource('PlayerIdlesheet', 'image', 'image/Player/PlayerIdle.png');
        this.resourceManager.addResource('PlayerWalksheet', 'image', 'image/Player/PlayerWalk.png');

        this.resourceManager.addResource('RufugeeIdlesheet', 'image', 'image/NPC/RufugeeIdle.png');
        this.resourceManager.addResource('RufugeeWalksheet', 'image', 'image/NPC/RufugeeWalk.png');
        // 添加其他资源...
        // this.resourceManager.addResource('enemySpritesheet', 'image', 'path/to/enemy/spritesheet.png');
        // this.resourceManager.addResource('background', 'image', 'path/to/background.png');
        
        // 等待所有资源加载完成
        await this.resourceManager.loadAll();
        
        // 清除加载进度更新间隔
        clearInterval(this.loadingInterval);
    }
    
    initGame() {
        // // 移除加载屏幕
        // if (this.loadingScreen.parentNode) {
        //     this.loadingScreen.parentNode.removeChild(this.loadingScreen);
        // }

        // 创建Hitbox系统
        this.hitboxSystem = new HitboxSystem();

        // 创建碰撞检测系统
        this.collisionSystem = new CollisionSystem(this.hitboxSystem);

        // 创建输入处理器
        this.input = new InputHandler();

        // 创建浮动文字系统
        this.floatingTextSystem = new FloatingTextSystem();
        
        // 创建金币收集系统
        this.goldCollectionSystem = new Goldcollection(this.hitboxSystem, this);

        // 创建摄像机
        this.camera = new Camera(this.canvas, MAP_WIDTH, MAP_HEIGHT);

        // 创建环境
        this.environment = new Environment(this.canvas);
        
        // 创建玩家 - 传递资源管理器
        this.player = new Player(MAP_WIDTH / 2, GROUND_Y-150, this.resourceManager);
        this.player.sethitbox(this.hitboxSystem);
        
        // 创建 NPC
        this.rufugee = new Rufugee(MAP_WIDTH / 2 + 50, GROUND_Y-80, this.resourceManager);

        //将npc增加到npc管理器
        this.npcManager.addNPC(this.rufugee);
        

        // 注册实体到Hitbox系统
        this.hitboxSystem.registerEntity(this.player);
        this.hitboxSystem.registerEntity(this.environment.getGroundEntity());
        this.hitboxSystem.registerEntity(this.rufugee);

        
        // // 障碍物数组
        // this.obstacles = [];
        
        // 标记游戏已初始化
        this.initialized = true;
        
        // 启动游戏循环
        this.lastTime = 0;
        requestAnimationFrame(this.gameLoop.bind(this));
        
        // 添加事件监听
        this.setupEventListeners();
        
        // 初始化调试模式
        window.DEBUG_HITBOXES = false;
    }
    
    setupEventListeners() {
        // 摄像机控制
        this.camera.followSpeed = 1;
        this.camera.xOffset = 0.5;
    }
    
    // spawnObstacle(x, y) {
    //     const obstacle = new Obstacle(x, y);
    //     this.obstacles.push(obstacle);
    //     this.hitboxSystem.registerEntity(obstacle);
    // }
    
    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // 更新游戏状态
        this.update(deltaTime);
        
        // 渲染游戏
        this.render();
              
        // 继续游戏循环
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    //更新游戏
    update(deltaTime) {
        // 处理输入
        const direction = this.input.getHorizontalDirection();
        this.player.move(direction);
        
        // 更新玩家
        this.player.update(deltaTime);

        // 更新所有 NPC
        this.npcManager.update(deltaTime, this);
        
        // 更新所有hitbox位置
        this.hitboxSystem.updateAllHitboxes();
        
        // 检查玩家与障碍物的碰撞
        const obstacleCollisions = this.collisionSystem.checkEntityCollisions(this.player, "damage");
        if (obstacleCollisions.length > 0) {
            console.log("玩家撞到障碍物!");
            // 这里可以添加碰撞响应逻辑
        }
        
        // 更新金币收集系统（金币的物理更新在里面处理）
        this.goldCollectionSystem.update(deltaTime);

        // 更新浮动文字系统
        this.floatingTextSystem.update(deltaTime, this.camera);

        // 更新摄像机位置
        this.camera.follow(this.player);
    }
    
    //渲染
    render() {
        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 保存当前状态
        this.ctx.save();
        
        // 绘制环境
        this.environment.draw(this.camera);
        
        // // 绘制障碍物
        // this.obstacles.forEach(obstacle => {
        //     obstacle.draw(this.ctx, this.camera);
        // });

        // 绘制金币
        this.goldCollectionSystem.goldEntities.forEach(gold => {
            gold.draw(this.ctx, this.camera);
        });
        
        // 绘制玩家
        this.player.draw(this.ctx, this.camera);
        
        // 绘制 NPC
        this.npcManager.render(this.ctx, this.camera);

        // 恢复状态
        this.ctx.restore();
        
        // 渲染浮动文字系统
        this.floatingTextSystem.render(this.ctx, this.camera);
        
        // 绘制金币收集进度
        this.ctx.fillStyle = '#000';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`金币: ${this.player.goldCount}`, 10, 80);
        
        // 显示浮动文字数量（调试用）
        if (window.DEBUG_HITBOXES) {
            this.ctx.fillText(`浮动文字: ${this.floatingTextSystem.getCount()}`, 10, 120);
        }

        // 显示调试信息
        if (window.DEBUG_HITBOXES) {
            this.ctx.fillText(`Hitbox调试模式: 开启`, 10, 60);
        }
    }
    
 
}