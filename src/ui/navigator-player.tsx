import React, { useState } from "react";

import { useHistory } from "react-router-dom";

import { Navbar, Alignment, Button, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { useTranslation } from "react-i18next";
import { goBack } from "./navigator";


export function NavigatorPlayer() {
    const { i18n } = useTranslation("navigator");
    const lang = i18n.language;
    const history = useHistory();
    const [inputVisible, setInputVisible] = useState<boolean>(false);

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
            <Navbar.Group align={Alignment.RIGHT}>
                <div><select className="control-select bp3-select"></select></div>
                <Navbar.Divider />
                <Button minimal={true}
                        intent={ inputVisible ? Intent.PRIMARY : Intent.NONE }
                        icon={IconNames.MANUALLY_ENTERED_DATA}
                        onClick={() => setInputVisible(!inputVisible) }>
                </Button>
                <Button className="control-save" minimal={true}
                        icon={IconNames.FLOPPY_DISK}>
                </Button>
                <Button className="control-fullscreen" minimal={true}
                        icon={IconNames.MAXIMIZE}>
                </Button>
            </Navbar.Group>
        </Navbar>

        <div className="input-control-container" style={{ display: inputVisible ? "flex" : "none"}}>
            <input className="control-input"></input>
            <Button className="control-send" minimal={true}
                    icon={IconNames.SEND_MESSAGE}
                    onClick={() => setInputVisible(false) }>
            </Button>
        </div>
    </div>;
}
