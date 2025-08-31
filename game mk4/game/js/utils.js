// 游戏常量
const MAP_WIDTH = 10000;
const MAP_HEIGHT = 500;
const GROUND_HEIGHT = 50;
const GROUND_Y = 350;

// 坐标转换函数
function worldToScreen(worldX, worldY, camera) {
    return {
        x: worldX - camera.x,
        y: worldY - camera.y
    };
}

function screenToWorld(screenX, screenY, camera) {
    return {
        x: screenX + camera.x,
        y: screenY + camera.y
    };
}

// 工具函数
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// 生成随机数范围
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// 生成随机整数范围
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//加速-达到极值-减速
function move_toward(maxspeed,nowspeed)
{
    if(nowspeed<maxspeed){
        nowspeed += nowspeed
    }

}