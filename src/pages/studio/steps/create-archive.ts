import { Emulators } from "emulators";
import { DosConfig } from "emulators/dist/types/dos/bundle/dos-conf";

declare const emulators: Emulators;

export async function createArchive(config: DosConfig, zip: Uint8Array) {
    const dosBundle = await emulators.dosBundle();
    dosBundle.config = config;

    const blob = new Blob([zip as Uint8Array]);
    const url = URL.createObjectURL(blob);

    dosBundle
        .extract(url);

    const archive = await dosBundle.toUint8Array(true);
    URL.revokeObjectURL(url);
    return archive;
}
