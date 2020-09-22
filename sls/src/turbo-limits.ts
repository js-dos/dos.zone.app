import { Handler } from 'aws-lambda';
import * as AWS from "aws-sdk";

import { getTurboLimits } from './turbo';
import { validateUser } from './session';
import { noSession, success } from './responses';


export const turboLimits: Handler = async (event: any) => {
    const sso = event.queryStringParameters.sso;
    const sig = event.queryStringParameters.sig;
    const user = await validateUser(sso, sig);

    if (user === null) {
        return noSession();
    }

    const limits = await getTurboLimits(user.email);
    limits.restTime = Math.max(limits.timeLimit - limits.usedTime, 0);
    if (limits.arn.length > 0) {
        const used = (new Date().getTime() - limits.startedAt) / 1000 / 60;
        limits.restTime = Math.max(limits.restTime - used, 0);
    }

    return success({ limits });
}
