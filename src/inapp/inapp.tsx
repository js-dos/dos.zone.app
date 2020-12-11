import React, { useState, useEffect } from "react";
import {
    Card,
    ButtonGroup,
    Button,
    Elevation,
    Intent,
    Callout,
    Spinner,
} from "@blueprintjs/core";
import { useTranslation } from "react-i18next";
import { User } from "../core/auth";

import { GET_OBJECT } from "../core/xhr/GET";
import { inappGet } from "../core/config";
import { logError } from "../core/log";

const store: IapStore.IStore | undefined = initStorePlugin(window);

function initStorePlugin(plugins: any) {
    const store: IapStore.IStore | undefined = plugins.store;
    if (store === undefined) {
        return undefined;
    }

    store.validator = 'https://validator.fovea.cc/v1/validate?appName=zone.dos.app&apiKey=53f36d2b-7bcf-419a-80c2-9eaedc180afe';

    return store;
}

type State = Pick<IapStore.IStoreProduct, "state" | "canPurchase">;
interface SubscriptionsState {
    donate: State,
    turbo_2h: State,
}

async function subscribeToUpdates(store: IapStore.IStore | null,
                                  user: User,
                                  onUpdate: (state: SubscriptionsState) => void,
                                  onError: (error: string) => void) {
    const state: SubscriptionsState = {
        donate: {
            state: "valid",
            canPurchase: false,
        },
        turbo_2h: {
            state: "valid",
            canPurchase: false,
        },
    };

    if (store === null) {
        const active = await getInapp(user);
        for (const next of active) {
            state[next].state = "owned";
        }
        onUpdate({...state});
        return;
    }

    store.applicationUsername = user.email;
    store.register([{
        id:    'donate',
        type:   store.PAID_SUBSCRIPTION,
    }, {
        id:    'turbo_2h',
        type:   store.PAID_SUBSCRIPTION,
    }]);

    store.error((error) => onError(error.code + ":" + error.message));

    store.when("subscription").updated(() => {
        state.donate = store.get("donate") || state.donate;
        state.turbo_2h = store.get("turbo_2h") || state.turbo_2h;
        onUpdate({...state});
    });

    store.when("product")
         .approved(p => p.verify())
         .verified(p => p.finish());

    store.refresh();
}

export function Subscriptions(props: { user: User | null }) {
    const user = props.user;
    const { t, i18n } = useTranslation("subscriptions");
    const inappSupported = store !== undefined;
    const [subscriptionsState, setSubscriptionsState] = useState<SubscriptionsState | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user === null) {
            return;
        }

        let cancel = false;
        subscribeToUpdates(
            store || null,
            user,
            (state) => {
                if (cancel) {
                    return;
                }
                setSubscriptionsState(state)
            },
            (message) => {
                if (cancel) {
                    return;
                }
                setError(message);
            }
        );

        return () => {
            cancel = true;
        };
    }, [user]);

    if (user === null) {
        return <div className="purchases">
            <h1>{t("subscriptions")}</h1>

            <Callout intent={Intent.DANGER}>
                {t("subscriptions_for_logged")}
            </Callout>
        </div>;
    }

    if (error !== null) {
        return <div className="purchases">
            <h1>{t("subscriptions")}</h1>

            <Callout intent={Intent.DANGER}>
                {error}
            </Callout>
        </div>;
    }

    if (subscriptionsState === null) {
        return <div className="purchases">
            <h1>{t("subscriptions")}</h1>
            <Spinner/>
        </div>;
    }

    const androidNote = <Callout intent={Intent.WARNING}>
        {t("only_android")} <a href="https://play.google.com/store/apps/details?id=zone.dos.app">{t("android_application")}</a>
    </Callout>;

    return <div className="purchases">
        <h1>{t("subscriptions")}</h1>
        {!inappSupported ? androidNote : null}
        <br/>
        <Card interactive={true} elevation={Elevation.TWO}>
            <h3>{t("turbo_2h_title")}</h3>
            <p>{t("turbo_2h_desc")}</p>
            <Actions state={subscriptionsState["turbo_2h"]} store={store || null} id="turbo_2h" />
        </Card>
        <br/>
        <Card interactive={true} elevation={Elevation.TWO}>
            <h3>{t("donate_title")}</h3>
            <p>{t("donate_desc")}</p>
            <Actions state={subscriptionsState["donate"]} store={store || null} id="donate" />
        </Card>
        <br/>
    </div>;
}

function Actions(props: { state: State, store: IapStore.IStore | null, id: string}) {
    const { t, i18n } = useTranslation("subscriptions");
    const state = props.state;
    const store = props.store;
    const havePurchases = props.store !== null;
    const id = props.id;

    function subscribe() {
        if (store === null) {
            return;
        }

        store.order(id);
    }

    if (state.state !== "owned" &&
        state.state !== "valid") {
        return <Spinner size={16} />;
    }

    const owned = state.state === "owned";

    return <ButtonGroup>
    { owned ?
      <Button disabled={true} intent={Intent.SUCCESS}>{t("subscribed")}</Button> :
      <Button disabled={!havePurchases} intent={Intent.PRIMARY} onClick={subscribe}>{t("subscribe")}</Button> }
    </ButtonGroup>
}


async function getInapp(user: User): Promise<Array<"donate" | "turbo_2h">> {
    try {
        return (await GET_OBJECT(inappGet + "?sso=" + user.sso + "&sig=" + user.sig)).active;
    } catch (e) {
        logError(e);
        return [];
    }
}
