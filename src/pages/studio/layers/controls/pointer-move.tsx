import React, { useEffect, useState } from "react";

import { LayerControl, LayerPointerMoveControl } from "emulators-ui/dist/types/controls/layers-config";

import { EditorStackProps } from "../layers-editor";
import { getControl } from "./controls";
import { InputGroup, NumericInput, FormGroup } from "@blueprintjs/core";

export const PointerMoveControl: React.FC<EditorStackProps> = props => {
    const { t } = props;
    const [optional, setControl] = useState<LayerPointerMoveControl | null>(null);
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

    function onXChange(value: number) {
        control.x = value;
        setVersion(version + 1);
    }

    function onYChange(value: number) {
        control.y = value;
        setVersion(version + 1);
    }

    return <div className="key-container">
        <FormGroup
            label={t("symbol")}
            inline={true}>
            <InputGroup onChange={onSymbolChange} fill={false} value={control.symbol} />
        </FormGroup>
        <FormGroup
            label="x[0..1]"
            inline={true}>
                <NumericInput min={0} max={1} value={control.x} stepSize={0.1} majorStepSize={0.2}
                onValueChange={onXChange} />
        </FormGroup>
        <FormGroup
            label="y[0..1]"
            inline={true}>
                <NumericInput min={0} max={1} value={control.y} stepSize={0.1} majorStepSize={0.2}
                onValueChange={onYChange} />
        </FormGroup>
    </div>;
}

function initDefault(layerControl: LayerControl): LayerPointerMoveControl {
    const control = layerControl as LayerPointerMoveControl;
    control.x = control.x || 0;
    control.y = control.y || 0;
    control.symbol = control.symbol || "UP";
    return control;
}



