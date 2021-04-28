import React from "react";

import { PanelProps } from "@blueprintjs/core";
import { EditorStackProps } from "./layers-editor";
import { IconNames } from "@blueprintjs/icons";

export const LayersAsJson: React.FC<PanelProps<EditorStackProps>> = props => {
    return <div className="layers-container">
        <textarea className="layers-asjson" value={JSON.stringify(props.config, null, 4)}>
        </textarea>
    </div>;
}
