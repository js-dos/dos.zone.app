import { Plugins } from "@capacitor/core";

import { GET_OBJECT, POST_OBJECT } from "../xhr/GET";
import { logError } from "../log";
import { User } from "../auth";
import { storageGet, storagePut } from "../config";

const { Storage } = Plugins;

const MAX_VALUE_SIZE   = 1024;
const NEXT_PART_SYMBOL = "@";
const NEXT_PART_SYFFIX = ".";
const CACHE_READ_TIMEOUT_MS = 5000;

function prefix(user?: User | null) {
    if (user === undefined || user === null) {
        return "dz._.";
    }
    return "dz." + user.username + ".";
}

async function getKey(user: User, key: string): Promise<string | null> {
    try {
        return (await GET_OBJECT(storageGet + "?sso=" + user.sso + "&sig=" + user.sig + "&key=" + key)).value || null;
    } catch (e) {
        logError(e);
        return null;
    }
}

async function putKey(user: User, key: string, value: string): Promise<boolean> {
    try {
        return (await POST_OBJECT(storagePut + "?sso=" + user.sso + "&sig=" + user.sig + "&key=" + key, value)).success || false;
    } catch (e) {
        logError(e);
        return false;
    }
}

async function get(appKey: string, defaultValue?: string, user?: User | null): Promise<string | null> {
    const localKey = prefix(user) + appKey;
    const localValue = await localGet(localKey);

    if (localValue !== null) {
        const dtime = Date.now() - localValue.time;
        if (dtime >= 0 && dtime < CACHE_READ_TIMEOUT_MS) {
            return localValue.payload;
        }
    }

    if (!user || user === null) {
        return localValue !== null ? localValue.payload : (defaultValue || null);
    }

    const value = await getKey(user, appKey);
    if (value !== null) {
        await localSet(localKey, value);
        return value;
    }

    return defaultValue || null;
};

async function set(appKey: string, value: string, user?: User | null): Promise<boolean> {
    const localKey = prefix(user) + appKey;
    await localSet(localKey, value);
    if (user !== undefined && user !== null) {
        await putKey(user, appKey, value);
    }
    return true;
};

async function localGet(key: string): Promise<{ time: number, payload: string } | null> {
    const valueOrNull = (await Storage.get({ key })).value;
    if (valueOrNull === null) {
        return null;
    }

    function readStringFromKey(key: string) {
        return Storage.get({key}).then((value) => {
            if (value.value === null) {
                return "";
            }

            return value.value as string;
        });
    }

    let value = valueOrNull as string;
    while (value[value.length - 1] === NEXT_PART_SYMBOL) {
        value = value.substring(0, value.length - 1);
        key += NEXT_PART_SYFFIX;
        value += await readStringFromKey(key);
    }

    try {
        return JSON.parse(value);
    } catch(e) {
        // ignore
        return null;
    }
};

async function localSet(key: string, payload: string): Promise<void> {
    const value = JSON.stringify({
        time: Date.now(),
        payload,
    });

    function writeStringToKey(key: string, value: string) {
        return Storage.set({
            key,
            value,
        });
    }

    const promises: Promise<void>[] = [];

    let offset = 0;
    while (offset < value.length) {
        let substr = value.substring(offset, offset + MAX_VALUE_SIZE);
        offset += substr.length;

        if (offset < value.length) {
            substr += NEXT_PART_SYMBOL;
        }

        promises.push(writeStringToKey(key, substr));
        key += NEXT_PART_SYFFIX;
    }

    await Promise.all(promises);
};

export function storage(user?: User | null) {
    return {
        getDefault: async (key: string, defaultValue: string) => {
            return (await get(key, defaultValue, user)) as string;
        },
        get: (key: string, defaultValue?: string) => get(key, defaultValue, user),
        set: (key: string, value: string) => set(key, value, user),
    }
}


