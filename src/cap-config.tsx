import React, { useEffect } from "react";

import {
    useHistory,
    Redirect,
} from "react-router-dom";

import { Capacitor } from "@capacitor/core";
import { Plugins } from "@capacitor/core";
import { QueryParams } from "./core/query-string";

const { App: CapApp } = Plugins;

function renderDeepLink(lang: string, url: string) {
    return "/" + lang + "/dl/" + btoa(url);
}

export const isMobile = Capacitor.isNative || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export const BackButton: {
    customHandler?: () => void,
    defaultHandler: () => void,
} = {
    defaultHandler: () => { /**/ },
};

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

        BackButton.defaultHandler = async () => {
            if (BackButton.customHandler) {
                BackButton.customHandler();
                return;
            }

            if (history.length === 1 || history.location.pathname === firstUrl) {
                CapApp.exitApp();
                return;
            }

            history.goBack();
        };

        CapApp.addListener("backButton", BackButton.defaultHandler);

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
