import React, { useEffect, useState } from "react";
import {
    H1, H2, Classes, FileInput, Intent, Spinner,
    Tree, ITreeNode, Button, AnchorButton, ButtonGroup
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Emulators } from "emulators";
import { DosConfig } from "emulators/dist/types/dos/bundle/dos-conf";
import { Capacitor, FilesystemDirectory, Plugins } from "@capacitor/core";
import { StepProps } from "../state";

import { Player } from "../../../player/player";
import ReactMarkdown from "react-markdown";
import { renderers } from "../../../core/renderers";

import { LayersEditor } from "../layers/layers-editor";

import "./steps.css";
import { DosInstance } from "emulators-ui/dist/types/js-dos";
import { LayersConfig } from "emulators-ui/dist/types/controls/layers-config";

import { createArchive } from "./create-archive";
import { config } from "process";

const { Filesystem } = Plugins;

declare const emulators: Emulators;

export function DownloadArchive(props: StepProps) {
    const {t, state, back} = props;
    const [url, setUrl] = useState<string>(() => {
        const blob = new Blob([state.bundle as Uint8Array], {
            type: "application/zip"
        });
        return URL.createObjectURL(blob);
    });
    const [bundleUrl, setBundleUrl] = useState<string|undefined>(url);
    const [platformUri, setPlatformUri] = useState<string|undefined>(undefined);
    const [dos, setDos] = useState<DosInstance | null>(null);
    const [config, setConfig] = useState<{ layersConfig?: LayersConfig }>(state.config as any || {});

    useEffect(() => {
        window.scrollTo(0, 0);

        return () => {
            URL.revokeObjectURL(url);
        }
    }, [url]);

    const onDownload = async () => {
        URL.revokeObjectURL(url);
        const archive = await createArchive(config as DosConfig, state.zip as Uint8Array);
        const blob = new Blob([archive], {
            type: "application/zip"
        });
        const newUrl = URL.createObjectURL(blob);
        const fileName = state.name + ".jsdos";
        if (Capacitor.isNative) {
            const reader = new FileReader();
            reader.readAsDataURL(new Blob([archive]));
            reader.onloadend = async () => {
                const result = await Filesystem.writeFile({
                    path: fileName,
                    data: reader.result as string,
                    directory: FilesystemDirectory.Documents,
                });

                setPlatformUri(result.uri);
            }
            return;
        }

        const a = document.createElement("a");
        a.href = newUrl;
        a.download = fileName;
        a.style.display = "none";
        document.body.appendChild(a);

        a.click();
        a.remove();

        setUrl(newUrl);
    }

    const onStopStart = () => {
        if (bundleUrl) {
            setBundleUrl(undefined);
        } else {
            setBundleUrl(url);
        }
    }

    function openTopic() {
        if (state.slug === undefined) {
            return;
        }

        window.open("https://talks.dos.zone/t/" + state.slug, "_target");
    }

    const gameTopicComponent =  (state.slug !== undefined ?
                                 <Button onClick={openTopic} icon={IconNames.COMMENT} intent={Intent.NONE}>{t("open_topic")}</Button> :
                                 <AnchorButton
                                     href={"https://talks.dos.zone/search?expanded=true&q=" + encodeURIComponent((state.name || "") + " #" + props.lang)}
                                     target="_blank"
                                     icon={IconNames.COMMENT}>{t("open_topic")}</AnchorButton>);

    const markdownRenderers = {...renderers};
    markdownRenderers.link = (props: any) => {
        return gameTopicComponent;
    }

    function applyLayersConfig(layersConfig: LayersConfig) {
        if (dos === null) {
            return;
        }
        dos.setLayersConfig(layersConfig);
        const newConfig = {...config};
        newConfig.layersConfig = layersConfig;
        setConfig(newConfig);
    }

    return <div className="download-archive-container">
        <div className="download-archive-actions" style={{ visibility: Capacitor.isNative ? "hidden" : "visible" }}>
            <Button onClick={back} icon={IconNames.ARROW_LEFT}>{t("back")}</Button>
            { platformUri === undefined ?
              <Button onClick={onDownload}
                      icon={IconNames.ARCHIVE}
                      intent={Intent.PRIMARY}>{t("download")}</Button> :
              null
            }
            <Button onClick={onStopStart}
                    icon={bundleUrl ? IconNames.STOP : IconNames.PLAY}
                    intent={bundleUrl ? Intent.WARNING : Intent.SUCCESS}>{bundleUrl ? t("stop") : t("start")}</Button>
        </div>
        <div className="download-archive-player-and-layers">
            <div className="download-archive-player">
                { bundleUrl === undefined ? null :
                  <Player
                      onDosInstance={setDos}
                      bundleUrl={bundleUrl}
                      user={null}
                      embedded={true}
                      turbo={false} />
                }
            </div>
            <div className="download-archive-layers">
                <LayersEditor onApply={applyLayersConfig} layersConfig={config.layersConfig} />
            </div>
        </div>
        <div className="download-archive-actions">
            { gameTopicComponent }
        </div>

        { platformUri !== undefined ? <div className="platformUri"><br/><strong>{t("downloded_to")}:</strong>&nbsp;{platformUri}</div> : null }
        <br/>
        <ReactMarkdown renderers={markdownRenderers}
                      source={t("help", {lang: props.lang, game: state.name})}
                      escapeHtml={false}></ReactMarkdown>
    </div>;
}
