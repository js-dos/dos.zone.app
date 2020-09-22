import React from "react";

import { User } from "../core/auth";
import { DosPlayer } from "./dos-player";
import { TurboPlayer } from "./turbo-player";

export interface IPlayerProps {
    user: User | null;
    bundleUrl: string;
    embedded: boolean;
    turbo: boolean;
}

export function Player(props: IPlayerProps) {
    if (props.turbo) {
        return TurboPlayer(props);
    } else {
        return DosPlayer(props);
    }
}

