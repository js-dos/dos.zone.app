import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

import { Navbar, Alignment, Button, Intent, Overlay, Classes, Card, Spinner } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { useTranslation } from "react-i18next";
import { DosInstance } from "emulators-ui/dist/types/js-dos";
import { Capacitor } from "@capacitor/core";
import { Button as ButtonType } from "emulators-ui/dist/types/controls/button";
import { LayersType } from "../pages/layers";
import { EmulatorsUi } from "emulators-ui";
import { TFunction } from "i18next";
import { layers } from "emulators-ui/dist/types/dom/layers";
import { User } from "../core/auth";
import { getTurboSession } from "../core/turbo";

declare const emulatorsUi: EmulatorsUi;
const isMobile = Capacitor.isNative || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const keyOptions = Object.keys(emulatorsUi.controls.namedKeyCodes);

export function NavigatorPlayer(props: {
    dos: DosInstance | null,
    user: User | null,
}) {
    const { t, i18n } = useTranslation("navigator");
    const lang = i18n.language;
    const history = useHistory();
    const dos = props.dos;
    const user = props.user;
    const turbo = history.location.search.indexOf("turbo=1") >= 0;

    const [mobileMode, setMobileMode] = useState<boolean>(isMobile);
    const [overlay, setOverlay] = useState<boolean>(false);
    const [hint, setHintComponent] = useState<JSX.Element | null>(null);
    const [rtt, setRttComponent] = useState<JSX.Element | null>(null);
    const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [endTime, setEndTime] = useState<number>(0);
    const [endTimeWarn, setEndTimeWarn] = useState<boolean>(false);

    const showOverlay = overlay && hint !== null;

    useEffect(() => {
        if (dos === null) {
            return;
        }

        if (!isMobile) {
            dos.disableMobileControls();
        }

        let cancel = false;
        dos.ciPromise?.then((ci) => {
            ci.events().onStdout((message) => {
                if (cancel) {
                    return;
                }

                if (message.startsWith("rtt-data=")) {
                    setRttComponent(renderRttComponent(message));
                }
            });
            return ci.config();
        }).then((config) => {
            if (cancel) {
                return;
            }

            const layers = (config as any).layers as LayersType;
            if (layers === undefined) {
                return;
            }

            setHintComponent(renderHintComponent(layers, t));
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
        return dos.layers.save()
                  .then(() => setSaving(false))
                  .catch(() => setSaving(false))
    }

    function toggleKeyboard() {
        if (dos == null) {
            return;
        }

        setKeyboardVisible(dos.layers.toggleKeyboard());
        restoreFocus();
    }

    function doClose() {
        doSave().then(() => history.replace("/" + lang + "/my"));
    }

    return <div>
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
                    intent={showOverlay ? Intent.PRIMARY : Intent.NONE}
                    disabled={hint === null }
                    icon={IconNames.INFO_SIGN}
                    minimal={true}
                    onClick={() => setOverlay(!overlay) }>
                </Button>
                <Button
                    intent={(mobileMode ? Intent.PRIMARY : Intent.NONE)}
                    icon={IconNames.MOBILE_PHONE}
                    minimal={true}
                    onClick={toggleMobileMode}>
                </Button>
                <Navbar.Divider />
                <Button
                    intent={keyboardVisible ? Intent.PRIMARY : Intent.NONE}
                    icon={IconNames.MANUALLY_ENTERED_DATA}
                    minimal={true}
                    onClick={toggleKeyboard}>
                </Button>
                <Button
                    icon={IconNames.FLOPPY_DISK}
                    disabled={saving}
                    minimal={true}
                    onClick={doSave}>
                </Button>
                <Button
                    icon={IconNames.MAXIMIZE}
                    minimal={true}
                    onClick={toggleFullscreen}>
                </Button>
            </Navbar.Group>
        </Navbar>
        <Overlay
            isOpen={showOverlay}
            onClose={() => {setOverlay(false)}}
            className={Classes.OVERLAY_SCROLL_CONTAINER}>
            <Card className={Classes.DARK} elevation={4} style={{
                left: "max(0px, 50vw - 320px)",
                width: "640px",
                maxWidth: "100%",
            }}>
                {hint}
            </Card>
        </Overlay>
    </div>;
}

function renderRttComponent(rttdata: string) {
    const [rttTime, bitrate] = rttdata.substr("rtt-data=".length).split(" ");
    return <div style={{fontSize: "10px", color: "#BFCCD6"}}>
        {rttTime}ms | {bitrate}kbs
    </div>;
}

function renderHintComponent(layers: LayersType, t: TFunction) {
    const names = Object.keys(layers);
    names.sort();
    return <div>
        {names.map((name) => {
            const gestures = layers[name].gestures;
            const buttons = layers[name].buttons;
            const mapper = layers[name].mapper;
            let gesturesComponent = null;
            if (gestures !== undefined && gestures.length > 0) {
                gesturesComponent = <div className="hint-part">
                    <p className="hint-control-title">{t("joysticks")}:</p>
                    {gestures.map((g, index) => {
                        if (g.event === "end:release" || g.mapTo === 0) {
                            return null;
                        }
                        return <React.Fragment key={"g-" + index}>
                            <p><b className="hint-src">{g.joystickId}:{g.event}</b> -&gt; {getKeyCodeName(g.mapTo)}</p>
                        </React.Fragment>;
                    })}
                </div>;
            }
            let buttonsComponent = null;
            if (buttons !== undefined && buttons.length > 0) {
                buttonsComponent = <div className="hint-part">
                    <p className="hint-control-title">{t("buttons")}:</p>
                    {buttons.map((b, index) => {
                        if (b.mapTo === 0) {
                            return null;
                        }
                        return <React.Fragment key={"b-" + index}>
                            <p><b className="hint-src">{symbolOfButton(b)}</b> -&gt; {getKeyCodeName(b.mapTo)}</p>
                        </React.Fragment>;
                    })}
                </div>;
            }
            let mapperComponent = null;
            if (mapper === undefined || Object.keys(mapper).length > 0) {
                const keys = Object.keys(mapper);
                keys.sort();
                mapperComponent = <div className="hint-part">
                    <p className="hint-control-title">{t("mapper")}:</p>
                    {keys.map((key, index) => {
                        const keyCode = Number.parseInt(key, 10);
                        if (isNaN(keyCode) || keyCode === 0 || mapper[keyCode] === 0) {
                            return null;
                        }
                        return <React.Fragment key={"m-" + index}>
                            <p><b className="hint-src">{getKeyCodeName(keyCode)}</b> -&gt; {getKeyCodeName(mapper[keyCode])}</p>
                        </React.Fragment>;
                    })}
                </div>;
            }
            return <React.Fragment key={"layer-" + name}>
                <p className="hint-layer-name"><b>{name}:</b></p>
                {gesturesComponent}
                {buttonsComponent}
                {mapperComponent}
            </React.Fragment>;
        })}
    </div>;
}

function symbolOfButton(button: ButtonType) {
    if (button.symbol !== undefined) {
        return button.symbol;
    }

    return getKeyCodeName(button.mapTo).substr(4, 2).toUpperCase();
}

function getKeyCodeName(keyCode: number) {
    for (const next of keyOptions) {
        if (emulatorsUi.controls.namedKeyCodes[next] === keyCode) {
            return next;
        }
    }

    return "KBD_none";
}

function timeInfo(time: number, t: TFunction) {
    if (time < 60) {
        return "0 " + t("min");
    }

    return Math.round(time / 60 * 10) / 10 + " "+ t("min");
};
