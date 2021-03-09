import React, { useEffect, useState } from "react";
import { CommandInterface } from "emulators";
import { DosInstance } from "emulators-ui/dist/types/js-dos";

let a1Version = 0;

export function A1(props: {
    dos: DosInstance,
    ci: CommandInterface,
}) {
    const dos = props.dos;
    const ci = props.ci;
    const [_, setVersion] = useState<number>(a1Version);
    const [log, __] = useState<string[]>([]);
    const [keyCharTimes, ___] = useState<{[keyChar: string]: number}>({});

    useEffect(() => {
        const fn = (dos.layers as any).onKeyDown;
        (dos.layers as any).onKeyDown = (keyCode: number) => {
            const charCode = String.fromCharCode(keyCode).toLowerCase();
            keyCharTimes[charCode] = performance.now();
            fn(keyCode);
        };
        return () => {
            (dos.layers as any).onKeyDown = fn;
        };
    }, [dos, keyCharTimes]);

    useEffect(() => {
        const listeners: ((message: string) => void)[] = [];
        ci.events().onStdout((message: string) => {
            for (const next of listeners) {
                next(message);
            }
        });

        ci.events().onStdout = (fn: (message: string) => void) => {
            listeners.push(fn);
        }
    }, [ci]);

    useEffect(() => {
        ci.events().onStdout((message) => {
            if (keyCharTimes[message.toLowerCase()] !== undefined) {
                a1Version++;
                while (log.length > 4) {
                    log.shift();
                }
                log.push(message + ": " + Math.round((performance.now() - keyCharTimes[message]) * 100)/100 + "ms");
                setVersion(a1Version);
                delete keyCharTimes[message];
            }
        });
    }, [ci, log]);

    return <div className="a1-test"><pre>{log.join("\n")}</pre></div>;
}
