import React, { useEffect, useState } from "react";

import { Spinner } from "@blueprintjs/core";
import { getCachedGameData } from "../../../core/game-query";
import { GET_BUFFER } from "../../../core/xhr/GET";
import { ZipExecutables } from "../../../core/zip-explorer";
import { restoreConfig, StepProps } from "../state";

export function InitFromUrl(url: string) {
    return function InitFromUrlSteps(props: StepProps) {
        const { state } = props;
        const [error, setError] = useState<string>("");

        useEffect(() => {
            if (url === undefined) {
                return;
            }

            let cancel = false;
            GET_BUFFER(url)
                .then(async (data) => {
                    if (cancel) {
                        return;
                    }

                    const zip = new Uint8Array(data);
                    const blob = new Blob([zip]);
                    try {
                        const jsdosZipData = await ZipExecutables(blob);
                        if (cancel) {
                            return;
                        }

                        const gameData = getCachedGameData(url);
                        const slug = gameData?.slug[props.lang] || gameData?.slug.en;
                        props.nextStep({
                            ...state,
                            name: slug,
                            slug,
                            zip,
                            executables: jsdosZipData.executables,
                            config: await restoreConfig(jsdosZipData),
                        });
                    } catch (e) {
                        setError(props.t("zip_error") + e);
                    }
                })
                .catch((e) => {
                    if (cancel) {
                        return;
                    }

                    setError(e);
                });

            return () => {
                cancel = true;
            }
        }, []);

        if (error.length > 0) {
            return <div>
                <p><span style={{color: "#DB3737", display: (error.length === 0 ? "none" : "block") }}>*&nbsp;{error}</span></p>
            </div>;
        }

        return <div>
            {props.t("loading")}
            <div style={{display: "flex", marginTop: "12px"}}><Spinner/></div>
        </div>;
    }
}
