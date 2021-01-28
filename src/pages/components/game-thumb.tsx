import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Card, Icon, Spinner } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { GameData } from "../../core/game";

import { cdnUrl } from "../../core/cdn";

export function GameThumb(props: {
    game?: GameData,
    gamePromise?: Promise<GameData>,
    selected: boolean;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
    const { t } = useTranslation("common");

    const [data, setData] = useState<GameData | null>(() => {
        if (props.game !== undefined) {
            return props.game;
        }

        if (props.gamePromise === undefined) {
            return null;
        }

        return peekPromise(props.gamePromise);
    });

    useEffect(() => {
        if (data !== null || props.gamePromise === undefined) {
            return;
        }

        let cancel = false;
        props.gamePromise.then((data) => {
            if (!cancel) {
                setData(data);
            }
        });
        return () => {
            cancel = true;
        };
    }, [props.gamePromise]);

    if (data === null) {
        return <Card onClick={props.onClick} className={["thumb-frame", props.selected ? "thumb-frame-selected" : ""].join(" ")} interactive={true}>
            <div className="thumb-title">{t("loading")}</div>
            <div className="thumb-title-2">...</div>
            <img src={"/default.jpg"} className="thumb-screenshot" alt="screenshot"></img>
            <div className="thumb-author"></div>
            <Spinner className="thumb-play" />
        </Card>;
    }

    return <Card onClick={props.onClick} className={["thumb-frame", props.selected ? "thumb-frame-selected" : ""].join(" ")} interactive={true}>
        <div className="thumb-title">{data.game}</div>
        <div className="thumb-title-2">{data.title}</div>
        <img src={cdnUrl(data.screenshot) || "/default.jpg"} className="thumb-screenshot" alt="screenshot"></img>
        <div className="thumb-author">{"@" + data.author}</div>
        {props.selected ? <Icon icon={IconNames.PLAY} iconSize={32} className="thumb-play"></Icon> : null}
    </Card>;
}

function peekPromise<T>(promise: Promise<T>) {
    let value: T | null = null;
    promise.then((v) => value = v);
    return value;
};
