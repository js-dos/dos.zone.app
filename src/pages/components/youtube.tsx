import React from "react";

export function Youtube(props: { url: string }) {
    return <iframe
        title="youtube"
        width="560"
        height="315"
        style={{ maxWidth: "100%" }}
        src={props.url}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen>
    </iframe>
}