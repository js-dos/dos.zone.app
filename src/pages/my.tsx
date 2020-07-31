import React, { useState, useEffect } from "react";
import { Redirect, useParams, useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Spinner, Intent, Button } from "@blueprintjs/core";

import { myStorage, RecentlyPlayed } from "../core/storage";
import { GameThumb } from "./components/game-thumb";
import { IconNames } from "@blueprintjs/icons";

import { openRepository } from "../core/browser-tab";
import { getGameData } from "../core/game-query";

export function My() {
    const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayed | null>(null);
    const [selected, setSelected] = useState<string>("");
    const { t, i18n } = useTranslation("my");
    const { url } = useParams();
    const history = useHistory();

    useEffect(() => {
        myStorage().then(async (my) => {
            if (url !== undefined && url !== null && url.length > 0) {
                const decodedUrl = decodeURIComponent(url);
                my.recentlyPlayed[decodedUrl] = {
                    visitedAtMs: Date.now(),
                }
                await my.flush();
                setRecentlyPlayed(my.recentlyPlayed);
            } else {
                setRecentlyPlayed(my.recentlyPlayed);
            }
        });
    }, [url]);

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
    const runUrl = "/" + i18n.language + "/eplayer/" + encodeURIComponent(active);
    const description = getGameData(active).description[i18n.language]?.description || "";

    async function runBundle() {
        const storage = await myStorage();
        storage.recentlyPlayed[active].visitedAtMs = Date.now();
        await storage.flush();
        history.push(runUrl);
    }

    return <div className="left-margin">
        <h1>{t("selected")}</h1>
        <div className="recently-played">
            <GameThumb onClick={runBundle} url={active} selected={true} />
            <div className="thumb-description">{description}</div>
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
