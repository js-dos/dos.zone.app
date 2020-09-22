import { Handler } from 'aws-lambda';
import { decodeUser } from "./sso";
import { getSession, updateSession } from "./session";

export const ssoLogin: Handler = async (event: any) => {
    const sso = event.queryStringParameters.sso;
    const sig = event.queryStringParameters.sig;
    const userAgent = event.queryStringParameters.ua;

    let user = decodeUser(sso, sig);

    if (user !== null) {
        const session = await getSession(user.nonce);
        if (session === undefined) {
            user = null;
        } else if (session.sso === undefined ||
            session.sig === undefined ||
            session.email === undefined) {
            await updateSession(user,
                                sso,
                                sig,
                                userAgent ? (new Buffer(userAgent, "base64").toString("utf-8")) : "N/A");
        } else if (session.sso !== sso ||
            session.sig !== sig ||
            session.email !== user.email) {
            user = null;
        }
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ user: user }, null, 2)
    };
}
