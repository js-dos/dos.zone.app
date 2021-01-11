import BigNumber from "bignumber.js";
import { GameData, getGame } from "./game";

const cachedGameData: {[bundleUrl: string]: GameData} = {};

export function getCachedGameData(bundleUrl: string) {
    if (cachedGameData[bundleUrl] !== undefined) {
        const data = {...cachedGameData[bundleUrl]};
        return data;
    }

    return null;
}

async function getGameDataByUrl(bundleUrl: string) {
    const cachedData = getCachedGameData(bundleUrl);
    if (cachedData !== null) {
        return cachedData;
    }

    const gameData = await getGame(bundleUrl);

    if (gameData !== null) {
        cachedGameData[bundleUrl] = gameData;
    }

    return gameData;
}

export async function getGameData(bundleUrl: string): Promise<GameData> {
    if (!bundleUrl.startsWith("http://") &&
        !bundleUrl.startsWith("https://") &&
        bundleUrl.indexOf("@") > 0 &&
        bundleUrl.indexOf(":") > 0) {
        const [slug, rest] = bundleUrl.split("@");
        const [name, hash] = rest.split(":");
        const canonicalUrl = decodeHashToUrl(hash);
        const description = "Source: https://talks.dos.zone/t/" + slug;
        return (await getGameDataByUrl(canonicalUrl)) || {
            title: name,
            game: slug.charAt(0).toUpperCase() + slug.substr(1),
            author: hash,
            screenshot: "",
            description: { en: { description }, },
            slug: { en: slug },
            canonicalUrl,
            turbo: "no",
        }
    }

    const byUrl = await getGameDataByUrl(bundleUrl);
    if (byUrl !== null) {
        return byUrl;
    }

    return {
        title: "please update app",
        game: "N/A",
        screenshot: "",
        author: "",
        description: {},
        slug: {},
        canonicalUrl: bundleUrl,
        turbo: "no",
    };
}

const KEYS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = KEYS.length;
const KEYS_HASH = initKeysHash();

function initKeysHash() {
    const keysHash: {[index: string]: BigNumber} = {};
    let i = 0;
    while (i < BASE) {
        keysHash[KEYS[i]] = new BigNumber(i);
        ++i;
    }
    return keysHash;
}

function decode(hash: string) {
  	let i = 0;
    let num = new BigNumber(0);
    const len = hash.length - 1;
    while (i < hash.length) {
        const pow = new BigNumber(BASE).pow(len - i);
        num = num.plus(KEYS_HASH[hash[i]].multipliedBy(pow));
        ++i;
    }
    return num.toString(16);
}

function decodeHashToUrl(hash: string) {
    const decoded = decode(hash);
    const depth = 1;
    return "https://doszone-uploads.s3.dualstack.eu-central-1.amazonaws.com/original/" +
        (depth + 1) + "X/" + decoded.substr(0, depth) + "/" + decoded + ".jsdos";
}
