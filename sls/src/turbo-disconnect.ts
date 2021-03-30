import { Handler } from "aws-lambda";

import { validateUser } from "./session";
import { badRequest, noSession, success } from "./responses";
import { disconnectSession } from "./turbo";

export const turboDisconnect: Handler = async (event: any) => {
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

    return success( { disconnected: await disconnectSession(user.email, arn)});
}
