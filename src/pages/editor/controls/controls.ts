import React from "react";
import { EditorStackProps, LayerControl, LayerPosition } from "../layers-editor";

import { OptionsControl } from "./options";
import { KeyControl } from "./key";

import { EmulatorsUi } from "emulators-ui";

import "./controls.css";

declare const emulatorsUi: EmulatorsUi;

export const namedKeyCodes = emulatorsUi.controls.namedKeyCodes;
export const keyOptions = Object.keys(emulatorsUi.controls.namedKeyCodes);

export const controlsMapping: {[type: string]: React.FC<EditorStackProps>} = {
    "Options": OptionsControl,
    "Key": KeyControl,
}

export function getControl(props: EditorStackProps): LayerControl {
    const controls = props.config.layers[props.breadCrumbs.layer as number].controls;
    const position = props.breadCrumbs.layerControl as LayerPosition;
    for (const next of controls) {
        if (next.row === position.row && next.column === position.column) {
            return next;
        }
    }

    throw new Error("Unreachable");
}

export function getKeyCodeNameForCode(keyCode: number) {
    for (const next of keyOptions) {
        if (emulatorsUi.controls.namedKeyCodes[next] === keyCode) {
            return next;
        }
    }

    return "KBD_none";
}
