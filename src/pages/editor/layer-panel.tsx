import React from "react";

import { PanelProps, Button, Label, Classes } from "@blueprintjs/core";
import { EditorStackProps } from "./layers-editor";

export const LayerPanel: React.FC<PanelProps<EditorStackProps>> = props => {
    const { config, breadCrumbs, t } = props;
    const index = breadCrumbs.layer || 0;
    const layer = config.layers[index];

    function onChangeName(event: any) {
        const newValue = event.target.value;
        layer.title = newValue;
        props.setLayersConfig({...config});
    }

    return (
        <div className="layers-container">
            <div className="layer-name-container">
                <div>{t("name")}</div>
                <div><input className={Classes.INPUT} value={layer.title} onChange={onChangeName} /></div>
            </div>
        </div>
    );
};
