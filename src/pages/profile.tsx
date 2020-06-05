import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User } from "../core/auth";
import { getTurboSession, TurboSession } from "../core/turbo";

import {
    Icon,
    Classes,
    Spinner,
    HTMLSelect,
    Button,
} from "@blueprintjs/core";

import { IconNames } from "@blueprintjs/icons";
import { Storage, storage } from "../core/storage/storage";

import { Subscriptions } from "../inapp/inapp";

export function Profile(props: { user: User | null }) {
    const { t, i18n } = useTranslation("profile");
    const user = props.user;

    const [userStorage, setUserStorage] = useState<Storage | null>(null);
    const [turboSession, setTurboSession ] = useState<TurboSession | null>(null);
    const [region, setRegion] = useState<string|null>(null);
    const [updating, setUpdating] = useState<boolean>(false);
    const [version, setVersion] = useState<number>(0);

    const onRefresh = () => {
        setTurboSession(null);
        setVersion(version + 1);
    };

    useEffect(() => {
        setUserStorage(storage(user));
    }, [user]);

    useEffect(() => {
        if (user !== null && userStorage !== null) {
            getTurboSession(user).then(setTurboSession);
            userStorage.get("region").then(setRegion);
        }
    }, [version, userStorage, user]);

    if (user === null) {
        return <Redirect to={"/" + i18n.language} />;
    }

    let limits = <div><Spinner/></div>;
    if (turboSession !== null) {
        const onChangeRegion = (event: any) => {
            setUpdating(true);
            const newRegion = event.currentTarget.value;
            if (userStorage !== null) {
                userStorage.set("region", newRegion).then((success) => {
                    if (success) {
                        setRegion(newRegion);
                    }
                    setUpdating(false);
                });
            }
        };

        limits = <div>
            <p>{t("using_now")}<strong><span className={Classes.TEXT_LARGE}>{turboSession.arn !== undefined ? t("yes") : t("no") }</span></strong></p>
            <p>{t("day_limit")}<strong><span className={Classes.TEXT_LARGE}>{toMin(turboSession.timeLimit)} {t("min")}</span></strong></p>
            <p>{t("rest_time")}<strong><span className={Classes.TEXT_LARGE}>{toMin(turboSession.restTime)} {t("min")}</span></strong></p>
            <div>{t("region")}&nbsp;
                <HTMLSelect minimal={false}
                            options={["eu-central-1", "us-east-1"]}
                            onChange={onChangeRegion}
                            disabled={updating}
                            value={ region === null ? undefined : region } />
                &nbsp;{ updating ? <Spinner  className="spinner-inline" size={12} /> : null }
            </div>
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
            <Button icon={IconNames.REFRESH} minimal={true} onClick={onRefresh} />
        </div>
        {limits}
        <Subscriptions user={props.user} />
    </div>
}

function toMin(time: number) {
    return Math.round(time / 60 * 10) / 10;
}
