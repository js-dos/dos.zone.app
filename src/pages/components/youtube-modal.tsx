import React, { useEffect } from "react";


import { Overlay, Callout } from "@blueprintjs/core";
import { Youtube } from "./youtube";
import { BackButton } from "../../cap-config";

export function YoutubeModal(props: { url?: string, onClose: () => void }) {
    useEffect(() => {
        if (props.url === undefined) {
            return;
        }

        const prevHandler = BackButton.customHandler;
        BackButton.customHandler = () => props.onClose();

        return () => {
            BackButton.customHandler = prevHandler;
        };
    }, [props.url, props.onClose]);

    if (props.url === undefined) {
        return null;
    }

    return <Overlay portalClassName="portal-center" className="overlay-center" isOpen={true} onClose={props.onClose}>
        <div>
            <Callout>
                <Youtube url={props.url} />
            </Callout>
        </div>
    </Overlay>;
}