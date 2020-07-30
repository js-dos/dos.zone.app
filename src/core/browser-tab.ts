import { Plugins } from '@capacitor/core';
const { Browser } = Plugins;

export const repositoryUrl = "https://talks.dos.zone/c/rep/11";
Browser.prefetch({ urls: [repositoryUrl] });

export function runInTab(url: string) {
    Browser.open({
        url: url,
        toolbarColor: "#000000",
        windowName: "_self",
    });
}
