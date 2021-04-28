import React, { useEffect, useState } from "react";
import {
    H1, H2, Classes, FileInput, Intent, Spinner,
    Tree, ITreeNode, Button, AnchorButton, ButtonGroup
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Emulators } from "emulators";
import { DosConfigUi } from "./dos-config-ui";
import { DosConfig } from "emulators/dist/types/dos/bundle/dos-conf";
import { StepProps } from "../state";

declare const emulators: Emulators;

export function ConfigureDosbox(props: StepProps) {
    const {t, state, nextStep} = props;
    const [error, _setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [config, setConfig] = useState<DosConfig | null>(() => {
        if (state.config) {
            return state.config;
        }

        setTimeout(() => {
            emulators.dosBundle()
                     .then((bundle) => {
                         bundle.autoexec(state.executable + "");
                         state.config = bundle.config;
                         setConfig(state.config);
                     })
                     .catch(() => setError(new Error("Can't crate dos bundle")));
        }, 1);
        return null;
    });

    const setError = (error: Error) => {
        _setError(error.message + "\n\n" + JSON.stringify(error.stack));
    };

    const createArchive = async () => {
        setLoading(true);
        const dosBundle = await emulators.dosBundle();
        dosBundle.config = config as DosConfig;

        const blob = new Blob([state.zip as Uint8Array]);
        const url = URL.createObjectURL(blob);

        dosBundle
            .extract(url);

        const archive = await dosBundle.toUint8Array(true);
        URL.revokeObjectURL(url);

        nextStep({
            ...state,
            bundle: archive,
        });
    };

    const startArchive = async () => {
        nextStep({
            ...state,
            bundle: state.zip as Uint8Array,
        })
    };

    if (loading || config === null) {
        return <div>
            <Spinner/>
        </div>;
    }


    return <div>
        {error}
        <DosConfigUi config={config as DosConfig} t={t}></DosConfigUi>
        <ButtonGroup>
            <Button onClick={() => createArchive().catch(setError)} intent={Intent.PRIMARY}>{t("create")}</Button>
            { state.canSkipArchiveCreation ? <Button onClick={() => startArchive()}>{t("skip_create")}</Button> : null }
        </ButtonGroup>
    </div>;
}
