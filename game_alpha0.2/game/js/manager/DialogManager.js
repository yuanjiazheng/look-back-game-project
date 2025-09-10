// js/manager/DialogManager.js
class DialogManager {
    constructor(game) {
        this.game = game;
        this.isActive = false; // 是否正在显示对话
        this.dialogs = [];     // 当前对话数组
        this.currentIndex = 0; // 当前句子索引

        this.createUI();
    }

    createUI() {
        // 创建对话框 DOM
        this.dialogBox = document.createElement("div");
        this.dialogBox.id = "dialog-box";
        this.dialogBox.style.display = "none"; // 默认隐藏
        document.body.appendChild(this.dialogBox);

        this.textElement = document.createElement("p");
        this.dialogBox.appendChild(this.textElement);

        // 点击对话框 → 下一句
        this.dialogBox.addEventListener("click", () => this.next());
        document.addEventListener("keydown", (e) => {
            if (this.isActive && e.code === "Space") {
                this.next();
            }
        });
    }

    start(dialogs) {
        this.isActive = true;
        this.dialogs = dialogs;
        this.currentIndex = 0;
        this.game.inputLocked = true; // 锁定玩家操作
        this.dialogBox.style.display = "block";
        this.showCurrent();
    }

    showCurrent() {
        if (this.currentIndex < this.dialogs.length) {
            this.textElement.textContent = this.dialogs[this.currentIndex];
        } else {
            this.end();
        }
    }

    next() {
        this.currentIndex++;
        this.showCurrent();
    }

    end() {
        this.isActive = false;
        this.dialogBox.style.display = "none";
        this.game.inputLocked = false; // 恢复操作
    }
}
