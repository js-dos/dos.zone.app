import React, { useState } from "react";

import { Link } from "react-router-dom";

import {
    Classes,
    Button,
    Intent,
    Popover,
    Tooltip,
    Position,
    Spinner,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { useTranslation } from "react-i18next";

import ReactMardown from "react-markdown/with-html";
import { renderers } from "../core/renderers";

import { requestLogin, requestLogout, User } from "../core/auth";

export function LoginButton(props: { user: User | null }) {
    const { t, i18n } = useTranslation("login");
    const lang = i18n.language;
    const [busy, setBusy] = useState<boolean>(false);

    if (busy) {
        return <Spinner size={16} />;
    }

    if (props.user !== null) {
        const controls = <div>
            <Link className={[Classes.BUTTON, Classes.MINIMAL, Classes.ICON + "-" + IconNames.COG].join(" ")}
                  to={"/" + lang + "/profile"}></Link>
            <Button icon={IconNames.LOG_OUT} minimal={true} onClick={requestLogout}></Button>
        </div>;
        return <Popover content={controls} position={Position.BOTTOM}>
            <div>
                <img className="avatar" src={props.user.avatarUrl} alt="" />
            </div>
        </Popover>;
    }

    const loginClick = () => {
        setBusy(true);
        requestLogin();
    }

    const why = <div style={{ padding: "10px" }}>
        <ReactMardown
            renderers={renderers}
            source={t("login_popover", {lang})}
            escapeHtml={false}>
        </ReactMardown>
        Please <Button onClick={loginClick}>login</Button> to store progress <br/> on server.
    </div>;

    return <Popover content={why} position={Position.BOTTOM}>
        <Tooltip content={t("login_tooltip")} position={Position.BOTTOM}>
            <div>
                <Button intent={Intent.DANGER}
                        minimal={true}
                        icon={IconNames.LOG_IN}>
                </Button>
            </div>
        </Tooltip>
    </Popover>;
}

