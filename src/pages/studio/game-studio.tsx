import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";
import {
    H1, H2, Classes, FileInput, Intent, Spinner,
    Tree, ITreeNode, Button, AnchorButton, ButtonGroup
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { Emulators } from "emulators";


import { DosConfig } from "emulators/dist/types/dos/bundle/dos-conf";


import { State, StepProps } from "./state";

import { InitFromFile } from "./steps/init-from-file";
import { InitFromUrl } from "./steps/init-from-url";
import { SelectExecutable } from "./steps/select-executable";
import { ConfigureDosbox } from "./steps/configure-dosbox";
import { DownloadArchive } from "./steps/download-archive";


const commonSteps = [
    SelectExecutable,
    ConfigureDosbox,
    DownloadArchive,
];

export function GameStudio() {
    const { t, i18n } = useTranslation("studio");
    const { url } = useParams<{ url?: string }>();
    const [step, setStep] = useState<number>(1);
    const [state, setState] = useState<State>({
        canSkipArchiveCreation: false,
    });

    const props = {
        t,
        lang: i18n.language,
        state,
        nextStep: (state: State) => {
            if (step === 1 && state.config !== undefined) {
                setState({ ...state, canSkipArchiveCreation: true });
                setStep(3);
            } else {
                setState(state);
                setStep(step + 1);
            }
        },
        back: () => {
            setStep(step - 1);
        },
        restart: () => {
            setState({canSkipArchiveCreation: false});
            setStep(1);
        },
    };

    const steps = url === undefined ?
                  [InitFromFile, ...commonSteps] :
                  [InitFromUrl(decodeURIComponent(url)), ...commonSteps];
    const stepComponent = React.createElement(steps[step - 1], props);

    return <div className={Classes.TEXT_LARGE}
                style={{padding: "40px"}}>
        <H1>{t("welcome")}</H1>
        <p>
            {t("description")}&nbsp;
            (<Link to={"/" + i18n.language + "/guide/studio"}>
                {t("read_guide")}
            </Link>)
        </p>

        <div style={{display: "flex", alignItems: "center"}}>
            <H2>{t("step")} {step}/{steps.length}</H2>
            <AnchorButton
                style={{
                    marginLeft: "10px",
                    marginTop: "-20px",
                    visibility: (step > 1 ? "visible" : "hidden")
                }}
                className={Classes.MINIMAL}
                icon={IconNames.CROSS}
                intent={Intent.DANGER}
                onClick={() => props.restart()}></AnchorButton>
        </div>
        <div>
            {stepComponent}
        </div>
        <br/>
        {
            step === 1 ?
            (<div>
                <H2>{t("quick_tour")}</H2>
                <iframe
                    width="560"
                    height="315"
                    style={{maxWidth: "100%"}}
                    src="https://www.youtube.com/embed/KPetnv4atXg"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>
                </iframe>
            </div>) :
            null
        }
    </div>;
}


