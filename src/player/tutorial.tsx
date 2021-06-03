import React, { useEffect, useState } from "react";

import { Button, Overlay, Icon, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { useTranslation } from "react-i18next";
import { YoutubeModal } from "../pages/components/youtube-modal";
import { User } from "../core/auth";
import { storage } from "../core/storage/storage";

const TUTORIAL_KEY_PREFIX = "tutorial.";

export function Tutorial(props: { url?: string, user: User | null, togglePause: () => void }) {
    const { user, url, togglePause } = props;
    const { t } = useTranslation("player");
    const [open, setOpen] = useState<boolean>(false);
    const [showVideo, _setShowVideo] = useState<boolean>(false);

    function setShowVideo(show: boolean) {
        togglePause();
        _setShowVideo(show);
    }

    useEffect(() => {
        if (url === undefined || url.length === 0) {
            return;
        }

        try {
            const tutorialKey = TUTORIAL_KEY_PREFIX + url;
            const userStorage = storage(user);
            userStorage.get(tutorialKey).then((value) => {
                const watched = value !== null;
                if (!watched) {
                    setOpen(true);
                    userStorage.set(tutorialKey, "true").catch(() => {/**/ });
                }
            }).catch(() => {/**/ });
        } catch (e) {
            // do nothing
        }
    }, [url, user]);

    if (url === undefined) {
        return null;
    }

    const onClose = () => setOpen(false);
    return <div>
        {
            open ?
                <Overlay portalClassName="portal-center" className="overlay-center" isOpen={true} onClose={onClose}>
                    <div className="bp3-dark bp3-dialog-container">
                        <div className="bp3-dialog">
                            <div className="bp3-dialog-header">
                                <Icon icon={IconNames.LEARNING} />
                                <h4 className="bp3-heading">{t("tutorial")}</h4>
                                <Button minimal={true} icon={IconNames.CROSS} onClick={onClose}></Button>
                            </div>
                            <div className="bp3-dialog-body">
                                {t("watch_tutorial")}
                            </div>
                            <div className="bp3-dialog-footer">
                                <div className="bp3-dialog-footer-actions">
                                    <Button onClick={onClose}>{t("close")}</Button>
                                    <Button intent={Intent.PRIMARY} onClick={() => {
                                        onClose();
                                        setShowVideo(true);
                                    }}>{t("watch")}</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Overlay> :
                null
        }
        {
            showVideo ?
                <YoutubeModal url={url} onClose={() => setShowVideo(false)} /> :
                null
        }
    </div>;
}