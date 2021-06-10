import { GET_OBJECT } from "./xhr/GET";
import { ssoLogin, ssoLogout, ssoUrl } from "./config";
import { parseQuery } from "./query-string";
import { logError } from "./log";
import { Capacitor } from "@capacitor/core";
import { storage } from "./storage/storage";

const userKey = "zone.dos.user";
const userCookie = userKey.replace(/\./g, "_");

export interface User {
    avatarUrl: string,
    email: string,
    nonce: string,
    username: string,
    sso: string,
    sig: string,
    time: number,
}


export async function requestLogin() {
    try {
        const backUrl = Capacitor.isNative && Capacitor.platform === "android" ? "https://dos.zone" + window.location.pathname : window.location.href;
        const response = await GET_OBJECT(ssoUrl + "?url=" + backUrl);
        const url = response.url;
        window.open(url, "_self");
    } catch(e) {
        logError(e);
    }
}

export function getCachedUser(): User | null {
    // read cookie first
    for (const next of document.cookie.split("; ")) {
        if (next.startsWith(userCookie + "=")) {
            const cookieValue = next.substr((userCookie + "=").length);
            if (cookieValue.length === 0) {
                return null;
            } else {
                return JSON.parse(atob(cookieValue));
            }
        }
    }

    // give chance to ls
    try {
        const cachedValue = localStorage.getItem(userKey);
        return cachedValue === null || cachedValue === undefined ? null : JSON.parse(cachedValue);
    } catch (e) {
        return null;
    }
}

export async function refresh(user: User | null): Promise<User | null> {
    if (user !== null) {
        user = await validateUser(user);
    }

    if (user !== null) {
        const cachedUser = getCachedUser();
        const shouldUpdateDefaults = cachedUser === null || cachedUser.email !== user.email;
        const stringified = JSON.stringify(user);
        try {
            localStorage.setItem(userKey, stringified);
        } catch (e) {
            // do nothing
        }
        document.cookie = userCookie + "=" + btoa(stringified) + ";path=/;max-age=2592000";
        if (shouldUpdateDefaults) {
            initDefaults(user);
        }
    } else {
        try {
            localStorage.removeItem(userKey);
        } catch (e) {
            // do nothing
        }
        document.cookie = userCookie + "=;path=/";
    }

    return user;
}

export function authenticate(sso: string, sig:  string): Promise<User | null> {
    const payload = parseQuery(atob(sso));
    return refresh({
        avatarUrl: payload.avatar_url,
        email: payload.email,
        username: payload.username,
        nonce: payload.nonce,
        sso,
        sig,
        time: Date.now(),
    });
}

async function initDefaults(user: User) {
    const userStorage = storage(user);
    const region = await userStorage.get("turbo.region");
    if (region === null) {
        await userStorage.set("turbo.region", "auto");
    }
}

async function validateUser(user: User): Promise<User | null> {
    try {
        return (await GET_OBJECT(ssoLogin + "?sso=" + user.sso +
            "&sig=" + user.sig + "&ua=" + btoa(window.navigator.userAgent))).user;
    } catch (e) {
        logError(e);
        return null;
    }
}

export async function requestLogout(resetUser: () => void) {
    const user = getCachedUser();
    if (user !== null) {
        try {
            const payload = await GET_OBJECT(ssoLogout + "?sso=" + user.sso +
                "&sig=" + user.sig);
            if (payload.success) {
                try {
                    localStorage.removeItem(userKey);
                } catch (e) {
                    // do nothing
                }
                document.cookie = userCookie + "=;path=/";
                resetUser();
            }
        } catch (e) {
            logError(e);
        }
    }
}

export function isSuperUser(user?: User | null) {
    if (user === null || user === undefined) {
        return false;
    }

    return user.email === "caiiiycuk@gmail.com";
}
