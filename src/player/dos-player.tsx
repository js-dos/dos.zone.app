import React, { useRef, useEffect, useState } from "react";
import { DosFactoryType, DosInstance } from "emulators-ui/dist/types/js-dos";

import { Dhry2 } from "./dhry2";
import { CommandInterface } from "emulators";
import { dhry2Bundle } from "../core/storage";
import { ControlSelector } from "emulators-ui/dist/types/dom/layers";

import { IPlayerProps } from "./player";

declare const Dos: DosFactoryType;

export function DosPlayer(props: IPlayerProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [dos, setDos] = useState<DosInstance | null>(null);
    const [ci, setCi] = useState<CommandInterface | null>(null);

    useEffect(() => {
        /* const lockedPromise = window.screen.orientation
         *                      .lock('landscape')
         *                      .then(() => true)
         *                      .catch(() => false); */
        const controlSelector: ControlSelector = {
            send: () => document.querySelector(".control-send") as HTMLElement,
            input: () => document.querySelector(".control-input") as HTMLInputElement,
            save: () => document.querySelector(".control-save") as HTMLElement,
            fullscreen: () => document.querySelector(".control-fullscreen") as HTMLElement,
        };

        const root = rootRef.current as HTMLDivElement;
        const dos = Dos(root, {
            controlSelector: props.embedded ? undefined : controlSelector
        });
        setDos(dos);
        return () => {
            /* lockedPromise.then((locked) => {
             *     if (locked) {
             *         window.screen.orientation.unlock();
             *     }
             * }) */
            dos.stop();
        };
    }, [props.embedded]);

    useEffect(() => {
        if (dos === null) {
            return;
        }

        if (props.bundleUrl === undefined) {
            dos.stop();
        } else {
            dos.run(props.bundleUrl).then(setCi);
        }
    }, [dos, props.bundleUrl, props.embedded]);

    return <div ref={rootRef} className="player">
        { ci === null || props.bundleUrl.indexOf(dhry2Bundle) < 0 ? null : <Dhry2 ci={ci} /> }
    </div>;
}
