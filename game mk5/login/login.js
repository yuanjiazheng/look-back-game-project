// ---------- login.js (修正版) ----------

// 密码强度检查
function checkPasswordStrength(password) {
    const strengthEl = document.getElementById("strength");
    if (!strengthEl) return;

    if (password.length === 0) {
        strengthEl.textContent = "";
        barDisplay("");
        return;
    }
    if (password.length < 6) {
        strengthEl.textContent = "无效";
        barDisplay("无效");
        return;
    }

    const hasDigit = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    if (!hasDigit || !hasLetter) {
        strengthEl.textContent = "无效";
        barDisplay("无效");
        return;
    }

    let strength = "弱";
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);

    if (password.length > 10 && hasLower && hasUpper && hasSpecialChar) {
        strength = "强";
    } else if (password.length > 10 || (hasLower && hasUpper) || hasSpecialChar) {
        strength = "中";
    }

    strengthEl.textContent = strength;
    barDisplay(strength);
}

// 密码确认匹配显示（用于 oninput）
function checkSame(confirmVal) {
    const pass = document.getElementById("password-signup").value;
    const alertBox = document.querySelector("#signupForm .custom-alert .message");
    if (!alertBox) return;
    if (confirmVal.length === 0) {
        // nothing
        return;
    }
    if (pass !== confirmVal) {
        alertBox.textContent = "两次密码不相等";
        // 同时显示临时提示
        showAlertWithCountdown("两次密码不相等", 1);
    }
}

// 密码强度条显示
function barDisplay(strength) {
    const KeyMap = { "弱": 0, "中": 1, "强": 2 };
    const colors = ["#FF6666", "#FFCC66", "#66CC66"];

    for (let i = 0; i < 3; ++i) {
        let bar = document.getElementById("bar" + i);
        if (!bar) continue;
        if (!KeyMap.hasOwnProperty(strength)) {
            bar.style.display = "none";
        } else {
            bar.style.display = "inline-block";
            bar.style.width = "30px";
            bar.style.height = "6px";
            bar.style.marginRight = "6px";
        }
        if (KeyMap.hasOwnProperty(strength) && i <= KeyMap[strength]) {
            bar.style.backgroundColor = colors[KeyMap[strength]];
        } else {
            bar.style.backgroundColor = "#DDDDDD";
        }
    }
}

// 注册
function signup() {
    const username = document.getElementById("text-signup").value.trim();
    const password = document.getElementById("password-signup").value;
    const passwordCheck = document.getElementById("password-signup-check").value;
    const strength = document.getElementById("strength").textContent;

    if (!username) {
        showAlertWithCountdown("请输入用户名", 1);
        return;
    }
    if (Store.get(username) !== null) {
        showAlertWithCountdown("用户名已存在，请选择其他用户名。", 1);
        return;
    }
    if (strength !== "强" && strength !== "中") {
        showAlertWithCountdown("请提高密码强度", 1);
        return;
    }
    if (password !== passwordCheck) {
        showAlertWithCountdown("两次密码输入不相等", 1);
        return;
    }

    Store.set(username, password);
    Auth.login(username);
    showAlertWithCountdown("注册成功！", 1);
    toLogin(username, password);
}

// 切换回登录并填充
function toLogin(usernameVal, passwordVal) {
    const username = document.getElementById("text");
    const password = document.getElementById("password");
    if (username) username.value = usernameVal || "";
    if (password) password.value = passwordVal || "";
    toLoginPage();
}

// 登录
function login() {
    const username = document.getElementById("text").value.trim();
    const password = document.getElementById("password").value;
    const storedPassword = Store.get(username);

    if (storedPassword === null) {
        showAlertWithCountdown("用户名不存在。", 1);
        return;
    }
    if (storedPassword === password) {
        Auth.login(username);
        showAlertWithCountdown("登录成功！", 1);
        // safe call encode if available
        if (window.$store && typeof window.$store.encode === "function") {
            window.location.href = `../game/game.html?${window.$store.encode()}`;
        } else {
            window.location.href = `../game/game.html`;
        }
    } else {
        showAlertWithCountdown("密码错误。", 1);
    }
}

// 全局变量 form 节点（确保作用域）
let loginForm, signupForm, signupLink, loginLink;

document.addEventListener("DOMContentLoaded", () => {
    // 先确保 Store 已存在
    if (typeof Store === "undefined") {
        console.error("Store is not loaded. Check path to Store.js");
    } else {
        window.$store = new Store();
    }

    loginForm = document.getElementById("loginForm");
    signupForm = document.getElementById("signupForm");
    signupLink = document.getElementById("signupLink");
    loginLink = document.getElementById("loginLink");

    if (loginForm) loginForm.style.display = "block";
    if (signupForm) signupForm.style.display = "none";

    if (signupLink) signupLink.addEventListener("click", toSignupPage);
    if (loginLink) loginLink.addEventListener("click", toLoginPage);
});

function toSignupPage(e) {
    if (e) e.preventDefault();
    if (loginForm) loginForm.style.display = "none";
    if (signupForm) signupForm.style.display = "block";
}

function toLoginPage(e) {
    if (e) e.preventDefault();
    if (loginForm) loginForm.style.display = "block";
    if (signupForm) signupForm.style.display = "none";
}

// 自定义 alert
function showAlertWithCountdown(message, seconds) {
    const alertElements = document.querySelectorAll(".custom-alert");
    alertElements.forEach((alertElement) => {
        const messageElement = alertElement.querySelector(".message");
        if (messageElement) messageElement.textContent = message;
        alertElement.classList.remove("hidden");
        setTimeout(() => hideAlert(), seconds * 1000);
    });
}

function hideAlert() {
    const alertElements = document.querySelectorAll(".custom-alert");
    alertElements.forEach((alertElement) => {
        alertElement.classList.add("hidden");
    });
}
