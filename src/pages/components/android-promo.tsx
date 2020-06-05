import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Capacitor } from "@capacitor/core";

import "smart-app-banner/dist/smart-app-banner.css";
const SmartBanner = require("smart-app-banner");

const isAndroid = /(android)/i.test(navigator.userAgent);

export function AndroidPromo() {
    const { t, i18n } = useTranslation("promo");
    const lang = i18n.language;
    const isNative = Capacitor.isNative;

    useEffect(() => {
        if (isNative || !isAndroid) {
            return;
        }

        const banner = new SmartBanner({
            daysHidden: 5,
            daysReminder: 15,
            appStoreLanguage: lang, // language code for the App Store (defaults to user's browser language)
            title: t("title"),
            author: t("second_line"),
            button: t("view"),
            store: {
                android: t("store"),
            },
            price: {
                android: t("price"),
            },
            theme: "android",
        });

        return () => {
            banner.hide();
        };
    }, [isAndroid, isNative, lang]);
    return null;
}
