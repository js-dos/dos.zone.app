import { SECRET } from "../private/sso";
import * as crypto from "crypto";

export interface User {
    avatarUrl: string,
    email: string,
    nonce: string,
    username: string,
    sso: string,
    sig: string,
    time: number,
}

export function makeUrl(nonce: string, backUrl: string) {
    const payload = "nonce=" + nonce + "&return_sso_url=" + backUrl;
    const sso = new Buffer(payload, "utf-8").toString("base64");
    const signature = calculateSig(sso);
    return "https://talks.dos.zone/session/sso_provider?sso=" + encodeURI(sso) + "&sig=" + signature;
}

export function validateSso(sso: string, sig: string): boolean {
    const signature = calculateSig(sso);
    return signature === sig;
}

export function decodeUser(sso: string, sig: string): User | null {
    if (!validateSso(sso, sig)) {
        return null;
    }

    const payload = parseQuery(new Buffer(sso, "base64").toString("utf-8"));
    return {
        avatarUrl: payload.avatar_url,
        email: payload.email,
        username: payload.username,
        nonce: payload.nonce,
        sso,
        sig,
        time: Date.now(),
    };
}

function calculateSig(sso: string) {
    return crypto.createHmac("sha256", SECRET).update(sso).digest("hex");
}

function parseQuery(queryString: string) {
    let query: {[key: string]: string} = {};
    let pairs = (queryString[0] === "?" ? queryString.substr(1) : queryString).split("&");
    for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i].split("=");
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
    }
    return query;
}
