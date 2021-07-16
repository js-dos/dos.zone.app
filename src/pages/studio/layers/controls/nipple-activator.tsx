import React, { useEffect, useState } from "react";

import { LayerControl, LayerNippleActivatorControl } from "emulators-ui/dist/types/controls/layers-config";

import { EditorStackProps } from "../layers-editor";
import { getControl } from "./controls";

export const NippleActivatorControl: React.FC<EditorStackProps> = props => {
    const [optional, setControl] = useState<LayerNippleActivatorControl | null>(null);

    useEffect(() => {
        setControl(initDefault(getControl(props)));
    }, [props.config.layers, props.breadCrumbs.layer, props.breadCrumbs.layerControl]);


    if (optional === null) {
        return null;
    }

    return <div className="key-container">
    </div>;
}

function initDefault(layerControl: LayerControl): LayerNippleActivatorControl {
    const control = layerControl as LayerNippleActivatorControl;
    control.symbol = control.symbol || "◯";
    return control;
}
