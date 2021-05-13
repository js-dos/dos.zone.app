import React, { useState } from "react";

import { PanelProps, TextArea, Button, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { EditorStackProps } from "./layers-editor";

export const LayersAsJson: React.FC<PanelProps<EditorStackProps>> = props => {
    const { t, setLayersConfig } = props;
    const [json, setJson] = useState<string>(JSON.stringify(props.config, null, 4));
    function onChange(e: any) {
        setJson(e.target.value);
    }
    function onApply() {
        try {
            const layersConfig = JSON.parse(json);
            props.setLayersConfig(layersConfig);
            props.onApply(layersConfig);
        } catch (e) {
            console.error(e);
        }
    }
    return <div className="layers-container">
        <TextArea className="layers-asjson not-prevent-key-events" value={json} onChange={onChange}>
        </TextArea>
        <Button icon={IconNames.TICK} intent={Intent.SUCCESS} onClick={onApply}>{t("apply")}</Button>
    </div>;
}
