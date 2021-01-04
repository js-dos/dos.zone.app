import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Loader } from "./loader";

import { User, isSuperUser } from "../core/auth";
import { DosPlayer } from "./dos-player";
import { TurboPlayer } from "./turbo-player";
import { getPersonalBundleUrl } from "../core/personal";

import { goBack } from "../ui/navigator";
import { getCachedGameData } from "../core/game-query";

import { DosInstance } from "emulators-ui/dist/types/js-dos";

export interface IPlayerProps {
    user: User | null;
    bundleUrl: string;
    embedded: boolean;
    turbo: boolean;
    janusServerUrl?: string;

    onDosInstance?: (dos: DosInstance | null) => void;
}

export function Player(props: IPlayerProps) {
    const { t, i18n } = useTranslation("player");
    const user = props.user;
    const newProps = {...props};

    if (newProps.turbo && user === null) {
        newProps.turbo = false;
    }

    const gameData = getCachedGameData(props.bundleUrl);
    const turbo = gameData !== null && (gameData.turbo === "optional" || gameData.turbo === "required");

    if (!isSuperUser(user) && newProps.turbo && !turbo) {
        newProps.turbo = false;
    }

    if (newProps.turbo) {
        return <TurboPlayer {...newProps} />;
    } else {
        return <DosPlayer {...newProps} />;
    }
}

