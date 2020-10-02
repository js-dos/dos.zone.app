import { GET_OBJECT } from "./xhr/GET";
import { User } from "./auth"
import { personalUrl } from "./config";
import { logError } from "./log";

export interface TurboSession {
    email: string;
    timeLimit: number;
    restTime: number;
    arn?: string;
}

export async function getPersonalBundleUrl(user: User, bundleUrl: string): Promise<string | null> {
    try {
        return (await GET_OBJECT(personalUrl + "?sso=" + user.sso + "&sig=" + user.sig + "&bundleUrl=" + bundleUrl)).personalBundleUrl;
    } catch(e) {
        logError(e);
        return null;
    }
}

