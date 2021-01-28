import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

import { Navbar, Alignment, Button, Intent, Overlay, Classes, Card } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { useTranslation } from "react-i18next";
import { DosInstance } from "emulators-ui/dist/types/js-dos";
import { Capacitor } from "@capacitor/core";
import { Button as ButtonType } from "emulators-ui/dist/types/controls/button";
import { LayersType } from "../pages/layers";
import { EmulatorsUi } from "emulators-ui";
import { TFunction } from "i18next";
import { layers } from "emulators-ui/dist/types/dom/layers";

declare const emulatorsUi: EmulatorsUi;
const isMobile = Capacitor.isNative || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const keyOptions = Object.keys(emulatorsUi.controls.namedKeyCodes);

export function NavigatorPlayer(props: { dos: DosInstance | null }) {
    const { t, i18n } = useTranslation("navigator");
    const lang = i18n.language;
    const history = useHistory();
    const dos = props.dos;

    const [mobileMode, setMobileMode] = useState<boolean>(isMobile);
    const [overlay, setOverlay] = useState<boolean>(false);
    const [hint, setHint] = useState<JSX.Element | null>(null);
    const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);

    const showOverlay = overlay && hint !== null;

    useEffect(() => {
        if (dos === null) {
            return;
        }

        if (!isMobile) {
            dos.disableMobileControls();
        }

        let cancel = false;
        dos.ciPromise?.then((ci) => ci.config()).then((config) => {
            if (cancel) {
                return;
            }

            const layers = (config as any).layers as LayersType;
            if (layers === undefined) {
                return;
            }

            setHint(renderHintComponent(layers, t));
        });

        return () => {
            cancel = true;
        };
    }, [dos]);

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
    }

    function toggleFullscreen() {
        if (dos === null) {
            return;
        }

        dos.layers.toggleFullscreen();
    }

    function onSave() {
        if (dos === null) {
            return;
        }

        dos.layers.save();
    }

    function toggleKeyboard() {
        if (dos == null) {
            return;
        }

        setKeyboardVisible(dos.layers.toggleKeyboard());
    }

    return <div>
        <Navbar fixedToTop={false}>
            <Navbar.Group align={Alignment.LEFT}>
                <Navbar.Heading>
                    <Button icon={IconNames.ARROW_LEFT} minimal={true}
                          onClick={() => history.replace("/" + lang + "/my")}>{t("games")}</Button>
                </Navbar.Heading>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Navbar.Divider />
                <a href="https://twitter.com/doszone_db" target="_blank" rel="noopener noreferrer" style={{ marginRight: "5px"}} >
                    <img src="/twitter.svg" alt="twitter" width="20px" />
                </a>
                <a href="https://discord.com/invite/hMVYEbG" target="_blank" rel="noopener noreferrer">
                    <img src="/discord.svg" alt="discord" width="24px" />
                </a>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
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
                    minimal={true}
                    onClick={onSave}>
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
