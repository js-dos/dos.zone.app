import React, { useEffect, useState } from "react";
import {
    H1, H2, Classes, FileInput, Intent, Spinner,
    Tree, ITreeNode, Button, AnchorButton, ButtonGroup
} from "@blueprintjs/core";
import { Emulators } from "emulators";
import { DosConfigUi } from "./dos-config-ui";
import { DosConfig } from "emulators/dist/types/dos/bundle/dos-conf";
import { StepProps } from "../state";
import { createArchive as createZipArchive } from "./create-archive";

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
        const archive = await createZipArchive(config as DosConfig, state.zip as Uint8Array);

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
        <br/>
        <div className="configure-dosbox-actions">
            <Button onClick={() => createArchive().catch(setError)} intent={Intent.PRIMARY}>{t("create")}</Button>
            { state.canSkipArchiveCreation ? <Button onClick={() => startArchive()}>{t("skip_create")}</Button> : null }
        </div>
        <br/>
        <DosConfigUi config={config as DosConfig} t={t}></DosConfigUi>
    </div>;
}
