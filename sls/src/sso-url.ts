import { Handler } from "aws-lambda";
import { makeUrl } from "./sso";
import { createSession } from "./session";
import { success } from "./responses";

export const ssoUrl: Handler = async (event: any) => {
    const nonce = await createSession();
    const backUrl = event.queryStringParameters.url || "N/A";
    const url = makeUrl(nonce, backUrl);

    return success({ url });
}
