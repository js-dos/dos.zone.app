import { GET_OBJECT } from "./xhr/GET";
import { ssoLogin, ssoLogout, ssoUrl } from "./config";
import { parseQuery } from "./query-string";
import { logError } from "./log";
import { Capacitor } from "@capacitor/core";

const userKey = "zone.dos.user";

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
        const backUrl = Capacitor.isNative && Capacitor.platform === "android" ? "https://dos.zone/auto/my/" : window.location.href;
        const response = await GET_OBJECT(ssoUrl + "?url=" + backUrl);
        const url = response.url;
        window.open(url, "_self");
    } catch(e) {
        logError(e);
    }
}

export function getCachedUser() {
    const cachedValue: string | null = localStorage.getItem(userKey);
    return cachedValue === null ? null : JSON.parse(cachedValue);
}

export async function authenticate(user: User | null): Promise<User | null> {
    const { sso, sig } = parseQuery(window.location.search);
    if (sso) {
        const payload = parseQuery(atob(sso));
        user = {
            avatarUrl: payload.avatar_url,
            email: payload.email,
            username: payload.username,
            nonce: payload.nonce,
            sso,
            sig,
            time: Date.now(),
        };
    }

    if (user !== null) {
        user = await validateUser(user);
    }

    if (user !== null) {
        localStorage.setItem(userKey, JSON.stringify(user));
    } else {
        localStorage.removeItem(userKey);
    }

    if (sso) {
        window.history.replaceState({}, "", window.location.pathname);
    }

    return user;
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

export async function requestLogout() {
    const user = getCachedUser();
    if (user !== null) {
        try {
            const payload = await GET_OBJECT(ssoLogout + "?sso=" + user.sso +
                "&sig=" + user.sig);
            if (payload.success) {
                localStorage.removeItem(userKey);
                window.location.reload();
            }
        } catch (e) {
            logError(e);
        }
    }
}
