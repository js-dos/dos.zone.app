import React, { useRef, useEffect, useState } from 'react';
import { DosFactoryType, DosInstance } from "js-dos";

declare const Dos: DosFactoryType;

export interface IPlayerProps {
    bundleUrl?: string;
}

export function Player(props: IPlayerProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [dos, setDos] = useState<DosInstance | null>(null);

    useEffect(() => {
        //window.screen.orientation.lock('landscape');

        const root = rootRef.current as HTMLDivElement;
        const dos = Dos(root);
        setDos(dos);
        return () => {
            //window.screen.orientation.unlock();
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
            dos.run(props.bundleUrl);
        }
    }, [dos, props.bundleUrl]);

    return <div ref={rootRef} className="player">
    </div>;
}

