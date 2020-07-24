import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';

const en = {
    navigator: {
        home: "Home",
        studio: "Game Studio",
        database: "Database",
    },
    guides: {
        gameStudio: `
# Game Studio

Game Studio is a tool for creation \`js-dos bundles\`. You can think about bundle like a single archive that contains everything to run DOS program ([read more](https://js-dos.com/v7/build/docs/#js-dos-bundle--doszone)). Bundles is core part of our database, it allows to easy share DOS games in web.

The process of bundle creation is simple:

1. Click on \`Browse\` button, and choose program archive.

![Browser button](/guides/bundle_guide_1.jpg)

2. Select executable that will be runned when DOS emulator starts.

![Select executable](/guides/bundle_guide_2.jpg)

3. On next step you can change various of dosbox options, but usually defaults is pretty good. Scroll down and press \`create archive\`.

![Create archive](/guides/bundle_guide_3.jpg)

4. Bundle is ready and you can download it.

![Download archive](/guides/bundle_guide_4.jpg)

`,
        database: `
# Games database

Our database is structured like forum, every game have own page, where game can be discussed. All js-dos bundles attached to game page.

To play game in browser just [find game](https://talks.dos.zone/search?expanded=true&q=%23{{lang}}) page and press on js-dos bundle. Feel free to [add](/{{lang}}/studio) new version of game in our database.

You can [query](https://talks.dos.zone/search?expanded=true&q=%23{{lang}}%20tags%3Ajsdos) list of all games that have js-dos bundles.

Take attention that our base support multiple languages, please post messages in correct language.

Our database is community drived. Database sources is [here](https://github.com/caiiiycuk/dos.zone). Report about your problem and we will try to solve it asap.
`,
    },
    landing: {
        header_1: `
# Welcome!

DOS.Zone - is an <span style="color: #DB3737; font-size: larger;">**interactive**</span> database of DOS games. We not only mantain full collection of games, but also provide serivces to play you favoirte game in **browser** or **mobile**.

## Do you want to play your favorite game?

Just use search tools on our [database](#) to find page of game. Then run game directly in browser or discuss it with other people.
`,
        header_2: `

## What if there is no browser version for my game?

Don’t be discouraged, this is a great chance to help community! Try our [Game Studio](/{{lang}}/studio) to create playable version of game and add it to database.

## What if my favorite game is missing?

Our database is community drived. Database sources is [here](https://github.com/caiiiycuk/dos.zone). Report about your problem and we will try to solve it asap.
`,
        browse_database: "Browse database",
    },
    studio: {
        welcome: "Welcome to Game Studio",
        description: "Follow steps to create playable game",
        step: "Step",
        upload: "Upload",
        archive: "archive of program",
        try: "try",
        choose_file: "Choose file...",
        zip_error: "Can't read ZIP file: ",
        executable_not_found: "Archive does not have executables",
        try_other: "Upload another archive",
        selected_executable: "Selected executable",
        select_executable: "Select executable",
        select_other: "Select other file",
        use_this: "Use this",
        create: "Create archive",
        download: "Download js-dos bundle",
        allowed_values: "Allowed values",
        dosbox_config: "Configure dosbox options",
        cpu_config: "Configure CPU options",
        output_config: "Configure output options",
        mixer_config: "Configure sound options",
        autoexec_config: "Setup autoexec script",
        auto: "auto",
        "true": "Yes",
        "false": "No",
        back: "Back",
        read_guide: "read guide",
        stop: "Stop",
        start: "Start",
        help: `
### Help to community

You can help community if you [search](https://talks.dos.zone/search?expanded=true&q=%23{{lang}}%20{{game}}) for game in our database and post it in game thread. It will make our database better.

On the game page:

1. Press "Reply" button

![reply](/guides/reply.jpg)

2. Press "Upload" button and select bundle

![upload](/guides/upload.jpg)

Enter description of bundle and press "Reply"

3. Flag the message to add it in post header

![flag](/guides/flag_0.jpg)
![flag](/guides/flag.jpg)

Thank you!
`
    }
}

