import React, { useState, useEffect } from "react";

import { PanelStack2, PanelProps, Panel, Button } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";

import "./layers-editor.css";
import { TFunction } from "i18next";

import { LayersPanel } from "./layers-panel";
import { LayerPanel } from "./layer-panel";
import { LayerControlPanel } from "./layer-control-panel";

import { GridType } from "./grid";

export enum LayerControlType {
    Options = "Options",
}

export interface LayerPosition {
    column: number;
    row: number;
}

export interface LayerControl extends LayerPosition {
    type: LayerControlType,
    symbol: string;
}

export interface LayerConfig {
    grid: GridType,
    title: string,
    controls: LayerControl[],
}

export interface LayersConfig {
    layers: LayerConfig[],
}

export interface BreadCrumbs {
    layer?: number,
    layerControl?: LayerPosition,
    layerControlMove?: boolean,
}

export interface EditorStackProps {
    t: TFunction,
    config: LayersConfig,
    breadCrumbs: BreadCrumbs,
    setLayersConfig: (config: LayersConfig) => void;
    setBreadCrumbs: (breadCrumbs: BreadCrumbs) => void;
}

function createPanelsStack(props: EditorStackProps): Panel<EditorStackProps>[] {
    const stack: Panel<EditorStackProps>[] = [];
    stack.push({
        props,
        renderPanel: LayersPanel,
        title: props.t("layers"),
    });

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

export function LayersEditor(props: {}) {
    const { t, i18n } = useTranslation("editor");
    const [ layersConfig, setLayersConfig ] = useState<LayersConfig>({
        layers: [],
    });
    const [ breadCrumbs, setBreadCrumbs] = useState<BreadCrumbs>({});

    const editorProps: EditorStackProps = {
        t,
        config: layersConfig,
        breadCrumbs,
        setLayersConfig,
        setBreadCrumbs,
    };

    const onClose = () => {
        const newBreadCrumbs = {...breadCrumbs};
        if (newBreadCrumbs.layerControl !== undefined) {
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
