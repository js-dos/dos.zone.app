import React, { useEffect, useState } from "react";

import { FormGroup, HTMLSelect, InputGroup, IOptionProps } from "@blueprintjs/core";
import { LayerControl, LayerKeyControl } from "emulators-ui/dist/types/controls/layers-config";
import { EditorStackProps } from "../layers-editor";
import { getControl, getKeyCodeNameForCode, namedKeyCodes } from "./controls";

export const KeyControl: React.FC<EditorStackProps> = props => {
    const { t } = props;
    const [optional, setControl] = useState<LayerKeyControl | null>(null);
    const [version, setVersion] = useState<number>(0);
    const options: IOptionProps[] = Object.keys(namedKeyCodes).map((key) => {
        return {
            label: mapKBDToShort(key),
            value: key,
        };
    });

    useEffect(() => {
        setControl(initDefault(getControl(props)));
    }, [props.config.layers, props.breadCrumbs.layer, props.breadCrumbs.layerControl]);


    if (optional === null) {
        return null;
    }

    const control = optional;

    function onSymbolChange(event: any) {
        control.symbol = event.currentTarget.value;
        setVersion(version + 1);
    }

    function eventToKeyCode(event: any) {
        const key = event.currentTarget.value;
        return namedKeyCodes[key];
    }

    function onChangeKey(event: any) {
        control.mapTo = eventToKeyCode(event);
        control.symbol = mapKBDToSymbol(getKeyCodeNameForCode(control.mapTo));
        setVersion(version + 1);
    }

    return <div className="key-container">
        <FormGroup
            label={t("key")}
            inline={true}>
            <HTMLSelect minimal={false}
                        options={options}
                        onChange={(e) => onChangeKey(e)}
                        value={getKeyCodeNameForCode(control.mapTo)} />
        </FormGroup>
        <FormGroup
            label={t("symbol")}
            inline={true}>
            <InputGroup onChange={onSymbolChange} fill={false} value={control.symbol} />
        </FormGroup>
    </div>;
}

function initDefault(layerControl: LayerControl): LayerKeyControl {
    const control = layerControl as LayerKeyControl;
    control.symbol = control.symbol || mapKBDToSymbol("KBD_up");
    control.mapTo = control.mapTo || namedKeyCodes.KBD_up;
    return control;
}

function mapKBDToShort(kbd: string) {
    return kbd.substr(4);
}

const symbols: {[key: string]: string} = {
    up: "↑",
    down: "↓",
    left: "←",
    right: "→",
    kp8: "↑",
    kp2: "↓",
    kp4: "←",
    kp6: "→",
    esc: "␛",
    space: "␠",
    backspace: "␈",
    enter: "⏎",
    kpenter: "⏎",
}

function mapKBDToSymbol(kbd: string) {
    const short = mapKBDToShort(kbd);
    const symbol = symbols[short];
    if (symbol !== undefined) {
        return symbol;
    }
    return short;
}

