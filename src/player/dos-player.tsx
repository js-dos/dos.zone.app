import React, { useRef, useEffect, useState } from "react";
import { DosFactoryType, DosInstance } from "emulators-ui/dist/types/js-dos";

import { Dhry2 } from "./dhry2";
import { CommandInterface } from "emulators";
import { dhry2Bundle } from "../core/storage/recently-played";

import { IPlayerProps } from "./player";
import { getPersonalBundleUrl } from "../core/personal";

declare const Dos: DosFactoryType;

export function DosPlayer(props: IPlayerProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [dos, setDos] = useState<DosInstance | null>(null);
    const [ci, _setCi] = useState<CommandInterface | null>(null);

    function setCi(ci: CommandInterface | null) {
        _setCi(ci);
        if (props.onDosInstance) {
            props.onDosInstance(ci === null ? null : dos);
        }
    }

    useEffect(() => {
        const root = rootRef.current as HTMLDivElement;
        const preventListener = (e: any) => {
            e.preventDefault();
        };

        window.addEventListener("keydown", preventListener);

        const instance = Dos(root, {
            emulatorFunction: props.turbo ? "janus" : "dosWorker",
        });

        setDos(instance);

        return () => {
            window.removeEventListener("keydown", preventListener);
            instance.stop();
        };
    }, [props.embedded, props.turbo]);

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
            dos.run(props.janusServerUrl).then(setCiIfNeeded);
        } else if (props.user === null && props.bundleUrl !== undefined) {
            dos.run(props.bundleUrl).then(setCiIfNeeded);
        } else if (props.user !== null && props.bundleUrl !== undefined) {
            getPersonalBundleUrl(props.user.email, props.bundleUrl).then((personalUrl) => {
                if (cancel) {
                    return;
                }

                dos.run(personalUrl).then(setCiIfNeeded);
            })
        } else {
            dos.stop();
            setCi(null);
        }

        return () => {
            cancel = true;
            dos.stop();
            setCi(null);
        }
    }, [dos, props.turbo, props.bundleUrl, props.embedded]);

    return <div ref={rootRef} className="player">
        { ci === null || (props.bundleUrl || "").indexOf(dhry2Bundle) < 0 ? null : <Dhry2 ci={ci} /> }
    </div>;
}
