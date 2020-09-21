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

import { CapConfig } from "./cap-config";

import { Navigator } from "./ui/navigator";
import { NavigatorPlayer } from "./ui/navigator-player";

import { Landing } from "./pages/landing";
import { GameStudio } from "./pages/game-studio";
import { My } from "./pages/my";
import { Player } from "./player/player";
import { User, authenticate, getCachedUser } from "./core/auth";

function PlayerWrapper(props: { embedded: boolean }) {
    const { url } = useParams();
    return <Player bundleUrl={decodeURIComponent(url)} embedded={props.embedded} ></Player>;
}


function App() {
    const { i18n } = useTranslation();
    const lang = i18n.language;

    const [user, setUser] = useState<User|null>(getCachedUser());

    useEffect(() => {
        authenticate(user).then(setUser);
        //  eslint-disable-next-line
    }, []);

    return <Router>
        <CapConfig lang={lang}></CapConfig>
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
            <Route path={["/:lang/my/:url", "/:lang/my"]}>
                <Navigator user={user} />
                <My />
            </Route>
            <Route path="/:lang/play/:url">
                <div className="play-player-root">
                    <NavigatorPlayer />
                    <div className="play-player-container">
                        <PlayerWrapper embedded={false} />
                    </div>
                </div>
            </Route>
            <Route path="/:lang/player/:url">
                <PlayerWrapper embedded={true} />
            </Route>
        </Switch>
    </Router>;
}

export default App;

