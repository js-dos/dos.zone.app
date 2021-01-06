import React, { useEffect, useState } from "react";
import { User } from "../../core/auth";

import {
    Popover,
    Position,
    Button,
    ButtonGroup,
    Spinner,
    Classes,
    Icon,
    HTMLSelect
} from "@blueprintjs/core";

import { useTranslation } from "react-i18next";
import { IconNames } from "@blueprintjs/icons";
import { getTurboSession } from "../../core/turbo";
import { TFunction } from "i18next";
import { Link } from "react-router-dom";
import { Storage, storage } from "../../core/storage/storage";



export function TurboOptions(props: { user: User | null, onClick: () => void }) {
    const { t, i18n } = useTranslation("my");
    const [turboTime, setTurboTime] = useState<number | null>(null);
    const [userStorage, setUserStorage] = useState<Storage | null>(null);
    const [region, setRegion] = useState<string|null>(null);
    const [updating, setUpdating] = useState<boolean>(false);

    const user = props.user;
    const onClick = props.onClick;
    const lang = i18n.language;

    useEffect(() => {
        setUserStorage(storage(user));
    }, [user]);

    useEffect(() => {
        if (user !== null && userStorage !== null) {
            getTurboSession(user).then((session) => {
                if (session === null) {
                    setTurboTime(0);
                    return;
                }

                setTurboTime(session.restTime);
            });
            userStorage.get("region").then(setRegion);
        }
    }, [userStorage, user]);

    if (user === null) {
        return <div className="turbo-options turbo-border">
            <Popover content={<div className="popover-inner-card">{t("please_login_for_turbo_mode")}, <Link to={"/" + i18n.language + "/guide/features"}>{t("more")}</Link></div>} position={Position.BOTTOM} isOpen={true}>
                <Button disabled={true}  icon={IconNames.FAST_FORWARD}>{t("play_turbo")}</Button>
            </Popover>
        </div>;
    }

    if (turboTime === null) {
        return <div className="turbo-options turbo-border">
            <Button disabled={true}  icon={IconNames.FAST_FORWARD}>{t("play_turbo")}</Button>
            &nbsp;&nbsp;<Spinner size={16} />
        </div>;
    }

    if (turboTime < 60) {
        const popoeverInner = <div className="popover-inner-card">{t("no_time_for_turbo_mode")}, <Link to={"/" + i18n.language + "/profile"}>{t("settings")}</Link></div>;
        return <div className="turbo-options turbo-border">
            <Popover content={<div className="popover-inner-card">{popoeverInner}</div>} position={Position.BOTTOM} isOpen={true}>
                <div>
                    <Button disabled={true}  icon={IconNames.FAST_FORWARD}>{t("play_turbo")}</Button>
                    &nbsp;&nbsp;{timeInfo(turboTime, t)}
                </div>
            </Popover>
        </div>;
    }


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

    return <div>
        <div className="turbo-border">
            <div className="turbo-options">
                <ButtonGroup>
                <Button  icon={IconNames.FAST_FORWARD} onClick={onClick}>{t("play_turbo")}</Button>
          <Link className={Classes.BUTTON} to={"/" + lang + "/profile"}>
            <Icon icon={IconNames.COG} iconSize={16} />
          </Link>
    </ButtonGroup>
          &nbsp;&nbsp;{timeInfo(turboTime, t)}&nbsp;&nbsp;
            </div>
            <div className="my-region-selector">{t("region")}&nbsp;
                <HTMLSelect minimal={true}
                            options={[{label: "Europe", value: "eu-central-1"}, {label: "N. America", value: "us-east-1"}]}
                            onChange={onChangeRegion}
                            disabled={updating}
                            value={ region === null ? undefined : region } />
          &nbsp;{ updating ? <Spinner  className="spinner-inline" size={12} /> : null }
            </div>
        </div>

        <div className="sup-text">
            <sup>*</sup>&nbsp;{t("streaming_service")}
        </div>
    </div>;
}

function timeInfo(time: number, t: TFunction) {
    if (time < 60) {
        return "0 " + t("min");
    }

    return Math.round(time / 60 * 10) / 10 + " "+ t("min");
};