const ru = {
    navigator: {
        home: "Домой",
        studio: "Творческая студия",
        database: "База данных",
    },
    guides: {
        gameStudio: `
# Творческая студия

Творческая студия это инструмент для создания \`пакетов js-dos\`. Он содержит все необходимое для запуска DOS програм ([подробнее](https://js-dos.com/v7/build/docs/#js-dos-bundle--doszone)). Пакеты это основая концепция нашей базы данных, они позволяют шарить DOS игры в вебе.

Процесс создания пакетов прост:

1. Нажмите кнопку \`Browse\` и выберите архив с программой.

![Browser button](/guides/bundle_guide_1.jpg)

2. Выберите запускаемый файл который будет запущен в эмуляторе.

![Select executable](/guides/bundle_guide_2.jpg)

3. На следующем шаге вы можете поменять настройки dosbox, но обычно настройки по умолчанию хорошо подходят. Нажмите \`Создать архив\` внизу страницы.

![Create archive](/guides/bundle_guide_3.jpg)

4. Пакет готов и вы можете скачать его.

![Download archive](/guides/bundle_guide_4.jpg)

Спасибо!
`,
        database: `
# База данных игр 

Наша база данных построена на основе форума, каждая игра имеет свою страницу для обсуждения. js-dos архивы так же прикреплены к странице игры.

Что бы запустить игру в браузере [найдите](https://talks.dos.zone/search?expanded=true&q=%23{{lang}}) её страницу и запуститье js-dos архив. Вы можете [добавить](/{{lang}}/studio) новую версию игры и помочь сообществу.

[Список](https://talks.dos.zone/search?expanded=true&q=%23{{lang}}%20tags%3Ajsdos) всех игр для которых есть js-dos архив.

Обратите внимание, что наша база данных поддерживает несколько языков, пожалуйтса пишите сообщения в своей ветке.

Наша база данных управляется сообществом. Её исходный код опубликован [здесь](https://github.com/caiiiycuk/dos.zone). Сообщите нам о проблеме и мы постораемся решить её как можно скорее.
`,
    },
    landing: {
        header_1: `
# Добро пожаловать!

DOS.Zone - это управляемая сообществом <span style="color: #DB3737; font-size: larger;">**интерктивная**</span> база данных DOS игр. Мы не только поддерживаем полную коллекцию игр, но и сервисы позваляющие играть в них прямо в **браузере** или **на мобильных устройствах**.

## Хотите поиграть в свою любимую игру?

Воспользуйтесь инструментами поиска [базы данных](#), и найдите страничку вашей любимой игры. Запустите игру прямо в браузере или обсудите её с другими фанатами.

`,
        header_2: `

## Для моей игры нет версии для браузера

Не расстраивайтесь, это отличный шанс помочь сообществу! Воспользуйтесь нашей [Творческой Студией](/{{lang}}/studio) и добавьте версию для браузера в нашу базу данных.

## Моей любимой игры нет в базе данных

Наша база данных управляется сообществом. Её исходный код опубликован [здесь](https://github.com/caiiiycuk/dos.zone). Сообщите нам о проблеме и мы постораемся добавить игру как можно скорее.

`,
        browse_database: "Поиск в базе",
    },
    studio: {
        welcome: "Добро пожаловать в творческую студию",
        description: "Следуйте инструкции что бы создать игру",
        step: "Шаг",
        upload: "Загрузите",
        archive: "архив с программой",
        try: "попробуйте",
        choose_file: "Выберите файл...",
        zip_error: "Ошибка чтений файла: ",
        executable_not_found: "Архив не содержит исполняемых файлов",
        try_other: "Загрузить другой архив",
        selected_executable: "Исполняемый файл",
        select_executable: "Выберите исполняемый файл",
        select_other: "Выбрать другой файл",
        use_this: "Использовать этот",
        create: "Создать архив",
        download: "Скачать js-dos архив",
        allowed_values: "Допустимые значения",
        dosbox_config: "Настройте параметры dosbox",
        cpu_config: "Настройте параметры эмуляции CPU",
        output_config: "Настройте параметры вывода",
        mixer_config: "Настройте параметры звука",
        autoexec_config: "Скрипт запуска",
        auto: "Автоматически",
        "true": "Да",
        "false": "Нет",
        back: "Назад",
        read_guide: "читать руководство",
        stop: "Остановить",
        start: "Запустить",
        help: `
### Помогите сообществу

Вы можете помочь сообществу если [найдете](https://talks.dos.zone/search?expanded=true&q=%23{{lang}}%20{{game}}) страницу игры в нашей базе данных и прикрепите ваш архив к игре. Это сделает нашу базуданных лучше.

На странице игры:

1. Нажмите кнопку "Ответить"

![reply](/guides/reply.jpg)

2. Нажмите кнопку "Загрузить" и выберите архив с игрой

![upload](/guides/upload.jpg)

Введите комментарий к вашему архиву, опубликуйте сообщение.

3. Призовите администратора что бы опубликовать архив в шапке игры.

![flag](/guides/flag_0.jpg)
![flag](/guides/flag.jpg)
`
    }
}

const resources = {
    en,
    ru,
}

class ShortLanguageDetector extends LanguageDetector {
    detect(detectionOrder?: any): string | undefined {
        let lang = super.detect(detectionOrder);
        if (lang !== undefined) {
            lang = lang.split("-")[0];
        }
        return lang;
    }
}

i18n
    .use(ShortLanguageDetector)
    .use(initReactI18next)
    .init({
        detection: {
            order: ['path', 'querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'subdomain'],
        },
        resources,
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;
