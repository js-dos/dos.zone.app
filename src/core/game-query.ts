import { gamesDb } from "./games";

export interface GameData {
    title: string,
    game: string,
    author: string,
    screenshot: string,
    description: {[locale: string]: {
        description: string,
    }},
}

const gameData: {[bundleUrl: string]: GameData} = JSON.parse(gamesDb);

export function getGameData(bundleUrl: string) {
    return gameData[bundleUrl] || {
        title: "please update app",
        game: "N/A",
        screenshot: "",
        author: "",
        description: {},
    };
}
