import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    H1, H2, Classes, FileInput, Intent, Spinner,
    Tree, ITreeNode, Button, ButtonGroup
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { ZipExecutables } from "../core/zip-explorer";
import { TFunction } from 'i18next';

interface State {
    zip?: Uint8Array,
    executables?: string[],
}

interface StepProps {
    t: TFunction,
    state: State,
    nextStep: (state: State) => void;
    restart: () => void;
}

const steps = [
    (props: StepProps) => {
        const {t, state, nextStep} = props;
        const [error, setError] = useState<string>("");
        const [loadProgress, setLoadProgress] = useState<number>(0);
        const [reader, setReader] = useState<FileReader|null>(null);

        function onInputChange(e: any) {
            const files = e.currentTarget.files as FileList;
            if (files.length === 0) {
                setReader(null);
                return;
            }

            setError("");

            const file = files[0];
            var reader = new FileReader();
            reader.addEventListener('load', async (e) => {
                const zip = new Uint8Array(reader.result as ArrayBuffer);
                const blob = new Blob([zip]);
                setLoadProgress(100);

                try {
                    const executables = await ZipExecutables(blob);
                    nextStep({
                        zip,
                        executables,
                    });
                } catch (e) {
                    setError(t("zip_error") + e);
                    setReader(null);
                    setLoadProgress(0);
                }
            });
            reader.addEventListener('progress', (e) => setLoadProgress(e.loaded / e.total));
            reader.readAsArrayBuffer(file);
            setReader(reader);
        }

        return <div>
            <p>{t("upload")} <span style={{color: "#D9822B", fontWeight: "bold", borderBottom: "2px solid #DB3737"}}>ZIP</span> {t("archive")} ({t("try")} <a href="https://caiiiycuk.github.io/dosify/digger.zip">digger.zip</a>)</p>
            <div style={{display: "flex"}}><FileInput disabled={reader !== null} text={t("choose_file")} onInputChange={onInputChange} />&nbsp;&nbsp;<Spinner size={16} intent={Intent.PRIMARY} value={loadProgress} /></div>
            <p><span style={{color: "#DB3737", display: (error.length === 0 ? "none" : "block") }}>*&nbsp;{error}</span></p>
        </div>;
    },

    (props: StepProps) => {
        const {t, state, nextStep} = props;
        const [executable, setExecutable] = useState<string | null>(null);

        const executables: string[] = state.executables || [];

        if (executable !== null) {
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
                    <Button intent={Intent.PRIMARY}>{t("use_this")}</Button>
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
                icon: IconNames.PLAY,
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
    },
];

export function GameStudio() {
    const { t, i18n } = useTranslation("studio");
    const [step, setStep] = useState<number>(1);
    const [state, setState] = useState<State>({});

    const stepComponent = React.createElement(steps[step - 1], {
        t,
        state,
        nextStep: (state) => {
            setState(state);
            setStep(step + 1);
        },
        restart: () => {
            setState({});
            setStep(1);
        },
    });

    return <div className={Classes.TEXT_LARGE}
                style={{padding: "40px"}}>
        <H1>{t("welcome")}</H1>
        <p>{t("description")}</p>

        <H2>{t("step")} {step}/{steps.length}</H2>
        <div>
            {stepComponent}
        </div>
    </div>;
}


