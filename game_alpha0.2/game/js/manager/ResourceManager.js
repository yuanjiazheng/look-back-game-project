// 资源管理器 - 管理游戏中的所有资源加载
class ResourceManager {
    constructor() {
        this.resources = new Map();
        this.loaded = false;
        this.loadProgress = 0;
        this.totalResources = 0;
        this.loadedResources = 0;
    }

    // 添加资源
    addResource(name, type, path) {
        this.resources.set(name, {
            type: type,
            path: path,
            data: null,
            loaded: false
        });
        this.totalResources++;
    }

    // 加载所有资源
    loadAll() {
        return new Promise((resolve, reject) => {
            if (this.totalResources === 0) {
                this.loaded = true;
                resolve();
                return;
            }

            let loadedCount = 0;

            this.resources.forEach((resource, name) => {
                if (resource.type === 'image') {
                    const img = new Image();
                    img.onload = () => {
                        resource.data = img;
                        resource.loaded = true;
                        loadedCount++;
                        this.loadedResources = loadedCount;
                        this.loadProgress = loadedCount / this.totalResources;

                        if (loadedCount === this.totalResources) {
                            this.loaded = true;
                            resolve();
                        }
                    };
                    img.onerror = () => {
                        console.error(`Failed to load image: ${resource.path}`);
                        loadedCount++;
                        if (loadedCount === this.totalResources) {
                            this.loaded = true;
                            resolve();
                        }
                    };
                    img.src = resource.path;
                }
                // 可以扩展支持其他资源类型，如音频、JSON等
            });
        });
    }

    // 获取资源
    getResource(name) {
        const resource = this.resources.get(name);
        return resource ? resource.data : null;
    }

    // 检查资源是否已加载
    isResourceLoaded(name) {
        const resource = this.resources.get(name);
        return resource ? resource.loaded : false;
    }

    // 检查所有资源是否已加载
    isLoaded() {
        return this.loaded;
    }

    // 获取加载进度(0-1)
    getProgress() {
        return this.loadProgress;
    }
}