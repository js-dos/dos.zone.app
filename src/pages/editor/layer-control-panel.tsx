import React, { useState } from "react";

import { PanelProps, Button,
    Label, Classes, NumericInput, HTMLSelect, FormGroup, Intent } from "@blueprintjs/core";
import { EditorStackProps, LayerConfig, LayerControlType, LayerPosition } from "./layers-editor";
import { LayerGrid } from "./layer-grid";
import { layers } from "emulators-ui/dist/types/dom/layers";
import { IconNames } from "@blueprintjs/icons";

const allowedSymbols = ["⚙", "↑", "↓", "←", "→"];

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
            symbol: "?",
            type: LayerControlType.Options
        })
    }

    const control = layer.controls[controlIndex];

    function onTypeChange() {
    }

    function onSymbolChange(event: any) {
        control.symbol = event.currentTarget.value;
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

    return (<div className="layers-container">
        <FormGroup
            label={t("control_type")}
            inline={true}>
            <HTMLSelect onChange={onTypeChange} options={Object.keys(LayerControlType)} value={control.type}>
            </HTMLSelect>
        </FormGroup>
        <FormGroup
            label={t("symbol")}
            inline={true}>
            <HTMLSelect onChange={onSymbolChange} options={allowedSymbols} value={control.symbol}>
            </HTMLSelect>
        </FormGroup>
        <div className="layer-control-move">
            <Button intent={Intent.SUCCESS} minimal={true} icon={IconNames.MOVE} onClick={onMove}></Button>
        </div>
        <div className="layer-control-delete">
            <Button intent={Intent.DANGER} minimal={true} icon={IconNames.TRASH} onClick={onDelete}></Button>
        </div>
    </div>);
};
