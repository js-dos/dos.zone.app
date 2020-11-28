import React from "react";

import { useHistory } from "react-router-dom";

import { Navbar, Alignment, Button } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { useTranslation } from "react-i18next";
import { goBack } from "./navigator";


export function NavigatorPlayer() {
    const { i18n } = useTranslation("navigator");
    const lang = i18n.language;
    const history = useHistory();

    return <div>
        <Navbar fixedToTop={false}>
            <Navbar.Group align={Alignment.LEFT}>
                <Navbar.Heading>
                    <Button icon={IconNames.ARROW_LEFT} minimal={true}
                          onClick={() => goBack(history, lang)}>DOS.Zone</Button>
                </Navbar.Heading>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Navbar.Divider />
                <a href="https://twitter.com/doszone_db" target="_blank" rel="noopener noreferrer" style={{ marginRight: "5px"}} >
                    <img src="/twitter.svg" alt="twitter" width="20px" />
                </a>
                <a href="https://discord.com/invite/hMVYEbG" target="_blank" rel="noopener noreferrer">
                    <img src="/discord.svg" alt="discord" width="24px" />
                </a>
            </Navbar.Group>
        </Navbar>
    </div>;
}
