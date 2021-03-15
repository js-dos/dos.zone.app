import React, { useEffect, useState } from "react";
import { CommandInterface } from "emulators";
import { DosInstance } from "emulators-ui/dist/types/js-dos";

import "./log-visual.css";

interface LogVisualData {
    white: {
        pipe: number;
        frame: number;
        stream: number;
    },
    red: {
        pipe: number;
        frame: number;
        stream: number;
    },
    yellow: {
        pipe: number;
        frame: number;
        stream: number;
    },
    median: {
        pipe: number[];
        frame: number[];
        stream: number[];
    }
}

export function LogVisual(props: {
    dos: DosInstance,
    ci: CommandInterface,
}) {
    const dos = props.dos;
    const ci = props.ci;
    const [logVisualData, setLogVisualData] = useState<LogVisualData>({
        white: { pipe: 0, frame: 0, stream: 0},
        red: { pipe: 0, frame: 0, stream: 0},
        yellow: { pipe: 0, frame: 0, stream: 0},
        median: { pipe: [0], frame: [0], stream: [0] },
    });

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
        const colors = ["white", "red", "yellow"];
        const signals = ["pipe", "frame", "stream"];

        ci.events().onStdout((message) => {
            let changed = false;
            for (const signal of signals) {
                for (const color of colors) {
                    if (message.startsWith(color + "-" + signal + ":")) {
                        const value = Number.parseInt(message.substr((color + "-" + signal + ":").length), 10);
                        (logVisualData as any)[color][signal] = value;
                        (logVisualData as any).median[signal].push(value);
                        changed = true;
                    }
                }
            }
            if (changed) {
                for (const signal of signals) {
                    while ((logVisualData as any).median[signal].length > 10) {
                        (logVisualData as any).median[signal].shift();
                    }
                }
                setLogVisualData({...logVisualData});
            }
        });

        (ci as any).logVisual(dos.layers.video);
    }, [dos, ci]);

    const pipe = [...logVisualData.median.pipe];
    const frame = [...logVisualData.median.frame];
    const stream = [...logVisualData.median.stream];

    pipe.sort(sortFn);
    frame.sort(sortFn);
    stream.sort(sortFn);

    const pipeMed = pipe[Math.floor(pipe.length/2)];
    const frameMed = frame[Math.floor(frame.length/2)];
    const streamMed = stream[Math.floor(stream.length/2)];

    return <div className="log-visual">
        <table>
            <tbody>
                <tr>
                    <td>signal</td>
                    <td>pipe</td>
                    <td>frame</td>
                    <td></td>
                    <td>stream</td>
                    <td></td>
                </tr>
                <tr>
                    <td>white</td>
                    <td>{logVisualData.white.pipe}</td>
                    <td>{logVisualData.white.frame}</td>
                    <td className="log-visual-dt">+{logVisualData.white.frame - logVisualData.white.pipe}</td>
                    <td>{logVisualData.white.stream}</td>
                    <td className="log-visual-dt">+{logVisualData.white.stream - logVisualData.white.frame}</td>
                </tr>
                <tr>
                    <td>red</td>
                    <td>{logVisualData.red.pipe}</td>
                    <td>{logVisualData.red.frame}</td>
                    <td className="log-visual-dt">+{logVisualData.red.frame - logVisualData.red.pipe}</td>
                    <td>{logVisualData.red.stream}</td>
                    <td className="log-visual-dt">+{logVisualData.red.stream - logVisualData.red.frame}</td>
                </tr>
                <tr>
                    <td>yellow</td>
                    <td>{logVisualData.yellow.pipe}</td>
                    <td>{logVisualData.yellow.frame}</td>
                    <td className="log-visual-dt">+{logVisualData.yellow.frame - logVisualData.yellow.pipe}</td>
                    <td>{logVisualData.yellow.stream}</td>
                    <td className="log-visual-dt">+{logVisualData.yellow.stream - logVisualData.yellow.frame}</td>
                </tr>
                <tr className="log-visual-median">
                    <td>median</td>
                    <td>{pipeMed}</td>
                    <td>{frameMed}</td>
                    <td className="log-visual-dt">+{frameMed - pipeMed}</td>
                    <td>{streamMed}</td>
                    <td className="log-visual-dt">+{streamMed - frameMed}</td>
                </tr>
            </tbody>
        </table>
    </div>;
}

function sortFn(a: number, b: number) {
    return a - b;
}
