import { Handler } from 'aws-lambda';
import * as AWS from "aws-sdk";

import { decodeUser } from "./sso";
import { getTurboLimits, TurboLimits } from './turbo';


export const turboLimits: Handler = async (event: any) => {
    const sso = event.queryStringParameters.sso;
    const sig = event.queryStringParameters.sig;
    const user = decodeUser(sso, sig);

    let limits: TurboLimits | null = null;
    if (user !== null) {
        limits = await getTurboLimits(user.email);
        limits.restTime = Math.max(limits.timeLimit - limits.usedTime, 0);
        if (limits.arn.length > 0) {
            const used = (new Date().getTime() - limits.startedAt) / 1000 / 60;
            limits.restTime = Math.max(limits.restTime - used, 0);
        }
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ success: user !== null, limits }, null, 2)
    };
}
