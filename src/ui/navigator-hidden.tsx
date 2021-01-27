import React, { useEffect } from "react";

import { DosInstance } from "emulators-ui/dist/types/js-dos";
import { Capacitor } from "@capacitor/core";

const isMobile = Capacitor.isNative || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export function NavigatorHidden(props: { dos: DosInstance | null }) {
    const dos = props.dos;
    useEffect(() => {
        if (dos === null) {
            return;
        }

        if (!isMobile) {
            dos.disableMobileControls();
        }
    }, [dos]);

    return null;
}
