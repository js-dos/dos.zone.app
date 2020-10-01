import React, { useRef, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { DosFactoryType, DosInstance } from "emulators-ui/dist/types/js-dos";
import { useTranslation } from "react-i18next";

import { IPlayerProps } from "./player";

import { openTurboSession } from "../core/turbo";

export function TurboPlayer(props: IPlayerProps) {
    const { t, i18n } = useTranslation("turbo");
    const user = props.user;
    const bundle = props.bundleUrl;

    const [response, setResponse] = useState<string>("");

    useEffect(() => {
        if (user === null) {
            return;
        }

        openTurboSession(user, bundle).then((payload) => {
            setResponse(JSON.stringify(payload, null, 2));
        })
    }, [user?.email, bundle]);


    if (user === null) {
        return <Redirect to={"/" + i18n.language + "/my" } />
    }
    return <div><pre>{response}</pre></div>;
}
