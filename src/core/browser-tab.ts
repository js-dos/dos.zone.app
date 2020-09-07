import { Plugins } from "@capacitor/core";
const { Browser } = Plugins;

const repositoryUrl = "https://talks.dos.zone/c/rep/11";
Browser.prefetch({ urls: [repositoryUrl] });

export function openRepository() {
    Browser.open({
        url: repositoryUrl,
        toolbarColor: "#000000",
        windowName: "_self",
    });
}
