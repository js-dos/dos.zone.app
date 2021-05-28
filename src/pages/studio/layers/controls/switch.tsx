import React, { useEffect, useState } from "react";

import { LayerControl, LayerSwitchControl } from "emulators-ui/dist/types/controls/layers-config";

import { EditorStackProps } from "../layers-editor";
import { getControl } from "./controls";
import { HTMLSelect, FormGroup, InputGroup } from "@blueprintjs/core";

export const SwitchControl: React.FC<EditorStackProps> = props => {
    const { t } = props;
    const [optional, setControl] = useState<LayerSwitchControl | null>(null);
    const [version, setVersion] = useState<number>(0);

    useEffect(() => {
        setControl(initDefault(getControl(props), props.config.layers[0].title));
    }, [props.config.layers, props.breadCrumbs.layer, props.breadCrumbs.layerControl]);


    if (optional === null) {
        return null;
    }

    const control = optional;
    const names: string[] = [];

    for (const next of props.config.layers) {
        names.push(next.title);
    }

    function onSymbolChange(event: any) {
        control.symbol = event.currentTarget.value;
        setVersion(version + 1);
    }

    function onNameChange(event: any) {
        control.layerName = event.currentTarget.value;
        setVersion(version + 1);
    }

    return <div className="key-container">
        <FormGroup
            label={t("layer")}
            inline={true}>
            <HTMLSelect minimal={false}
                        options={names}
                        onChange={onNameChange}
                        value={control.layerName} />
        </FormGroup>
        <FormGroup
            label={t("symbol")}
            inline={true}>
            <InputGroup onChange={onSymbolChange} fill={false} value={control.symbol} />
        </FormGroup>
    </div>;
}

function initDefault(layerControl: LayerControl, layerName: string): LayerSwitchControl {
    const control = layerControl as LayerSwitchControl;
    control.symbol = ">";
    control.layerName = layerName;
    return control;
}
