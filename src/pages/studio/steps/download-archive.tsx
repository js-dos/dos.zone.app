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

const { Filesystem } = Plugins;

export function DownloadArchive(props: StepProps) {
    const {t, state, back} = props;
    const [url] = useState<string>(() => {
        const blob = new Blob([state.bundle as Uint8Array], {
            type: "application/zip"
        });
        return URL.createObjectURL(blob);
    });
    const [bundleUrl, setBundleUrl] = useState<string|undefined>(url);
    const [platformUri, setPlatformUri] = useState<string|undefined>(undefined);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const onDownload = () => {
        const fileName = state.name + ".jsdos";
        if (Capacitor.isNative) {
            const reader = new FileReader();
            reader.readAsDataURL(new Blob([state.bundle as Uint8Array]));
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
        a.href = url;
        a.download = fileName;
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
        <ButtonGroup>
            <Button onClick={back} icon={IconNames.ARROW_LEFT}>{t("back")}</Button>
            { platformUri === undefined ?
              <Button onClick={onDownload} icon={IconNames.ARCHIVE} intent={Intent.PRIMARY}>{t("download")}</Button> :
              null
            }
            { gameTopicComponent }
            <Button onClick={onStopStart} icon={IconNames.STOP} intent={Intent.WARNING}>{bundleUrl ? t("stop") : t("start")}</Button>
        </ButtonGroup>
        <br/>
        { platformUri !== undefined ? <div className="platformUri"><br/><strong>{t("downloded_to")}:</strong>&nbsp;{platformUri}</div> : null }
        <br/>
        <ReactMarkdown renderers={markdownRenderers}
                      source={t("help", {lang: props.lang, game: state.name})}
                      escapeHtml={false}></ReactMarkdown>
    </div>;
}
