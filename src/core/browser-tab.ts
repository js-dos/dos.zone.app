import { Plugins } from "@capacitor/core";
import { isMobile } from "../cap-config";

const { Browser } = Plugins;

const domain = "https://talks.dos.zone";

const desktopCatalogUrl = "https://dos.zone";
const mobileCatalogUrl = "https://dos.zone";
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
