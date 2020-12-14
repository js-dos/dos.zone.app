import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Spinner,
    Intent,
    Button,
    Switch,
    Popover,
    Position,
    Classes,
    Icon,
} from "@blueprintjs/core";

import { getRecentlyPlayed, RecentlyPlayed, setRecentlyPlayed as updateRecentlyPlayed  } from "../core/storage/recently-played";
import { GameThumb } from "./components/game-thumb";
import { IconNames } from "@blueprintjs/icons";

import { openRepository } from "../core/browser-tab";
import { GameData } from "../core/game";
import { getGameData } from "../core/game-query";

import { User } from "../core/auth";
import { getTurboSession } from "../core/turbo";
import { Capacitor } from "@capacitor/core";
import { AndroidPromo } from "./components/android-promo";
import { TurboOptions } from "./components/turbo-options";

const isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
                 navigator.userAgent &&
                 navigator.userAgent.indexOf('CriOS') == -1 &&
                 navigator.userAgent.indexOf('FxiOS') == -1;

export function My(props: { user: User | null }) {
    const [recentlyPlayed, _setRecentlyPlayed] = useState<RecentlyPlayed | null>(null);
    const [gamesData, setGamesData] = useState<{[url: string]: Promise<GameData>}>({});
    const [selected, _setSelected] = useState<string | null>(null);
    const [selectedData, setSelectedData] = useState<GameData | null>(null);
    const { t, i18n } = useTranslation("my");
    const { url } = useParams<{ url: string }>();
    const history = useHistory();
    const user = props.user;

    function setRecentlyPlayed(newRecentlyPlayed: RecentlyPlayed | null) {
        const keys = Object.keys(newRecentlyPlayed || {});
        if (newRecentlyPlayed === null || keys.length === 0) {
            setGamesData({});
            _setSelected(null);
            _setRecentlyPlayed(null);
            setSelectedData(null);
        } else {
            keys.sort(recentlyPlayedSorterFn(newRecentlyPlayed));

            const newGamesData: {[url: string]: Promise<GameData>} = {};
            for (const next of keys) {
                newGamesData[next] = getGameData(next);
            }

            setGamesData(newGamesData);
            _setSelected(keys[0]);
            _setRecentlyPlayed(newRecentlyPlayed);
            updateSelectedData(keys[0], newGamesData);
        }
    }

    function setSelected(bundleUrl: string | null) {
        _setSelected(bundleUrl);
        if (bundleUrl === null) {
            setSelectedData(null);
        } else {
            updateSelectedData(bundleUrl, gamesData);
        }
        window.scrollTo(0,0);
    }

    function updateSelectedData(selected: string, gamesData: {[url: string]: Promise<GameData>}) {
        if (selected === null || gamesData[selected] === undefined) {
            setSelectedData(null);
            return;
        }

        const data = peekPromise(gamesData[selected]);
        if (data != null) {
            setSelectedData(data);
            return;
        }

        let cancel = false;
        if (selected != null && gamesData[selected] !== undefined) {
            gamesData[selected].then((data) => {
                if (cancel) {
                    return;
                }
                setSelectedData(data);
            });
        }

        return () => {
            cancel = true;
        }
    }

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

    if (recentlyPlayed === null || selected === null || selectedData === null) {
        return <div>
            <br/>
            <Spinner></Spinner>
        </div>;
    }

    const description = selectedData.description[i18n.language]?.description || selectedData.description.en?.description || "";
    const canTurbo = selectedData.turbo !== "no" && !isSafari;
    const runUrl = "/" + i18n.language + "/play/" + encodeURIComponent(selectedData.canonicalUrl);

    function runBundle(turboMode: boolean) {
        if (recentlyPlayed !== null && selected !== null) {
            recentlyPlayed[selected].visitedAtMs = Date.now();
            updateRecentlyPlayed(user, recentlyPlayed);
        }

        const url = runUrl + "?turbo=" + (canTurbo && turboMode ? "1" : "0")
        history.push(url);
    }

    async function remove() {
        if (recentlyPlayed !== null && selected !== null) {
            const newRecentlyPlayed = {...recentlyPlayed};
            delete newRecentlyPlayed[selected];
            await updateRecentlyPlayed(user, newRecentlyPlayed);
            setRecentlyPlayed(newRecentlyPlayed);
        }
    }

    const keys = Object.keys(recentlyPlayed);
    keys.sort(recentlyPlayedSorterFn(recentlyPlayed));

    return <div className="left-margin">
        <AndroidPromo />
        <h1>{t("selected")}</h1>
        <div className="recently-played">
            <GameThumb key={"selected-" + selectedData.canonicalUrl} onClick={() => runBundle(false)} game={selectedData} selected={true} />
            <div className="thumb-options">
                <div>
                    <Button icon={IconNames.PLAY} onClick={() => runBundle(false)}>{t("play")}</Button>
                    &nbsp;&nbsp;<Button minimal={true} onClick={remove} icon={IconNames.TRASH}></Button>
                    { canTurbo ? <TurboOptions user={user} /> : null }
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
            keys.map((a) => <GameThumb onClick={() => setSelected(a)} gamePromise={gamesData[a]} key={"all-" + a} selected={false} />)
        }</div>
    </div>
}

function recentlyPlayedSorterFn(recentlyPlayed: RecentlyPlayed) {
    return (a: string, b: string) => {
        return recentlyPlayed[b].visitedAtMs - recentlyPlayed[a].visitedAtMs;
    };
};

function peekPromise<T>(promise: Promise<T>) {
    let value: T | null = null;
    promise.then((v) => value = v);
    return value;
};
