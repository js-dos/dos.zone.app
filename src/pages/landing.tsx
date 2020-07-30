import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Classes,
    Intent, Overlay,
    Card, Button, Icon
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import ReactMardown from "react-markdown/with-html";
import { renderers } from "../core/renderers";

import { Plugins } from '@capacitor/core';
const { Browser } = Plugins;


const repositoryUrl = "https://talks.dos.zone/c/rep/11";
Browser.prefetch({ urls: [repositoryUrl] });

export function Landing() {
    const { t, i18n } = useTranslation("landing");
    const dbGuide = useTranslation("guides").t("database", {lang: i18n.language});
    const [dbGuideOpened, setDbGuideOpened] = useState<boolean>(false);

    function runInTab() {
        Browser.open({
            url: repositoryUrl,
            toolbarColor: "#000000",
            windowName: "_self",
        });
    }

    return <div className={[Classes.RUNNING_TEXT, Classes.TEXT_LARGE].join(" ")}
                style={{padding: "0 40px"}}>

        <ReactMardown renderers={{
            ...renderers,
            link: (props: any) => {
                return <a href="#nan" onClick={() => setDbGuideOpened(true)}>{props.children}
                    &nbsp;<Icon icon={IconNames.DOCUMENT_OPEN}></Icon>
                </a>
            },
        }}
                      source={t("header_1", {lang: i18n.language})}
                      escapeHtml={false}></ReactMardown>

        <Button large={true}
                onClick={runInTab}
                intent={Intent.PRIMARY}
                icon={IconNames.SEARCH}>{t("browse_database")}</Button>

        <ReactMardown renderers={renderers}
                      source={t("header_2", {lang: i18n.language})}
                      escapeHtml={false}></ReactMardown>

        <Overlay
            isOpen={dbGuideOpened}
            onClose={() => setDbGuideOpened(false) }
            className={Classes.OVERLAY_SCROLL_CONTAINER}>
            <Card className={Classes.DARK} elevation={4} style={{
                left: "max(0px, 50vw - 320px)",
                width: "640px",
                maxWidth: "100%",
            }}>
                <ReactMardown renderers={renderers}
                              source={dbGuide}
                              escapeHtml={false}></ReactMardown>
            </Card>
        </Overlay>
    </div>;
}
