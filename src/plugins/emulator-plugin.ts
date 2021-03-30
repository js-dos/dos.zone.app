import { Capacitor } from "@capacitor/core";
import { Plugins } from "@capacitor/core";

interface EmulatorPlugin {
    canIUse(): Promise<{ ok: boolean }>;
}

class WebEmulator implements EmulatorPlugin {
    canIUse(): Promise<{ ok: boolean}> {
        return Promise.resolve({ ok: false });
    }
}

function initPlugin(): EmulatorPlugin {
    if (Capacitor.platform === "android") {
        return (Plugins.EmulatorPlugin as EmulatorPlugin);
    }

    return new WebEmulator();
}

export class HardwareEmulatorImpl {
    private plugin: EmulatorPlugin;

    constructor(plugin: EmulatorPlugin) {
        this.plugin = plugin;
    }

    async canIUse(): Promise<boolean> {
        return (await this.plugin.canIUse()).ok;
    }
}

export const HardwareEmulator: HardwareEmulatorImpl = new HardwareEmulatorImpl(initPlugin());

