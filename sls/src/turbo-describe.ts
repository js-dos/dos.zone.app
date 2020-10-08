import { Handler } from 'aws-lambda';

import { validateUser } from './session';
import { badRequest, noSession, success, error } from './responses';
import { describeSession } from './turbo';

export const turboDescribe: Handler = async (event: any) => {
    const sso = event.queryStringParameters.sso;
    const sig = event.queryStringParameters.sig;
    const arn = event.queryStringParameters.arn;

    if (!arn || arn.length === 0) {
        return badRequest();
    }

    const user = await validateUser(sso, sig);
    if (user === null) {
        return noSession();
    }

    const payload = (await describeSession(arn)).Payload;
    const session = JSON.parse(JSON.parse(payload as string).body);
    return success( { session });
}
