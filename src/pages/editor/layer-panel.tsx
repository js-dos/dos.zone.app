import React from "react";

import { PanelProps, Button, Label, Classes, NumericInput, HTMLSelect } from "@blueprintjs/core";
import { EditorStackProps } from "./layers-editor";
import { LayerGrid } from "./layer-grid";
import { getGrid } from "./grid";

export const LayerPanel: React.FC<PanelProps<EditorStackProps>> = props => {
    const { config, breadCrumbs, t } = props;
    const index = breadCrumbs.layer || 0;
    const layer = config.layers[index];

    function onChangeName(event: any) {
        const newValue = event.target.value;
        layer.title = newValue;
        props.setLayersConfig({...config});
    }

    function onGridChange(event: any) {
        const newValue = event.target.value;
        layer.grid = newValue;
        // validate grid
        const { cells } = getGrid(layer.grid).getConfiguration(1, 1);
        for (const next of layer.controls) {
            if (next.row >= cells.length) {
                next.row = cells.length - 1;
            }

            const cellsRow = cells[next.row];
            if (next.column >= cellsRow.length) {
                next.column = cellsRow.length - 1;
            }
        }

        props.setLayersConfig({...config});
    }

    return (
        <div className="layers-container">
            <div className="layer-name-container">
                <div>{t("name")}</div>
                <div><input className={Classes.INPUT} value={layer.title} onChange={onChangeName} /></div>
                <div>{t("grid")}</div>
                <HTMLSelect value={layer.grid} onChange={onGridChange}>
                    <option value="square">Square</option>
                    <option value="honeycomb">Honeycomb</option>
                </HTMLSelect>
            </div>
            { props.breadCrumbs.layerControlMove === true ?
              <div className="layer-select-position">{t("select_position")}</div> : null}
            <LayerGrid {...props} />
        </div>
    );
};
