import React from "react";

import { Card, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { getGameData } from "../../core/game-query";

export function GameThumb(props: { url: string;
    selected: boolean;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
    const data = getGameData(props.url);

    return <Card onClick={props.onClick} className={["thumb-frame", props.selected ? "thumb-frame-selected" : ""].join(" ")} interactive={true}>
        <div className="thumb-title">{data.game}</div>
        <div className="thumb-title-2">{data.title}</div>
        <img src={data.screenshot} className="thumb-screenshot"></img>
        <div className="thumb-author">{"@" + data.author}</div>
        {props.selected ? <Icon icon={IconNames.PLAY} iconSize={32} className="thumb-play"></Icon> : null}
    </Card>
}
