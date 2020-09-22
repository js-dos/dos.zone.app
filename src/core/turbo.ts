import { GET } from "./xhr/GET";
import { User } from "./auth"
import { turboLimits } from "./config";

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

