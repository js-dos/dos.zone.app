import React from "react";
import { Link } from "react-router-dom";
import { H1, H2, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

export const renderers = {
    heading: (props: any) => {
        if (props.level === 1 ) {
            return <H1 style={{textAlign: "center"}}>{props.children}</H1>;
        }

        return <H2>{props.children}</H2>
    },
    link: (props: any) => {
        if (props.href.startsWith("https://")) {
            return <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children}
                &nbsp;<Icon icon={IconNames.DOCUMENT_OPEN}></Icon>
            </a>;
        }
        return <Link to={props.href}>{props.children}
            &nbsp;<Icon icon={IconNames.DOCUMENT_OPEN}></Icon>
        </Link>;
    },
    image: (props: any) => {
        return <img src={props.src} alt={props.alt} style={{
            width: "80%",
            maxWidth: "640px",
        }} />
    }
};
