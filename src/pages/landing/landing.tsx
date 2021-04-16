import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Classes,
    Intent, Overlay,
    Card, Button, Icon,
    H2
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import ReactMardown from "react-markdown/with-html";
import { renderers } from "../../core/renderers";

import { openRepository } from "../../core/browser-tab";
import { useHistory } from "react-router-dom";

import { getRecentlyPlayed, setRecentlyPlayed } from "../../core/storage/recently-played";
import { User } from "../../core/auth";

let redirected = false;

export function Landing(props: { user: User | null }) {
    const { t, i18n } = useTranslation("landing");
    const dbGuide = useTranslation("guides").t("database", {lang: i18n.language});
    const [dbGuideOpened, setDbGuideOpened] = useState<boolean>(false);
    const [showRecentlyPlayed, setShowRecentlyPlayed] = useState<boolean>(false);
    const history = useHistory();
    const user = props.user;
    const lang = i18n.language;

    useEffect(() => {
        let cancle = false;
        getRecentlyPlayed(user).then((recentlyPlayed) => {
            if (cancle) {
                return;
            }

            if (Object.keys(recentlyPlayed).length > 1) {
                if (redirected) {
                    setShowRecentlyPlayed(true);
                } else {
                    history.push("/" + lang + "/my");
                    redirected = true;
                }
            }
        });
        return () => {
            cancle = true;
        }
    }, [user]);

    return <div className={[Classes.RUNNING_TEXT, Classes.TEXT_LARGE].join(" ")}
                style={{padding: "0 40px"}}>
        <ReactMardown renderers={renderers}
                      source={t("header_1", {lang: i18n.language})}
                      escapeHtml={false}></ReactMardown>
        <div style={{display: "flex", flexWrap: "wrap", alignItems: "center"}}>
            {showRecentlyPlayed ?
             <Button large={true}
                     style={{marginRight: "10px", marginBottom: "10px"}}
                     onClick={() => history.push("/" + i18n.language + "/my")}
                     intent={Intent.PRIMARY}
                     icon={IconNames.HEART}>{t("my_favorite")}</Button> :
             null}

            <Button large={true}
                    style={{marginBottom: "10px"}}
                    onClick={() => openRepository()}
                    intent={showRecentlyPlayed ? Intent.NONE : Intent.PRIMARY}
                    icon={IconNames.SEARCH}>{t("browse_database")}</Button>

            <p style={{marginLeft: "10px"}}><a onClick={() => setDbGuideOpened(true) }>{t("about_db")}</a></p>
        </div>

        <H2>{t("quick_tour")}</H2>
        <iframe
            width="560"
            height="315"
            style={{maxWidth: "100%"}}
            src="https://www.youtube.com/embed/kLXZ1t84BdE"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen>
        </iframe>

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
