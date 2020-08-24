import React, { useState, FormEvent } from 'react';
import { DosConfigCategory, DosConfigOption, DosConfigValue, DosConfig } from 'emulators/dist/types/dos/bundle/dos-conf';
import { EventMapping } from "emulators-ui/dist/types/controls/nipple-arrows";
import { EmulatorsUi } from "emulators-ui";

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
    HTMLSelect
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { TFunction } from 'i18next';

declare const emulatorsUi: EmulatorsUi;

const namedKeyCodes = emulatorsUi.controls.namedKeyCodes;
const keyOptions = Object.keys(emulatorsUi.controls.namedKeyCodes);

const defaultMapping: EventMapping[] = [
    { joystickId: 0, event: "dir:up", mapTo: namedKeyCodes.KBD_up },
    { joystickId: 0, event: "dir:down", mapTo: namedKeyCodes.KBD_down },
    { joystickId: 0, event: "dir:left", mapTo: namedKeyCodes.KBD_left },
    { joystickId: 0, event: "dir:right", mapTo: namedKeyCodes.KBD_right },
];

export function DosConfigUi(props: { config: DosConfig, t: TFunction }) {
    const config = props.config;
    const t = props.t;
    return <div>
        <br/>
        <TouchControls config={config}
                       t={t}/>
        <br/>
        <Category category={config.dosbox}
                  localizedDescription={t("dosbox_config")}
                  t={t}></Category>
        <br/><br/>
        <Category category={config.cpu}
                  localizedDescription={t("cpu_config")}
                  t={t}></Category>
        <br/><br/>
        <Category category={config.output}
                  localizedDescription={t("output_config")}
                  t={t}></Category>
        <br/><br/>
        <Category category={config.mixer}
                  localizedDescription={t("mixer_config")}
                  t={t}></Category>
        <br/><br/>
        <Category category={config.autoexec}
                  localizedDescription={t("autoexec_config")}
                  t={t}></Category>
        <br/><br/>
    </div>;
}

function TouchControls(props: {
    config: DosConfig,
    t: TFunction
}) {
    const t = props.t;
    const config = props.config;

    (config as any).gestures = (config as any).gestures || defaultMapping;
    const mapping: EventMapping[] = (config as any).gestures;
    const [version, setVersion] = useState<number>(0);
    const [showDescription, setShowDescription] = useState<boolean>(false);

    function onJoystickIdChanged(event: any, option: EventMapping) {
        option.joystickId = Number.parseInt(event.currentTarget.value, 10) as any;
        setVersion(version + 1);
    }

    function onGestureChanged(event: any, option: EventMapping) {
        option.event = event.currentTarget.value;
        setVersion(version + 1);
    }

    function onKeyNameChanged(event: any, option: EventMapping) {
        const key = event.currentTarget.value;
        option.mapTo = emulatorsUi.controls.namedKeyCodes[key];
        setVersion(version + 1);
    }

    function onAdd() {
        mapping.push({
            joystickId: 1,
            event: "tap",
            mapTo: emulatorsUi.controls.namedKeyCodes["KBD_space"],
        });
        setVersion(version + 1);
    }

    function onDelete(option: EventMapping) {
        const index = mapping.indexOf(option);
        if (index >= 0) {
            mapping.splice(index, 1);
        }
        setVersion(version + 1);
    }

    function getKeyName(keyCode: number) {
        for (const next of keyOptions) {
            if (emulatorsUi.controls.namedKeyCodes[next] === keyCode) {
                return next;
            }
        }

        return "KBD_up";
    }

    return <Callout style={ { position: "relative" } }>
        <H3>{t("touch_controls")}</H3>
        {t("touch_description")}&nbsp;&nbsp;
        <Button intent={showDescription ? Intent.PRIMARY : Intent.NONE}
                minimal={true}
                onClick={() => setShowDescription(!showDescription) }
                icon={showDescription ? IconNames.EYE_OPEN : IconNames.EYE_OFF }
                style={ { position: "absolute", top: "10px", right: "12px" } }>
        </Button>
        <br/>
        <Collapse isOpen={showDescription}>
<h3>dir gesture</h3>
When a direction is reached after the threshold.
Direction are split with a 45° angle.
<pre>
//     \  UP /<br/>
//      \   /<br/>
// LEFT       RIGHT<br/>
//      /   \<br/>
//     /DOWN \<br/>
</pre>
<h3>plain gesture</h3>
When a plain direction is reached after the threshold.
Plain directions are split with a 90° angle.
<pre>
//       UP               |<br/>
//     ------        LEFT | RIGHT<br/>
//      DOWN              |<br/>
</pre>
<h3>end:release</h3>
Syntethic gesture, means that key pressed by (dir or plain) should be
released on end of gesture. By default it will be pressed until new gesture is
detected.
<h3>tap gesture</h3>
When user tap on the screen by finger.
        </Collapse>
        <br/>
        {mapping.map((option, index) => {
            return <React.Fragment key={index}>
            <div className="touch-options">
                <p>{t("finger")}</p>&nbsp;&nbsp;
                <HTMLSelect minimal={false}
                            options={["0", "1"]}
                            onChange={(e) => onJoystickIdChanged(e, option)}
                            value={option.joystickId} />&nbsp;&nbsp;&nbsp;&nbsp;
                <p>{t("gesture")}</p>&nbsp;&nbsp;
                <HTMLSelect minimal={false}
                            options={["dir:up", "dir:down", "dir:left", "dir:right",
                                      "plain:up", "plain:down", "plain:left", "plain:right",
                                      "end:release",
                                      "tap"]}
                            onChange={(e) => onGestureChanged(e, option)}
                            value={option.event} />&nbsp;&nbsp;&nbsp;&nbsp;
                <p>{t("key")}</p>&nbsp;&nbsp;
                <HTMLSelect minimal={false}
                            options={keyOptions}
                            onChange={(e) => onKeyNameChanged(e, option)}
                            disabled={option.event === "end:release"}
                            value={getKeyName(option.mapTo)} />&nbsp;&nbsp;&nbsp;&nbsp;
                <Button icon={IconNames.CROSS}
                        minimal={true}
                        intent={Intent.DANGER}
                        onClick={() => onDelete(option)} />
            </div>
            </React.Fragment>
        })}
        <br/>
        <Button icon={IconNames.PLUS}
                intent={Intent.PRIMARY}
                onClick={onAdd}>{t("add")}</Button>
    </Callout>;
}

