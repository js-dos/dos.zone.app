import React from 'react';

import { Navbar, Button, Alignment, Classes } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { useTranslation } from 'react-i18next';

import { GameStudioGuide } from "./pages/guides/game-studio";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

import { Navigator } from "./ui/navigator";

import { Landing } from "./pages/landing";
import { GameStudio } from "./pages/game-studio";

function App() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    return <Router>
        <Navigator />
        <Switch>
            <Route exact path="/">
                <Redirect to={"/" + lang} />
            </Route>
            <Route exact path="/:lang/">
                <Landing />
            </Route>
            <Route path="/:lang/studio">
                <GameStudio />
            </Route>
            <Route path="/:lang/guide/studio">
                <GameStudioGuide />
            </Route>
        </Switch>
    </Router>;
}

export default App;
