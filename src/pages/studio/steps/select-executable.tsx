import React, { useEffect, useState } from "react";
import {
    H1, H2, Classes, FileInput, Intent, Spinner,
    Tree, ITreeNode, Button, AnchorButton, ButtonGroup
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { StepProps } from "../state";

export function SelectExecutable(props: StepProps) {
    const {t, state, nextStep} = props;
    const [executable, setExecutable] = useState<string | null>(null);

    const executables: string[] = state.executables || [];

    if (executable !== null) {
        const next = () => {
            nextStep({
                ...state,
                executable: executable as string,
            });
        };

        return <div>
            <p>{t("selected_executable")}</p>
            <div style={{
                background: "#394B59",
                padding: "10px 20px",
                display: "flex",
                alignItems: "center",
                width: "max-content",
            }}>
                <span style={{
                    color: "#D9822B",
                    fontWeight: "bold",
                    marginRight: "20px",
                }}>{executable}</span>
                <Button disabled={executables.length === 1} className={Classes.MINIMAL} onClick={() => setExecutable(null)}>{t("select_other")}</Button>
            </div>
            <br/>
            <div>
                <Button intent={Intent.PRIMARY} onClick={next}>{t("use_this")}</Button>
            </div>
        </div>;
    }

    if (executables.length === 0) {
        return <div>
            <p>
                <span style={{color: "#DB3737", fontWeight: "bold"}}>{t("executable_not_found")}</span>
            </p>
            <Button icon={IconNames.RESET} intent={Intent.PRIMARY} onClick={() => props.restart()}>{t("try_other")}</Button>
        </div>
    }

    if (executables.length === 1) {
        setExecutable(executables[0]);
        return <Spinner></Spinner>;
    }

    const nodes: ITreeNode[] = [];
    for (const next of executables) {
        nodes.push({
            id: next,
            label: next,
            icon: IconNames.CIRCLE,
        });
    }
    return <div>
        <p>{t("select_executable")}</p>
        <div style={{
            background: "#394B59",
            padding: "10px 0px",
        }}>
            <Tree contents={nodes} onNodeClick={(node) => setExecutable(node.id + "")} />
        </div>
    </div>
}
