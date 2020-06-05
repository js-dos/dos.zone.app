import { Plugins } from "@capacitor/core";
import { isMobile } from "../cap-config";

const { Browser } = Plugins;

const domain = "https://talks.dos.zone";

const desktopCatalogUrl = domain + "/t/dos-games-on-mobile/47306";
const mobileCatalogUrl = domain + "/t/dos-games-on-mobile/47305";
const catalogUrl = isMobile ? mobileCatalogUrl : desktopCatalogUrl;

Browser.prefetch({ urls: [catalogUrl] });

export function openRepository() {
    Browser.open({
        url: catalogUrl,
        toolbarColor: "#000000",
        windowName: "_self",
    });
}

export function openSlug(slug: string) {
    Browser.open({
        url: domain + "/t/" + slug,
        toolbarColor: "#000000",
        windowName: "_self",
    });
}

export function openSearch(searchTerm: string, locale: string) {
    Browser.open({
        url: domain + "/search?q=" + encodeURIComponent(searchTerm + " #" + locale),
        toolbarColor: "#000000",
        windowName: "_self",
    });
}

export function openTalks(locale: string) {
    Browser.open({
        url: domain + (locale === "ru" ? "/t/dos-zone/7427" : "/t/welcome-to-dos-zone/11"),
        toolbarColor: "#000000",
        windowName: "_self",
    });
}
