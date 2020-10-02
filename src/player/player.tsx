import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import {
    Spinner, H1, Intent
} from "@blueprintjs/core";

import { User } from "../core/auth";
import { DosPlayer } from "./dos-player";
import { TurboPlayer } from "./turbo-player";
import { getPersonalBundleUrl } from "../core/personal";

export interface IPlayerProps {
    user: User | null;
    bundleUrl: string;
    embedded: boolean;
    turbo: boolean;
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
                    if (history.length > 1) {
                        history.goBack();
                    } else {
                        history.push("/" + i18n.language + "/my");
                    }
                } else {
                    setPersonalBundleUrl(url);
                }
            });
        }
    }, [user]);

    if (user !== null && personalBundleUrl === null) {
        return <div className="intermediate-loader-conatiner">
            <H1>{t("restoring")}</H1>
            &nbsp;&nbsp;&nbsp;&nbsp;<Spinner/>
        </div>;
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

