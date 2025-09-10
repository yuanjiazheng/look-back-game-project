class Store {
    static prefix = "portal-2d-";

    constructor() {
        const p = new URLSearchParams(window.location.search);
        p.forEach((v, k) => {
            localStorage.setItem(`${Store.prefix}${k}`, v);
        });

        if (window.location.search) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    static get(key) {
        return localStorage.getItem(`${Store.prefix}${key}`);
    }

    static set(key, value) {
        localStorage.setItem(`${Store.prefix}${key}`, value);
    }

    static remove(key) {
        localStorage.removeItem(`${Store.prefix}${key}`);
    }

    export() {
        let data = new Map();
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(Store.prefix)) {
                data.set(key, localStorage.getItem(key));
            }
        }
        return data;
    }

    encode() {
        const param = new URLSearchParams();
        this.export().forEach((v, k) => param.set(k, v));
        return param.toString();
    }
}
