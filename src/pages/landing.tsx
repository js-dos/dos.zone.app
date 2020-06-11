import React from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { H1, H2, Classes } from "@blueprintjs/core";
import ReactMardown from "react-markdown/with-html";

export function Landing() {
    const { t, i18n } = useTranslation("landing");
    return <div className={[Classes.RUNNING_TEXT, Classes.TEXT_LARGE].join(" ")}
                style={{padding: "0 40px"}}>
        <ReactMardown renderers={{
            heading: (props: any) => {
                if (props.level === 1 ) {
                    return <H1 style={{textAlign: "center"}}>{props.children}</H1>;
                }

                return <H2>{props.children}</H2>
            },
            link: (props: any) => {
                if (props.href.startsWith("https://")) {
                    return <a href={props.href}>{props.children}</a>;
                }
                return <Link to={props.href}>{props.children}</Link>;
            },
        }} source={t("header", {lang: i18n.language})} escapeHtml={false}></ReactMardown>
    </div>;
}
