import { GET } from "./xhr/GET";
import { User } from "./auth"
import { turboLimits, turboConnect } from "./config";

export interface TurboLimits {
    email: string;
    dayOrigin: number;
    timeLimit: number;
    usedTime: number;
    arn: string;
    startedAt: number;
    restTime: number;
}

export async function getTurboLimits(user: User): Promise<TurboLimits> {
    return JSON.parse(await GET(turboLimits + "?sso=" + user.sso + "&sig=" + user.sig)).limits;
}

export async function connect(user: User, bundleUrl: string) {
    return JSON.parse(await GET(turboConnect + "?sso=" + user.sso + "&sig=" + user.sig + "&bundleUrl=" + encodeURIComponent(bundleUrl)));
}

