import { Handler } from 'aws-lambda';

import { validateUser } from './session';
import { noSession, success } from './responses';
import { getTurboSession } from './turbo';

export const turboDescribe: Handler = async (event: any) => {
    const sso = event.queryStringParameters.sso;
    const sig = event.queryStringParameters.sig;

    const user = await validateUser(sso, sig);
    if (user === null) {
        return noSession();
    }

    return success({ session: await getTurboSession(user.email) });
}
