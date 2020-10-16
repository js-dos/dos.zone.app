import { Handler } from 'aws-lambda';

import { putKey } from './storage';
import { badRequest, noSession, success, error } from './responses';
import { validateUser } from './session';

export const storagePut: Handler = async (event: any) => {
    const sso = event.queryStringParameters.sso;
    const sig = event.queryStringParameters.sig;
    const key = event.queryStringParameters.key;
    const value = event.body;

    if (!key || key.length === 0) {
        return badRequest();
    }

    if (!value || value.length === 0) {
        return badRequest();
    }

    const user = await validateUser(sso, sig);
    if (user === null) {
        return noSession();
    }

    await putKey(user.email, key, value);
    return success({});
}
