import { gameGet, gameSearch } from "./config";
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
    slug: {[locale: string]: string},
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
        unescapeStrings(data);
        return data;
    } catch (e) {
        logError(e);
        return null;
    }
}

export async function searchGame(searchTerm: string): Promise<GameData[]> {
    try {
        const games = (await GET_OBJECT(gameSearch + "?request=" + encodeURIComponent(searchTerm))).games || [];
        for (const next of games) {
            unescapeStrings(next);
        }
        return games;
    } catch (e) {
        logError(e);
        return [];
    }
}

function unescapeStrings(game: GameData | null) {
    if (game === null) {
        return;
    }

    game.title = replaceEntities(game.title);
    game.game = replaceEntities(game.game);
}

function replaceEntities(value: string) {
    return (value || "").replaceAll("&#x26;", "&").replaceAll("&#x27;", "'");
}
