// 游戏初始化
window.addEventListener('load', () => {
    const canvas = document.getElementById("gameCanvas");
    window.game = new Game(canvas);   // 绑定到全局，供按钮调用

});