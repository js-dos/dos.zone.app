import React, { useEffect } from "react";

import {
    useHistory,
    Redirect,
} from "react-router-dom";

import { Plugins } from "@capacitor/core";
import { QueryParams } from "./core/query-string";

const { App: CapApp } = Plugins;

function renderDeepLink(lang: string, url: string) {
    return "/" + lang + "/dl/" + btoa(url);
}

export function CapConfig(props: {
    lang: string,
    queryParams: () => QueryParams,
}) {
    const history = useHistory();
    useEffect(() => {
        const firstUrl = history.location.pathname;
        CapApp.addListener("appUrlOpen", (data: { url: string }) => {
            if (data.url) {
                window.location.pathname = renderDeepLink(props.lang, data.url);
            }
        });

        CapApp.addListener("backButton", async () => {
            if (history.length === 1 || history.location.pathname === firstUrl) {
                CapApp.exitApp();
                return;
            }

            history.goBack();
        });

        return () => {
            CapApp.removeAllListeners();
        };
        // eslint-disable-next-line
    }, [props.lang]);

    if (props.queryParams().sso !== undefined) {
        return <Redirect to={renderDeepLink(props.lang, window.location.href)} />;
    }

    return null;
};
