import React from "react";


import { Overlay, Callout } from "@blueprintjs/core";
import { Youtube } from "./youtube";

export function YoutubeModal(props: { url?: string, onClose: () => void }) {
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