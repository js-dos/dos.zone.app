import * as AWS from "aws-sdk";

const uploadsS3Bucket = "doszone-uploads";
const uploadsS3Url = "https://doszone-uploads.s3.dualstack.eu-central-1.amazonaws.com";
const uploadsPersonalBase = "personal";
const s3 = new AWS.S3();

export async function getPersonalBundleUrl(email: string, bundleUrl: string) {
    const index = bundleUrl.lastIndexOf("/");
    const basename = bundleUrl.substr(index + 1);
    const personalBundleKey = uploadsPersonalBase + "/" + email + "/" + basename;
    const personalBundleUrl = uploadsS3Url + "/" + personalBundleKey;

    const listResult = await s3.listObjectsV2({
        Bucket: uploadsS3Bucket,
        Delimiter: "/",
        Prefix: personalBundleKey,
    }).promise();

    if (listResult.KeyCount === 1) {
        return personalBundleUrl;
    }

    await s3.copyObject({
        Bucket: uploadsS3Bucket,
        CopySource: uploadsS3Bucket + "/" + bundleUrl.substr(uploadsS3Url.length + 1),
        Key: personalBundleKey,
        ACL: "public-read",
    }).promise();

    return personalBundleUrl;

}
