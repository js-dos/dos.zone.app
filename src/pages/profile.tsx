import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User } from "../core/auth";
import { getTurboSession, TurboSession } from "../core/turbo";

import {
    Icon,
    Classes,
    Spinner,
} from "@blueprintjs/core";

import { IconNames } from "@blueprintjs/icons";

export function Profile(props: { user: User | null }) {
    const { t, i18n } = useTranslation("profile");
    const user = props.user;

    const [turboSession, setTurboSession ] = useState<TurboSession | null>(null);
    useEffect(() => {
        if (user !== null) {
            getTurboSession(user).then(setTurboSession);
        }
    }, [user?.email]);

    if (user === null) {
        return <Redirect to={"/" + i18n.language} />;
    }

    let limits = <div><Spinner/></div>;
    if (turboSession !== null) {
        limits = <div>
            <p>{t("using_now")}<strong><span className={Classes.TEXT_LARGE}>{turboSession.arn !== undefined ? t("yes") : t("no") }</span></strong></p>
            <p>{t("day_limit")}<strong><span className={Classes.TEXT_LARGE}>{turboSession.timeLimit} {t("min")}</span></strong></p>
            <p>{t("rest_time")}<strong><span className={Classes.TEXT_LARGE}>{turboSession.restTime} {t("min")}</span></strong></p>
        </div>;
    }

    return <div className="left-margin">
        <div className="profile-head">
            <img className="profile-avatar" src={user.avatarUrl} alt="avatar" />
            <div className="profile-short-info">
                <div className="profile-username">{user.username}</div>
                <div className={["profile-email", Classes.TEXT_MUTED].join(" ")} >{user.email}</div>
            </div>
        </div>
        <br/><br/>
        <div className="one-row">
            <h1>{t("turbo")}</h1>&nbsp;&nbsp;&nbsp;&nbsp;
            <Icon icon={IconNames.DASHBOARD} />
        </div>
        {limits}
    </div>
}
