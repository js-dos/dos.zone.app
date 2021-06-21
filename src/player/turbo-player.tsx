import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IPlayerProps } from "./player";
import { openTurboSession, describeSession, closeTurboSession } from "../core/turbo";

import { User } from "../core/auth";

import { DosPlayer } from "./dos-player";
import { Loader } from "./loader";
import { logError } from "../core/log";
import { getAutoRegion } from "../core/latency";

const initialCountDown = 50;

function goBack(history: any, lang: string) {
    history.replace("/" + lang + "/my");
}

export function TurboPlayer(props: IPlayerProps) {
    const { t, i18n } = useTranslation("turbo");
    const history = useHistory();
    const user = props.user;
    const bundle = props.bundleUrl;

    const [arn, setArn] = useState<string | null>(null);
    const [publicIp, setPublicIp] = useState<string | null>(null);
    const [countDown, setCountDown] = useState<number>(initialCountDown);
    const [testRegion, setTestRegion] = useState<string>("");
    const [region, setRegion] = useState<string | null>(props.turboRegion === "auto" ? null : props.turboRegion)

    useEffect(() => {
        return () => {
            if (user !== null && arn !== null) {
                closeTurboSession(user, arn)
            }
        };
    }, [user, arn]);

    useEffect(() => {
        if (region !== null) {
            return;
        }

        getAutoRegion(setTestRegion).then(setRegion);
    }, [region]);

    useEffect(() => {
        let cancel = false;

        if (user === null) {
            return;
        }

        if (region === null) {
            return;
        }

        if (arn !== null) {
            closeTurboSession(user, arn);
        }

        openTurboSession(user, bundle, region).then(async (newArn) => {
            if (newArn === null) {
                goBack(history, i18n.language);
            } else if (cancel) {
                closeTurboSession(user, newArn);
                goBack(history, i18n.language);
            } else {
                setArn(newArn);
                let countDown = initialCountDown;
                const countDownId = setInterval(() => {
                    countDown--;
                    if (!cancel) {
                        setCountDown(countDown);
                    }
                    if (countDown === 0) {
                        clearInterval(countDownId);
                    }
                }, 1000);

                getPublicIp(user, newArn).then((ip) => {
                    clearInterval(countDownId);
                    if (cancel) {
                        return;
                    }
                    setPublicIp(ip);
                }).catch((e) => {
                    clearInterval(countDownId);
                    logError(e);
                });
            }
        });

        return () => {
            cancel = true;
        }
    }, [user, bundle, region]);

    if (user === null) {
        return <Redirect to={"/" + i18n.language + "/my"} />
    }

    if (region === null) {
        return <Loader
            pre2={t("detecting_region")}
            pre3={t("testing") + testRegion}/>;
    }

    if (arn === null) {
        return <Loader
            pre2={t("waiting_arn")}
            pre3={props.turboRegion === "auto" ? "auto:" + region : region} />;
    }

    if (publicIp === null) {
        return <Loader
            pre2={t("waiting_ip") + " (" + countDown + ") " + t("sec")}
            pre3={props.turboRegion === "auto" ? "auto:" + region : region}
        />;
    }

    const playerProps: IPlayerProps = { ...props };
    playerProps.janusServerUrl = "http://" + publicIp + ":8088/janus";
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
