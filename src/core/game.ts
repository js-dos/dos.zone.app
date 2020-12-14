import { gameGet } from "./config";
import { GET_OBJECT } from "./xhr/GET";
import { logError } from "./log";

export interface GameData {
    title: string,
    game: string,
    author: string,
    screenshot: string,
    description: {[locale: string]: {
        description: string,
    }},
    turbo: "optional" | "required" | "no",
    canonicalUrl: string,
}

export async function getGame(bundleUrl: string): Promise<GameData | null> {
    try {
        const data = (await GET_OBJECT(gameGet + "?bundleUrl=" + encodeURI(bundleUrl))).value;
        if (data === undefined) {
            return null;
        }
        data.canonicalUrl = bundleUrl;
        return data;
    } catch (e) {
        logError(e);
        return null;
    }
}
