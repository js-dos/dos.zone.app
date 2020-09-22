import { GET } from "./xhr/GET";
import { ssoLogin, ssoLogout, ssoUrl } from "./config";
import { parseQuery } from "./query-string";

const userKey = "zone.dos.user";

export async function requestLogin() {
    const response = JSON.parse(await GET(ssoUrl + "?url=" + window.location.href));
    const url = response.url;
    window.open(url, "_self");
}

export interface User {
    avatarUrl: string,
    email: string,
    nonce: string,
    username: string,
    sso: string,
    sig: string,
    time: number,
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
    return JSON.parse(await GET(ssoLogin + "?sso=" + user.sso +
        "&sig=" + user.sig + "&ua=" + btoa(window.navigator.userAgent))).user;
}

export async function requestLogout() {
    const user = getCachedUser();
    if (user !== null) {
        const payload = JSON.parse(await GET(ssoLogout + "?sso=" + user.sso +
            "&sig=" + user.sig));
        if (payload.success) {
            localStorage.removeItem(userKey);
            window.location.reload();
        }
    }
}
