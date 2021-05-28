import React, { useEffect, useState } from "react";

import { LayerControl, LayerPointerButtonControl } from "emulators-ui/dist/types/controls/layers-config";

import { EditorStackProps } from "../layers-editor";
import { getControl } from "./controls";
import { HTMLSelect, FormGroup, InputGroup } from "@blueprintjs/core";

export const PointerButtonControl: React.FC<EditorStackProps> = props => {
    const { t } = props;
    const [optional, setControl] = useState<LayerPointerButtonControl | null>(null);
    const [version, setVersion] = useState<number>(0);

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

    return <div className="key-container">
        <FormGroup
            label={t("button")}
            inline={true}>
            <HTMLSelect minimal={false}
                        options={["0", "1"]}
                        disabled={true}
                        value={control.button} />
        </FormGroup>
        <FormGroup
            label={t("symbol")}
            inline={true}>
            <InputGroup onChange={onSymbolChange} fill={false} value={control.symbol} />
        </FormGroup>
    </div>;
}

function initDefault(layerControl: LayerControl): LayerPointerButtonControl {
    const control = layerControl as LayerPointerButtonControl;
    control.symbol = "RMB";
    control.button = 1;
    return control;
}
