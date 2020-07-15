import React from 'react';

import { Link } from "react-router-dom";

import { Navbar, Alignment, Classes } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { useTranslation } from 'react-i18next';


export function Navigator() {
    const { t, i18n } = useTranslation("navigator");
    const lang = i18n.language;

    return <Navbar>
            <Navbar.Group align={Alignment.LEFT}>
                <Navbar.Heading>
                    <Link className={[Classes.BUTTON, Classes.MINIMAL].join(" ")}
                          to="/">DOS.Zone</Link>
                </Navbar.Heading>
                <Navbar.Divider />
                <Link className={[Classes.BUTTON, Classes.MINIMAL, Classes.ICON + "-" + IconNames.PLUS].join(" ")}
                      to={"/" + lang + "/studio"}>{t("studio")}</Link>
                <Link className={[Classes.BUTTON, Classes.MINIMAL, Classes.ICON + "-" + IconNames.DATABASE].join(" ")}
                      to={"/" + lang + "/database"}>{t("database")}</Link>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Navbar.Divider />
                <a href="https://twitter.com/doszone_db" target="_blank" style={{ marginRight: "5px"}} >
                    <img src="/twitter.svg" width="20px" />
                </a>
                <a href="https://discord.com/invite/hMVYEbG" target="_blank">
                    <img src="/discord.svg" width="24px" />
                </a>
            </Navbar.Group>
        </Navbar>;
}
