// js/manager/EventManager.js
class EventManager {
    constructor() {
        this.listeners = {};
    }

    // 注册监听器
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    // 触发事件
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }
}

// 全局事件管理器实例
window.eventManager = new EventManager();
