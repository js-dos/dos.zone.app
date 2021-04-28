import React, { useEffect, useState } from "react";
import { DosConfig } from "emulators/dist/types/dos/bundle/dos-conf";
import { EventMapping } from "emulators-ui/dist/types/controls/nipple";
import { Button as ButtonType } from "emulators-ui/dist/types/controls/button";
import { Mapper } from "emulators-ui/dist/types/controls/keyboard";

import { EmulatorsUi } from "emulators-ui";
import { TFunction } from "i18next";

import {
    H3,
    Button,
    Collapse,
    Callout,
    HTMLSelect,
    Checkbox,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

declare const emulatorsUi: EmulatorsUi;

const namedKeyCodes = emulatorsUi.controls.namedKeyCodes;
const keyOptions = Object.keys(emulatorsUi.controls.namedKeyCodes);
const buttonsLayout = (() => {
    const buttons: ButtonType[] = [];
    const addButtonsGroup = (buttons: ButtonType[],
                             prop1: "left" | "right",
                             prop2: "top" | "bottom",
                             index: number) => {
        for (let i = 0; i < 4; ++i) {
            const button: ButtonType = {
                action: "hold",
                mapTo: 0 /*KBD_none*/,
                symbol: (index + i) + "",
                position: {},
            };

            button.position[prop1] = Math.floor(i / 2) + 1 as any;
            button.position[prop2] = i % 2 + 1 as any;

            buttons.push(button);
        }
    };

    addButtonsGroup(buttons, "left", "bottom", 1);
    addButtonsGroup(buttons, "right", "bottom", 5);
    addButtonsGroup(buttons, "left", "top", 9);
    addButtonsGroup(buttons, "right", "top", 13);

    return buttons;
})();

export interface LayerType {
    buttons: ButtonType[],
    gestures: EventMapping[],
    mapper: Mapper,
};

export type LayersType = {[index: string]: LayerType};

function emptyLayer(): LayerType {
    return {
        buttons: [],
        gestures: [],
        mapper: {},
    }
}

export interface DosConfigWithLayers extends DosConfig {
    layers?: LayersType,
};

export function Layers(props: {
    config: DosConfigWithLayers,
    t: TFunction
}) {
    const t = props.t;
    const config = props.config;
    const [layers, setLayers] = useState<LayersType>(() => {
        if (config.layers !== undefined) {
            return config.layers;
        }

        return {
            default: emptyLayer(),
        }
    });

    const [selectedLayer, setSelectedLayer] = useState<string>("default");
    const [version, setVersion] = useState<number>(0);
    const names = Object.keys(layers);

    useEffect(() => {
        (config as any).layers = layers;
    }, []);

    function addLayer() {
        layers["newLayer." + version] = emptyLayer();
        setVersion(version + 1);
    }

    function renameLayer(e: any, name: string) {
        const newName = e.currentTarget.value;
        if (newName.length === 0) {
            return;
        }
        layers[newName] = layers[name];
        delete layers[name];
        if (selectedLayer === name) {
            setSelectedLayer(newName);
        } else {
            setVersion(version + 1);
        }
    }

    function removeLayer(name: string) {
        delete layers[name];
        setVersion(version + 1);
    }

    return (<Callout style={ { position: "relative" } }>
        <H3>{t("touch_controls")}</H3>
        <Button
                minimal={true}
                onClick={addLayer}
                icon={IconNames.ADD}
                style={ { position: "absolute", top: "10px", right: "12px" } }>
        </Button>
        <br/>
        {names.map((name, index) => {
            const selected = name === selectedLayer;
            return <React.Fragment key={index}>
                <div className="layer-container">
                    <Button minimal={true} icon={selected ? IconNames.CHEVRON_DOWN : IconNames.CHEVRON_RIGHT} onClick={() => setSelectedLayer(selected ? "" : name) } />{t("layer")}: &nbsp;&nbsp;
                    { selected ? <input className="bp3-input" value={name} onChange={(e) => renameLayer(e, name)} /> : name }
                    <Button minimal={true} icon={IconNames.TRASH} onClick={() => removeLayer(name)} />
                    <Collapse className="layer-collapse" isOpen={ name === selectedLayer }>
                        <Layer t={t} layer={layers[name]} />
                    </Collapse>
                </div>
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

    layer.buttons = layer.buttons || [];
    layer.gestures = layer.gestures || [];
    layer.mapper = layer.mapper || {};

    const buttons = layer.buttons;
    const gestures = layer.gestures;
    const mapper = layer.mapper;

    function eventToKeyCode(event: any) {
        const key = event.currentTarget.value;
        return emulatorsUi.controls.namedKeyCodes[key];
    }

    function onAddMapping() {
        mapper[0] = 0;
        setVersion(version + 1);
    }

    function onRemoveMapping(keyCode: number) {
        delete mapper[keyCode];
        setVersion(version + 1);
    }

    function onMapperChanged(keyCode: number,
                             newKeyCode: number,
                             mapTo: number) {
        delete mapper[keyCode];
        mapper[newKeyCode] = mapTo;
        setVersion(version + 1);
    }

    function onAddGestures() {
        gestures.length = 0;
        gestures.push({ joystickId: 0, event: "dir:up", mapTo: namedKeyCodes.KBD_up });
        gestures.push({ joystickId: 0, event: "dir:down", mapTo: namedKeyCodes.KBD_down });
        gestures.push({ joystickId: 0, event: "dir:left", mapTo: namedKeyCodes.KBD_left });
        gestures.push({ joystickId: 0, event: "dir:right", mapTo: namedKeyCodes.KBD_right });
        gestures.push({ joystickId: 0, event: "tap", mapTo: 0 });
        gestures.push({ joystickId: 0, event: "end:release", mapTo: 0 });
        setVersion(version + 1);
    }

    function onGestureMapToChanged(event: any, gesture: EventMapping) {
        gesture.mapTo = eventToKeyCode(event);
        setVersion(version + 1);
    }

    function onRemoveGestures() {
        gestures.length = 0;
        setVersion(version + 1);
    }

    function onGestureChangeReleaseOnEnd(event: any, finger: 0 | 1) {
        const enabled = event.currentTarget.checked;
        if (enabled) {
            gestures.push({
                joystickId: finger,
                mapTo: 0,
                event: "end:release",
            });
        } else {
            const index = gestures.findIndex((g) => g.joystickId === finger && g.event === "end:release");
            if (index >= 0) {
                gestures.splice(index, 1);
            }
        }
        setVersion(version + 1);
    }

    function onAddButtons() {
        buttons.length = 0;
        for (const next of buttonsLayout) {
            buttons.push({...next});
        }
        setVersion(version + 1);
    }

    function symbolOfButton(button: ButtonType) {
        if (button.symbol !== undefined) {
            return button.symbol;
        }

        return getKeyCodeName(button.mapTo).substr(4, 2).toUpperCase();
    }

    function onButtonActionChanged(event: any, button: ButtonType) {
        const action = event.currentTarget.value;
        button.action = action;
        setVersion(version + 1);
    }

    function onButtonSymbolChanged(event: any, button: ButtonType) {
        const symbol = event.currentTarget.value;
        button.symbol = symbol;
        setVersion(version + 1);
    }

    function onButtonMapToChanged(event: any, button: ButtonType) {
        delete button.symbol;
        button.mapTo = eventToKeyCode(event);
        button.symbol = symbolOfButton(button);
        setVersion(version + 1);
    }

    function onRemoveButtons() {
        buttons.length = 0;
        setVersion(version + 1);
    }

    let buttonsComponent;
    if (buttons.length === 0) {
        buttonsComponent = (<div>
            {t("buttons")}&nbsp;&nbsp;

            <div className="touch-options">
                <Button onClick={onAddButtons}>{t("add")}</Button>
            </div>
        </div>);
    } else {
        buttonsComponent = (<div>
            {t("buttons_description")}&nbsp;&nbsp;
            <Button icon={IconNames.TRASH} minimal={true} onClick={() => onRemoveButtons()} style={{alignSelf: "flex-start"}}></Button>
            <br/>
            <div className="touch-options" style={{flexDirection: "column"}}>
                {t("buttons_thumb")}&nbsp;&nbsp;
                <div>
                    <img className="layout-thumb" src={ "/layers/all-buttons.jpg" } />
                </div>
            </div>
            <br/>
            {buttons.map((button, index) => {
                if (index == 12) {
                    // special button
                    return <React.Fragment key={index}></React.Fragment>;
                }
                return <React.Fragment key={index}>
                    <div className="touch-options">
                        <p><strong style={{width: "4ch", display: "inline-block"}}>{index + 1}:</strong> {t("button_symbol")}&nbsp;&nbsp;</p>
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
                        <p>&nbsp;&nbsp;{t("action")}&nbsp;&nbsp;</p>
                        <HTMLSelect minimal={false}
                                    options={["click", "hold"]}
                                    onChange={(e) => onButtonActionChanged(e, button)}
                                    value={button.action} />&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                </React.Fragment>
            })}
        </div>);
    }

    let gesturesComponent;
    if (gestures.length === 0) {
        gesturesComponent = (<div>
            {t("gestures")}&nbsp;&nbsp;
            <div className="touch-options">
                <Button onClick={onAddGestures}>{t("add")}</Button>
            </div>
        </div>);
    } else {
        const releaseOnEnd: {[finger: number]: boolean} = {};
        for (const next of gestures) {
            releaseOnEnd[next.joystickId] = releaseOnEnd[next.joystickId] || next.event === "end:release";
        }
        gesturesComponent = (<div>
            {t("touch_description")}&nbsp;&nbsp;
            <Button icon={IconNames.TRASH} minimal={true} onClick={() => onRemoveGestures()} style={{alignSelf: "flex-start"}}></Button>
            {gestures.filter((g) => g.event !== "end:release").map((gesture, index) => {
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
            {Object.keys(releaseOnEnd).sort().map((finger, index) => {
                const id  = Number.parseInt(finger, 10);
                return <React.Fragment key={"finger-" + id}>
                    <div className="touch-options">
                        <Checkbox checked={releaseOnEnd[id]} onChange={(e) => onGestureChangeReleaseOnEnd(e, id as any)}>
                            {t("finger")}&nbsp;&nbsp;<code className="bp3-code fake-input"style={{width: "3ch"}}>{finger}</code>&nbsp;&nbsp;
                            {t("release_on_end")}
                        </Checkbox>
                    </div>
                </React.Fragment>
            })}
        </div>);
    }

    const mapperComponent = (<div>
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
    </div>);

    return <div>
        {buttonsComponent}
        <br/>
        {gesturesComponent}
        <br/>
        {mapperComponent}
        <br/>
    </div>;
}

function getKeyCodeName(keyCode: number | string) {
    if (typeof keyCode === "number") {
        return getKeyCodeNameForCode(keyCode);
    }

    return keyCode;
}

function getKeyCodeNameForCode(keyCode: number) {
    for (const next of keyOptions) {
        if (emulatorsUi.controls.namedKeyCodes[next] === keyCode) {
            return next;
        }
    }

    return "KBD_none";
}
