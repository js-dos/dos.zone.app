import React from "react";

import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Card,
         H5,
         Button,
         Elevation,
         Intent} from "@blueprintjs/core";

import { GameData } from "../../core/game";

import { cdnUrl } from "../../core/cdn";
import striptags from "striptags";

import "./game-preview.css";
import { openSlug } from "../../core/browser-tab";

export function GamePreview(props: {
    game: GameData,
    openInternal: boolean,
    warnAboutMobile: boolean,
    openInternalWhiteList?: string[],
}) {
    const { t, i18n } = useTranslation("common");
    const history = useHistory();
    const data = props.game;
    const versionsCount = (data as any).count || 1;
    let openInternal = props.openInternal && versionsCount === 1;
    const description = striptags(data.description[i18n.language]?.description || data.description.en?.description || "");
    const warnNoMobile = props.warnAboutMobile && data.title.indexOf("mobile") === -1;
    const openInternalWhiteList = props.openInternalWhiteList || [];

    if (!openInternal) {
        for (const next of openInternalWhiteList) {
            if (next === data.canonicalUrl) {
                openInternal = true;
                break;
            }
        }
    }

    function onClick() {
        if (openInternal) {
            history.push("/" + i18n.language + "/my/" + encodeURIComponent(data.canonicalUrl));
        } else {
            openSlug(data.slug[i18n.language] || data.slug.en);
        }
    }

    return <Card className="preview-card" onClick={onClick} interactive={true} elevation={Elevation.TWO}>
        <div className="preview-column">
            <H5 className="preview-header">{data.game}</H5>
            <img className="preview-image" src={cdnUrl(data.screenshot) || "/default.jpg"} alt="screenshot"></img>
            <div className="preview-footer">
                <div className="preview-desc">
                    {description.substr(0, 150) + "..."}
                </div>
                <Button className="preview-button" intent={ warnNoMobile ? Intent.NONE : (openInternal ? Intent.PRIMARY : Intent.SUCCESS) }>
                    { warnNoMobile ?
                      t("no_mobile") :
                      (openInternal ?
                       t("play") :
                       t("versions_" + Math.min(versionsCount, 5)))
                    }
                </Button>
            </div>
        </div>
    </Card>;
}
