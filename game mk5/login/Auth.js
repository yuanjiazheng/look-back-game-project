class Auth {
    static getToken() {
        return Store.get('token');
    }

    static isAuthenticated() {
        return this.getToken() !== null;
    }

    static toLogin() {
        // 根据你的目录结构修改路径
        window.location.href = './pages/login/login.html';
    }

    static login(username) {
        // 保存 token
        Store.set('token', username);
    }

    static logout() {
        Store.remove('token');
        this.toLogin();
    }
}
