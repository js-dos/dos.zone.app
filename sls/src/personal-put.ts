import { Handler } from 'aws-lambda';

import { badRequest, noSession, success } from './responses';
import { validateUser } from './session';

import * as AWS from "aws-sdk";

const PutCurlLambda = process.env.PUT_CURL as string;
const lambda = new AWS.Lambda();

export const personalPut: Handler = async (event: any) => {
    const sso = event.queryStringParameters.sso;
    const sig = event.queryStringParameters.sig;
    const bundleUrl = event.queryStringParameters.bundleUrl;

    if (!bundleUrl || bundleUrl.length === 0) {
        return badRequest();
    }

    const user = await validateUser(sso, sig);
    if (user === null) {
        return noSession();
    }

    const result = await lambda.invoke({
        FunctionName: PutCurlLambda,
        Payload: JSON.stringify({
            bundleUrl,
        }),
    }).promise();

    return success({ payload: result.Payload });
}
