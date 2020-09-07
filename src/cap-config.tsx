import { useEffect } from "react";

import {
    useHistory,
} from "react-router-dom";

import { Plugins } from "@capacitor/core";
const { App: CapApp } = Plugins;

export function CapConfig(props: { lang: string }) {
    const history = useHistory();
    useEffect(() => {
        const firstUrl = history.location.pathname;
        CapApp.addListener("appUrlOpen", (data: { url: string }) => {
            if (data.url) {
                const myIndex = data.url.indexOf("/my/");
                if (myIndex > 0) {
                    const bundleUrl = data.url.substr(myIndex + "/my/".length);
                    const newUrl = "/" + props.lang + "/my/" + bundleUrl;
                    history.push(newUrl);
                }
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
    return null;
};
