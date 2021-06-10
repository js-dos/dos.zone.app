import React, { useState, useEffect } from "react";

import { useParams, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Spinner,
    Intent,
    Button,
    ButtonGroup,
    Popover,
    Position,
} from "@blueprintjs/core";

import { getRecentlyPlayed, RecentlyPlayed,
         setRecentlyPlayed as updateRecentlyPlayed,
         recentlyPlayedSorterFn } from "../core/storage/recently-played";
import { GameThumb } from "./components/game-thumb";
import { IconNames } from "@blueprintjs/icons";

import { openRepository } from "../core/browser-tab";
import { GameData } from "../core/game";
import { getGameData } from "../core/game-query";

import { isSuperUser, User } from "../core/auth";
import { TurboOptions } from "./components/turbo-options";
import { GET_TEXT } from "../core/xhr/GET";
import { getPersonalBundleUrlIfExists } from "../core/personal";

import { HardwareIcon } from "./components/hardware-icon";


import striptags from "striptags";
import { YoutubeModal } from "./components/youtube-modal";

const isSafari = navigator.vendor && navigator.vendor.indexOf("Apple") > -1 &&
                 navigator.userAgent &&
                 navigator.userAgent.indexOf("CriOS") === -1 &&
                 navigator.userAgent.indexOf("FxiOS") === -1;

export interface RunOptions {
    turbo: boolean;
    turboRegion?: string;
    local?: boolean;
    logVisual?: boolean;
    logLayers?: boolean;
}

