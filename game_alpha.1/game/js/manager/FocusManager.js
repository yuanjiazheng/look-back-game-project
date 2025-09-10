// js/manager/FocusManager.js
class FocusManager {

    pause() {
        this.game.isPaused = true;
        if (this.game.input) {
            this.game.input.keys = {};
            this.game.input.keyPressed = {};
        }
        if (this.overlay) this.overlay.style.display = "block";
        console.log("Game paused");
    }

    resume() {
        this.game.isPaused = false;
        if (this.overlay) this.overlay.style.display = "none";
        console.log("Game resumed");
    }
}
