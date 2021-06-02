import React, { useEffect, useState } from "react";
import { CommandInterface } from "emulators";
import { EmulatorsUi } from "emulators-ui";

import "./log-layers.css";
import { Callout } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

declare const emulatorsUi: EmulatorsUi;

const keyCodeNames = buildKeyCodeNames();

export function LogLayers(props: {
    ci: CommandInterface,
}) {
    const ci = props.ci;
    const [lastKeyName, setLastKeyName] = useState<string | null>(null);

    useEffect(() => {
        const sendKeyFn = ci.sendKeyEvent;
        let lastReportedKeyCode = 0;
        let timeoutId: any = -1;
        ci.sendKeyEvent = (keyCode: number, pressed: boolean) => {
            sendKeyFn.apply(ci, [keyCode, pressed]);
            clearTimeout(timeoutId);
            if (pressed && lastReportedKeyCode !== keyCode) {
                lastReportedKeyCode = keyCode;

                setLastKeyName(keyCodeNames[keyCode]);
            }
            timeoutId = setTimeout(() => setLastKeyName(null), 1000);
        };

        return () => clearTimeout(timeoutId);
    }, [ci]);

    if (lastKeyName === null) {
        return null;
    }

    return <div className="log-layers-container">
        <Callout icon={IconNames.WIDGET_BUTTON}>
            { lastKeyName }
        </Callout>
    </div>;
}

function buildKeyCodeNames() {
    const names: {[keyCode: number]: string} = {};

    for (const name of Object.keys(emulatorsUi.controls.namedKeyCodes)) {
        names[emulatorsUi.controls.namedKeyCodes[name]] = (name || "KBD_???").substr(4).toUpperCase();
    }

    return names;
}