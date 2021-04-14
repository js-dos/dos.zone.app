import { Capacitor } from "@capacitor/core";
import { Plugins } from "@capacitor/core";

export interface EmulatorPlugin {
    canIUse(): Promise<{ ok: boolean }>;
    sendMessage(args: { payload: string}): void;
}

class WebEmulator {
    canIUse(): Promise<{ ok: boolean}> {
        return Promise.resolve({ ok: false });
    }
}

function initPlugin(): EmulatorPlugin {
    if (Capacitor.platform === "android") {
        return (Plugins.EmulatorPlugin as EmulatorPlugin);
    }

    return new WebEmulator() as EmulatorPlugin;
}

export const HardwareEmulatorPlugin = initPlugin();

