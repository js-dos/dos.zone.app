import { Handler } from "aws-lambda";
import { makeUrl } from "./sso";
import { createSession } from "./session";

export const ssoUrl: Handler = async (event: any) => {
    const nonce = await createSession();
    const backUrl = event.queryStringParameters.url || "N/A";
    const url = makeUrl(nonce, backUrl);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            url
        }, null, 2)
    };
}
