import React from "react";

import { Link } from "react-router-dom";

import {
    Navbar,
    Alignment,
    Classes,
    Button,
} from "@blueprintjs/core";

import { IconNames } from "@blueprintjs/icons";
import { useTranslation } from "react-i18next";

import { LoginButton } from "./login-button";
import { User } from "../core/auth";
import { openTalks } from "../core/browser-tab";

export function Navigator(props: {
    user: User | null,
    resetUser: () => void,
    showTalksLink?: boolean,
}) {
    const { t, i18n } = useTranslation("navigator");
    const lang = i18n.language;
    const showTalksLink = props.showTalksLink || false;

    return <Navbar fixedToTop={false}>
            <Navbar.Group align={Alignment.LEFT}>
                <Navbar.Heading>
                    { showTalksLink === false ?
                      <Link className={[Classes.BUTTON, Classes.MINIMAL].join(" ")}
                         to="/">DOS.Zone</Link> :
                      <Button minimal={true} onClick={() => openTalks(i18n.language)}>Talks</Button>
                    }
                </Navbar.Heading>
                <Navbar.Divider />
                <Link className={[Classes.BUTTON, Classes.MINIMAL, Classes.ICON + "-" + IconNames.PLUS].join(" ")}
                      to={"/" + lang + "/studio"}>{t("studio")}</Link>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Navbar.Divider />
                <a href="https://twitter.com/intent/user?screen_name=doszone_db" target="_blank" rel="noopener noreferrer" style={{ marginRight: "5px"}} >
                    <img src="/twitter.svg" alt="twitter" width="20px" />
                </a>
                <a href="https://discord.com/invite/hMVYEbG" target="_blank" rel="noopener noreferrer">
                    <img src="/discord.svg" alt="discord" width="24px" />
                </a>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <LoginButton {...props} />
            </Navbar.Group>
        </Navbar>;
}
