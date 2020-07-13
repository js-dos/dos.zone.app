import React, { useState, FormEvent } from 'react';
import DosBundle from 'emulators/dist/types/dos/bundle/dos-bundle';
import { DosConfigCategory, DosConfigOption, DosConfigValue, DosConfig } from 'emulators/dist/types/dos/bundle/dos-conf';

import {
    H1, H2, H3, Classes, FileInput, Intent, Spinner,
    Tree, ITreeNode, Button, AnchorButton,
    Card,
    Elevation,
    Callout,
    Blockquote,
    Label,
    UL,
    Collapse,
    RadioGroup,
    Radio,
    EditableText,
    NumericInput
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { TFunction } from 'i18next';

export function DosConfigUi(props: { config: DosConfig, t: TFunction }) {
    const config = props.config;
    const t = props.t;
    return <div>
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
            option.value = value + " " + fixed;
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

    if (option.name === "lines") {
        const onValueChange = (newValue: string) => {
            option.value = newValue;
            setValue(newValue);
        }

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
                icon={showDescription ? IconNames.EYE_OPEN : IconNames.EYE_OFF}></Button>
        <br/><br/>
        <Collapse isOpen={showDescription}>
            <Blockquote>{option.description}</Blockquote>
        </Collapse>
    </div>;
}
