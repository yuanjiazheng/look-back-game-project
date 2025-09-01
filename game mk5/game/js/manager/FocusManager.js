// js/manager/FocusManager.js
class FocusManager {
    constructor(game) {
        this.game = game;
        this.isFocused = true;
        this.overlay = document.getElementById("pauseOverlay");

        // 页面失焦
        window.addEventListener("blur", () => this.pause());

        // 页面获得焦点
        window.addEventListener("focus", () => this.resume());

        // 标签页切换
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) this.pause();
            else this.resume();
        });
    }

    pause() {
        this.isFocused = false;
        this.game.isPaused = true;
        if (this.game.input) {
            this.game.input.keys = {};
            this.game.input.keyPressed = {};
        }
        if (this.overlay) this.overlay.style.display = "block";
        console.log("Game paused");
    }

    resume() {
        this.isFocused = true;
        this.game.isPaused = false;
        if (this.overlay) this.overlay.style.display = "none";
        console.log("Game resumed");
    }
}
