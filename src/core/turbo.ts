import { GET_OBJECT } from "./xhr/GET";
import { User } from "./auth"
import { turboLimits, turboConnect, turboDisconnect, turboDescribe } from "./config";
import { logError } from "./log";

export interface TurboSession {
    email: string;
    timeLimit: number;
    restTime: number;
    arn?: string;
}

export async function getTurboSession(user: User): Promise<TurboSession | null> {
    try {
        return (await GET_OBJECT(turboLimits + "?sso=" + user.sso + "&sig=" + user.sig)).session;
    } catch (e) {
        logError(e);
        return null;
    }
}

export async function openTurboSession(user: User, bundleUrl: string): Promise<string | null> {
    try {
        return (await GET_OBJECT(turboConnect + "?sso=" + user.sso + "&sig=" + user.sig + "&bundleUrl=" + encodeURIComponent(bundleUrl))).session.arn;
    } catch(e) {
        logError(e);
        return null;
    }
}

export async function closeTurboSession(user: User, arn: string): Promise<string | null> {
    try {
        return (await GET_OBJECT(turboDisconnect + "?sso=" + user.sso + "&sig=" + user.sig + "&arn=" + encodeURIComponent(arn))).disconnected;
    } catch(e) {
        logError(e);
        return null;
    }
}

export async function describeSession(user: User, arn: string): Promise<{ live: boolean, ip: "N/A" | string } | null> {
    try {
        return (await GET_OBJECT(turboDescribe + "?sso=" + user.sso + "&sig=" + user.sig + "&arn=" + encodeURIComponent(arn))).session;
    } catch(e) {
        logError(e);
        return null;
    }
}

