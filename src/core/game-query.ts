import { gamesDb } from "./games";
import BigNumber from "bignumber.js";

export interface GameData {
    title: string,
    game: string,
    author: string,
    screenshot: string,
    description: {[locale: string]: {
        description: string,
    }},
    turbo?: boolean,
    canonicalUrl: string,
}

const gameData: {[bundleUrl: string]: GameData} = JSON.parse(gamesDb);

function getGameDataByUrl(bundleUrl: string) {
    if (gameData[bundleUrl] !== undefined) {
        const data = {...gameData[bundleUrl]};
        data.canonicalUrl = bundleUrl;
        return data;
    }

    return undefined;
}

export function getGameData(bundleUrl: string): GameData {
    const byUrl = getGameDataByUrl(bundleUrl);
    if (byUrl !== undefined) {
        return byUrl;
    }

    if (!bundleUrl.startsWith("http://") &&
        !bundleUrl.startsWith("https://") &&
        bundleUrl.indexOf("@") > 0 &&
        bundleUrl.indexOf(":") > 0) {
        const [slug, rest] = bundleUrl.split("@");
        const [name, hash] = rest.split(":");
        const canonicalUrl = decodeHashToUrl(hash);
        const description = "Source: https://talks.dos.zone/t/" + slug;
        return getGameDataByUrl(canonicalUrl) || {
            title: "from uploads",
            game: name,
            author: hash,
            screenshot: "",
            description: { en: { description }, },
            turbo: false,
            canonicalUrl,
        }
    }

    return {
        title: "please update app",
        game: "N/A",
        screenshot: "",
        author: "",
        description: {},
        turbo: false,
        canonicalUrl: bundleUrl,
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
