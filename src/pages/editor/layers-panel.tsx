import React from "react";

import { PanelProps, Button, Icon, ButtonGroup, Intent } from "@blueprintjs/core";
import { EditorStackProps, LayerControlType } from "./layers-editor";
import { IconNames } from "@blueprintjs/icons";

export const LayersPanel: React.FC<PanelProps<EditorStackProps>> = props => {
    const { config, breadCrumbs, t } = props;
    function addNewLayer() {
        const newLayersConfig = {...config};
        const newBreadCrumbs = {...breadCrumbs};
        newBreadCrumbs.layer = newLayersConfig.layers.length;
        newLayersConfig.layers.push({
            grid: "honeycomb",
            title: "Layer#" + newBreadCrumbs.layer,
            controls: [{ row: 0, column: 10, symbol: "⚙", type: LayerControlType.Options }],
        });

        props.setLayersConfig(newLayersConfig);
        props.setBreadCrumbs(newBreadCrumbs);
    }

    function editLayer(index: number) {
        const newBreadCrumbs = {...breadCrumbs};
        newBreadCrumbs.layer = index;
        props.setBreadCrumbs(newBreadCrumbs);
    }


    function removeLayer(index: number) {
        const newLayersConfig = {...config};
        newLayersConfig.layers.splice(index, 1);
        props.setLayersConfig(newLayersConfig);
    }

    function asJson() {
        const newBreadCrumbs = {...breadCrumbs};
        newBreadCrumbs.asJson = true;
        props.setBreadCrumbs(newBreadCrumbs);
    }

    if (config.layers.length === 0) {
        return <div className="layers-empty">
            <Icon onClick={addNewLayer} icon={IconNames.INSERT} iconSize={52}></Icon>
            <div>{t("add_new_layer")}</div>
            <div className="layers-empty-close">
                <Button minimal={true}
                        icon={IconNames.CROSS}
                        intent={Intent.DANGER}
                        onClick={props.onClose}></Button>
            </div>
        </div>;
    }

    return (
        <div className="layers-container">
            {config.layers.map((l, index) => {
                return <div className="layers-entry" key={"layer-" + l.title + "-" + index}>
                    <div className="layers-layer-title">{l.title}</div>
                    <ButtonGroup className="layers-actions">
                        <Button icon={IconNames.EDIT} onClick={() => editLayer(index)}>{t("edit")}</Button>
                        <Button icon={IconNames.TRASH} minimal={true} intent={Intent.DANGER} onClick={() => removeLayer(index)}></Button>
                    </ButtonGroup>
                </div>
            })}
            <div className="layers-controls">
                <Button icon={IconNames.INSERT} onClick={addNewLayer}>{t("add_new_layer")}</Button>
                <span>&nbsp;</span>
                <Button icon={IconNames.EDIT} onClick={asJson}>{t("as_json")}</Button>
                <span className="layers-container-spring"></span>
                <Button icon={IconNames.CROSS} minimal={true} intent={Intent.DANGER} onClick={props.onClose}></Button>
            </div>
        </div>
    );
};