function Category(props: { category: DosConfigCategory,
                           localizedDescription: string,
                           t: TFunction }) {
    const category = props.category;
    const [showDescription, setShowDescription] = useState<boolean>(false);

    const options = []
    for (const option in category.options) {
        options.push(<RenderOption option={category.options[option]} t={props.t} />);
    }

    return <Callout style={ { position: "relative" } }>
        <H3>{category.name.toUpperCase()}</H3>
        {props.localizedDescription}&nbsp;&nbsp;
        <Button intent={showDescription ? Intent.PRIMARY : Intent.NONE}
                minimal={true}
                onClick={() => setShowDescription(!showDescription) }
                icon={showDescription ? IconNames.EYE_OPEN : IconNames.EYE_OFF }
                style={ { position: "absolute", top: "10px", right: "12px" } }>
        </Button>
        <br/><br/>
        <Collapse isOpen={showDescription}>
            <Blockquote>{category.description}</Blockquote>
        </Collapse>
        {options.map((option, index) => {
            return <React.Fragment key={index}>
                {option}
            </React.Fragment>
        })}
    </Callout>;
}

function RenderOption(props: { option: DosConfigOption,
                               t: TFunction }) {
    const t = props.t;
    const option = props.option;
    const [showDescription, setShowDescription] = useState<boolean>(false);
    const [value, setValue] = useState<DosConfigValue>(() => {
        if ((option.value + "").startsWith("fixed")) {
            return "fixed";
        }

        return option.value;
    });
    const [fixed, setFixed] = useState<number>(() => {
        if ((option.value + "").startsWith("fixed")) {
            return Number.parseInt((option.value + "").substr("fixed ".length), 10);
        }

        return 1000;
    });

    if (option.allowedValues.length > 0) {
        const onAllowedValueChange = (e: FormEvent<HTMLInputElement>) => {
            const newValue = e.currentTarget.value;
            setValue(newValue);
            option.value = newValue === "fixed" ? newValue + " " + fixed : newValue;
        };

        const onFixedChange = (newFixed: number) => {
            setFixed(newFixed);
            option.value = value + " " + newFixed;
        }

        return <div style={ { position: "relative" } }>
            <RadioGroup label={option.name}
                        inline={true}
                        onChange={onAllowedValueChange}
                        selectedValue={value + ""}>
                {option.allowedValues.map((value, index) => {
                    return <Radio key={index} label={t(value + "")} value={value + ""}>
                        </Radio>;
                })}
            </RadioGroup>
            <Button intent={showDescription ? Intent.PRIMARY : Intent.NONE}
                    minimal={true}
                    onClick={() => setShowDescription(!showDescription) }
                    icon={showDescription ? IconNames.EYE_OPEN : IconNames.EYE_OFF}
                    style={ { position: "absolute", right: 0, top: 0 } }>
            </Button>
            {
                value !== "fixed" ? <div></div> :
                <NumericInput
                    min={100}
                    value={fixed}
                    onValueChange={onFixedChange}
                    stepSize={100}
                    majorStepSize={500}>
                </NumericInput>
            }
            <Collapse isOpen={showDescription}>
                <Blockquote>{option.description}</Blockquote>
            </Collapse>
        </div>;
    }

    const onValueChange = (newValue: string) => {
        option.value = newValue;
        setValue(newValue);
    }

    if (option.name === "lines") {
        return <div>
          <Blockquote>
            <EditableText
              multiline={true}
              value={value + ""}
              onChange={onValueChange}/>
          </Blockquote>
        </div>;
    }

    return <div>
        <strong>{option.name}</strong>
        <Button intent={showDescription ? Intent.PRIMARY : Intent.NONE}
                minimal={true}
                onClick={() => setShowDescription(!showDescription) }
                style={ { position: "absolute", right: "12px" } }
                icon={showDescription ? IconNames.EYE_OPEN : IconNames.EYE_OFF}></Button>
        <br/><br/>
        <Collapse isOpen={showDescription}>
            <Blockquote>{option.description}</Blockquote>
        </Collapse>
        <Blockquote>
            <EditableText multiline={false}
                          value={value + ""}
                          onChange={onValueChange}>
            </EditableText>
        </Blockquote>
    </div>;
}
