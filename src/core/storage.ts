import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

const recentlyPlayedKey = "profileStorage.recentlyPlayed";
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
    return new MyStorage(played);
}

const myStoragePromise = myStorageFactory();

export function myStorage() {
    return myStoragePromise;
}


