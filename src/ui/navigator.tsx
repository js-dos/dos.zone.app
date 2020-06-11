import React from 'react';

import {
    Link
} from "react-router-dom";

import { Navbar, Alignment, Classes } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { useTranslation } from 'react-i18next';


export function Navigator() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    return <Navbar>
            <Navbar.Group align={Alignment.LEFT}>
                <Navbar.Heading>
                    <Link className={[Classes.BUTTON, Classes.MINIMAL].join(" ")}
                          to="/">DOS Zone</Link>
                </Navbar.Heading>
                <Navbar.Divider />
                <Link className={[Classes.BUTTON, Classes.MINIMAL, Classes.ICON + "-" + IconNames.PLUS].join(" ")}
                      to={"/" + lang + "/studio"}>{t("studio")}</Link>
            </Navbar.Group>
        </Navbar>;
}
