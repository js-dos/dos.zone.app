import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Loader } from "./loader";

import { User } from "../core/auth";
import { DosPlayer } from "./dos-player";
import { TurboPlayer } from "./turbo-player";
import { getPersonalBundleUrl } from "../core/personal";

import { goBack } from "../ui/navigator";

export interface IPlayerProps {
    user: User | null;
    bundleUrl: string;
    embedded: boolean;
    turbo: boolean;
    sourceBundleUrl?: string;
}

export function Player(props: IPlayerProps) {
    const history = useHistory();
    const { t, i18n } = useTranslation("player");
    const user = props.user;
    const [personalBundleUrl, setPersonalBundleUrl] = useState<string | null>(null);
    useEffect(() => {
        if (user !== null) {
            getPersonalBundleUrl(user, props.bundleUrl).then((url) => {
                if (url === null) {
                    goBack(history, i18n.language);
                } else {
                    setPersonalBundleUrl(url);
                }
            });
        }
    }, [user]);

    if (user !== null && personalBundleUrl === null) {
        return <Loader pre2={t("restoring")} />;
    }

    const newProps = {...props};
    if (personalBundleUrl !== null) {
        newProps.bundleUrl = personalBundleUrl;
    }

    if (newProps.turbo) {
        return <TurboPlayer {...newProps} />;
    } else {
        return <DosPlayer {...newProps} />;
    }
}

