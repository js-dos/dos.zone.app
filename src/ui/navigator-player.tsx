import React, { useEffect, useState } from "react";

import { Alignment, Button, Intent, Navbar, Spinner } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Capacitor } from "@capacitor/core";
import { CommandInterface } from "emulators";
import { DosInstance } from "emulators-ui/dist/types/js-dos";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { BackButton, isMobile } from "../cap-config";
import { User } from "../core/auth";
import { getTurboSession } from "../core/turbo";

import "./navigator.css";
import { Tutorial } from "../player/tutorial";
import { getCachedGameData } from "../core/game-query";

export function NavigatorPlayer(props: {
    dos: DosInstance | null,
    user: User | null,
    bundleUrl: string,
}) {
    const { t, i18n } = useTranslation("navigator");
    const lang = i18n.language;
    const history = useHistory();
    const { user, dos, bundleUrl } = props;
    const turbo = history.location.search.indexOf("turbo=1") >= 0;

    const [mobileMode, setMobileMode] = useState<boolean>(isMobile);
    const [rtt, setRttComponent] = useState<JSX.Element | null>(null);
    const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [endTime, setEndTime] = useState<number>(0);
    const [endTimeWarn, setEndTimeWarn] = useState<boolean>(false);
    const [paused, setPaused] = useState<boolean>(false);
    const [muted, setMuted] = useState<boolean>(false);
    const [ci, setCi] = useState<CommandInterface | null>(null);

    const game = getCachedGameData(bundleUrl);

    useEffect(() => {
        BackButton.customHandler = () => {
            if (dos !== null) {
                dos.layers.notyf.error(t("use_back_button"));
            }
        };

        function onBeforeUnload(event: BeforeUnloadEvent) {
            setTimeout(() => {
                if (dos !== null) {
                    dos.layers.notyf.error(t("use_back_button"));
                }
            }, 16);

            event.preventDefault();
            event.returnValue = t("use_back_button");
        }

        if (!Capacitor.isNative) {
            window.addEventListener("beforeunload", onBeforeUnload);
        }


        return () => {
            delete BackButton.customHandler;
            if (!Capacitor.isNative) {
                window.removeEventListener("beforeunload", onBeforeUnload);
            }
        };
    }, [dos, t]);

    useEffect(() => {
        if (dos === null) {
            return;
        }

        if (!isMobile) {
            dos.disableMobileControls();
        }

        let cancel = false;
        dos.ciPromise?.then((commandInterface) => {
            if (cancel) {
                return;
            }

            commandInterface.events().onStdout((message) => {
                if (cancel) {
                    return;
                }

                if (message.startsWith("rtt-data=")) {
                    setRttComponent(renderRttComponent(message));
                }
            });
            setCi(commandInterface);
        });

        return () => {
            cancel = true;
        };
    }, [dos]);

    useEffect(() => {
        if (!turbo || user === null || dos === null) {
            return;
        }

        let cancle = false;
        let warnNotified = false;
        const update = () => {
            if (cancle) {
                return;
            }

            getTurboSession(user).then((session) => {
                if (cancle || session === null) {
                    return;
                }

                setEndTime(Date.now() + session.restTime * 1000);
                const shouldWarn = session.restTime <= 5 * 60;
                setEndTimeWarn(shouldWarn);
                if (shouldWarn) {
                    if (!warnNotified) {
                        alert(t("turbo_time_warn"));
                        warnNotified = true;
                    }
                }
            });
        };

        const id = setTimeout(update, 60 * 1000);
        update();
        return () => {
            cancle = true;
            clearTimeout(id);
        };
    }, [turbo, user, dos, t]);

    function restoreFocus() {
        document.body.focus();
    }

    function toggleMobileMode() {
        if (dos === null) {
            return;
        }

        if (!mobileMode) {
            dos.enableMobileControls();
        } else {
            dos.disableMobileControls();
        }

        setMobileMode(!mobileMode);
        restoreFocus();
    }

    function toggleFullscreen() {
        if (dos === null) {
            return;
        }

        dos.layers.toggleFullscreen();
        restoreFocus();
    }

    function doSave(): Promise<void> {
        if (dos === null) {
            return Promise.resolve();
        }

        setSaving(true);
        restoreFocus();
        return dos.layers.save()
                  .then(() => setSaving(false))
                  .catch(() => setSaving(false))
    }

    function toggleKeyboard() {
        if (dos === null) {
            return;
        }

        setKeyboardVisible(dos.layers.toggleKeyboard());
        restoreFocus();
    }

    function doClose() {
        doSave().then(() => history.replace("/" + lang + "/my"));
    }

    function togglePause() {
        if (ci === null) {
            return;
        }

        setPaused(!paused);
        if (paused) {
            ci.resume();
        } else {
            ci.pause();
        }

        restoreFocus();
    }

    function toggleMute() {
        if (ci === null) {
            return;
        }

        setMuted(!muted);
        if (muted) {
            ci.unmute();
        } else {
            ci.mute();
        }

        restoreFocus();
    }

    return <div>
        { ci === null ? null : <Tutorial url={game?.video} user={user} togglePause={togglePause} /> }
        <Navbar fixedToTop={false}>
            <Navbar.Group align={Alignment.LEFT}>
                <Navbar.Heading>
                    { saving ?
                    (<div style={{display: "flex", flexDirection: "row"}}><Spinner size={16} /><p style={{margin: 0, paddingLeft: "8px" }}>{t("saving")}</p></div>) :
                      (<Button icon={IconNames.ARROW_LEFT} minimal={true}
                               onClick={doClose}>{t("games")}</Button>)
                    }
                </Navbar.Heading>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                { turbo && endTime > 0 ? <div style={{fontSize: "10px", color: endTimeWarn ? "#DB3737" : "#BFCCD6"}}>{timeInfo((endTime - Date.now()) / 1000, t)}</div> : null }
                { turbo && endTime > 0 && rtt !== null ? <Navbar.Divider /> : null}
                { rtt }
                { turbo || rtt !== null ? <Navbar.Divider /> : null }
                <Button
                    disabled={ci === null}
                    intent={(mobileMode ? Intent.PRIMARY : Intent.NONE)}
                    icon={IconNames.MOBILE_PHONE}
                    minimal={true}
                    onClick={toggleMobileMode}>
                </Button>
                <Navbar.Divider />
                <Button
                    disabled={ci === null}
                    intent={paused ? Intent.SUCCESS : Intent.NONE}
                    icon={ paused ? IconNames.PLAY : IconNames.PAUSE}
                    minimal={true}
                    onClick={togglePause}>
                </Button>
                <Button
                    disabled={ci === null}
                    intent={muted ? Intent.PRIMARY : Intent.NONE}
                    icon={ muted ? IconNames.VOLUME_OFF : IconNames.VOLUME_UP}
                    minimal={true}
                    onClick={toggleMute}>
                </Button>
                <Button
                    disabled={ci === null}
                    intent={keyboardVisible ? Intent.PRIMARY : Intent.NONE}
                    icon={IconNames.MANUALLY_ENTERED_DATA}
                    minimal={true}
                    onClick={toggleKeyboard}>
                </Button>
                <Button
                    icon={IconNames.FLOPPY_DISK}
                    disabled={ci === null || saving}
                    minimal={true}
                    onClick={doSave}>
                </Button>
                <Button
                    disabled={ci === null}
                    icon={IconNames.MAXIMIZE}
                    minimal={true}
                    onClick={toggleFullscreen}>
                </Button>
            </Navbar.Group>
        </Navbar>
    </div>;
}

function renderRttComponent(rttdata: string) {
    const [rttTime, bitrate] = rttdata.substr("rtt-data=".length).split(" ");
    return <div style={{fontSize: "10px", color: "#BFCCD6"}}>
        {rttTime}ms | {bitrate}kbs
    </div>;
}

function timeInfo(time: number, t: TFunction) {
    if (time < 60) {
        return "0 " + t("min");
    }

    return Math.round(time / 60 * 10) / 10 + " "+ t("min");
};
