import React from 'react';
import { useTranslation } from 'react-i18next';

export function Landing() {
    const { t, i18n } = useTranslation();

    return <div>{t("landing")}</div>;
}
