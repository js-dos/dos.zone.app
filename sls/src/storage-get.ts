import { Handler } from 'aws-lambda';

import { getKey } from './storage';
import { badRequest, noSession, success, error } from './responses';
import { validateUser } from './session';

export const storageGet: Handler = async (event: any) => {
    const sso = event.queryStringParameters.sso;
    const sig = event.queryStringParameters.sig;
    const key = event.queryStringParameters.key;

    if (!key || key.length === 0) {
        return badRequest();
    }

    const user = await validateUser(sso, sig);
    if (user === null) {
        return noSession();
    }

    const value = await getKey(user.email, key);
    return success({ value });
}
