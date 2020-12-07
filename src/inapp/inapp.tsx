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
                                  onUpdate: (state: SubscriptionsState) => void,
                                  onError: (error: string) => void) {
    if (store === null) {
        onUpdate({
            donate: {
                state: "valid",
                canPurchase: false,
            },
            turbo_2h: {
                state: "valid",
                canPurchase: false,
            }
        });
        return;
    }

    store.register([{
        id:    'donate',
        type:   store.PAID_SUBSCRIPTION,
    }, {
        id:    'turbo_2h',
        type:   store.PAID_SUBSCRIPTION,
    }]);

    store.error((error) => onError(error.code + ":" + error.message));

    store.when("subscription").updated(() => {
        onUpdate({
            donate: store.get("donate"),
            turbo_2h: store.get("turbo_2h"),
        });
    });

    store.when("product")
         .approved(p => p.verify())
         .verified(p => p.finish());

    store.refresh();
}

export function Subscriptions() {
    const { t, i18n } = useTranslation("subscriptions");
    const inappSupported = store !== undefined;
    const [subscriptionsState, setSubscriptionsState] = useState<SubscriptionsState | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancel = false;
        subscribeToUpdates(
            store || null,
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
    }, []);

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

