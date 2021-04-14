import { CommandInterface } from "emulators";
import { TransportLayer } from "emulators/dist/types/protocol/protocol";
import { EmulatorsUi } from "./emulators-ui";
import { Layers, LayersOptions } from "./dom/layers";
export declare type EmulatorFunction = "dosboxWorker" | "dosboxDirect" | "dosboxNode" | "janus" | "backend";
export interface DosOptions {
    emulatorFunction?: EmulatorFunction;
    clickToStart?: boolean;
    layersOptions?: LayersOptions;
    createTransportLayer?: () => TransportLayer;
}
export declare class DosInstance {
    static initialRun: boolean;
    emulatorsUi: EmulatorsUi;
    emulatorFunction: EmulatorFunction;
    createTransportLayer?: () => TransportLayer;
    layers: Layers;
    ciPromise?: Promise<CommandInterface>;
    enableMobileControls: () => void;
    disableMobileControls: () => void;
    private clickToStart;
    constructor(root: HTMLDivElement, emulatorsUi: EmulatorsUi, options: DosOptions);
    run(bundleUrl: string, optionalChangesUrl?: string): Promise<CommandInterface>;
    stop(): Promise<void>;
}
export declare type DosFactoryType = (root: HTMLDivElement, options?: DosOptions) => DosInstance;
