import React, { useState, useEffect } from "react";
import { Link, Redirect, useParams, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Spinner,
    Intent,
    Button,
    ButtonGroup,
    ControlGroup,
    Switch,
    Popover,
    Position,
} from "@blueprintjs/core";

import { getRecentlyPlayed, RecentlyPlayed, setRecentlyPlayed as updateRecentlyPlayed  } from "../core/storage/recently-played";
import { GameThumb } from "./components/game-thumb";
import { IconNames } from "@blueprintjs/icons";

import { openRepository } from "../core/browser-tab";
import { getGameData } from "../core/game-query";

import { User } from "../core/auth";
import { getTurboSession } from "../core/turbo";
import { Capacitor } from "@capacitor/core";

export function My(props: { user: User | null }) {
    const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayed | null>(null);
    const [selected, setSelected] = useState<string>("");
    const { t, i18n } = useTranslation("my");
    const { url } = useParams();
    const history = useHistory();
    const user = props.user;
    const [ turboMode, setTurboMode ] = useState<boolean>(user !== null);
    const [ turboTime, setTurboTime ] = useState<number | null>(null);

    useEffect(() => {
        if (user !== null && turboMode) {
            getTurboSession(user).then((session) => {
                if (session === null) {
                    return;
                }

                setTurboTime(session.restTime);
                if (turboMode && session !== null && session.restTime < 60) {
                    setTurboMode(false);
                }
            });
        }

        if (turboMode && user === null) {
            setTurboMode(false);
        }
    }, [user?.email, turboMode]);

    useEffect(() => {
        setRecentlyPlayed(null); // reset state

        getRecentlyPlayed(user).then((recentlyPlayed) => {
            if (url !== undefined && url !== null && url.length > 0) {
                const decodedUrl = decodeURIComponent(url);
                recentlyPlayed[decodedUrl] = {
                    visitedAtMs: Date.now(),
                }
                updateRecentlyPlayed(user, recentlyPlayed);
            }

            setRecentlyPlayed(recentlyPlayed);
        });
    }, [user, url]);

    if (recentlyPlayed === null) {
        return <Spinner></Spinner>;
    }

    const keys = Object.keys(recentlyPlayed);
    if (keys.length === 0) {
        return <Redirect to={"/" + i18n.language}></Redirect>
    }

    keys.sort((a, b) => {
        return recentlyPlayed[b].visitedAtMs - recentlyPlayed[a].visitedAtMs;
    });

    const active = selected.length === 0 ? keys[0] : selected;
    const gameData = getGameData(active);
    const description = gameData.description[i18n.language]?.description || gameData.description["en"]?.description || "";
    const canTurbo = Capacitor.isNative && Capacitor.getPlatform() === "android" && gameData.turbo === true;
    const runUrl = "/" + i18n.language + "/play/" + encodeURIComponent(active) + "?turbo=" + (canTurbo && turboMode ? "1" : "0");

    async function runBundle() {
        if (recentlyPlayed !== null) {
            recentlyPlayed[active].visitedAtMs = Date.now();
            updateRecentlyPlayed(user, recentlyPlayed);
        }

        history.push(runUrl);
    }

    const timeInfo = (time: number) => {
        if (time < 60) {
            return "0 " + t("min");
        }

        return Math.round(time / 60 * 10) / 10 + " "+ t("min");
    };

    let turboSwitch = null;
    if (!canTurbo) {
        /* turboSwitch = <Switch className="my-turbo-switch"
           checked={true}
           disabled={true}
           large={true}
           inline={true}
           innerLabel={t("Turbo")}>
           </Switch> */
        // no controls
    } else if (user === null) {
        turboSwitch = <Popover content={<div className="popover-inner-card">{t("please_login_for_turbo_mode")}</div>} position={Position.TOP} isOpen={true}>
            <div>
                <Switch className="my-turbo-switch"
                        checked={false}
                        disabled={true}
                        large={true}
                        inline={true}
                        innerLabel={t("Turbo")}></Switch>
            </div>
        </Popover>;
    } else if (turboTime === 0) {
        const popoeverInner = <div className="popover-inner-card">{t("no_time_for_turbo_mode")}, <Link to={"/" + i18n.language + "/profile"}>{t("settings")}</Link></div>;
        turboSwitch = <Popover content={popoeverInner} position={Position.TOP} isOpen={true}>
            <Switch className="my-turbo-switch"
                    checked={turboMode}
                    disabled={true}
                    large={true}
                    inline={true}
                    innerLabel={t("Turbo")}
                    >
                0 {t("min")}
            </Switch>
        </Popover>;
    } else {
        turboSwitch =
            <Switch className="my-turbo-switch" checked={turboMode}
                large={true}
                inline={true}
                innerLabel={t("Turbo")}
                onChange={() => setTurboMode(!turboMode)}>
                {turboTime === null ? "" : timeInfo(turboTime) }
             </Switch>;
    }

    return <div className="left-margin">
        <h1>{t("selected")}</h1>
        <div className="recently-played">
            <GameThumb onClick={runBundle} url={active} selected={true} />
            <div className="thumb-options">
                <div>
                    <Button icon={IconNames.PLAY} onClick={runBundle}>{t("play")}</Button>
                    {turboSwitch}
                </div>
                <br/><br/>
                <div className="thumb-description">{description}</div>
            </div>
        </div>
        <div className="one-row">
            <h1>{t("recently_played")}</h1>
            <Button onClick={() => openRepository()} icon={IconNames.SEARCH} intent={Intent.PRIMARY}></Button>
        </div>
        <div className="recently-played">{
            keys.map((a) => active === a ? null : <GameThumb onClick={() => setSelected(a)} url={a} key={a} selected={false} />)
        }</div>
    </div>
}
