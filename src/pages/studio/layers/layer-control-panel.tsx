import React, { useState } from "react";

import { Button, FormGroup, HTMLSelect, Intent, PanelProps } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { LayerConfig, LayerPosition } from "emulators-ui/dist/types/controls/layers-config";
import { controlsMapping } from "./controls/controls";
import { EditorStackProps } from "./layers-editor";

export const LayerControlPanel: React.FC<PanelProps<EditorStackProps>> = props => {
    const [ readOnly, setReadOnly ] = useState<boolean>(false);
    const [ version, setVersion ] = useState<number>(0);
    const { t } = props;
    const { column, row } = props.breadCrumbs.layerControl as LayerPosition;
    const layer = props.config.layers[props.breadCrumbs.layer as number] as LayerConfig;
    let controlIndex = 0;
    for (const next of layer.controls) {
        if (next.column === column && next.row === row) {
            break;
        }
        ++controlIndex;
    }

    if (readOnly && controlIndex === layer.controls.length) {
        return null;
    }

    if (controlIndex === layer.controls.length) {
        layer.controls.push({
            row,
            column,
            symbol: "",
            type: "Key",
        })
    }

    const control = layer.controls[controlIndex];

    function onTypeChange(event: any) {
        clearControl(control);
        control.type = event.currentTarget.value;
        setVersion(version + 1);
    }

    function onMove() {
        const newBreadCrumbs = {...props.breadCrumbs};
        newBreadCrumbs.layerControlMove = true;
        props.setBreadCrumbs(newBreadCrumbs);
    }

    function onDelete() {
        setReadOnly(true);
        layer.controls.splice(controlIndex, 1);
        const newBreadCrumbs = {...props.breadCrumbs};
        delete newBreadCrumbs.layerControl;
        props.setBreadCrumbs(newBreadCrumbs);
        props.setLayersConfig({...props.config});
    }

    const controlElement = React.createElement(controlsMapping[control.type], props);

    return (<div className="layers-container">
        <FormGroup
            label={t("control_type")}
            inline={true}>
            <HTMLSelect onChange={onTypeChange} options={Object.keys(controlsMapping)} value={control.type}>
            </HTMLSelect>
        </FormGroup>
        <div className="layers-control-container">
            {controlElement}
        </div>
        <div className="layer-control-move">
            <Button intent={Intent.SUCCESS} minimal={true} icon={IconNames.MOVE} onClick={onMove}></Button>
        </div>
        <div className="layer-control-delete">
            <Button intent={Intent.DANGER} minimal={true} icon={IconNames.TRASH} onClick={onDelete}></Button>
        </div>
    </div>);
};

function clearControl(obj: any) {
    for (const next of Object.keys(obj)) {
        if (next === "row" || next === "column") {
            continue;
        }
        delete obj[next];
    }
}
