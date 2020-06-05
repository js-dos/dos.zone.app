import { Handler } from 'aws-lambda';

import { getPersonalBundleUrl } from './s3';
import { success, badRequest, noSession } from './responses';
import { validateUser } from './session';

export const personalUrl: Handler = async (event: any) => {
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

    const personalBundleUrl = await getPersonalBundleUrl(user.email, bundleUrl);

    return success({ personalBundleUrl });
}
