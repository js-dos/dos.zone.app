import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import { Landing } from "./pages/landing";

function Creator() {
    return <div>Creator</div>;
}

function App() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    return <Router>
        <a href="/en">English</a>
        <br/>
        <a href="/ru">Russian</a>
        <br/>
        <Link to={"/" + lang}>{t("home")}</Link>
        <br/>
        <Link to={"/" + lang + "/creator"}>{t("creator")}</Link>

        <Switch>
            <Route exact path="/:lang/">
                <Landing />
            </Route>
            <Route path="/:lang/creator">
                <Creator />
            </Route>
        </Switch>
    </Router>;
}

export default App;
