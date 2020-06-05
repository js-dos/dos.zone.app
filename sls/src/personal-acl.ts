import { Handler } from 'aws-lambda';

import { badRequest, noSession, success, error } from './responses';
import { validateUser } from './session';

import * as AWS from "aws-sdk";

const s3Bucket = "doszone-uploads";
const s3 = new AWS.S3();

function getPersonalKey(email: string, bundleUrl: string) {
    const index = bundleUrl.lastIndexOf("/");
    const basename = bundleUrl.substr(index + 1);
    return "personal/" + email + "/" + basename;
}

export const personalAcl: Handler = async (event: any) => {
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

    const personalKey = getPersonalKey(user.email, bundleUrl);

    await s3.putObjectAcl({
        Bucket: s3Bucket,
        Key: personalKey,
        ACL: "public-read",
    }).promise();

    return success({});
}