export function My(props: { user: User | null }) {
    const [recentlyPlayed, _setRecentlyPlayed] = useState<RecentlyPlayed | null>(null);
    const [gamesData, setGamesData] = useState<{[url: string]: Promise<GameData>}>({});
    const [selected, _setSelected] = useState<string | null>(null);
    const [selectedData, setSelectedData] = useState<GameData | null>(null);
    const [fullDescription, setFullDescription] = useState<boolean>(false);
    const [showVideo, setShowVideo] = useState<boolean>(false);
    const { t, i18n } = useTranslation("my");
    const { url, listUrl } = useParams<{ url?: string, listUrl?: string }>();
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

            if (recentlyPlayed !== null && selected !== null) {
                recentlyPlayed[bundleUrl].visitedAtMs = Date.now();
                updateRecentlyPlayed(user, recentlyPlayed);
            }
        }
        window.scrollTo(0,0);
    }

    function updateSelectedData(selected: string, gamesData: {[url: string]: Promise<GameData>}) {
        setFullDescription(false);
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
        let cancel = false;
        setRecentlyPlayed(null); // reset state
        getRecentlyPlayed(user).then((recentlyPlayed) => {
            if (cancel) {
                return;
            }

            if (url !== undefined && url !== null && url.length > 0) {
                const decodedUrl = decodeURIComponent(url);
                recentlyPlayed[decodedUrl] = {
                    visitedAtMs: Date.now(),
                }
                updateRecentlyPlayed(user, recentlyPlayed);
                setRecentlyPlayed(recentlyPlayed);
            } else if (listUrl !== undefined && listUrl !== null && listUrl.length > 0) {
                GET_TEXT(decodeURIComponent(listUrl)).then((listContent) => {
                    if (cancel) {
                        return;
                    }

                    for (const next of listContent.split("\n")) {
                        const fullUrl = (next.split(" ")[1] || "").trim();
                        const myIndex = fullUrl.indexOf("/my/");
                        if (myIndex > 0) {
                            const url = decodeURIComponent(fullUrl.substr(myIndex + "/my/".length));
                            recentlyPlayed[url] = {
                                visitedAtMs: Date.now(),
                            }
                        }
                    }

                    updateRecentlyPlayed(user, recentlyPlayed);
                    setRecentlyPlayed(recentlyPlayed);
                })
            } else {
                setRecentlyPlayed(recentlyPlayed);
            }
        });

        return () => {
            cancel = true;
        }
    }, [user, url, listUrl]);

    if (recentlyPlayed === null || selected === null || selectedData === null) {
        return <div style={{ alignSelf: "center", }}>
            <br/>
            <Spinner></Spinner>
        </div>;
    }

    const description = striptags(selectedData.description[i18n.language]?.description || selectedData.description.en?.description || "");
    const canPlay = selectedData.turbo !== "required";
    const canTurbo = !canPlay || (selectedData.turbo !== "no" && !isSafari);
    const runUrl = "/" + i18n.language + "/play/" + encodeURIComponent(selectedData.canonicalUrl);

    function runBundle(options: RunOptions) {
        const turboMode = options.turbo;
        const startTurbo = canTurbo && turboMode;
        const url = runUrl + "?turbo=" + (startTurbo ? "1" : "0") +
            (options.local ? "&local=1" : "") + (options.logVisual ? "&logVisual=1" : "") +
            (options.logLayers ? "&logLayers=1" : "") +
            "&turboRegion=" + (options.turboRegion || "auto");
        if (startTurbo && window.location.protocol === "https:") {
            window.location.href = "http://dos.zone" + url;
        } else {
            history.push(url);
        }
    }

    async function remove() {
        if (recentlyPlayed !== null && selected !== null) {
            const newRecentlyPlayed = {...recentlyPlayed};
            delete newRecentlyPlayed[selected];
            await updateRecentlyPlayed(user, newRecentlyPlayed);
            setRecentlyPlayed(newRecentlyPlayed);
        }
    }

    async function downloadArchive() {
        if (user === null || selectedData === null) {
            return;
        }
        const url = await getPersonalBundleUrlIfExists(user.email, selectedData.canonicalUrl);
        window.open(url, "_blank");
    }

    const keys = Object.keys(recentlyPlayed);
    keys.sort(recentlyPlayedSorterFn(recentlyPlayed));

    const slug = selectedData.slug[i18n.language] || selectedData.slug.en;
    function openSlug() {
        window.open("https://talks.dos.zone/t/" + slug, "_blank");
    }

    function openBuild() {
        if (selectedData === null) {
            return;
        }

        history.push("/" + i18n.language + "/studio/" + encodeURIComponent(selectedData.canonicalUrl));
    }

    const playButton = (<Button disabled={!canPlay}
        className={canPlay ? "heartbeat" : ""}
        icon={IconNames.PLAY}
        intent={canPlay ? Intent.PRIMARY : Intent.NONE}
        onClick={() => runBundle({ turbo: false })}>{t("play")}</Button>);

    return <div className="left-margin">
        <h1>{t("selected")}</h1>
        <div className="recently-played my-selected">
            <GameThumb canPlay={canPlay} key={"selected-" + selectedData.canonicalUrl} onClick={() => { if (canPlay) { runBundle({ turbo: false }) }}} game={selectedData} selected={true} />
            <div className="thumb-options">
                <div>
                    <ButtonGroup>
                        {
                            canPlay ?
                            playButton :
                            <Popover content={<div className="popover-inner-card">{t("turbo_mode_required")}</div>} position={Position.TOP} isOpen={true}>
                                {playButton}
                            </Popover>
                        }
                        { selectedData.video !== undefined && selectedData.video.length > 0 ? <Button icon={IconNames.VIDEO} onClick={() => setShowVideo(true)}/> : null }
                        { isSuperUser(user) ? <Button disabled={!canPlay} icon={IconNames.RECORD} onClick={() => runBundle({ turbo: false, logLayers: true })} /> : null}
                        { slug !== undefined && slug.length > 0 ? <Button onClick={openSlug} icon={IconNames.COMMENT}></Button> : null }
                        { user !== null ? <Button icon={IconNames.ARCHIVE} onClick={downloadArchive}></Button> : null }
                        <Button onClick={openBuild} icon={IconNames.FORK}></Button>
                        <Button onClick={remove} icon={IconNames.TRASH}></Button>
                    </ButtonGroup>
                    <HardwareIcon />
                    { canTurbo ? <TurboOptions
                                     intent={!canPlay ? Intent.PRIMARY : Intent.NONE}
                                     user={user}
                                     onRun={runBundle} /> : null }
                </div>
                <br/><br/>
                <div className="thumb-description">
    {
        fullDescription || description.length < 300 ?
                                                description :
                                                <div>{description.substr(0, 300)}...&nbsp;&nbsp;<a onClick={() => setFullDescription(true) }>{t("more")}</a></div>
    }
                </div>
            </div>
        </div>
        <div className="one-row">
            <h1>{t("recently_played")}</h1>
            <Button large={true} onClick={() => openRepository()} icon={IconNames.SEARCH} intent={Intent.NONE}>{t("browse_database")}</Button>
        </div>
        <div className="recently-played">{
            keys.map((a) => <GameThumb canPlay={false} onClick={() => setSelected(a)} gamePromise={gamesData[a]} key={"all-" + a} selected={false} />)
        }</div>
        { showVideo ? <YoutubeModal url={selectedData.video} onClose={() => setShowVideo(false)} /> : null }
    </div>
}

function peekPromise<T>(promise: Promise<T>) {
    let value: T | null = null;
    promise.then((v) => value = v);
    return value;
};
