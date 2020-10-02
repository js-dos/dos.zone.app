import { GET_OBJECT } from "./xhr/GET";
import { User } from "./auth"
import { turboLimits, turboConnect } from "./config";
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

export async function openTurboSession(user: User, bundleUrl: string): Promise<any | null> {
    return (await GET_OBJECT(turboConnect + "?sso=" + user.sso + "&sig=" + user.sig + "&bundleUrl=" + encodeURIComponent(bundleUrl)));
}

