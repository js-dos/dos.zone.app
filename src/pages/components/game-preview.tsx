import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Card,
         H5,
         Button,
         Elevation,
         Intent,
         ButtonGroup,
         Overlay,
         Callout} from "@blueprintjs/core";

import { GameData } from "../../core/game";

import { cdnUrl } from "../../core/cdn";
import striptags from "striptags";

import "./game-preview.css";
import { openSlug } from "../../core/browser-tab";
import { IconNames } from "@blueprintjs/icons";
import { YoutubeModal } from "./youtube-modal";

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
    const [showVideo, setShowVideo] = useState<boolean>(false);

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

    const actionButton =
                <Button className="preview-action" intent={ warnNoMobile ? Intent.NONE : (openInternal ? Intent.PRIMARY : Intent.SUCCESS) } onClick={onClick} >
                    { warnNoMobile ?
                      t("no_mobile") :
                      (openInternal ?
                       t("play") :
                       t("versions_" + Math.min(versionsCount, 5)))
                    }
                </Button>;

    return <Card className="preview-card" interactive={true} elevation={Elevation.TWO}>
        <div className="preview-column">
            <H5 className="preview-header" onClick={onClick}>{data.game}</H5>
            <img className="preview-image" src={cdnUrl(data.screenshot) || "/default.jpg"} alt="screenshot" onClick={onClick} ></img>
            <div className="preview-footer">
                <div className="preview-desc" onClick={onClick} >
                    {description.substr(0, 150) + "..."}
                </div>
                <ButtonGroup className="preview-button">
                    {actionButton}
                    { data.video !== undefined && data.video.length > 0 ? <Button icon={IconNames.VIDEO} intent={Intent.SUCCESS} onClick={() => setShowVideo(true)} /> : null }
                </ButtonGroup>
            </div>
        </div>
        {
            showVideo ?
            <YoutubeModal url={data.video as string} onClose={() => setShowVideo(false)} /> :
            null
        }
    </Card>;
}
