import React, { useRef, useEffect, useState } from "react";
import { DosFactoryType, DosInstance } from "emulators-ui/dist/types/js-dos";

import { LogVisual } from "./log-visual";
import { Dhry2 } from "./dhry2";
import { CommandInterface } from "emulators";
import { dhry2Bundle } from "../core/storage/recently-played";

import { IPlayerProps } from "./player";
import { getPersonalBundleUrl, putPresonalBundle } from "../core/personal";
import { User } from "../core/auth";
import { cdnUrl } from "../core/cdn";
import { hardwareTransportLayerFactory } from "../plugins/transport-layer";

declare const zip: any;
declare const Dos: DosFactoryType;

function isEmptyArchive(data: Uint8Array): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        zip.createReader(new zip.BlobReader(new Blob([data])), (reader: any) => {
            reader.getEntries((entries: any) => {
                let empty = true;
                for (const next of entries) {
                    empty = next.directory === true;
                    if (!empty) {
                        break;
                    }
                }
                reader.close();
                resolve(empty);
            });
        }, (e: any) => reject(new Error("not a zip archive")));
    });
}

export function DosPlayer(props: IPlayerProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [dos, setDos] = useState<DosInstance | null>(null);
    const [ci, _setCi] = useState<CommandInterface | null>(null);
    const [canIUseHardware, setCanIUseHardware] = useState<boolean | null>(null);

    const isDhry2Bundle = props.bundleUrl?.indexOf(dhry2Bundle) >= 0;

    function setCi(ci: CommandInterface | null) {
        _setCi(ci);
        if (props.onDosInstance) {
            props.onDosInstance(ci === null ? null : dos);
        }
    }

    useEffect(() => {
        if (canIUseHardware === null) {
            hardwareTransportLayerFactory.canIUse().then((r) => setCanIUseHardware(r.ok === true));
        }
    }, [canIUseHardware]);

    useEffect(() => {
        if (canIUseHardware === null) {
            return;
        }

        const root = rootRef.current as HTMLDivElement;
        const preventListener = (e: any) => {
            if (e.target.className.indexOf("not-prevent-key-events") >= 0) {
                return;
            }
            e.preventDefault();
        };

        window.addEventListener("keydown", preventListener);

        const instance = Dos(root, {
            emulatorFunction: props.turbo ? "janus" : (canIUseHardware ? "backend" : "dosWorker"),
            createTransportLayer: hardwareTransportLayerFactory.createTransportLayer,
        } as any);

        setDos(instance);

        return () => {
            window.removeEventListener("keydown", preventListener);
            instance.stop();
        };
    }, [props.embedded, props.turbo, canIUseHardware]);

    useEffect(() => {
        if (dos === null) {
            return;
        }

        let cancel = false;
        function setCiIfNeeded(ci: CommandInterface) {
            if (cancel) {
                return;
            }

            setCi(ci);
        }

        if (props.turbo && props.janusServerUrl !== undefined) {
            dos.run(props.janusServerUrl).then((ci) => {
                setCiIfNeeded(ci);
                dos.layers.setOnSave(() => Promise.resolve());
            });
        } else if (props.user === null && props.bundleUrl !== undefined) {
            dos.run(cdnUrl(props.bundleUrl)).then(setCiIfNeeded);
            if (props.local || isDhry2Bundle) {
                dos.layers.setOnSave(() => Promise.resolve());
            }
        } else if (props.user !== null && props.bundleUrl !== undefined) {
            const personalBundleUrl = getPersonalBundleUrl(props.user.email, props.bundleUrl);
            dos.run(cdnUrl(props.bundleUrl), personalBundleUrl).then((ci) => {
                setCiIfNeeded(ci);
                if (props.local || isDhry2Bundle) {
                    dos.layers.setOnSave(() => Promise.resolve());
                } else {
                    dos.layers.setOnSave(() => {
                        return ci.persist().then(async (data) => {
                            const isEmpty = await isEmptyArchive(data);
                            if (isEmpty) {
                                return Promise.resolve();
                            }
                            return putPresonalBundle(props.user as User, data, props.bundleUrl);
                        })
                    });
                }
            });
        } else {
            dos.stop();
            setCi(null);
        }

        return () => {
            cancel = true;
            dos.stop();
            setCi(null);
        }
    }, [dos, props.user, props.turbo, props.bundleUrl, props.embedded, props.local, isDhry2Bundle]);

    let decorator: JSX.Element | null = null;
    if (ci !== null && dos !== null) {
        if (props.logVisual) {
            decorator = <LogVisual ci={ci} dos={dos} />;
        } else if (isDhry2Bundle) {
            decorator = <Dhry2 ci={ci} />;
        }
    }
    return <div ref={rootRef} className="player">
        {decorator}
    </div>;
}
