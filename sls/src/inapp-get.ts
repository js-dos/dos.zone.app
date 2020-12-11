import { Handler } from 'aws-lambda';

import { badRequest, noSession, success } from "./responses";
import { validateUser } from "./session";
import { getActiveSubscriptions } from "./inapp";

export const inappGet: Handler = async (event: any) => {
    const sso = event.queryStringParameters.sso;
    const sig = event.queryStringParameters.sig;
    const user = await validateUser(sso, sig);

    if (user === null) {
        return noSession();
    }

    const active = await getActiveSubscriptions(user.email);
    return success({ active });
}
