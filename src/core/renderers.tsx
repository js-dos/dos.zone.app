import React from 'react';
import { Link } from "react-router-dom";
import { H1, H2, Classes } from "@blueprintjs/core";

export const renderers = {
    heading: (props: any) => {
        if (props.level === 1 ) {
            return <H1 style={{textAlign: "center"}}>{props.children}</H1>;
        }

        return <H2>{props.children}</H2>
    },
    link: (props: any) => {
        if (props.href.startsWith("https://")) {
            return <a href={props.href} target="_blank">{props.children}</a>;
        }
        return <Link to={props.href}>{props.children}</Link>;
    },
    image: (props: any) => {
        return <img src={props.src} alt={props.alt} style={{
            width: "80%",
            maxWidth: "640px",
        }} />
    }
};
