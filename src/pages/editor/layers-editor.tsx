import React, { useState, useEffect } from "react";

import { PanelStack2, PanelProps, Panel, Button } from "@blueprintjs/core";
import { useTranslation } from "react-i18next";

import "./layers-editor.css";
import { TFunction } from "i18next";

import { LayersPanel } from "./layers-panel";
import { LayerPanel } from "./layer-panel";

export interface LayerConfig {
    title: string,
}

export interface LayersConfig {
    layers: LayerConfig[],
}

export interface BreadCrumbs {
    layer?: number,
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
        if (newBreadCrumbs.layer !== undefined) {
            delete newBreadCrumbs.layer;
            setBreadCrumbs(newBreadCrumbs);
            return;
        }
    };

    return <div className="layers-editor-container">
        <PanelStack2 className="layers-editor-stack"
                     stack={createPanelsStack(editorProps) as any}
                     onClose={onClose}
        />
    </div>;
}
