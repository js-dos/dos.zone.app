import React, { useEffect, useState } from "react";
import { DosConfigCategory, DosConfigOption, DosConfigValue, DosConfig } from "emulators/dist/types/dos/bundle/dos-conf";
import { EventMapping } from "emulators-ui/dist/types/controls/nipple";
import { Button as ButtonType, ActionType } from "emulators-ui/dist/types/controls/button";
import { Mapper } from "emulators-ui/dist/types/controls/keyboard";

import { EmulatorsUi } from "emulators-ui";
import { TFunction } from "i18next";

import {
    H3,
    Button,
    Collapse,
    Intent,
    Callout,
    Blockquote,
    RadioGroup,
    Radio,
    EditableText,
    NumericInput,
    HTMLSelect,
    TextArea,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { layers } from "emulators-ui/dist/types/dom/layers";

declare const emulatorsUi: EmulatorsUi;

const namedKeyCodes = emulatorsUi.controls.namedKeyCodes;
const keyOptions = Object.keys(emulatorsUi.controls.namedKeyCodes);

interface LayerType {
    image: string,
    name: string,
    buttons: ButtonType[],
    gestures: EventMapping[],
    mapper: Mapper,
};

type LayersType = {[index: string]: LayerType};

const layersDef: LayersType = {
    "joystick+button": {
        name: "joystick+button",
        image: "layers-joystick-button.jpg",
        buttons: [
            {
                action: "click",
                mapTo: namedKeyCodes["KBD_x"],
                style: ({
                    left: "16px",
                    bottom: "32px",
                } as unknown) as ElementCSSInlineStyle,
            },
        ],
        mapper: {},
        gestures: [
            { joystickId: 0, event: "dir:up", mapTo: namedKeyCodes["KBD_up"], },
            { joystickId: 0, event: "dir:down", mapTo: namedKeyCodes["KBD_down"], },
            { joystickId: 0, event: "dir:left", mapTo: namedKeyCodes["KBD_left"] },
            { joystickId: 0, event: "dir:right", mapTo: namedKeyCodes["KBD_right"] },
        ],
    }
};


const defaultLayer = "joystick+button";

export function Layers(props: {
    config: DosConfig,
    t: TFunction
}) {
    const t = props.t;
    const config = props.config;
    const [layers, setLayers] = useState<LayersType>({
        default: layersDef[defaultLayer],
    });

    const [showDescription, setShowDescription] = useState<boolean>(false);
    const [selectedLayer, setSelectedLayer] = useState<string>("default");
    const names = Object.keys(layers);

    useEffect(() => {
        (config as any).layers = layers;
    }, []);

    return (<Callout style={ { position: "relative" } }>
        <H3>{t("touch_controls")}</H3>
        <Button intent={showDescription ? Intent.PRIMARY : Intent.NONE}
                minimal={true}
                onClick={() => setShowDescription(!showDescription) }
                icon={showDescription ? IconNames.EYE_OPEN : IconNames.EYE_OFF }
                style={ { position: "absolute", top: "10px", right: "12px" } }>
        </Button>
        <br/>
        {names.map((name, index) => {
            return <React.Fragment key={name}>
                <Collapse isOpen={ name === selectedLayer }>
                    <Layer t={t} layer={layers[name]} />
                </Collapse>
            </React.Fragment>
        })}
    </Callout>);
}

function Layer(props: {
    layer: LayerType,
    t: TFunction,
}) {
    const [version, setVersion] = useState<number>(0);
    const t = props.t;
    const layer = props.layer;
    const buttons = layer.buttons;
    const gestures = layer.gestures;
    const mapper = layer.mapper;

    function eventToKeyCode(event: any) {
        const key = event.currentTarget.value;
        return emulatorsUi.controls.namedKeyCodes[key];
    }

    function symbolOfButton(button: ButtonType) {
        if (button.symbol !== undefined) {
            return button.symbol;
        }

        return getKeyCodeName(button.mapTo).substr(4, 7).toUpperCase();
    }

    function onButtonMapToChanged(event: any, button: ButtonType) {
        button.mapTo = eventToKeyCode(event);
        setVersion(version + 1);
    }

    function onButtonSymbolChanged(event: any, button: ButtonType) {
        const symbol = event.currentTarget.value;
        button.symbol = symbol.substr(symbol.length - 1, symbol.length).toUpperCase();
        setVersion(version + 1);
    }

    function onGestureMapToChanged(event: any, gesture: EventMapping) {
        gesture.mapTo = eventToKeyCode(event);
        setVersion(version + 1);
    }

    function onMapperChanged(keyCode: number,
                             newKeyCode: number,
                             mapTo: number) {
        delete mapper[keyCode];
        mapper[newKeyCode] = mapTo;
        setVersion(version + 1);
    }

    function onAddMapping() {
        mapper[0] = 0;
        setVersion(version + 1);
    }

    function onRemoveMapping(keyCode: number) {
        delete mapper[keyCode];
        setVersion(version + 1);
    }


    return <div>
        {t("thumb_description")}&nbsp;&nbsp;
        <div>
            <img className="layout-thumb" src={ "/layers/" + layer.image } />
        </div>
        {t("buttons_description")}&nbsp;&nbsp;
        {buttons.map((button, index) => {
            return <React.Fragment key={index}>
                <div className="touch-options">
                    <p>{t("button_symbol")}&nbsp;&nbsp;</p>
                    <input
                        className="bp3-input"
                        style={{width: "6ch"}}
                        value={symbolOfButton(button)}
                        onChange={(e) => onButtonSymbolChanged(e, button)}
                    />
                    <p>&nbsp;&nbsp;{t("key")}&nbsp;&nbsp;</p>
                    <HTMLSelect minimal={false}
                                options={keyOptions}
                                onChange={(e) => onButtonMapToChanged(e, button)}
                                value={getKeyCodeName(button.mapTo)} />&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
            </React.Fragment>
        })}
        {t("touch_description")}&nbsp;&nbsp;
        {gestures.map((gesture, index) => {
            return <React.Fragment key={index}>
            <div className="touch-options">
                <p>{t("finger")}&nbsp;&nbsp;<code className="bp3-code fake-input"style={{width: "3ch"}}>{gesture.joystickId}</code>&nbsp;&nbsp;</p>
                <p>{t("gesture")}&nbsp;&nbsp;<code className="bp3-code fake-input" style={{width: "11ch"}}>{gesture.event}</code>&nbsp;&nbsp;</p>
                <p>{t("key")}</p>&nbsp;&nbsp;
                <HTMLSelect minimal={false}
                            options={keyOptions}
                            onChange={(e) => onGestureMapToChanged(e, gesture)}
                            disabled={gesture.event === "end:release"}
                            value={getKeyCodeName(gesture.mapTo)} />&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            </React.Fragment>
        })}
        {t("mapper_description")}&nbsp;&nbsp;
        {Object.keys(mapper).sort().map((key, index) => {
            const keyCode = Number.parseInt(key, 10);
            const mapTo = mapper[keyCode];
            return <React.Fragment key={key}>
                <div className="touch-options">
                    <p>{t("key")}&nbsp;&nbsp;</p>
                    <HTMLSelect minimal={false}
                                options={keyOptions}
                                onChange={(e) => onMapperChanged(keyCode, eventToKeyCode(e), mapTo)}
                                value={getKeyCodeName(keyCode)} />&nbsp;&nbsp;&nbsp;&nbsp;
            <p>&nbsp;&nbsp;{t("key")}&nbsp;&nbsp;</p>
            <HTMLSelect minimal={false}
                        options={keyOptions}
                        onChange={(e) => onMapperChanged(keyCode, keyCode, eventToKeyCode(e))}
                        value={getKeyCodeName(mapTo)} />&nbsp;&nbsp;&nbsp;&nbsp;
            <Button icon={IconNames.TRASH} minimal={true} onClick={() => onRemoveMapping(keyCode)} style={{alignSelf: "flex-start"}}></Button>
                </div>
            </React.Fragment>
        })}
        <div className="touch-options">
            <Button onClick={onAddMapping}>{t("add")}</Button>
        </div>
    </div>;
}

function getKeyCodeName(keyCode: number) {
    for (const next of keyOptions) {
        if (emulatorsUi.controls.namedKeyCodes[next] === keyCode) {
            return next;
        }
    }

    return "KBD_none";
}
