import { useEffect } from 'react';

import {
    useHistory,
} from "react-router-dom";

import { Plugins } from '@capacitor/core';
const { App: CapApp } = Plugins;

export function CapConfig(props: { lang: string }) {
    let history = useHistory();
    useEffect(() => {
        CapApp.addListener('appUrlOpen', (data: { url: string }) => {
            if (data.url) {
                const playerIndex = data.url.indexOf("/player/");
                if (playerIndex > 0) {
                    const bundleUrl = data.url.substr(playerIndex + "/player/".length);
                    const newUrl = "/" + props.lang + "/player/" + bundleUrl;
                    history.push(newUrl);
                }
            }

            return () => {
                CapApp.removeAllListeners();
            };
        });
    }, [props.lang]);
    return null;
};
