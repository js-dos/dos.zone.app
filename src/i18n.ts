import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import LanguageDetector from "i18next-browser-languagedetector";

const en = {
    editor: {
        layers: "Layers",
        add_new_layer: "Add new layer",
        add: "Add",
        edit: "Edit",
        delete: "Delete",
        name: "Name",
        grid: "Grid",
        symbol: "Symbol",
        required: "(required)",
        control_type: "Control type",
        select_position: "Select new position",
        as_json: "JSON",
        close: "Close",
        key: "Key",
        apply: "Apply",
    },
    subscriptions: {
        subscriptions: "Subscriptions",
        donate_title: "Developers donation",
        donate_desc: "Subscribe to per-month donation for developer team of js-dos and DOS Zone. As a gift you will have +30 min on turbo time each day",
        turbo_2h_title: "Turbo 2 hours / day",
        turbo_2h_desc: "Subscribe and increase turbo time up to 2 hours per day",
        subscribe: "Subscribe",
        subscribed: "Subscribed",
        approved: "Processing...",
        unsubscribe: "Unsubscribe",
        only_android: "You can change subscriptions (subscribe/unsubscribe) only using",
        android_application: "android application",
        subscriptions_for_logged: "Subscriptions only available for logged users",
    },
    common: {
        loading: "Loading...",
        play: "Play",
        versions_1: "1 version",
        versions_2: "2 versions",
        versions_3: "3 versions",
        versions_4: "4 versions",
        versions_5: "5 versions",
        no_mobile: "No mobile controls",
    },
    turbo: {
        waiting_arn: "Connecting to Turbo cloud...",
        waiting_ip: "Starting up emulator",
        sec: "sec",
    },
    player: {
        restoring: "Restoring your progress...",
    },
    navigator: {
        use_back_button: "Please use button in top left corner to exit",
        home: "Home",
        studio: "Game Studio",
        database: "Database",
        buttons: "Buttons",
        joysticks: "Joysticks",
        mapper: "Mapper",
        games: "Games",
        close: "Close",
        saving: "Saving...",
        turbo_time_warn: "You Turbo session will close in 5 minutes, please save your game",
    },
    login: {
        please: "Please",
        login: "login",
        to_activate_all_features: "to activate all features",
        login_tooltip: "Login to activate more features",
        login_popover: `
By default js-dos store<br/>
your game progress in indexed db.<br/>
This data can be suddenly wiped.<br/>
`
    },
    hardware: {
        native_acceleration: "Native acceleration",
        native_acceleration_install: "Install ",
        native_acceleration_android: " application from Google Play to enable native acceleration which gives a much better performance",
        not_supported: " - NOT SUPPORTED",
        comparsion: "comparsion",
    },
    my: {
        browse_database: "Browse database",
        selected: "Play",
        recently_played: "Others",
        play: "Play",
        play_turbo: "Turbo",
        streaming_service: "DOS streaming service",
        min: "min.",
        please_login_for_turbo_mode: "Please login to use Turbo mode",
        turbo_mode_required: "This game only works in Turbo mode",
        no_time_for_turbo_mode: "No time for Turbo mode",
        settings: "settings",
        region: "Region: ",
        more: "more",
    },
    profile: {
        turbo: "Turbo",
        using_now: "Using now: ",
        yes: "YES",
        no: "no",
        day_limit: "Limit per day: ",
        min: "minutes",
        rest_time: "Rest time: ",
        region: "Region: ",
    },
    guides: {
        features: `
# Dos.Zone

Dos.Zone provides minimal basic functionality for anonymous players. You can use it without registration, but some advanced features that are listed below require login.

## Synchronization

All devices where you logged in are synchronized with each other, it means that all your favorite games, configuration and customization are stored on the backend and shared between all your devices.

## Game progress storage

For non logged users progress is stored in browsers local storage. It works fine while you play in a single browser, but if you change the browser of device progress will be lost. This type of progress storage is non recoverable.

For logged users game progress is also synced with backend, and shared between all your devices. It means you can play on PC and then continue playing on Mobile for example.

## Turbo mode

Turbo mode is only supported for logged users. This mode can help to play games that require a powerful CPU, like C&C or Diablo. For each user Dos.Zone provides a free 30 min session of Turbo mode everyday.

`,
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

To play game in browser just [find game](https://talks.dos.zone/t/collections/44653) page and press on js-dos bundle. Feel free to [add](/{{lang}}/studio) new version of game in our database.

You can [query](https://talks.dos.zone/c/rep/11) list of all games that have js-dos bundles.

Take attention that our base support multiple languages, please post messages in correct language.

Our database is community drived. Database sources is [here](https://github.com/caiiiycuk/dos.zone). Report about your problem and we will try to solve it asap.
`,
    },
    landing2: {
        open_catalog: "Open catalog",
        search_result: "Best match",
        more_search: "More...",
        recently_played: "Your favorites",
        more_recent: "All..."
    },
    search: {
        searching: "Searching...",
        search_placeholder: "Enter game name to search",
        search_action: "Press to search",
        search_no_results: "No search result",
        search_no_results_description: "No results found. Try advanced search.",
        search_advanced: "Advanced Search",
        search_too_short: "Your search term is too short.",
    },
    landing: {
        about_db: "Read more about database",
        quick_tour: "Quick tour",
        my_favorite: "Favorites",
        header_1: `
# Welcome!

DOS.Zone - is an <span style="color: #DB3737; font-size: larger;">**interactive**</span> database of DOS games. We not only mantain full collection of games, but also provide serivces to play you favoirte game in **browser** or **mobile**.

## Do you want to play your favorite game?

Just use search tools on our database to find page of game. Then run game directly in browser or discuss it with other people.
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
        quick_tour: "Tutorial: adding mobile controls to a DOS game",
        loading: "Loading...",
        open_topic: "Game Topic",
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
        skip_create: "Run original file",
        download: "js-dos",
        downloaded: "Downloaded to",
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
        touch_controls: "Controls",
        touch_description: "Configure how to map gestures and touches into key codes",
        gestures: "Gesture controls",
        thumb_description: "Controllers preview",
        button_symbol: "Symbol",
        buttons: "Virtual buttons",
        buttons_description: "Configure how to map buttons into key codes",
        buttons_thumb: "Position of virtual buttons",
        mapper_description: "Configure keyboard mapping",
        release_on_end: "release button on touch end",
        layer: "Layer",
        action: "Action",
        control_type: "Controller type",
        finger: "Finger",
        gesture: "Gesture",
        key: "Key",
        add: "Add",
        help: `
### Help to community

You can help community if you add jsdos bundle to [search](#). This will make our database better.

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
    editor: {
        layers: "Слои",
        add_new_layer: "Создать слой",
        add: "Создать",
        edit: "Редактировать",
        delete: "Удалить",
        name: "Название",
        grid: "Сетка",
        symbol: "Символ",
        required: "(обязательный)",
        control_type: "Тип элемента",
        select_position: "Выбирите новую позицию",
        as_json: "JSON",
        close: "Закрыть",
        key: "Кнопка",
        apply: "Применить",
    },
    subscriptions: {
        subscriptions: "Подписки",
        donate_title: "Пожертвования разработчикам",
        donate_desc: "Подпишитесь на ежемесечные пожертвования разрабочтикам js-dos и DOS Zone. Получи +30 минут к времени turbo в подарок",
        turbo_2h_title: "Turbo 2 часа / день",
        turbo_2h_desc: "Подпишитесь и увеличте время turbo до двух часов в день",
        subscribe: "Подписаться",
        subscribed: "Вы подписаны",
        approved: "Обработка...",
        unsubscribe: "Отказаться",
        only_android: "Вы можете управлять подписками только используя",
        android_application: "мобильное приложение",
        subscriptions_for_logged: "Подписки доступны только зарегестрированным пользователям",
    },
    common: {
        loading: "Загрузка...",
        play: "Играть",
        versions_1: "1 версия",
        versions_2: "2 версии",
        versions_3: "3 версии",
        versions_4: "4 версии",
        versions_5: "5 версий",
        no_mobile: "Нет мобильной версии",
    },
    turbo: {
        waiting_arn: "Подключаемся к облаку...",
        waiting_ip: "Запускаем эмулятор",
        sec: "сек",
    },
    player: {
        restoring: "Востанавливаем ваш прогресс...",
    },
    navigator: {
        use_back_button: "Для выхода используйте кнопку справа вверху",
        home: "Домой",
        studio: "Творческая студия",
        database: "База данных",
        buttons: "Кнопки",
        joysticks: "Джойстики",
        mapper: "Маппер",
        games: "Игры",
        save: "Закрыть",
        saving: "Сохранение...",
        turbo_time_warn: "Turbo сессия закроется в течении 5 минут, пожалуйста сохраните игру",
    },
    login: {
        please: "Пожалуйста",
        login: "войдите",
        to_activate_all_features: "что бы активировать все функции",
        login_tooltip: "Войдите что бы активировать больше функций",
        login_popover: `
По умоланию js-dos хранит<br/>
прогресс в локальной базе данных.<br/>
Эти данные могут быть очищенны<br/>
бразуером.<br/>
`
    },
    hardware: {
        native_acceleration: "Нативное ускорение",
        native_acceleration_install: "Установите приложение ",
        native_acceleration_android: " из Google Play что бы включить нативное ускорение для гораздо большей производительности",
        not_supported: " - НЕ ПОДДЕРЖИВАЕТСЯ",
        comparsion: "сравнение",
    },
    my: {
        browse_database: "Поиск в базе",
        selected: "Запустить",
        recently_played: "Другие",
        play: "Играть",
        play_turbo: "Turbo",
        streaming_service: "стриминг сервис",
        min: "мин.",
        please_login_for_turbo_mode: "Пожалуйста войдите что бы использовать Turbo режим",
        turbo_mode_required: "Эта игра работает только в Turbo режиме",
        no_time_for_turbo_mode: "Доступное время закончилось",
        settings: "настройки",
        region: "Регион: ",
        more: "подробнее",
    },
    profile: {
        turbo: "Turbo",
        using_now: "Используется сейчас: ",
        yes: "ДА",
        no: "нет",
        day_limit: "Дневной лими: ",
        min: "мин.",
        rest_time: "Оставшееся время: ",
        region: "Регион: ",
    },
    guides: {
        features: `
# Dos.Zone

Dos.Zone предоставляет минимальну функциональность для анонимных пользователей. Вы можете использовать его без регистрации, но некоторые дополнительные функции указанные ниже требуют регистрации.

## Синхронизация

Все устройства на которых выполнен вход синхронизуются друг с дургом, это значит что избранные игры, настройки и кастомизации сохраняются на сервере и распространяются на все устройства.

## Сохранение игрового прогресса

Для не зарегестрированных пользователей игровой прогресс записывается в локальное хранилище браузера. Это рабтает прекрасно пока вы используете один браузер, но если вы поменяете браузер или устройство, то прогресс будет потерян. В данном случае игровой прогесс не возможно востановить.

Для зарегистрированных пользователей игровой прогресс хранится на серверах и может быть востанновлен на любом устройстве. Например, вы можете игарть на ПК, а затем прололжить с того же места уже на мобильном устройстве.

## Turbo режим

Турбо режим поддерживается только для зарегистрированных пользователей. Этот режим преднозначен для игр которые требуют мощных CPU, например C&C или Diablo. Для любого пользователя предусмотрен бесплатный сеанc турбо режима продолжительностью до 30 минут ежедневно.
`,
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

Что бы запустить игру в браузере [найдите](https://talks.dos.zone/t/collections/44653) её страницу и запуститье js-dos архив. Вы можете [добавить](/{{lang}}/studio) новую версию игры и помочь сообществу.

[Список](https://talks.dos.zone/c/rep/11) всех игр для которых есть js-dos архив.

Обратите внимание, что наша база данных поддерживает несколько языков, пожалуйтса пишите сообщения в своей ветке.

Наша база данных управляется сообществом. Её исходный код опубликован [здесь](https://github.com/caiiiycuk/dos.zone). Сообщите нам о проблеме и мы постораемся решить её как можно скорее.
`,
    },
    landing2: {
        open_catalog: "Открыть каталог",
        search_result: "Релевантные результаты",
        more_search: "Ещё...",
        recently_played: "Избранные",
        more_recent: "Все..."
    },
    search: {
        searching: "Поиск...",
        search_placeholder: "Введите название игры",
        search_action: "Нажимите для поиска",
        search_no_results: "Нет результатов",
        search_no_results_description: "Ничего не найдено. Попробуйтe расширенный поиск.",
        search_advanced: "Расширенный поиск",
        search_too_short: "Слишком короткое слово для поиска"
    },
    landing: {
        about_db: "Подробнее о базе данных",
        quick_tour: "Краткий обзор",
        my_favorite: "Избранное",
        header_1: `
# Добро пожаловать!

DOS.Zone - это управляемая сообществом <span style="color: #DB3737; font-size: larger;">**интерктивная**</span> база данных DOS игр. Мы не только поддерживаем полную коллекцию игр, но и сервисы позваляющие играть в них прямо в **браузере** или **на мобильных устройствах**.

## Хотите поиграть в свою любимую игру?

Воспользуйтесь инструментами поиска базы данных, и найдите страничку вашей любимой игры. Запустите игру прямо в браузере или обсудите её с другими фанатами.

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
        quick_tour: "Видео урок: мобильное управление для DOS игр",
        loading: "Загрузка...",
        open_topic: "Открыть форум",
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
        skip_create: "Запустить оригинальный архив",
        download: "js-dos",
        downloaded: "Сохранено",
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
        touch_controls: "Управление",
        touch_description: "Задайте соответствие между жестами и клавишами",
        gestures: "Управление жестами",
        button_symbol: "Символ",
        buttons: "Виртуальные кнопки",
        buttons_description: "Задайте соответствие межде кнопками и клавишами",
        buttons_thumb: "Расположение виртуальных кнопок",
        thumb_description: "Приблизительный вид контроллеров",
        release_on_end: "отменять нажатие при отпускании",
        layer: "Слой",
        mapper_description: "Настройте маппинг клавиш",
        action: "Дейтсвие",
        control_type: "Тип контроллера",
        finger: "Палец",
        gesture: "Жест",
        key: "Клавиша",
        add: "Добавить",
        help: `
### Помогите сообществу

Вы можете помочь, если прикрепите созданный архив к игре [игре](#). Это сделает нашу базуданных лучше.

На странице игры:

1. Нажмите кнопку "Ответить"

![reply](/guides/reply.jpg)

2. Нажмите кнопку "Загрузить" и выберите архив с игрой

![upload](/guides/upload.jpg)

Введите комментарий к вашему архиву, опубликуйте сообщение.

3. Призовите администратора что бы опубликовать архив в шапке игры.

![flag](/guides/flag_0.jpg)

![flag](/guides/flag.jpg)

Спасибо!
`
    }
}

const resources = {
    en,
    ru,
}

const supportedLanguages = ["en", "ru", "fr", "de", "es", "zh"];
const detectionOrder = ["path", "querystring", "cookie", "localStorage", "navigator", "htmlTag", "subdomain"];

class ShortLanguageDetector extends LanguageDetector {
    detect(order?: any): string | undefined {
        let lang = super.detect(order) || "en";
        lang = lang.split("-")[0];

        if (lang === "rep") {
            lang = super.detect([...detectionOrder].slice(1)) || "en";
            lang = lang.split("-")[0];
        }

        if (lang === "rep" || supportedLanguages.indexOf(lang) === -1) {
            lang = "en";
        }

        return lang;
    }
}

i18n
    .use(ShortLanguageDetector)
    .use(initReactI18next)
    .init({
        detection: {
            order: detectionOrder,
        },
        resources,
        fallbackLng: "en",
        debug: false,
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;
