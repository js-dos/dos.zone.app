import React, { useEffect } from "react";

import { DosInstance } from "emulators-ui/dist/types/js-dos";
import { isMobile } from "../cap-config";


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
