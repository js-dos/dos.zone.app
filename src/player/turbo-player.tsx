import React, { useRef, useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IPlayerProps } from "./player";
import { openTurboSession, describeSession, closeTurboSession } from "../core/turbo";
import { goBack } from "../ui/navigator";

import { Spinner, H1} from "@blueprintjs/core";
import { User } from "../core/auth";

import { DosPlayer } from "./dos-player";
import { Loader } from "./loader";

const initialCountDown = 50;

export function TurboPlayer(props: IPlayerProps) {
    const { t, i18n } = useTranslation("turbo");
    const history = useHistory();
    const user = props.user;
    const bundle = props.bundleUrl;

    const [arn, setArn] = useState<string | null>(null);
    const [publicIp, setPublicIp] = useState<string | null>(null);
    const [countDown, setCountDown] = useState<number>(initialCountDown);

    useEffect(() => {
        return () => {
            if (user !== null && arn !== null) {
                closeTurboSession(user, arn)
            }
        };
    }, [user, arn]);

    useEffect(() => {
        if (user === null) {
            return;
        }

        openTurboSession(user, bundle).then(async (arn) => {
            if (arn === null) {
                goBack(history, i18n.language);
            } else {
                setArn(arn);
                let countDown = initialCountDown;
                let countDownId = setInterval(() => {
                    countDown--;
                    setCountDown(countDown);
                    if (countDown === 0) {
                        clearInterval(countDownId);
                    }
                }, 1000);
                try {
                    setPublicIp(await getPublicIp(user, arn));
                    clearInterval(countDownId);
                } catch(e) {
                    console.error(e);
                    goBack(history, i18n.language);
                    clearInterval(countDownId);
                }
            }
        })
    }, [user?.email, bundle]);

    if (user === null) {
        return <Redirect to={"/" + i18n.language + "/my" } />
    }

    if (arn === null) {
        return <Loader pre2={t("waiting_arn")} />;
    }

    if (publicIp === null) {
        return <Loader pre2={t("waiting_ip") + " (" + countDown + ") " + t("sec")} />;
    }

    const playerProps: IPlayerProps = {...props};
    playerProps.bundleUrl = "http://" + publicIp + ":8088/janus";
    return <DosPlayer {...playerProps} />;
}

async function getPublicIp(user: User, arn: string) {
    return new Promise<string>((resolve, reject) => {
        const inervalId = setInterval(() => {
            describeSession(user, arn).then((session) => {
                if (session === null) {
                    clearInterval(inervalId);
                    reject(new Error("Can't obtain session"));
                    return;
                }

                if (session.arn !== arn) {
                    clearInterval(inervalId);
                    reject(new Error("Arn changed!"));
                    return;
                }

                if (session.ip !== undefined) {
                    clearInterval(inervalId);
                    resolve(session.ip);
                }
            });
        }, 3000);
    });
}
