import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import {
    H1, H2, Classes, FileInput, Intent, Spinner,
    Tree, ITreeNode, Button, AnchorButton
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { ZipExecutables } from "../core/zip-explorer";
import { TFunction } from "i18next";
import { Emulators } from "emulators";

import { DosConfigUi } from "./dos-config-ui";
import { DosConfig } from "emulators/dist/types/dos/bundle/dos-conf";

import ReactMardown from "react-markdown/with-html";
import { renderers } from "../core/renderers";

import { Player } from "../player/player";

declare const emulators: Emulators;

interface State {
    name?: string,
    zip?: Uint8Array,
    executables?: string[],
    executable?: string,
    config?: DosConfig,
    bundle?: Uint8Array,
}

interface StepProps {
    t: TFunction,
    lang: string,
    state: State,
    nextStep: (state: State) => void;
    back: () => void;
    restart: () => void;
}

const steps = [
    (props: StepProps) => {
        const {t, nextStep} = props;
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
            const reader = new FileReader();
            reader.addEventListener("load", async (e) => {
                const zip = new Uint8Array(reader.result as ArrayBuffer);
                const blob = new Blob([zip]);
                setLoadProgress(100);

                try {
                    const executables = await ZipExecutables(blob);
                    const name = file.name.substr(0, file.name.lastIndexOf("."));
                    nextStep({
                        name,
                        zip,
                        executables,
                    });
                } catch (e) {
                    setError(t("zip_error") + e);
                    setReader(null);
                    setLoadProgress(0);
                }
            });
            reader.addEventListener("progress", (e) => setLoadProgress(e.loaded / e.total));
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
    },

    (props: StepProps) => {
        const {t, state, nextStep} = props;
        const [error, _setError] = useState<string>("");
        const [loading, setLoading] = useState<boolean>(false);
        const [config, setConfig] = useState<DosConfig | null>(() => {
            if (state.config) {
                return state.config;
            }

            setTimeout(() => {
                emulators.dosBundle()
                         .then((bundle) => {
                             bundle.autoexec(state.executable + "");
                             state.config = bundle.config;
                             setConfig(state.config);
                         })
                         .catch(() => setError(new Error("Can't crate dos bundle")));
            }, 1);
            return null;
        });

        const setError = (error: Error) => {
            _setError(error.message + "\n\n" + JSON.stringify(error.stack));
        };

        const createArchive = async () => {
            setLoading(true);
            const dosBundle = await emulators.dosBundle();
            dosBundle.config = config as DosConfig;

            const blob = new Blob([state.zip as Uint8Array]);
            const url = URL.createObjectURL(blob);

            dosBundle
                .extract(url);

            const archive = await dosBundle.toUint8Array();
            URL.revokeObjectURL(url);

            nextStep({
                ...state,
                bundle: archive,
            });
        };

        if (loading || config === null) {
            return <div>
                <Spinner/>
            </div>;
        }


        return <div>
            {error}
            <DosConfigUi config={config as DosConfig} t={t}></DosConfigUi>
            <Button onClick={() => {
                createArchive().catch(setError);
            }}>{t("create")}</Button>
        </div>;
    },

    (props: StepProps) => {
        const {t, state, back} = props;
        const [url] = useState<string>(() => {
            const blob = new Blob([state.bundle as Uint8Array], {
                type: "application/zip"
            });
            return URL.createObjectURL(blob);
        });
        const [bundleUrl, setBundleUrl] = useState<string|undefined>(url);

        const onDownload = () => {
            const a = document.createElement("a");
            a.href = url;
            a.download = state.name + ".jsdos";
            a.style.display = "none";
            document.body.appendChild(a);

            a.click();
            a.remove();
        }

        const onStopStart = () => {
            if (bundleUrl) {
                setBundleUrl(undefined);
            } else {
                setBundleUrl(url);
            }
        }

        return <div>
            <div style={{
                position: "relative",
                width: "64vw",
                height: "40vw",
                background: "black",
            }}>
                <Player bundleUrl={bundleUrl as string} user={null} embedded={true} turbo={false} />
            </div>
            <br/>
            <Button onClick={back}>{t("back")}</Button>&nbsp;
            <Button onClick={onDownload} intent={Intent.PRIMARY}>{t("download")}</Button>&nbsp;
            <Button onClick={onStopStart} intent={Intent.WARNING}>{bundleUrl ? t("stop") : t("start")}</Button>
            <br/><br/>
            <ReactMardown renderers={renderers}
                          source={t("help", {lang: props.lang, game: state.name})}
                          escapeHtml={false}></ReactMardown>
        </div>;
    },
];

export function GameStudio() {
    const { t, i18n } = useTranslation("studio");
    const [step, setStep] = useState<number>(1);
    const [state, setState] = useState<State>({});

    const props = {
        t,
        lang: i18n.language,
        state,
        nextStep: (state: State) => {
            setState(state);
            setStep(step + 1);
        },
        back: () => {
            setStep(step - 1);
        },
        restart: () => {
            setState({});
            setStep(1);
        },
    };

    const stepComponent = React.createElement(steps[step - 1], props);

    return <div className={Classes.TEXT_LARGE}
                style={{padding: "40px"}}>
        <H1>{t("welcome")}</H1>
        <p>
            {t("description")}&nbsp;
            (<Link to={"/" + i18n.language + "/guide/studio"}>
                {t("read_guide")}
            </Link>)
        </p>

        <div style={{display: "flex", alignItems: "center"}}>
            <H2>{t("step")} {step}/{steps.length}</H2>
            <AnchorButton
                style={{
                    marginLeft: "10px",
                    marginTop: "-20px",
                    visibility: (step > 1 ? "visible" : "hidden")
                }}
                className={Classes.MINIMAL}
                icon={IconNames.CROSS}
                intent={Intent.DANGER}
                onClick={() => props.restart()}></AnchorButton>
        </div>
        <div>
            {stepComponent}
        </div>
    </div>;
}


