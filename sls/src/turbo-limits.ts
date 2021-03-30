import { Handler } from "aws-lambda";

import { getTurboSession } from "./turbo";
import { validateUser } from "./session";
import { noSession, success } from "./responses";


export const turboLimits: Handler = async (event: any) => {
    const sso = event.queryStringParameters.sso;
    const sig = event.queryStringParameters.sig;
    const user = await validateUser(sso, sig);

    if (user === null) {
        return noSession();
    }

    const session = await getTurboSession(user.email);
    return success({ session });
}
