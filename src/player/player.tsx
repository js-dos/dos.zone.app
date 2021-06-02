import React from "react";

import { DosInstance } from "emulators-ui/dist/types/js-dos";
import { isSuperUser, User } from "../core/auth";
import { getCachedGameData } from "../core/game-query";
import { DosPlayer } from "./dos-player";
import { TurboPlayer } from "./turbo-player";

import { Tutorial } from "./tutorial";

export interface IPlayerProps {
    user: User | null;
    bundleUrl: string;
    embedded: boolean;
    turbo: boolean;
    local?: boolean;
    logVisual?: boolean;
    logLayers?: boolean;
    janusServerUrl?: string;

    onDosInstance?: (dos: DosInstance | null) => void;
}

export function Player(props: IPlayerProps) {
    const user = props.user;
    const newProps = { ...props };

    if (newProps.turbo && user === null) {
        newProps.turbo = false;
    }

    const gameData = getCachedGameData(props.bundleUrl);
    const turbo = gameData !== null && (gameData.turbo === "optional" || gameData.turbo === "required");
    const video = gameData?.video;

    if (!isSuperUser(user) && newProps.turbo && !turbo) {
        newProps.turbo = false;
    }

    const player = (() => {
        if (newProps.local === true) {
            return <DosPlayer {...newProps} janusServerUrl="http://127.0.0.1:8088/janus" turbo={true} logVisual={true} />;
        } else if (newProps.turbo) {
            return <TurboPlayer {...newProps} />;
        } else {
            return <DosPlayer {...newProps} />;
        }
    })();

    return <div>
        <Tutorial url={video} user={user} />
        {player}
    </div>;
}

