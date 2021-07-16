import React from "react";

import { LayerControl, LayerPosition } from "emulators-ui/dist/types/controls/layers-config";
import { EditorStackProps } from "../layers-editor";

import { OptionsControl } from "./options";
import { KeyControl } from "./key";
import { KeyboardControl } from "./keyboard";
import { SwitchControl } from "./switch";
import { ScreenMoveControl } from "./screen-move";
import { PointerButtonControl } from "./pointer-button";
import { PointerMoveControl } from "./pointer-move";
import { PointerResetControl } from "./pointer-reset";
import { NippleActivatorControl } from "./nipple-activator";

import { EmulatorsUi } from "emulators-ui";

import "./controls.css";

declare const emulatorsUi: EmulatorsUi;

export const namedKeyCodes = emulatorsUi.controls.namedKeyCodes;
export const keyOptions = Object.keys(emulatorsUi.controls.namedKeyCodes);

export const controlsMapping: {[type: string]: React.FC<EditorStackProps>} = {
    Options: OptionsControl,
    Key: KeyControl,
    Keyboard: KeyboardControl,
    Switch: SwitchControl,
    ScreenMove: ScreenMoveControl,
    PointerButton: PointerButtonControl,
    PointerMove: PointerMoveControl,
    PointerReset: PointerResetControl,
    NippleActivator: NippleActivatorControl,
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
