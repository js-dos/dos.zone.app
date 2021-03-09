import React, { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Capacitor } from "@capacitor/core";

import {
    Intent,
    Button,
    Spinner,
} from "@blueprintjs/core";

import { AndroidPromo } from "../components/android-promo";
import { Search } from "../components/search";
import { User } from "../../core/auth";

import { GameData } from "../../core/game";
import { GamePreview } from "../components/game-preview";

import "./landing-v2.css";
import { dhry2Url, getRecentlyPlayed, recentlyPlayedSorterFn  } from "../../core/storage/recently-played";
import { getGameData } from "../../core/game-query";
import { openRepository, openSearch } from "../../core/browser-tab";

export function Landing(props: { user: User | null }) {
    const { t, i18n } = useTranslation("landing2");
    const history = useHistory();
    const [ searchTerm, setSearchTerm ] = useState<string>("");
    const [ searchResponse, setSearchResponse ] = useState<GameData[] | null>(null);
    const [ recentlyResponse, setRecentlyResponse ] = useState<GameData[] | null>(null);
    const user = props.user;

    useEffect(() => {
        let cancle = false;
        getRecentlyPlayed(user).then(async (recentlyPlayed) => {
            const urls = Object.keys(recentlyPlayed);
            urls.sort(recentlyPlayedSorterFn(recentlyPlayed));

            const gameData: GameData[] = [];
            for (let i = 0; i < Math.min(urls.length, 5); ++i) {
                if (cancle) {
                    return;
                }

                if (urls[i] === dhry2Url) {
                    continue;
                }

                gameData.push(await getGameData(urls[i]));
            }

            if (cancle) {
                return;
            }

            setRecentlyResponse(gameData);
        });

        return () => {
            cancle = true;
        }
    }, [user]);

    function onSearchMore() {
        if (searchTerm.length > 0) {
            openSearch(searchTerm, i18n.language);
        }
    }

    function onRecentMore() {
        history.push("/" + i18n.language + "/my");
    }

    return (<div className="landing2-root">
        <AndroidPromo />

        <div className="landing2-header">
            <img src="logo-wide.png" className="landing2-logo" />
            <Search onSearchResult={(searchTerm, response) => {
                setSearchTerm(searchTerm);
                setSearchResponse(response);
            }} />
        </div>
        {
            searchResponse !== null && searchResponse.length > 0 ?
            <div className="landing2-games-header"><div>{t("search_result")}&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;</div><Button onClick={onSearchMore} minimal={true} intent={Intent.PRIMARY}>{t("more_search")}</Button></div> : null
        }
        <div className="landing2-games">
               { (searchResponse || []).map((game, i) => <GamePreview openInternal={ Capacitor.platform !== "android" } game={game} key={"search-" + i + ":" + game.canonicalUrl} />) }
        </div>

        { recentlyResponse !== null && recentlyResponse.length > 0 ? <div className="landing2-games-header"><div>{t("recently_played")}&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;</div><Button onClick={onRecentMore} minimal={true} intent={Intent.PRIMARY}>{t("more_recent")}</Button></div> : null }
        <div className="landing2-games">
            {
                recentlyResponse === null ? <Spinner/> :
                (recentlyResponse.length === 0 ?
                <div className="landing2-games-header"><Button onClick={openRepository} minimal={true} intent={Intent.PRIMARY}>{t("open_catalog")}</Button></div> :
                recentlyResponse.map((game, i) => <GamePreview openInternal={true} game={game} key={"recently-" + i + ":" + game.canonicalUrl} />))
            }
        </div>
    </div>);
}
