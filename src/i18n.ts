import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';

const en = {
    translation: {
        home: "Home",
        creator: "Creator",
    },
    landing: {
        header: `
# Welcome!

DOS.Zone - is an <span style="color: #DB3737; font-size: larger;">**interactive**</span> database of DOS games. We not only mantain full collection of games, but also provide serivces to play you favoirte game in **browser** or **mobile**.

## Do you want to play your favorite game?

Just use search tools on our [platform](https://talks.dos.zone/c/{{lang}}) to find page of your game. Run you game directly in browser or discuss it with other people.

## What if there is no browser version for my game?

Don’t be discouraged, this is a great chance to help community! Try our [Game Studio](/{{lang}}/studio) to create playable version of game and add it to database.

## What if my favorite game is missing?

Our database is community drived. Database sources is here. Report about your problem and we will try to solve it asap.
`,
    },
}

const ru = {
    translation: {
        home: "Домой",
        creator: "Упаковщик",
    },
    landing: {
        header: `
# Добро пожаловать!

DOS.Zone - это управляемая сообществом <span style="color: #DB3737; font-size: larger;">**интерктивная**</span> база данных DOS игр. Мы не только поддерживаем полную коллекцию игр, но и сервисы позваляющие играть в них прямо в **браузере** или **на мобильных устройствах**.

## Хотите поиграть в свою любимую игру?

Воспользуйтесь инструментами поиска нашей [платформы](https://talks.dos.zone/c/{{lang}}), и найдите страничку вашей любимой игры. Запустите игру прямо в браузере или обсудите её с другими фанатами.

## Для моей игры нет версии для браузера

Не расстраивайтесь, это отличный шанс помочь сообществу! Воспользуйтесь нашей [Творческой Студией](/{{lang}}/studio) и добавьте версию для браузера в нашу базу данных.

## Моей любимой игры нет в базе данных

Наша база данных управляется сообществом. Её исходный код опубликован здесь. Сообщите нам о проблеме и мы постораемся добавить игру как можно скорее.

`,
    },
}

const resources = {
    en,
    ru,
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        detection: {
            order: ['path', 'querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'subdomain'],
        },
        resources,
        fallbackLng: 'en',
        debug: true,
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;
