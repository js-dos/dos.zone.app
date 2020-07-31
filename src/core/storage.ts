import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

const recentlyPlayedKey = "profileStorage.recentlyPlayed";

export const dhry2Url = "https://doszone-uploads.s3.dualstack.eu-central-1.amazonaws.com/original/2X/b/b4b5275904d86a4ab8a20917b2b7e34f0df47bf7.jsdos";

export type RecentlyPlayed = {[url: string]: {
    visitedAtMs: number,
}};


export class MyStorage {
    recentlyPlayed: RecentlyPlayed;

    constructor(recentlyPlayed: RecentlyPlayed) {
        this.recentlyPlayed = recentlyPlayed;
    }

    flush() {
        Storage.set({
            key: recentlyPlayedKey,
            value: JSON.stringify(this.recentlyPlayed),
        });
    }

};

async function myStorageFactory() {
    const played = JSON.parse((await Storage.get({key: recentlyPlayedKey})).value || "{}") as RecentlyPlayed;
    if (Object.keys(played).length === 0) {
        played[dhry2Url] = {
            visitedAtMs: Date.now(),
        };
    }
    return new MyStorage(played);
}

const myStoragePromise = myStorageFactory();

export function myStorage() {
    return myStoragePromise;
}


