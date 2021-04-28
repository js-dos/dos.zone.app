import React, { useState } from "react";

import { LayersConfig, LayerPosition } from "emulators-ui/dist/types/controls/layers-config"

import { PanelStack2, Panel } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";

import "./layers-editor.css";
import { TFunction } from "i18next";

import { LayersPanel } from "./layers-panel";
import { LayersAsJson } from "./layers-asjson";
import { LayerPanel } from "./layer-panel";
import { LayerControlPanel } from "./layer-control-panel";


export interface BreadCrumbs {
    layer?: number,
    layerControl?: LayerPosition,
    layerControlMove?: boolean,
    asJson?: boolean,
}

export interface EditorStackProps {
    t: TFunction,
    config: LayersConfig,
    breadCrumbs: BreadCrumbs,
    setLayersConfig: (config: LayersConfig) => void;
    setBreadCrumbs: (breadCrumbs: BreadCrumbs) => void;
    onApply: (config: LayersConfig) => void;
    onClose: () => void;
}

function createPanelsStack(props: EditorStackProps): Panel<EditorStackProps>[] {
    const stack: Panel<EditorStackProps>[] = [];
    stack.push({
        props,
        renderPanel: LayersPanel,
        title: props.t("layers"),
    });

    if (props.breadCrumbs.asJson === true) {
        stack.push({
            props,
            renderPanel: LayersAsJson,
            title: "JSON",
        });
        return stack;
    }

    if (props.breadCrumbs.layer === undefined) {
        return stack;
    }

    const layer = props.config.layers[props.breadCrumbs.layer];
    stack.push({
        props,
        renderPanel: LayerPanel,
        title: layer.title,
    })

    if (props.breadCrumbs.layerControl === undefined || props.breadCrumbs.layerControlMove === true) {
        return stack;
    }
    const layerControl = props.breadCrumbs.layerControl;
    stack.push({
        props,
        renderPanel: LayerControlPanel,
        title: "Control [" + layerControl.row + ", " + layerControl.column + "]",
    });

    return stack;
};

export function LayersEditor(props: {
    onApply: (config: LayersConfig) => void,
    onClose: () => void,
}) {
    const { t, i18n } = useTranslation("editor");
    const [ layersConfig, setLayersConfig ] = useState<LayersConfig>({
        version: 1,
        layers: [],
    });
    const [ breadCrumbs, setBreadCrumbs] = useState<BreadCrumbs>({});

    const editorProps: EditorStackProps = {
        t,
        config: layersConfig,
        breadCrumbs,
        setLayersConfig,
        setBreadCrumbs,
        onApply: props.onApply,
        onClose: props.onClose,
    };

    const onClose = () => {
        const newBreadCrumbs = {...breadCrumbs};
        if (newBreadCrumbs.asJson !== undefined) {
            delete newBreadCrumbs.asJson;
            setBreadCrumbs(newBreadCrumbs);
        } else if (newBreadCrumbs.layerControlMove !== undefined) {
            delete newBreadCrumbs.layerControlMove;
            setBreadCrumbs(newBreadCrumbs);
        } else if (newBreadCrumbs.layerControl !== undefined) {
            delete newBreadCrumbs.layerControl;
            delete newBreadCrumbs.layerControlMove;
            setBreadCrumbs(newBreadCrumbs);
        } else if (newBreadCrumbs.layer !== undefined) {
            delete newBreadCrumbs.layer;
            delete newBreadCrumbs.layerControl;
            delete newBreadCrumbs.layerControlMove;
            setBreadCrumbs(newBreadCrumbs);
        }
    };

    const panelStack = createPanelsStack(editorProps);
    return <div className="layers-editor-container">
        <PanelStack2 className="layers-editor-stack"
                     stack={panelStack as any}
                     onClose={onClose}
        />
    </div>;
}
