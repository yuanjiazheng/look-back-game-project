// js/manager/AchievementManager.js
class AchievementManager {
    constructor() {
        this.achievements = [
            { id: "first_login", name: "初出茅庐", desc: "完成第一次登录", unlocked: false },
            { id: "chop_tree", name: "伐木工", desc: "成功砍倒一棵树", unlocked: false },
            { id: "gold_100", name: "财富积累", desc: "收集到100金币", unlocked: false }
        ];

        // 订阅事件
        eventManager.on("login", () => this.unlock("first_login"));
        eventManager.on("tree_chopped", () => this.unlock("chop_tree"));
        eventManager.on("gold_collected", (gold) => {
            if (gold >= 100) this.unlock("gold_100");
        });
    }

    unlock(id) {
        const achievement = this.achievements.find(a => a.id === id);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.saveProgress();
            this.showNotification(achievement);
        }
    }

    showNotification(achievement) {
        alert(`🎉 成就解锁: ${achievement.name}`);
        // 可以在游戏画面里用UI系统显示
    }

    saveProgress() {
        localStorage.setItem("achievements", JSON.stringify(this.achievements));
    }

    loadProgress() {
        const data = localStorage.getItem("achievements");
        if (data) {
            this.achievements = JSON.parse(data);
        }
    }
}

window.achievementManager = new AchievementManager();
achievementManager.loadProgress();
