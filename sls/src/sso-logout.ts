import { Handler } from 'aws-lambda';
import { deleteSession, validateUser } from "./session";
import { noSession, success } from './responses';

export const ssoLogout: Handler = async (event: any) => {
    const sso = event.queryStringParameters.sso;
    const sig = event.queryStringParameters.sig;
    const user = await validateUser(sso, sig);

    if (user === null) {
        return noSession();
    }

    await deleteSession(user);

    return success({});
}
