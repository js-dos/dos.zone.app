import React from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { H1, H2, Classes } from "@blueprintjs/core";

import ReactMardown from "react-markdown/with-html";
import { renderers } from "../core/renderers";

export function Landing() {
    const { t, i18n } = useTranslation("landing");
    return <div className={[Classes.RUNNING_TEXT, Classes.TEXT_LARGE].join(" ")}
                style={{padding: "0 40px"}}>
        <ReactMardown renderers={renderers}
                      source={t("header", {lang: i18n.language})}
                      escapeHtml={false}></ReactMardown>
    </div>;
}
