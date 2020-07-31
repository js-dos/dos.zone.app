import React, { useRef, useEffect, useState } from 'react';
import { DosFactoryType, DosInstance } from "js-dos";

import { Dhry2 } from "./dhry2";
import { CommandInterface } from 'emulators';
import { dhry2Url } from '../core/storage';

declare const Dos: DosFactoryType;

export interface IPlayerProps {
    bundleUrl?: string;
}

export function Player(props: IPlayerProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [dos, setDos] = useState<DosInstance | null>(null);
    const [ci, setCi] = useState<CommandInterface | null>(null);

    useEffect(() => {
        /* const lockedPromise = window.screen.orientation
         *                      .lock('landscape')
         *                      .then(() => true)
         *                      .catch(() => false); */

        const root = rootRef.current as HTMLDivElement;
        const dos = Dos(root);
        setDos(dos);
        return () => {
            /* lockedPromise.then((locked) => {
             *     if (locked) {
             *         window.screen.orientation.unlock();
             *     }
             * }) */
            dos.stop();
        };
    }, []);

    useEffect(() => {
        if (dos === null) {
            return;
        }

        if (props.bundleUrl === undefined) {
            dos.stop();
        } else {
            dos.run(props.bundleUrl).then(setCi);
        }
    }, [dos, props.bundleUrl]);

    return <div ref={rootRef} className="player">
        { ci === null || props.bundleUrl !== dhry2Url ? null : <Dhry2 ci={ci} /> }
    </div>;
}

