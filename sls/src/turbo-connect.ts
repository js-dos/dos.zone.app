import { Handler } from 'aws-lambda';

import { validateUser } from './session';
import { badRequest, noSession, success, error } from './responses';
import { getTurboSession, startTurboSession } from './turbo';

import { getKey } from "./storage";

export const turboConnect: Handler = async (event: any) => {
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

    const session = await getTurboSession(user.email);
    if (session.restTime < 60) {
        return error("error_no_time");
    }

    if (session.bundleUrl === bundleUrl) {
        return success({ session });
    }

    if (session.startedAt && Date.now() - session.startedAt < 15) {
        return error("error_starting_to_often");
    }

    const region = await getKey(user.email, "region");

    session.bundleUrl = bundleUrl;
    return success( { session: await startTurboSession(session, region || "eu-central-1") });
}
