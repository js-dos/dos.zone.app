import React, { FormEvent, useState } from "react";

import { useTranslation } from "react-i18next";
import { IconNames } from "@blueprintjs/icons";
import "./search.css";

import {
    Classes,
    Intent,
    Button,
    Spinner, InputGroup,
    Popover, Position,
    NonIdealState,
} from "@blueprintjs/core";
import i18n from "../../i18n";
import { GameData, searchGame } from "../../core/game";
import { openSearch } from "../../core/browser-tab";

type SearchResponseData = GameData[];

const minimalSearchTerm = 3;

export function Search(props: { onSearchResult: (searchTerm: string, result: GameData[] | null) => void }) {
    const { t } = useTranslation("search");
    const [ searchText, setSearchText ] = useState<string>("");
    const [ needAction, setNeedAction ] = useState<boolean>(false);
    const [ popoverShown, setPopoverShown ] = useState<boolean>(false);

    const [ searchRequestTerm, setSearchRequestTerm ] = useState<string>("");
    const [ searchResponse, _setSearchResponse ] = useState<SearchResponseData | null>(null);

    function setSearchResponse(searchTerm: string, response: SearchResponseData | null) {
        props.onSearchResult(searchTerm, response);
        _setSearchResponse(response);
    }

    function onSearchInput(e: FormEvent<HTMLInputElement>) {
        const newSearchText = (e.target as any).value as string || "";
        if (searchText === newSearchText) {
            return;
        }
        setSearchText(newSearchText);

        const newNeedAction = newSearchText.length > 0;
        if (needAction !== newNeedAction) {
            setNeedAction(newNeedAction);
            if (!popoverShown && !newNeedAction) {
                setPopoverShown(true);
            }
        }
    }

    function onSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.keyCode === 13) {
            (e.target as any).blur();
            onSearchRequest();
        }
    }

    function onSearchRequest() {
        if (searchText.length === 0) {
            return;
        }

        setPopoverShown(true);

        if (searchRequestTerm === searchText) {
            return;
        }

        setSearchResponse("", null);
        setSearchRequestTerm(searchText);
        doSearch(searchText).then((response) => setSearchResponse(searchText, response));
    }

    const searchRightElement = (
        <Popover content={<div className="popover-inner-card">{t("search_action")}</div>} position={Position.BOTTOM} isOpen={needAction && !popoverShown}>
            <Button minimal={!needAction} icon={IconNames.KEY_ENTER} intent={Intent.PRIMARY} onClick={onSearchRequest} />
        </Popover>
    );

    return (<div className={"search-root"}>
        <InputGroup className={[Classes.ROUND, "search"].join(" ")} leftIcon="search" tabIndex={0}
                    onChange={onSearchInput}
                    onKeyDown={onSearchKey}
                    rightElement={searchRightElement}
                    placeholder={t("search_placeholder")} />
        <SearchResponse searchRequestTerm={searchRequestTerm}
                        searchResponse={searchResponse} />
    </div>);
}

function SearchResponse(props: {
    searchRequestTerm: string,
    searchResponse: SearchResponseData | null,
}) {
    const { t } = useTranslation("search");
    const { searchRequestTerm, searchResponse } = props;

    if (searchRequestTerm.length === 0 && searchResponse === null) {
        return null;
    }

    let icon: any = IconNames.SEARCH;
    let title = t("search_no_results");
    let description = t("search_no_results_description");
    let action: any = null;

    if (searchRequestTerm.length < minimalSearchTerm) {
        description = t("search_too_short");
    }

    if (searchResponse === null) {
        icon = <Spinner />;
        title = t("searching");
        description = "";
    }

    if (searchResponse === null || searchResponse.length === 0) {
        action = <Button intent={Intent.PRIMARY} onClick={() => {
            openSearch(searchRequestTerm, i18n.language);
        }} >{t("search_advanced")}</Button>

        return (
            <div className="search-non-ideal">
                <NonIdealState
                    icon={icon}
                    title={title}
                    description={description}
                    action={action}
                />
            </div>
        );
    }

    return null;
}

function doSearch(searchTerm: string): Promise<GameData[]> {
    return new Promise<GameData[]>((resolve) => {
        if (searchTerm.length < minimalSearchTerm) {
            setTimeout(() => resolve([]), 300);
            return;
        }

        searchGame(searchTerm).then(resolve);
    });
}
