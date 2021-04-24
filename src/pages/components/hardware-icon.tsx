import React, { useEffect, useState } from "react";
import { hardwareTransportLayerFactory } from "../../plugins/transport-layer";
import { isAndroid } from "../../cap-config";
import { Icon, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { useTranslation } from "react-i18next";

import { Capacitor } from "@capacitor/core";
import "./hardware-icon.css";

export function HardwareIcon(props: {}) {
    const { t, i18n } = useTranslation("hardware");
    const [canIUseHardware, setCanIUseHardware] = useState<boolean | null>(null);

    useEffect(() => {
        hardwareTransportLayerFactory.canIUse().then((r) => setCanIUseHardware(r.ok === true));
    }, []);

    if (!isAndroid) {
        return null;
    }

    if (Capacitor.isNative === false) {
        return <div className="hardware-icon-promo">
            <div>
                <Icon intent={Intent.DANGER} icon={IconNames.OFFLINE} iconSize={10}></Icon>&nbsp;&nbsp;{t("native_acceleration")}
                <span>{t("not_supported")}</span>
            </div>
            <div className="hardware-icon-promo-text">
               {t("native_acceleration_install")}
               <a target="_blank" href="https://play.google.com/store/apps/details?id=zone.dos.app">Dos.Zone</a>
               {t("native_acceleration_android")}
               &nbsp;(<a target="_blank" href="https://youtu.be/U4gPnbtBrJw">{t("comparsion")}</a>)
            </div>
        </div>;
    }

    const intent = canIUseHardware === null ? Intent.PRIMARY
            : (canIUseHardware ? Intent.SUCCESS : Intent.DANGER);

    return <div className="hardware-icon-container">
        <div>
            <Icon intent={intent} icon={IconNames.OFFLINE} iconSize={10}></Icon>&nbsp;&nbsp;{t("native_acceleration")}
        </div>
    </div>
}
