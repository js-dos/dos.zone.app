import { GET } from "./xhr/GET";
import { User } from "./auth"
import { turboLimits, turboConnect } from "./config";

export interface TurboSession {
    email: string;
    timeLimit: number;
    restTime: number;
    arn?: string;
}

export async function getTurboSession(user: User): Promise<TurboSession> {
    return JSON.parse(await GET(turboLimits + "?sso=" + user.sso + "&sig=" + user.sig)).session;
}

export async function openTurboSession(user: User, bundleUrl: string) {
    return JSON.parse(await GET(turboConnect + "?sso=" + user.sso + "&sig=" + user.sig + "&bundleUrl=" + encodeURIComponent(bundleUrl)));
}

