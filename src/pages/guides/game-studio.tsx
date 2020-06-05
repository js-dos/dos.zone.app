import React from "react";
import { useTranslation } from "react-i18next";
import { Classes } from "@blueprintjs/core";

import ReactMardown from "react-markdown/with-html";
import { renderers } from "../../core/renderers";

export function GameStudioGuide() {
    const { t, i18n } = useTranslation("guides");
    return <div className={[Classes.RUNNING_TEXT, Classes.TEXT_LARGE].join(" ")}
                style={{padding: "0 40px"}}>
        <ReactMardown
            renderers={renderers}
            source={t("gameStudio", {lang: i18n.language})}
            escapeHtml={false}>
        </ReactMardown>
    </div>;
}
