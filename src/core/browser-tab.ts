import { Plugins } from "@capacitor/core";
const { Browser } = Plugins;

const domain = "https://talks.dos.zone";
const repositoryUrl = domain + "/t/collections/44653";
Browser.prefetch({ urls: [repositoryUrl] });

export function openRepository() {
    Browser.open({
        url: repositoryUrl,
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
