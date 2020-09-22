import { Handler } from 'aws-lambda';

import { decodeUser } from "./sso";

export const turboLimits: Handler = async (event: any) => {
    const sso = event.queryStringParameters.sso;
    const sig = event.queryStringParameters.sig;
    const user = decodeUser(sso, sig);

    if (user !== null) {
        const email = user.email;
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ success: user !== null }, null, 2)
    };
}
