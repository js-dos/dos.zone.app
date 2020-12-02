import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import { GameStudioGuide } from "./pages/guides/game-studio";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    useParams,
} from "react-router-dom";

import { Deeplink } from "./core/deeplink";
import { CapConfig } from "./cap-config";

import { Navigator } from "./ui/navigator";
import { NavigatorPlayer } from "./ui/navigator-player";

import { Landing } from "./pages/landing";
import { GameStudio } from "./pages/game-studio";
import { FeaturesGuide } from "./pages/guides/features";
import { My } from "./pages/my";
import { Profile } from "./pages/profile";
import { Player } from "./player/player";
import { User, refresh, getCachedUser } from "./core/auth";

import { parseQuery, QueryParams } from "./core/query-string";
import { DosInstance } from "emulators-ui/dist/types/js-dos";

function App() {
    const { i18n } = useTranslation();
    const [user, setUser] = useState<User|null>(getCachedUser());
    const [dos, setDosInsatnce] = useState<DosInstance | null>(null);

    const lang = i18n.language;
    const queryParams = parseQuery(window.location.search);

    useEffect(() => {
        refresh(user).then(setUser);
        //  eslint-disable-next-line
    }, []);

    return <Router>
        <Route path="/" render={({location}) => {
            if (typeof (window as any).gtag === "function") {
                (window as any).gtag("config", "G-5L33M3K6MQ", {"page_path": location.pathname + location.search});
            }
            return null;
        }} />
        <CapConfig lang={lang} queryParams={queryParams}></CapConfig>
        <Switch>
            <Route exact path="/">
                <Redirect to={"/" + lang} />
            </Route>
            <Route exact path="/:lang/">
                <Navigator user={user} />
                <Landing />
            </Route>
            <Route path="/:lang/studio">
                <Navigator user={user} />
                <GameStudio />
            </Route>
            <Route path="/:lang/guide/studio">
                <Navigator user={user} />
                <GameStudioGuide />
            </Route>
            <Route path="/:lang/guide/features">
                <Navigator user={user} />
                <FeaturesGuide />
            </Route>
            <Route path={["/:lang/my/:url", "/:lang/my"]}>
                <Navigator user={user} />
                <My user={user} />
            </Route>
            <Route path={["/:lang/profile"]}>
                <Navigator user={user} />
                <Profile user={user} />
            </Route>
            <Route path="/:lang/play/:url">
                <div className="play-player-root">
                    <NavigatorPlayer dos={dos} />
                    <div className="play-player-container">
                        <PlayerWrapper user={user} embedded={false} queryParams={queryParams} onDosInstance={setDosInsatnce} />
                    </div>
                </div>
            </Route>
            <Route path="/:lang/player/:url">
                <PlayerWrapper user={user} embedded={true} queryParams={queryParams} onDosInstance={setDosInsatnce} />
            </Route>
            <Route path="/:lang/dl/:url">
                <Deeplink user={user} />
            </Route>
        </Switch>
    </Router>;
}

function PlayerWrapper(props: {
    user: User | null,
    embedded: boolean,
    queryParams: QueryParams,
    onDosInstance: (dos: DosInstance | null) => void;
}) {
    const { url } = useParams<{url: string}>();
    const turbo = props.queryParams.turbo || "0";
    return <Player
               user={props.user}
               bundleUrl={decodeURIComponent(url)}
               embedded={props.embedded}
               turbo={turbo === "1"}
               onDosInstance={props.onDosInstance}
           ></Player>;
}

export default App;

