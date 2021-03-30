import { Handler } from "aws-lambda";
import { decodeUser } from "./sso";
import { validateSession } from "./session";
import { success } from "./responses";

export const ssoLogin: Handler = async (event: any) => {
    const sso = event.queryStringParameters.sso;
    const sig = event.queryStringParameters.sig;
    const userAgent = event.queryStringParameters.ua;

    const user = decodeUser(sso, sig);
    const valid = await validateSession(user, userAgent ? (new Buffer(userAgent, "base64").toString("utf-8")) : "N/A");

    return success({ user: valid ? user : null });
}
