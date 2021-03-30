import { Handler } from "aws-lambda";
import { success } from "./responses";
import { Purchase, updatePurchase } from "./inapp";

interface WebHookPayload {
    type: string | "purchases.updated",
    applicationUsername: string,
    password: string,
    purchases: {[productId: string]: Purchase},
};

export const inappWebhook: Handler = async (event: any) => {
    const payloadString = event.body as string;

    if (typeof payloadString !== "string") {
        console.error("Unknown payload type", typeof payloadString);
        success({});
    }

    const payload = JSON.parse(payloadString) as WebHookPayload;

    if (payload.type !== "purchases.updated") {
        console.error("Unknown payload type");
        console.error(payload);
        return success({});
    }

    if (payload.applicationUsername === undefined ||
        typeof payload.applicationUsername !== "string" ||
        payload.applicationUsername.length === 0) {
        console.error("Wrong username");
        console.error(payload);
    }

    if (payload.password !== "6ba63c7a-f567-4f53-8dd2-34f1490218db") {
        console.error("Wrong password");
        console.error(payload);
        return success({});
    }

    for (const next of Object.values(payload.purchases)) {
        try {
            await updatePurchase(next, payload.applicationUsername);
        } catch (e) {
            console.error("Unable to update subscriptions info");
            console.error(next);
            console.error(e);
        }
    }

    return success({});
}
